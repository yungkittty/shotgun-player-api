# Shotgun Player API

## What's it ?

Shotgun Player API is a simple clone of [this](https://github.com/wittydeveloper/spotify-api-graphql-console/tree/master/server) repository. I just made some modifications to suit my needs.

## How to run it (locally) ?  

First, clone the repository.  

```
git clone https://github.com/yungkittty/shotgun-player-api.git
```

Once this is done, make sure to install the dependencies.  

```
npm install

Or

yarn install

```
Then you will need to edit the following informations in the _configureServer.js_ and _configureSpotify.js_ files.  

```javascript
// configureServer.js

const configureServer = () => ({
  sessionSecret: "SOME_RANDOM_UUID",
  port: 4000,
  mountPath: "https://localhost:3000/shotgun-player#",
});

module.exports = configureServer;

// configureSpotify.js

const configureSpotify = () => ({
  clientId: "SPOTIFY_CLIENT_ID",
  clientSecret: "SPOTIFY_CLIENT_SECRET",
  redirectUri: "http://localhost:4000/auth/callback",
});

module.exports = configureSpotify;
```

Then start the back-end local server.  

```
npm run start
```

It should work!  
