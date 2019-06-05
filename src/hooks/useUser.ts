import { useContext, useEffect, useState } from "react"
import { FirebaseContext } from "../index"

export function useUser(mapUser?: (user: any) => any) {
  const [user, setUser] = useState(null)
  const firebase: firebase.app.App = useContext(FirebaseContext)

  useEffect(() => {
    function handleAuthStateChanged(authData: firebase.User) {
      const authDataJSON: { uid: string } = authData
        ? (authData.toJSON() as { uid: string })
        : null

      if (!user && authDataJSON && authDataJSON.uid) {
        setUser(authDataJSON)
      }

      if (user && authDataJSON && authDataJSON.uid !== user.uid) {
        setUser(authDataJSON)
      }

      if (user && !authDataJSON) {
        setUser(null)
      }
    }
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(handleAuthStateChanged)
    return function cleanup() {
      unsubscribe()
    }
  })

  return user && mapUser ? mapUser(user) : user
}
