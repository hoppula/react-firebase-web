import * as firebase from "firebase"

export type FirebaseCallback = (
  a: firebase.database.DataSnapshot | null,
  b?: string
) => any

export interface FirebaseContext {
  firebase: firebase.app.App
}
