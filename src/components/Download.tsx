import firebase from "firebase/app"
import "firebase/storage"
import PropTypes from "prop-types"
import React from "react"
import { FirebaseContext } from "./FirebaseContext"

export interface DownloadProps {
  readonly path: string
  readonly metadata?: boolean
  readonly children: (props: DownloadState) => React.ReactNode
  readonly firebase?: firebase.app.App
}

export interface DownloadState {
  url: string
  metadata: any
  error: string
}

export class Download extends React.Component<DownloadProps, DownloadState> {
  static propTypes = {
    metadata: PropTypes.bool,
    path: PropTypes.string,
    children: PropTypes.func.isRequired
  }

  state: DownloadState = { url: "", metadata: {}, error: "" }

  componentDidMount() {
    this.download()
  }

  componentDidUpdate(prevProps: DownloadProps) {
    if (this.props.path !== prevProps.path) {
      this.download()
    }
  }

  download = () => {
    const { metadata, path } = this.props
    const storage = this.props.firebase.storage()
    const storageRef = storage.refFromURL(path)
    Promise.all([
      storageRef.getDownloadURL(),
      metadata ? storageRef.getMetadata() : null
    ])
      .then(([downloadUrl, metadata]) => {
        this.setState({ url: downloadUrl, metadata })
      })
      .catch((error: firebase.FirebaseError) => {
        this.setState({ error: error.code })
      })
  }

  render() {
    return React.Children.only(this.props.children({ ...this.state }))
  }
}

export default function DownloadFirebase(props: DownloadProps) {
  return (
    <FirebaseContext.Consumer>
      {firebase => <Download {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  )
}
