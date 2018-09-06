import * as React from "react"
import * as firebase from "firebase"
import * as renderer from "react-test-renderer"
import { Firebase } from "../Firebase"
import { List } from "../List"

import { initializeMockSDK } from "./setup"
const mocksdk = initializeMockSDK()

jest.mock("firebase", () => {
  return {
    initializeApp: (...args) => mocksdk.initializeApp(...args)
  }
})

describe("List", () => {
  test("renders most recent value whenever list changes", () => {
    let component = renderer.create(
      <Firebase apiKey="firebase-test" projectId="firebase-test">
        <List
          path="list"
          children={list => (
            <ul>
              {list.map(({ key, value: item }) => (
                <li key={key}>{item.name}</li>
              ))}
            </ul>
          )}
        />
      </Firebase>
    )
    const testRef = component
      .getInstance()
      .firebase.database()
      .ref("list")
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    testRef.push({ name: "Name" })
    testRef.flush()
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    testRef.push({ name: "Another" })
    testRef.flush()
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
