const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  "mode": "development",
  "entry": "./src/names/index.js",
  "output": {
    "path": __dirname + '/names',
    "filename": "bundle.js"
  },
  "plugins": [
    new HtmlWebpackPlugin()
  ],
  "devtool": "source-map",
  "module": {
    "rules": [
      {
        "enforce": "pre",
        "test": /\.(js|jsx)$/,
        "exclude": /node_modules/,
        "use": "eslint-loader"
      },
      {
        "test": /\.js$/,
        "exclude": /node_modules/,
        "use": {
          "loader": "babel-loader",
          "options": {
            "presets": [
              "@babel/preset-env"
            ]
          }
        }
      },
      {
        "test": /\.scss$/,
        "use": [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  }
}
