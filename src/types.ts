import firebase from "firebase/app"

export type FirebaseCallback = (
  a: firebase.database.DataSnapshot | null,
  b?: string
) => any

export type RefType = firebase.database.Reference | firebase.database.Query
