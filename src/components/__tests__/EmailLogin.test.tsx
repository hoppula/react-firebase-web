import React from "react"
import renderer from "react-test-renderer"
import { Firebase } from "../Firebase"
import EmailLogin from "../EmailLogin"

import { initializeMockSDK } from "./setup"
const mocksdk = initializeMockSDK()

jest.mock("firebase/app", () => {
  return {
    initializeApp: (...args: any[]) => mocksdk.initializeApp(...args)
  }
})

describe("EmailLogin", () => {
  test("logs user in using email and password", () => {
    let component = renderer.create(
      <Firebase apiKey="firebase-test" projectId="firebase-test">
        <EmailLogin
          children={login => (
            <button onClick={() => login("test@email.dev", "password")}>
              Login
            </button>
          )}
        />
      </Firebase>
    )
    const auth = component.getInstance().firebase.auth()
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(auth.currentUser).toBeNull()

    const button = component.root.findByType("button")
    button.props.onClick()
    auth.flush()

    expect(auth.currentUser.email).toBe("test@email.dev")
  })
})
