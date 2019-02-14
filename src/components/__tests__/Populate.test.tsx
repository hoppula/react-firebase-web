import React from "react"
import renderer from "react-test-renderer"
import { Firebase } from "../Firebase"
import Populate from "../Populate"
import Value from "../Value"

import { initializeMockSDK } from "./setup"
const mocksdk = initializeMockSDK()

jest.mock("firebase/app", () => {
  return {
    initializeApp: (...args: any[]) => mocksdk.initializeApp(...args)
  }
})

describe("Populate", () => {
  test("populates related lists properly", () => {
    let component = renderer.create(
      <Firebase apiKey="firebase-test" projectId="firebase-test">
        <Value
          path="user"
          children={user => {
            const bookmarked = user ? user.bookmarkedArticles : {}
            return (
              <Populate
                from={bookmarked}
                with={articledId => `articles/${articledId}`}
                children={list => (
                  <ul>
                    {list.map(
                      ({
                        key,
                        value: article
                      }: {
                        key: string
                        value: any
                      }) => (
                        <li key={key}>{article.title}</li>
                      )
                    )}
                  </ul>
                )}
              />
            )
          }}
        />
      </Firebase>
    )

    const dbRef = component.getInstance().firebase.database()
    dbRef.ref("user").set({ username: "Test user", bookmarkedArticles: [] })
    dbRef.ref("user").flush()

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot("list should be empty")

    const articlesRef = dbRef.ref("articles")
    articlesRef.push({ title: "First article" })
    articlesRef.push({ title: "Second article" })
    articlesRef.flush()

    const articleIds = Object.keys(articlesRef.getData())

    articleIds.forEach(articleId => {
      dbRef.ref(`user/bookmarkedArticles/${articleId}`).set(true)
    })
    dbRef.ref("user/bookmarkedArticles").flush()

    tree = component.toJSON()
    expect(tree).toMatchSnapshot("all bookmarked articles should be rendered")

    const third = articlesRef.push({ title: "Third article" })
    articlesRef.flush()
    dbRef.ref(`user/bookmarkedArticles/${third.key}`).set(true)
    dbRef.ref("user/bookmarkedArticles").flush()

    tree = component.toJSON()
    expect(tree).toMatchSnapshot(
      "third article should have been added to bookmarks"
    )

    third.update({ title: "Third article with new title" })
    articlesRef.flush()

    tree = component.toJSON()
    expect(tree).toMatchSnapshot("third article should have new title")
  })
})
