import * as firebase from "firebase"
import * as PropTypes from "prop-types"
import * as React from "react"
import { FirebaseContext } from "../types"

export interface DownloadProps {
  readonly path: string
  readonly metadata?: boolean
  readonly children: (props: DownloadState) => React.ReactElement<any>
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

  static contextTypes = {
    firebase: PropTypes.object.isRequired
  }

  context: FirebaseContext
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
    const storage = this.context.firebase.storage()
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

export default Download
