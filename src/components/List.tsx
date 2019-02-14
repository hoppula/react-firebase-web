import firebase from "firebase/app"
import PropTypes from "prop-types"
import React from "react"
import {
  childAdded,
  childChanged,
  childMoved,
  childRemoved
} from "../stateReducers"
import { FirebaseCallback, RefType } from "../types"
import { FirebaseContext } from "./FirebaseContext"

export type FirebaseEventType =
  | "child_added"
  | "child_changed"
  | "child_removed"
  | "child_moved"

export interface ListProps {
  readonly once?: boolean
  readonly path: string
  readonly query?: (ref: firebase.database.Reference) => RefType
  readonly children?: (value: any) => React.ReactNode
  readonly firebase?: firebase.app.App
}

export interface ListState {
  value: any[]
}

export class List extends React.Component<ListProps, ListState> {
  static propTypes = {
    once: PropTypes.bool,
    path: PropTypes.string.isRequired,
    query: PropTypes.func,
    children: PropTypes.func
  }

  static defaultProps = {
    once: false
  }

  private ref: RefType
  private listeners: {
    child_added: FirebaseCallback
    child_changed: FirebaseCallback
    child_moved: FirebaseCallback
    child_removed: FirebaseCallback
  }

  constructor(props: ListProps) {
    super(props)
    this.state = {
      value: []
    }
  }

  componentDidMount() {
    const { path, query, once } = this.props
    this.ref = this.createRef(path, query)
    this.listeners = {
      child_added: null,
      child_changed: null,
      child_moved: null,
      child_removed: null
    }
    this.addListeners(this.ref, once)
  }

  createRef(
    path: string,
    query: (ref: firebase.database.Reference) => RefType
  ) {
    const ref = this.props.firebase.database().ref(path)
    return query ? query(ref) : ref
  }

  addListeners(ref: RefType, once: boolean) {
    const listeners = this.listeners

    // listen only once if once prop has been passed
    if (once) {
      ref.once("value", snapshot => {
        const snapshotValue = snapshot.val() || []
        this.setState({
          value: Object.keys(snapshotValue).map(key => ({
            key: key,
            value: snapshotValue[key]
          }))
        })
      })
      return
    }

    // use live bindings as default
    listeners.child_added = ref.on(
      "child_added",
      (snapshot: firebase.database.DataSnapshot, previousChildKey: string) => {
        this.setState(state => {
          return {
            value: childAdded(state.value, snapshot, previousChildKey)
          }
        })
      }
    )

    listeners.child_changed = ref.on(
      "child_changed",
      (snapshot: firebase.database.DataSnapshot) => {
        this.setState(state => {
          return {
            value: childChanged(state.value, snapshot)
          }
        })
      }
    )

    listeners.child_moved = ref.on(
      "child_moved",
      (snapshot: firebase.database.DataSnapshot, previousChildKey: string) => {
        this.setState(state => {
          return {
            value: childMoved(state.value, snapshot, previousChildKey)
          }
        })
      }
    )

    listeners.child_removed = ref.on(
      "child_removed",
      (snapshot: firebase.database.DataSnapshot) => {
        this.setState(state => {
          return { value: childRemoved(state.value, snapshot) }
        })
      }
    )
  }

  removeListeners() {
    Object.keys(this.listeners).forEach((eventType: FirebaseEventType) => {
      this.ref.off(eventType, this.listeners[eventType])
    })
    this.listeners = {
      child_added: null,
      child_changed: null,
      child_moved: null,
      child_removed: null
    }
  }

  componentDidUpdate(prevProps: ListProps) {
    const { query, path, once } = this.props
    const { query: prevQuery, path: prevPath, once: prevOnce } = prevProps
    if (query !== prevQuery || path !== prevPath || once !== prevOnce) {
      this.removeListeners()
      this.setState({ value: [] }, () => {
        this.ref = this.createRef(path, query)
        this.addListeners(this.ref, once)
      })
    }
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  render() {
    return React.Children.only(this.props.children(this.state.value))
  }
}

export default function ListFirebase(props: ListProps) {
  return (
    <FirebaseContext.Consumer>
      {firebase => <List {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  )
}
