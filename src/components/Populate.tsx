import * as firebase from "firebase"
import * as PropTypes from "prop-types"
import * as React from "react"
import findIndex = require("lodash.findindex")
import { FirebaseCallback, FirebaseContext } from "../types"

export type KeyValue = { key: string; value: any }

export interface PopulateProps {
  readonly from: { [key: string]: boolean }
  readonly children: (value: any) => React.ReactElement<any>
  readonly with: (key: string) => string
}

export interface PopulateState {
  value: KeyValue[]
}

export class Populate extends React.Component<PopulateProps, PopulateState> {
  static propTypes = {
    from: PropTypes.any,
    children: PropTypes.func.isRequired,
    with: PropTypes.func.isRequired
  }

  static contextTypes = {
    firebase: PropTypes.object.isRequired
  }

  context: FirebaseContext
  listeners: {
    ref: firebase.database.Reference
    callback: FirebaseCallback
  }[]

  state = {
    value: [] as KeyValue[]
  }

  componentDidMount() {
    const { from, with: populateWith } = this.props
    this.addListeners(from, populateWith)
  }

  addListeners(
    from: { [key: string]: boolean },
    populateWith: (key: string) => string
  ) {
    const keys = Object.keys(from || {})
    const refs = keys.map(key => {
      return this.context.firebase.database().ref(populateWith(key))
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
      this.addListeners(from, populateWith)
    }
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  render() {
    return React.Children.only(this.props.children(this.state.value))
  }
}

export default Populate
