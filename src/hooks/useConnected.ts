import { useContext, useEffect, useState } from "react"
import { FirebaseContext } from "../index"

export function useConnected() {
  const [connected, setConnected] = useState(false)
  const firebase: firebase.app.App = useContext(FirebaseContext)

  useEffect(() => {
    function handleConnectedChange(snap: firebase.database.DataSnapshot) {
      setConnected(snap.val())
    }
    const connectedRef = firebase.database().ref(".info/connected")
    connectedRef.on("value", handleConnectedChange)
    return function cleanup() {
      connectedRef.off("value", handleConnectedChange)
    }
  })

  return connected
}
