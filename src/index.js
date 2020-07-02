const express = require("express");
const SpotifyGraphQL = require("spotify-graphql");
const ExpressGraphQL = require("express-graphql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const timeout = require("connect-timeout");
const configureSpotify = require("./configurations/spotify");
const configureServer = require("./configurations/server");

const SpotifyStrategy = require("passport-spotify").Strategy;

const spotifyConfig = configureSpotify();
const serverConfig = configureServer();

const PORT = serverConfig.port;

let spotifyStrategy = new SpotifyStrategy(
  {
    clientID: spotifyConfig.clientId,
    clientSecret: spotifyConfig.clientSecret,
    callbackURL: spotifyConfig.redirectUri,
    passReqToCallback: true,
  },
  function (request, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      done(null, Object.assign({}, profile, { accessToken }));
    });
  }
);

passport.use(spotifyStrategy);

function userSerializer(user, done) {
  done(null, user);
}
passport.serializeUser(userSerializer);
passport.deserializeUser(userSerializer);

const appOnMountPath = express();
const app = express();

app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({ secret: serverConfig.sessionSecret }));
app.use(passport.initialize());
app.use(passport.session());
/* app.use(express.static(path.resolve(__dirname, "../../../node_modules/")));
app.use(express.static(path.resolve(__dirname, "../../../client/"))); */
app.use(timeout("5s"));

// AUTH
app.get(
  "/auth/connect",
  passport.authenticate("spotify", { scope: spotifyConfig.scopes }),
  (req, res) => {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

app.get("/auth/callback", passport.authenticate("spotify"), (req, res) => {
  res.redirect(serverConfig.mountPath);
});

app.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect(serverConfig.mountPath);
});

app.post("/graphql", (req, res) => {
  let accessToken = (req.user && req.user.accessToken) || "";
  let schema = SpotifyGraphQL.getSchema(
    Object.assign({}, spotifyConfig, {
      accessToken: accessToken,
    })
  );
  return ExpressGraphQL({
    schema: schema,
    graphiql: true,
  })(req, res);
});

/* app.get("/", (req, res) => {
  res.set("Content-Type", "text/html");
  res.send(
    new Buffer(
      fs.readFileSync(path.resolve(__dirname, "../../../client/index.html"))
    )
  );
}); */

if (serverConfig.mountPath) {
  appOnMountPath.use(serverConfig.mountPath, app);
}
console.log(`graphql server listening on port ${PORT}`);
(serverConfig.mountPath ? appOnMountPath : app).listen(PORT);
