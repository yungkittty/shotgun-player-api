const configureServer = () => ({
  sessionSecret: process.env.SESSION_SECRET,
  port: process.env.PORT,
  mountPath: process.env.MOUNT_PATH, // client-side
});

module.exports = configureServer;
