import firebase from "firebase/app"
import "firebase/storage"
import PropTypes from "prop-types"
import React from "react"
import { FirebaseContext } from "./FirebaseContext"

export type FilesUpload = File[] // TODO: Uint8Array & string support

export interface UploadResult {
  cancel?: firebase.Unsubscribe
  error?: Error
  snapshot?: firebase.storage.UploadTaskSnapshot
  success?: boolean
  task?: firebase.storage.UploadTask
}

export interface RenderProps {
  uploadFiles: (files: FilesUpload) => void
  uploads: UploadResult[]
}

export interface UploadProps {
  readonly onUpload?: (
    snapshot: firebase.storage.UploadTaskSnapshot,
    rootRef: firebase.database.Reference
  ) => void
  readonly path: string
  readonly children: (props: RenderProps) => React.ReactNode
  // TODO: stringFormat?: "raw" | "base64" | "base64url" | "data_url"
  readonly firebase?: firebase.app.App
}

export interface UploadState {
  uploadResults: UploadResult[]
}

export class Upload extends React.Component<UploadProps, UploadState> {
  static propTypes = {
    onUpload: PropTypes.func,
    path: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired
    // TODO: stringFormat: PropTypes.string
  }

  state: UploadState = { uploadResults: [] }

  componentWillUnmount() {
    // cancel remaining uploads when unmounting
    this.cancelRemainingUploads()
  }

  cancelRemainingUploads = () => {
    this.state.uploadResults.forEach(result => result.cancel())
    this.setState({ uploadResults: [] })
  }

  setResult = (index: number) => {
    return (changes: UploadResult) => {
      this.setState(state => {
        const results = [...state.uploadResults]
        results[index] = { ...results[index], ...changes }
        return { uploadResults: results }
      })
    }
  }

  uploadFiles = (files: FilesUpload) => {
    // cancel any remaining previous uploads before starting these new ones
    this.cancelRemainingUploads()

    files.forEach((file, index) => {
      this.uploadFile(file, this.setResult(index))
    })
  }

  uploadFile = (file: File, update: (changes: UploadResult) => void) => {
    const { onUpload, path } = this.props
    const storageRef = this.props.firebase.storage()
    const uploadTask = storageRef.ref(`${path}/${file.name}`).put(file)
    update({ task: uploadTask })

    const unsubscribe = uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        update({ snapshot })
      },
      error => {
        update({ error })
      },
      () => {
        update({ snapshot: uploadTask.snapshot, success: true })
        if (onUpload) {
          onUpload(uploadTask.snapshot, this.props.firebase.database().ref())
        }
      }
    )
    update({
      cancel: () => {
        unsubscribe()
        uploadTask.cancel()
      }
    })
  }

  render() {
    return React.Children.only(
      this.props.children({
        uploadFiles: this.uploadFiles,
        uploads: this.state.uploadResults
      })
    )
  }
}

export default function UploadFirebase(props: UploadProps) {
  return (
    <FirebaseContext.Consumer>
      {firebase => <Upload {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  )
}
