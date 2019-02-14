import React from "react"
import renderer from "react-test-renderer"
import firebase from "firebase/app"
import { Firebase } from "../Firebase"
import OAuthLogin from "../OAuthLogin"

import { initializeMockSDK } from "./setup"
const mocksdk = initializeMockSDK()

jest.mock("firebase/app", () => {
  return {
    initializeApp: (...args: any[]) => mocksdk.initializeApp(...args)
  }
})
// override firebase.auth with mock
Object.defineProperty(firebase, "auth", { value: mocksdk.auth })

describe("OAuthLogin", () => {
  test("login sets auth data properly", () => {
    let component = renderer.create(
      <Firebase apiKey="firebase-test" projectId="firebase-test">
        <OAuthLogin
          flow="popup"
          provider="google"
          children={login => <button onClick={login}>Login with Google</button>}
        />
      </Firebase>
    )
    const auth = component.getInstance().firebase.auth()
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(auth.currentUser).toBe(null)

    const button = component.root.findByType("button")
    button.props.onClick()
    auth.flush()

    expect(auth.currentUser.providerData[0].providerId).toBe("google.com")
  })
})
