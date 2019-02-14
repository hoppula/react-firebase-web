import firebase from "firebase/app"
import PropTypes from "prop-types"
import React from "react"
import { FirebaseContext } from "./FirebaseContext"
import { FirebaseCallback, RefType } from "../types"

export interface ValueProps {
  readonly once?: boolean
  readonly path: string
  readonly children?: (value: any) => React.ReactNode
  readonly firebase?: firebase.app.App
}

export interface ValueState {
  value: any
}

export class Value extends React.Component<ValueProps, ValueState> {
  static propTypes = {
    once: PropTypes.bool,
    path: PropTypes.string.isRequired,
    children: PropTypes.func
  }

  static defaultProps = {
    once: false
  }

  private ref: RefType
  private listeners: {
    value: FirebaseCallback
  }

  constructor(props: ValueProps) {
    super(props)
    this.state = {
      value: {}
    }
  }

  componentDidMount() {
    const { path, once } = this.props
    this.ref = this.createRef(path)
    this.listeners = {
      value: null
    }
    this.addListeners(this.ref, once)
  }

  createRef(path: string) {
    return this.props.firebase.database().ref(path)
  }

  addListeners(ref: RefType, once: boolean) {
    const listeners = this.listeners

    // listen only once if once prop has been passed
    if (once) {
      return ref.once("value", snapshot => {
        this.setState({
          value: snapshot.val()
        })
      })
    }

    // use live bindings as default
    listeners.value = ref.on("value", snapshot => {
      this.setState(() => {
        return { value: snapshot.val() }
      })
    })
  }

  removeListeners() {
    Object.keys(this.listeners).forEach((eventType: "value") => {
      this.ref.off(eventType, this.listeners[eventType])
    })
    this.listeners = {
      value: null
    }
  }

  componentDidUpdate(prevProps: ValueProps) {
    const { path, once } = this.props
    const { path: prevPath, once: prevOnce } = prevProps
    if (path !== prevPath || once !== prevOnce) {
      this.removeListeners()
      this.setState({ value: {} }, () => {
        this.ref = this.createRef(path)
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

export default function ValueFirebase(props: ValueProps) {
  return (
    <FirebaseContext.Consumer>
      {firebase => <Value {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  )
}
