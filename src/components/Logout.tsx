import firebase from "firebase/app"
import PropTypes from "prop-types"
import React from "react"
import { FirebaseContext } from "./FirebaseContext"

export interface LogoutProps {
  readonly children: (logout: () => Promise<void>) => React.ReactNode
  readonly firebase?: firebase.app.App
}

export class Logout extends React.Component<LogoutProps, {}> {
  static propTypes = {
    children: PropTypes.func.isRequired
  }

  logout = () => {
    return this.props.firebase.auth().signOut()
  }

  render() {
    return React.Children.only(this.props.children(this.logout))
  }
}

export default function LogoutFirebase(props: LogoutProps) {
  return (
    <FirebaseContext.Consumer>
      {firebase => <Logout {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  )
}
