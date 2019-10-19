import { useContext, useCallback } from "react"
import { default as firebaseRoot } from "firebase/app"
import { FirebaseContext } from "../index"
import { AuthFlows, AuthProviders } from "../types"
import { authProviders, authFlows } from "../authentication"

export function useOAuthLogin(
  provider: keyof AuthProviders,
  flow: keyof AuthFlows = "popup",
  scopes: string[] = []
): () => Promise<firebase.auth.UserCredential> | Promise<void> {
  const firebase: firebase.app.App = useContext(FirebaseContext)

  const authenticate = useCallback(() => {
    const authProvider = new firebaseRoot.auth[authProviders[provider]]()

    if (!(authProvider instanceof firebaseRoot.auth.TwitterAuthProvider)) {
      scopes.forEach(scope => {
        authProvider.addScope(scope)
      })
    }
    return firebase.auth()[authFlows[flow]](authProvider)
  }, [flow, provider, scopes, firebase])

  return authenticate
}
