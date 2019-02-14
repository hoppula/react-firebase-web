import firebase from "firebase/app"
import PropTypes from "prop-types"
import React from "react"
import { FirebaseContext } from "./FirebaseContext"

export interface RegistrationProps {
  readonly children: (
    submit: (
      email: string,
      password: string
    ) => Promise<firebase.auth.UserCredential>
  ) => React.ReactNode
  readonly firebase?: firebase.app.App
}

export class Registration extends React.Component<RegistrationProps, {}> {
  static propTypes = {
    children: PropTypes.func.isRequired
  }

  submit = (email: string, password: string) => {
    return this.props.firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
  }

  render() {
    return React.Children.only(this.props.children(this.submit))
  }
}

export default function RegistrationFirebase(props: RegistrationProps) {
  return (
    <FirebaseContext.Consumer>
      {firebase => <Registration {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  )
}
