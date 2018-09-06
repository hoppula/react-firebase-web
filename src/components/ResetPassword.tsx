import * as PropTypes from "prop-types"
import * as React from "react"
import { FirebaseContext } from "../types"

export interface ResetPasswordProps {
  readonly children: (
    resetPassword: (email: string) => Promise<any>
  ) => React.ReactElement<any>
}

export class ResetPassword extends React.Component<ResetPasswordProps, {}> {
  static propTypes = {
    children: PropTypes.func.isRequired
  }

  static contextTypes = {
    firebase: PropTypes.object.isRequired
  }

  context: FirebaseContext

  resetPassword = (email: string) => {
    return this.context.firebase.auth().sendPasswordResetEmail(email)
  }

  render() {
    return React.Children.only(this.props.children(this.resetPassword))
  }
}

export default ResetPassword
