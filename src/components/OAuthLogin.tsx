import firebase from "firebase/app"
import PropTypes from "prop-types"
import React from "react"
import { FirebaseContext } from "./FirebaseContext"

export interface AuthProviders {
  facebook: "FacebookAuthProvider"
  github: "GithubAuthProvider"
  google: "GoogleAuthProvider"
  twitter: "TwitterAuthProvider"
}

export interface AuthFlows {
  popup: "signInWithPopup"
  redirect: "signInWithRedirect"
}

const authProviders: AuthProviders = {
  facebook: "FacebookAuthProvider",
  github: "GithubAuthProvider",
  google: "GoogleAuthProvider",
  twitter: "TwitterAuthProvider"
}

const authFlows: AuthFlows = {
  popup: "signInWithPopup",
  redirect: "signInWithRedirect"
}

export interface OAuthProps {
  readonly flow?: "popup" | "redirect"
  readonly provider: "facebook" | "google" | "twitter" | "github"
  readonly children: (
    authenticate: () => Promise<firebase.auth.UserCredential> | Promise<void>
  ) => React.ReactNode
  readonly scopes?: string[]
  readonly firebase?: firebase.app.App
}

export class OAuthLogin extends React.Component<OAuthProps, {}> {
  static propTypes = {
    flow: PropTypes.oneOf(Object.keys(authFlows)),
    provider: PropTypes.oneOf(Object.keys(authProviders)).isRequired,
    children: PropTypes.func.isRequired,
    scopes: PropTypes.array
  }

  static defaultProps = {
    flow: "popup"
  }

  authenticate = () => {
    const { flow, provider, scopes = [] } = this.props
    const authProvider = new firebase.auth[authProviders[provider]]()
    if (
      authProvider instanceof firebase.auth.FacebookAuthProvider ||
      authProvider instanceof firebase.auth.GithubAuthProvider ||
      authProvider instanceof firebase.auth.GoogleAuthProvider
    ) {
      scopes.forEach(scope => {
        authProvider.addScope(scope)
      })
    }
    return this.props.firebase.auth()[authFlows[flow]](authProvider)
  }

  render() {
    return React.Children.only(this.props.children(this.authenticate))
  }
}

export default function OAuthLoginFirebase(props: OAuthProps) {
  return (
    <FirebaseContext.Consumer>
      {firebase => <OAuthLogin {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  )
}
