import * as PropTypes from "prop-types"
import * as React from "react"
import { FirebaseContext } from "../types"

export interface RegistrationProps {
  readonly children: (
    submit: (email: string, password: string) => Promise<any>
  ) => React.ReactElement<any>
}

export class Registration extends React.Component<RegistrationProps, {}> {
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
      .createUserWithEmailAndPassword(email, password)
  }

  render() {
    return React.Children.only(this.props.children(this.submit))
  }
}

export default Registration
