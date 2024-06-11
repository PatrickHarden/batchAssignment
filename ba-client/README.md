# ba-client

The [React](https://reactjs.org/) [typescript](https://www.typescriptlang.org/docs/) front end UI client for BA

## Dependencies

- Node v16.14.0 Do NOT download above this version if package.json contains scholastic-volume. Download [LTS version](https://nodejs.org/en/download/) or a tool like [NVM](https://github.com/nvm-sh/nvm#intro) ([Windows Version](https://dev.to/skaytech/how-to-install-node-version-manager-nvm-for-windows-10-4nbi))

## Setup

### Cloning

```
git clone git@bitbucket.org:scholastic/lit-platform-ba-web.git
cd ba-web/ba-client
git checkout develop
```

### Using React Volume

We use [React Volume Library](https://bitbucket.org/scholastic/volume/src/master/packages/volume-react/) for UI components.<br/>
To allow installation of this library, we need a `.npmrc` file inside `ba-web/ba-client` with credentials.<br/>

1. Create `.npmrc` file

```
cd ba-web/ba-client
touch .npmrc
open .npmrc
```

2. Using your JFrog credentials

Make sure that you can login to JFrog [here](https://scholastic.jfrog.io/ui/login/).

You should already have access as part of the onboarding process, however, if this is not the case, reach out to Josh Fritts.

Paste in the below snippet and fill it in with your base64 encoded pasword, username and email for your JFrog account:

```
@scholastic:registry=https://scholastic.jfrog.io/scholastic/api/npm/npm-virtual/
//scholastic.jfrog.io/scholastic/api/npm/npm-virtual/:_password=<base64_encoded_password>
//scholastic.jfrog.io/scholastic/api/npm/npm-virtual/:username=<username>
//scholastic.jfrog.io/scholastic/api/npm/npm-virtual/:email=<email>
//scholastic.jfrog.io/scholastic/api/npm/npm-virtual/:always-auth=true
```

### Installing Dependencies

```
npm ci --legacy-peer-deps
```

## Available Scripts

In the project directory (`ba-client`), you can run:

### `npm start`

Runs the app in the development mode.<br/>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br/>
You will also see any eslint errors in the console.

### `npm run lint`

Runs eslint on the `src/` directory for any possible lint issues.<br/>
It is also recommended to have the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) plugin installed for [Visual Studio Code](https://code.visualstudio.com/) to have realtime linting issues come up during development.

### `npm test`

Launches the test runner in the interactive watch mode.<br/>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run coverage`

Launches the test runner without watch mode and generates coverage information for tests.<br/>
View coverage results by opening `coverage/lcov-report/index.html` in a browser.

### `npm run build`

Builds the app for production to the `build/META-INF/resources` folder so it can be used as a static dependency for [ba-server](https://bitbucket.org/scholastic/lit-platform-ba-web/src/develop/ba-server).

### `npm run storybook`

Launch storybook locally<br/>
Should be viewable on http://localhost:6006/

## Running with `ba-server` for API requests

1. Run `npm start` inside `ba-client` to start the FE react development server running on http://localhost:3000
2. Run `ba-server` by following the instructions [here](https://bitbucket.org/scholastic/lit-platform-ba-web/src/develop/ba-server) to start the server on http://localhost:8080
3. API requests should be proxied to the server e.g. `await fetch('/api/helloworld')`
