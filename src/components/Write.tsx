import * as firebase from "firebase"
import * as PropTypes from "prop-types"
import * as React from "react"
import { FirebaseContext } from "../types"

export interface WriteProps {
  readonly method: "push" | "set" | "update" | "transaction"
  readonly children: (
    submit: (value: any) => Promise<any> | firebase.database.ThenableReference
  ) => React.ReactElement<any>
  readonly to: string
}

export class Write extends React.Component<WriteProps, {}> {
  static propTypes = {
    method: PropTypes.oneOf(["push", "set", "transaction", "update"]),
    children: PropTypes.func.isRequired,
    to: PropTypes.string
  }

  static contextTypes = {
    firebase: PropTypes.object.isRequired
  }

  context: FirebaseContext

  push = (value?: any, onComplete?: (a: Error | null) => any) => {
    return this.context.firebase
      .database()
      .ref(this.props.to)
      .push(value, onComplete)
  }

  set = (value?: any, onComplete?: (a: Error | null) => any) => {
    return this.context.firebase
      .database()
      .ref(this.props.to)
      .set(value, onComplete)
  }

  update = (value: Object, onComplete?: (a: Error | null) => any) => {
    return this.context.firebase
      .database()
      .ref(this.props.to)
      .update(value, onComplete)
  }

  transaction = (
    value: (a: any) => any,
    onComplete?: (
      a: Error | null,
      b: boolean,
      c: firebase.database.DataSnapshot | null
    ) => any,
    applyLocally?: boolean
  ) => {
    return this.context.firebase
      .database()
      .ref(this.props.to)
      .transaction(value, onComplete, applyLocally)
  }

  render() {
    return React.Children.only(this.props.children(this[this.props.method]))
  }
}

export default Write
