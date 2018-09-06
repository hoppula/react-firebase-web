import * as firebase from "firebase"
import * as PropTypes from "prop-types"
import * as React from "react"

import { FirebaseCallback, FirebaseContext } from "../types"

export interface ValueProps {
  readonly once?: boolean
  readonly path: string
  readonly children: (value: any) => React.ReactElement<any>
}

export interface ValueState {
  value: any
}

export class Value extends React.Component<ValueProps, ValueState> {
  static propTypes = {
    once: PropTypes.bool,
    path: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired
  }

  static contextTypes = {
    firebase: PropTypes.object.isRequired
  }

  static defaultProps = {
    once: false
  }

  context: FirebaseContext
  private ref: firebase.database.Reference
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
    return this.context.firebase.database().ref(path)
  }

  addListeners(ref: firebase.database.Reference, once: boolean) {
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
      this.ref = this.createRef(path)
      this.addListeners(this.ref, once)
    }
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  render() {
    return React.Children.only(this.props.children(this.state.value))
  }
}

export default Value
