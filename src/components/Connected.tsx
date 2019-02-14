import firebase from "firebase/app"
import React from "react"
import PropTypes from "prop-types"
import { FirebaseContext } from "./FirebaseContext"

export interface ConnectedProps {
  readonly children: (connected: boolean) => React.ReactNode
  readonly firebase?: firebase.app.App
}

export interface ConnectedState {
  connected: boolean
}

export class Connected extends React.Component<ConnectedProps, ConnectedState> {
  static propTypes = {
    children: PropTypes.func.isRequired
  }

  state: ConnectedState = { connected: false }

  componentDidMount() {
    this.props.firebase
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

export default function ConnectedFirebase(props: ConnectedProps) {
  return (
    <FirebaseContext.Consumer>
      {firebase => <Connected {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  )
}
