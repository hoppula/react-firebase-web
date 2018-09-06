import * as PropTypes from "prop-types"
import * as React from "react"
import { FirebaseContext } from "../types"

export interface ConnectedProps {
  readonly children: (connected: boolean) => React.ReactElement<any>
}

export interface ConnectedState {
  connected: boolean
}

export class Connected extends React.Component<ConnectedProps, ConnectedState> {
  static propTypes = {
    children: PropTypes.func.isRequired
  }

  static contextTypes = {
    firebase: PropTypes.object.isRequired
  }

  context: FirebaseContext
  state: ConnectedState = { connected: false }

  componentDidMount() {
    this.context.firebase
      .database()
      .ref(".info/connected")
      .on("value", snap => {
        this.setState({ connected: snap.val() === true })
      })
  }

  render() {
    return React.Children.only(this.props.children(this.state.connected))
  }
}

export default Connected
