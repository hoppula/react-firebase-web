import * as firebase from "firebase"
import * as PropTypes from "prop-types"
import * as React from "react"

export interface FirebaseProps {
  readonly apiKey: string
  readonly projectId: string
  readonly databaseURL?: string
}

export class Firebase extends React.Component<FirebaseProps, {}> {
  static propTypes = {
    apiKey: PropTypes.string.isRequired,
    databaseURL: PropTypes.string,
    projectId: PropTypes.string.isRequired
  }

  static childContextTypes = {
    firebase: PropTypes.object
  }

  firebase: firebase.app.App

  constructor(props: FirebaseProps) {
    super(props)
    const { apiKey, projectId, databaseURL } = props
    this.firebase = firebase.initializeApp({
      apiKey,
      authDomain: `${projectId}.firebaseapp.com`,
      databaseURL: databaseURL
        ? databaseURL
        : `https://${projectId}.firebaseio.com`,
      storageBucket: `${projectId}.appspot.com`
    })
  }

  getChildContext() {
    return {
      firebase: this.firebase
    }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

export default Firebase
