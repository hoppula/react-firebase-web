import * as React from "react"
import * as renderer from "react-test-renderer"
import { Firebase } from "../Firebase"
import { Write } from "../Write"

import { initializeMockSDK } from "./setup"
const mocksdk = initializeMockSDK()

jest.mock("firebase", () => {
  return {
    initializeApp: (...args) => mocksdk.initializeApp(...args)
  }
})

describe("Write", () => {
  test("push adds new value to list", () => {
    let component = renderer.create(
      <Firebase apiKey="firebase-test" projectId="firebase-test">
        <Write
          method="push"
          to="posts"
          children={pushToPosts => {
            return (
              <button onClick={() => pushToPosts({ title: "Test" })}>
                Push to posts
              </button>
            )
          }}
        />
      </Firebase>
    )
    const postsRef = component
      .getInstance()
      .firebase.database()
      .ref("posts")

    // no posts yet
    expect(postsRef.getData()).toBeNull()

    // add post using <Write />
    const button = component.root.findByType("button")
    button.props.onClick()
    postsRef.flush()

    // posts should have one object with { title: "Test "}
    const posts = postsRef.getData()
    const postId = Object.keys(posts)[0]
    expect(posts[postId]).toEqual({ title: "Test" })
  })

  test("set overrides value", () => {
    let component = renderer.create(
      <Firebase apiKey="firebase-test" projectId="firebase-test">
        <Write
          method="set"
          to="post"
          children={setPost => {
            return (
              <button
                onClick={() =>
                  setPost({
                    title: "First blog post",
                    content: "This is my first blog post, now with title."
                  })
                }
              >
                Set post
              </button>
            )
          }}
        />
      </Firebase>
    )
    const postRef = component
      .getInstance()
      .firebase.database()
      .ref("post")

    postRef.set({ content: "This is my first blog post", date: "01.01.2018" })
    postRef.flush()

    // set post using <Write />
    const button = component.root.findByType("button")
    button.props.onClick()
    postRef.flush()

    // post should have new content and no date field
    expect(postRef.getData()).toEqual({
      title: "First blog post",
      content: "This is my first blog post, now with title."
    })
  })

  test("update merges existing value with new data", () => {
    let component = renderer.create(
      <Firebase apiKey="firebase-test" projectId="firebase-test">
        <Write
          method="update"
          to="weatherInfo"
          children={updateWeatherInfo => {
            return (
              <button
                onClick={() =>
                  updateWeatherInfo({
                    temperature: 22
                  })
                }
              >
                Update weather info
              </button>
            )
          }}
        />
      </Firebase>
    )
    const weatherRef = component
      .getInstance()
      .firebase.database()
      .ref("weatherInfo")

    weatherRef.set({ temperature: 21, wind: 0 })
    weatherRef.flush()

    // update weather info using <Write />
    const button = component.root.findByType("button")
    button.props.onClick()
    weatherRef.flush()

    // weather info should have new temperature and existing wind info
    expect(weatherRef.getData()).toEqual({
      temperature: 22,
      wind: 0
    })
  })

  test("transaction updates data atomically", () => {
    let component = renderer.create(
      <Firebase apiKey="firebase-test" projectId="firebase-test">
        <Write
          method="transaction"
          to="likes"
          children={updateLikes => {
            return (
              <button onClick={() => updateLikes(likes => likes + 1)}>
                Update likes
              </button>
            )
          }}
        />
      </Firebase>
    )
    const likesRef = component
      .getInstance()
      .firebase.database()
      .ref("likes")

    likesRef.set(1)
    likesRef.flush()

    // update likes using <Write />
    const button = component.root.findByType("button")
    button.props.onClick()
    likesRef.flush()

    // likes count should have been incremented with one
    expect(likesRef.getData()).toBe(2)
  })
})
