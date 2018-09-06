import * as firebase from "firebase"
import findIndex = require("lodash.findindex")

export function childAdded(
  currentValue: any[],
  snapshot: firebase.database.DataSnapshot,
  previousChildKey: string
) {
  const nextArray = [...currentValue]
  const insertionIndex =
    previousChildKey === null
      ? 0
      : findIndex(nextArray, item => item.key === previousChildKey) + 1

  nextArray.splice(insertionIndex, 0, {
    key: snapshot.key,
    value: snapshot.val()
  })
  return nextArray
}

export function childChanged(
  currentValue: any[],
  snapshot: firebase.database.DataSnapshot
) {
  const nextArray = [...currentValue]
  const replaceIndex = findIndex(nextArray, item => item.key === snapshot.key)
  nextArray[replaceIndex] = {
    ...nextArray[replaceIndex],
    value: snapshot.val()
  }
  return nextArray
}

export function childMoved(
  currentValue: any[],
  snapshot: firebase.database.DataSnapshot,
  previousChildKey: string
) {
  const nextArray = [...currentValue]
  const currentIndex = findIndex(nextArray, item => item.key === snapshot.key)
  const record = nextArray.splice(currentIndex, 1)[0]

  const insertionIndex =
    previousChildKey === null
      ? 0
      : findIndex(nextArray, item => item.key === previousChildKey) + 1

  nextArray.splice(insertionIndex, 0, record)
  return nextArray
}

export function childRemoved(
  currentValue: any[],
  snapshot: firebase.database.DataSnapshot
) {
  const nextArray = [...currentValue]
  nextArray.splice(findIndex(nextArray, item => item.key === snapshot.key), 1)
  return nextArray
}
