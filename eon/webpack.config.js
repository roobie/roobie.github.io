const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  "mode": "development",
  "entry": "./src/index.js",
  "output": {
    "path": __dirname+'/dist',
    "filename": "[name].[chunkhash:8].js"
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
              "env"
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
