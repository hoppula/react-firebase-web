import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import PropTypes from "prop-types"
import React from "react"
import { FirebaseContext } from "./FirebaseContext"

export interface FirebaseProps {
  readonly apiKey: string
  readonly projectId: string
  readonly databaseURL?: string
  readonly firebase?: any // TODO: allow firebase or firebase-mock
}

export class Firebase extends React.Component<FirebaseProps, {}> {
  static propTypes = {
    apiKey: PropTypes.string.isRequired,
    databaseURL: PropTypes.string,
    projectId: PropTypes.string.isRequired,
    firebase: PropTypes.object
  }

  firebase: firebase.app.App

  constructor(props: FirebaseProps) {
    super(props)
    const { apiKey, projectId, databaseURL, firebase: propsFirebase } = props
    const firebaseImplementation = propsFirebase ? propsFirebase : firebase
    this.firebase =
      !firebaseImplementation.apps || !firebaseImplementation.apps.length
        ? firebaseImplementation.initializeApp({
            apiKey,
            authDomain: `${projectId}.firebaseapp.com`,
            databaseURL: databaseURL
              ? databaseURL
              : `https://${projectId}.firebaseio.com`,
            storageBucket: `${projectId}.appspot.com`
          })
        : firebaseImplementation.app()
  }

  render() {
    return (
      <FirebaseContext.Provider value={this.firebase}>
        {this.props.children}
      </FirebaseContext.Provider>
    )
  }
}

export default Firebase
