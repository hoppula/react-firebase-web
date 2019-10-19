import { AuthProviders, AuthFlows } from "./types"

export const authProviders: AuthProviders = {
  facebook: "FacebookAuthProvider",
  github: "GithubAuthProvider",
  google: "GoogleAuthProvider",
  twitter: "TwitterAuthProvider"
}

export const authFlows: AuthFlows = {
  popup: "signInWithPopup",
  redirect: "signInWithRedirect"
}
