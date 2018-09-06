import * as PropTypes from "prop-types"
import * as React from "react"
import { FirebaseContext } from "../types"

export interface LoginProps {
  readonly children: (
    submit: (email: string, password: string) => Promise<any>
  ) => React.ReactElement<any>
}

export class EmailLogin extends React.Component<LoginProps, {}> {
  static propTypes = {
    children: PropTypes.func.isRequired
  }

  static contextTypes = {
    firebase: PropTypes.object.isRequired
  }

  context: FirebaseContext

  submit = (email: string, password: string) => {
    return this.context.firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
  }

  render() {
    return React.Children.only(this.props.children(this.submit))
  }
}

export default EmailLogin
