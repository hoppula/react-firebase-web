import firebase from "firebase/app"

export type FirebaseCallback = (
  a: firebase.database.DataSnapshot | null,
  b?: string
) => any

export type RefType = firebase.database.Reference | firebase.database.Query

export interface AuthProviders {
  facebook: "FacebookAuthProvider"
  github: "GithubAuthProvider"
  google: "GoogleAuthProvider"
  twitter: "TwitterAuthProvider"
}

export interface AuthFlows {
  popup: "signInWithPopup"
  redirect: "signInWithRedirect"
}
