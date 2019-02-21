import firebase from "firebase/app"
import PropTypes from "prop-types"
import React from "react"
import { FirebaseContext } from "./FirebaseContext"

export interface UserProps {
  readonly mapUser?: (user: any) => any
  readonly children: (user: any) => React.ReactNode
  readonly firebase?: firebase.app.App
}

export interface UserState {
  user: any
}

export class User extends React.Component<UserProps, UserState> {
  static propTypes = {
    mapUser: PropTypes.func,
    children: PropTypes.func.isRequired
  }

  state = {
    user: {}
  }

  unsubscribe: firebase.Unsubscribe

  componentDidMount() {
    const { mapUser } = this.props
    this.unsubscribe = this.props.firebase
      .auth()
      .onAuthStateChanged((authData: firebase.User) => {
        this.setState({
          user:
            mapUser && authData
              ? mapUser(authData.toJSON())
              : authData
              ? authData.toJSON()
              : {}
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

export default function UserFirebase(props: UserProps) {
  return (
    <FirebaseContext.Consumer>
      {firebase => <User {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  )
}
