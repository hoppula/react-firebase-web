const firebasemock = require("firebase-mock")
const mockauth = new firebasemock.MockAuthentication()
const mockdatabase = new firebasemock.MockFirebase()

// add firebase property to ReactTestInstance
declare module "react-test-renderer" {
  export interface ReactTestInstance {
    firebase: any
  }
}

export const initializeMockSDK = () => {
  return new firebasemock.MockFirebaseSdk(
    (path: string) => {
      return path ? mockdatabase.child(path) : mockdatabase
    },
    () => {
      return mockauth
    },
    null
  )
}
