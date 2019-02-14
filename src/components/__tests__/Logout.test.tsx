import React from "react"
import renderer from "react-test-renderer"
import { Firebase } from "../Firebase"
import Logout from "../Logout"

import { initializeMockSDK } from "./setup"
const mocksdk = initializeMockSDK()

jest.mock("firebase/app", () => {
  return {
    initializeApp: (...args) => mocksdk.initializeApp(...args)
  }
})

describe("Logout", () => {
  test("currentUser gets emptied when provided render prop function is used", () => {
    let component = renderer.create(
      <Firebase apiKey="firebase-test" projectId="firebase-test">
        <Logout children={logout => <button onClick={logout}>Logout</button>} />
      </Firebase>
    )
    const auth = component.getInstance().firebase.auth()
    let tree = component.toJSON()

    auth.changeAuthState({ uid: "test", displayName: "Test User" })
    auth.flush()
    expect(auth.currentUser.uid).toBe("test")
    expect(tree).toMatchSnapshot()

    const button = component.root.findByType("button")
    button.props.onClick()
    auth.flush()

    expect(auth.currentUser).toBeNull()
  })
})
