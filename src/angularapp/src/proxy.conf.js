const PROXY_CONFIG = [
  {
    context: [
      "/chathub"
    ],
    target: "http://localhost:32777/",
    secure: false,
    ws: true,
    changeOrigin: false,
    logLevel: "debug"

  }
]

module.exports = PROXY_CONFIG;
