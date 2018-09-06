import * as firebase from "firebase"
import * as PropTypes from "prop-types"
import * as React from "react"
import { FirebaseContext } from "../types"

export interface UserProps {
  readonly mapUser?: (user: any) => any
  readonly children: (user: any) => React.ReactElement<any>
}

export interface UserState {
  user: any
}

export class User extends React.Component<UserProps, UserState> {
  static propTypes = {
    mapAuth: PropTypes.func,
    children: PropTypes.func.isRequired
  }

  static contextTypes = {
    firebase: PropTypes.object.isRequired
  }

  unsubscribe: firebase.Unsubscribe

  context: FirebaseContext
  state = {
    user: {}
  }

  componentDidMount() {
    const { mapUser } = this.props
    this.unsubscribe = this.context.firebase
      .auth()
      .onAuthStateChanged((authData: firebase.User) => {
        this.setState({
          user:
            mapUser && authData
              ? mapUser(authData.toJSON())
              : authData ? authData.toJSON() : {}
        })
      })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    return React.Children.only(this.props.children(this.state.user))
  }
}

export default User
