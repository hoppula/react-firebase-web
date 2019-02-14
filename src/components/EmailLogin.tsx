import firebase from "firebase/app"
import PropTypes from "prop-types"
import React from "react"
import { FirebaseContext } from "./FirebaseContext"

export interface LoginProps {
  readonly children: (
    submit: (
      email: string,
      password: string
    ) => Promise<firebase.auth.UserCredential>
  ) => React.ReactNode
  readonly firebase?: firebase.app.App
}

export class EmailLogin extends React.Component<LoginProps, {}> {
  static propTypes = {
    children: PropTypes.func.isRequired
  }

  submit = (email: string, password: string) => {
    return this.props.firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
  }

  render() {
    return React.Children.only(this.props.children(this.submit))
  }
}

export default function EmailLoginFirebase(props: LoginProps) {
  return (
    <FirebaseContext.Consumer>
      {firebase => <EmailLogin {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  )
}
