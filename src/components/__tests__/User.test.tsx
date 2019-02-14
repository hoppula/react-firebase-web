import React from "react"
import renderer from "react-test-renderer"
import { Firebase } from "../Firebase"
import User from "../User"

import { initializeMockSDK } from "./setup"
const mocksdk = initializeMockSDK()

jest.mock("firebase/app", () => {
  return {
    initializeApp: (...args: any[]) => mocksdk.initializeApp(...args)
  }
})

describe("User", () => {
  test("renders different content when logged in", () => {
    let component = renderer.create(
      <Firebase apiKey="firebase-test" projectId="firebase-test">
        <User
          children={user => {
            if (user.uid) {
              return <div>{user.displayName} Logout</div>
            } else {
              return <div>Login</div>
            }
          }}
        />
      </Firebase>
    )
    const auth = component.getInstance().firebase.auth()

    // no user logged in
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    auth.changeAuthState({
      toJSON: () => ({ uid: "test", displayName: "Test User" })
    })
    auth.flush()

    // test user logged in
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
