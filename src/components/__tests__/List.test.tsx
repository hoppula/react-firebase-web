import React from "react"
import renderer from "react-test-renderer"
import { Firebase } from "../Firebase"
import List from "../List"

import { initializeMockSDK } from "./setup"
const mocksdk = initializeMockSDK()

jest.mock("firebase/app", () => {
  return {
    initializeApp: (...args: any[]) => mocksdk.initializeApp(...args)
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
              {list.map(({ key, value: item }: { key: string; value: any }) => (
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
