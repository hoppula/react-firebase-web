import * as PropTypes from "prop-types"
import * as React from "react"
import { FirebaseContext } from "../types"

export interface LogoutProps {
  readonly children: (logout: () => Promise<any>) => React.ReactElement<any>
}

export class Logout extends React.Component<LogoutProps, {}> {
  static propTypes = {
    children: PropTypes.func.isRequired
  }

  static contextTypes = {
    firebase: PropTypes.object.isRequired
  }

  context: FirebaseContext

  logout = () => {
    return this.context.firebase.auth().signOut()
  }

  render() {
    return React.Children.only(this.props.children(this.logout))
  }
}

export default Logout
