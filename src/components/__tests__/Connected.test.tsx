import React from "react"
import renderer from "react-test-renderer"
import { Firebase } from "../Firebase"
import Connected from "../Connected"

import { initializeMockSDK } from "./setup"
const mocksdk = initializeMockSDK()

jest.mock("firebase/app", () => {
  return {
    initializeApp: (...args: any[]) => mocksdk.initializeApp(...args)
  }
})

describe("Connected", () => {
  test("render prop value is set to true when online", () => {
    let component = renderer.create(
      <Firebase apiKey="firebase-test" projectId="firebase-test">
        <Connected
          children={connected => {
            if (connected) {
              return <div>Online :)</div>
            } else {
              return <div>Offline :(</div>
            }
          }}
        />
      </Firebase>
    )

    // offline
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    const ref = component
      .getInstance()
      .firebase.database()
      .ref(".info/connected")
    ref.set(true)
    ref.flush()

    // online
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
