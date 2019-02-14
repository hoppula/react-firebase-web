import React from "react"
import renderer from "react-test-renderer"
import { Firebase } from "../Firebase"
import Registration from "../Registration"

import { initializeMockSDK } from "./setup"
const mocksdk = initializeMockSDK()

jest.mock("firebase/app", () => {
  return {
    initializeApp: (...args) => mocksdk.initializeApp(...args)
  }
})

describe("Registration", () => {
  test("creates user with given email and password", async () => {
    let component = renderer.create(
      <Firebase apiKey="firebase-test" projectId="firebase-test">
        <Registration
          children={register => (
            <button onClick={() => register("test@test.dev", "test")}>
              Create user
            </button>
          )}
        />
      </Firebase>
    )
    const auth = component.getInstance().firebase.auth()
    expect(mocksdk.auth().getUserByEmail("test@test.dev")).rejects.toThrow(
      "There is no existing user record corresponding to the provided identifier."
    )

    const button = component.root.findByType("button")
    button.props.onClick()
    auth.flush()

    const user = await mocksdk.auth().getUserByEmail("test@test.dev")
    expect(user).toMatchObject({ email: "test@test.dev", password: "test" })
  })
})
