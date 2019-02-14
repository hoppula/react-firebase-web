import firebase from "firebase/app"
import PropTypes from "prop-types"
import React from "react"
import findIndex = require("lodash.findindex")
import { FirebaseCallback } from "../types"
import { FirebaseContext } from "./FirebaseContext"

export type KeyValue = { key: string; value: any }

export interface PopulateProps {
  readonly from: { [key: string]: boolean }
  readonly children?: (value: any) => React.ReactNode
  readonly with: (key: string) => string
  readonly firebase?: firebase.app.App
}

export interface PopulateState {
  value: KeyValue[]
}

export class Populate extends React.Component<PopulateProps, PopulateState> {
  static propTypes = {
    from: PropTypes.any,
    children: PropTypes.func,
    with: PropTypes.func.isRequired
  }

  listeners: {
    ref: firebase.database.Reference
    callback: FirebaseCallback
  }[]

  state = {
    value: [] as KeyValue[]
  }

  componentDidMount() {
    this.addListeners()
  }

  addListeners() {
    const { from, with: populateWith } = this.props
    const keys = Object.keys(from || {})
    const refs = keys.map(key => {
      return this.props.firebase.database().ref(populateWith(key))
    })
    this.listeners = refs.map(ref => {
      return {
        ref,
        callback: ref.on("value", snapshot => {
          this.setState(state => {
            const nextValue = [...state.value]
            const replaceIndex = findIndex(keys, key => key === snapshot.key)
            if (replaceIndex >= 0) {
              nextValue[replaceIndex] = {
                key: snapshot.key,
                value: snapshot.val()
              }
            }
            return { value: nextValue }
          })
        })
      }
    })
  }

  removeListeners() {
    this.listeners.forEach(listener => {
      listener.ref.off("value", listener.callback)
    })
  }

  componentDidUpdate(prevProps: PopulateProps) {
    const { from, with: populateWith } = this.props
    const { from: prevFrom, with: prevWith } = prevProps
    if (from !== prevFrom || populateWith !== prevWith) {
      this.removeListeners()
      this.setState({ value: [] }, () => {
        this.addListeners()
      })
    }
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  render() {
    return React.Children.only(this.props.children(this.state.value))
  }
}

export default function PopulateFirebase(props: PopulateProps) {
  return (
    <FirebaseContext.Consumer>
      {firebase => <Populate {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  )
}
