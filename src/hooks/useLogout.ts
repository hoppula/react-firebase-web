import { useContext, useCallback } from "react"
import { FirebaseContext } from "../index"

export function useLogout() {
  const firebase: firebase.app.App = useContext(FirebaseContext)

  const logout = useCallback(() => {
    return firebase.auth().signOut()
  }, [firebase])

  return logout
}
