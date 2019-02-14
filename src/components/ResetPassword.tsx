import firebase from "firebase/app"
import PropTypes from "prop-types"
import React from "react"
import { FirebaseContext } from "./FirebaseContext"

export interface ResetPasswordProps {
  readonly children: (
    resetPassword: (email: string) => Promise<void>
  ) => React.ReactNode
  readonly firebase?: firebase.app.App
}

export class ResetPassword extends React.Component<ResetPasswordProps, {}> {
  static propTypes = {
    children: PropTypes.func.isRequired
  }

  resetPassword = (email: string) => {
    return this.props.firebase.auth().sendPasswordResetEmail(email)
  }

  render() {
    return React.Children.only(this.props.children(this.resetPassword))
  }
}

export default function ResetPasswordFirebase(props: ResetPasswordProps) {
  return (
    <FirebaseContext.Consumer>
      {firebase => <ResetPassword {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  )
}
