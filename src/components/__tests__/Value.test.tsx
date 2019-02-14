import React from "react"
import renderer from "react-test-renderer"
import { Firebase } from "../Firebase"
import Value from "../Value"

import { initializeMockSDK } from "./setup"
const mocksdk = initializeMockSDK()

jest.mock("firebase/app", () => {
  return {
    initializeApp: (...args: any[]) => mocksdk.initializeApp(...args)
  }
})

describe("Value", () => {
  test("renders most recent value whenever value changes", () => {
    let component = renderer.create(
      <Firebase apiKey="firebase-test" projectId="firebase-test">
        <Value
          path="value"
          children={value => <div>{value && value.name}</div>}
        />
      </Firebase>
    )
    const testRef = component
      .getInstance()
      .firebase.database()
      .ref("value")
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    testRef.set({ name: "Name 1" })
    testRef.flush()
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    testRef.set({ name: "Name 2" })
    testRef.flush()
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
