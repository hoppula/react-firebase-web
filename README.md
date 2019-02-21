# react-firebase-web ☢️🔥🕸

> Firebase React components with a render prop

`react-firebase-web` provides useful set of React components with easy-to-use APIs to access most of Firebase's features.

## Installation

### Using npm

```
npm install -S react-firebase-web
```

### Using yarn

```
yarn add react-firebase-web
```

## Usage

```javascript
<Firebase
  apiKey="AKzuSyD_O5g9322ozW28XRJ3MPgI-Q2sEBwqYmx"
  projectId="react-forum-example"
>
  <Value path="users/admin">{admin => <div>{admin.name}</div>}</Value>
  <List path="users/test/posts" query={ref => ref.orderByKey().limitToLast(10)}>
    {last10Posts => (
      <ul>
        {last10Posts.map(({ key, value: post }) => (
          <li key={key}>{post.title}</li>
        ))}
      </ul>
    )}
  </List>
  <User
    children={user => {
      return user.uid ? <div>{user.displayName}</div> : <div />
    }}
  />
  <Write method="push" to="users">
    {pushToUsers => <AddUser addUser={pushToUsers} />}
  </Write>
</Firebase>
```

## Components

### Firebase

&lt;Firebase/&gt; places Firebase instance to React's context, so all the other components can access it. You should wrap your app inside &lt;Firebase/&gt; component.

#### Usage

```javascript
<Firebase
  apiKey="your-api-key"
  projectId="your-project-id"
  databaseUrl="your-database-url (optional)"
  firebase={yourCustomFirebaseImplementation} // optional, allows using API compatible implementation, e.g. firebase-mock for tests
>
  <YourApp />
</Firebase>
```

### Connected

&lt;Connected/&gt; provides the current Firebase connection status as only argument for `children` render function.

#### Usage

```javascript
<Connected children={connected => (connected ? "Online" : "Offline")} />
```

### List

&lt;List/&gt; provides given Firebase `path` as an array for given `children` render function. All array items have `key` and `value` properties. List gets re-rendered whenever there are updates to referred Firebase data.

You can provide `once` prop if you do not want realtime updates.

There's also `query` prop for limiting results, it accepts a function that gets called with Firebase reference, e.g. `ref => ref.orderByKey().limitToLast(10)`

#### Usage

```javascript
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
```

### Value

&lt;Value/&gt; provides value of given Firebase `path` as an object for given `children` render function. Value gets re-rendered whenever there are updates to referred Firebase data.

You can provide `once` prop if you do not want realtime updates.

#### Usage

```javascript
<Value path="value" children={value => <div>{value && value.name}</div>} />
```

### Populate

&lt;Populate/&gt; takes `from` prop (object with shape `{key1: true, key2: true, ...}`) and populates an array of related objects using `with` prop (function with key, `` key => `relatedPath/${key}` ``) for given `children` render function.

All array items have `key` and `value` properties. Populate gets re-rendered whenever there are updates to referred Firebase data.

#### Usage

```javascript
<Populate
  from={bookmarkedArticleIds}
  with={articledId => `articles/${articledId}`}
  children={articles => (
    <ul>
      {articles.map(({ key, value: article }) => (
        <li key={key}>{article.title}</li>
      ))}
    </ul>
  )}
/>
```

### User

&lt;User/&gt; component renders given `children` render function with currently logged in user. Render function will receive an empty object when user is not logged in.

#### Usage

```javascript
<User
  children={user => {
    if (user.uid) {
      return <div>{user.displayName} Logout</div>
    } else {
      return <div>Login</div>
    }
  }}
/>
```

### OAuthLogin

&lt;OAuthLogin/&gt; renders given `children` render function with `login` function, which can be passed to `onClick` handler for example.

`flow` prop accepts `popup` and `redirect` as authentication flows.

`provider` props accepts `facebook`, `github`, `google` and `twitter` as OAuth providers.

#### Usage

```javascript
<OAuthLogin
  flow="popup"
  provider="google"
  children={login => <button onClick={login}>Login with Google</button>}
/>
```

### Logout

&lt;Logout/&gt; provides `logout` function for given `children` render function, it can then be passed to event handlers, e.g. `onClick`.

#### Usage

```javascript
<Logout children={logout => <button onClick={logout}>Logout</button>} />
```

### Write

&lt;Write/&gt; provides mutator function for given `children` render function.

`method` prop accepts `push`, `set`, `update` and `transaction`.

`to` prop accepts path to mutate as a string.

#### Usage

```javascript
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
```

### EmailLogin

&lt;EmailLogin/&gt; logs user in using Firebase Auth's `signInWithEmailAndPassword` method.

Given `children` render function receives single parameter, a function that logs user in.

That function accepts `email` and `password` as params and returns a `Promise`.

#### Usage

```javascript
<EmailLogin
  children={login => (
    <button onClick={() => login("test@email.dev", "password")}>Login</button>
  )}
/>
```

### Registration

&lt;Registration/&gt; registers new user using Firebase Auth's `createUserWithEmailAndPassword` method.

Given `children` render function receives single parameter, a function that creates new user.

That function accepts `email` and `password` as params and returns a `Promise`.

#### Usage

```javascript
<Registration
  children={register => (
    <button onClick={() => register("test@test.dev", "test")}>
      Create user
    </button>
  )}
/>
```

### ResetPassword

&lt;ResetPassword/&gt; sends password reset e-mail using Firebase Auth's `sendPasswordResetEmail` method.

Given `children` render function receives single parameter, a function that sends password reset e-mail.

That function accepts `email` as a param and returns a `Promise`.

#### Usage

```javascript
<ResetPassword
  children={sendResetEmail => (
    <button onClick={() => sendResetEmail("test@test.dev")}>
      Send reset password e-mail
    </button>
  )}
/>
```

### Upload

&lt;Upload/&gt; is a component that uploads files to Firebase storage.

`onUpload` prop function is called when upload completes. It receives upload snapshot and rootRef, so you can store references to uploaded files to some other location in your Firebase database.

```javascript
onComplete = (snapshot, rootRef) => {
  rootRef
    .child(`users/${this.props.user.uid}/uploads`)
    .push(snapshot.downloadURL)
}
```

`path` prop defines where uploaded files should be stored.

`children` render function receives an object with:

- `uploadFiles` a function that uploads the provided files, can be used directly as `react-dropzone`'s `onDrop` callback prop.

- `uploads` array of user's uploaded files.

The example below uses `react-dropzone`.

**NOTE:** Remember to enable Firebase storage in your Firebase control panel before using Upload component.

#### Usage

```javascript
<Upload
  onUpload={this.onComplete}
  path="uploads"
  children={({ uploadFiles, uploads }) => {
    return (
      <Dropzone onDrop={uploadFiles}>
        {uploads.map(upload => {
          const { snapshot, error, success } = upload
          if (error) {
            return <div>Error</div>
          }
          if (success) {
            return <div>Success {snapshot.downloadURL}</div>
          }
          return <div>Uploading...</div>
        })}
      </Dropzone>
    )
  }}
/>
```

### Download

&lt;Download/&gt; allows you to get download url for provided Firebase Storage reference. Given `children` render function receives an object with `url` property.

If you set `metadata` prop as true, provided object will also include `metadata` object, which includes file metadata, such as `contentType`.

#### Usage

```javascript
<Download
  path="https://firebasestorage.googleapis.com/v0/b/example-project-sd5c9.appspot.com/o/uploads%2Factivity.svg?alt=media&token=1e39160x-fgd1-4c15-a4bf-701f12d3d754"
  metadata
>
  {download => (
    <div>
      <img src={download.url} /> {download.metadata.contentType}
    </div>
  )}
</Download>
```

## React Hooks

This project will be likely rewritten using [hooks](https://reactjs.org/docs/hooks-intro.html) soon, but it will still provide current render prop components as an alternative.

## Firestore

Firestore support is in progress, no ETA yet.

## License

MIT
