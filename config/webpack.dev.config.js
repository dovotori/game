const path = require("path")
const webpack = require("webpack")

const port = 8080
const host = "localhost"

module.exports = {
  mode: "development",
  entry: [
    "webpack/hot/only-dev-server",
    "babel-polyfill",
    `webpack-dev-server/client?http://${host}:${port}`,
    "./src/index",
  ],
  output: {
    filename: "dovotori-game.js",
    publicPath: "/",
  },
  devtool: "eval",
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   loader: 'url-loader?name=/img/[name].[ext]?[hash]?limit=100000',
      // },
      {
        test: /\.(css)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("developement"),
      },
    }),
  ],
  devServer: {
    host,
    historyApiFallback: true,
    hot: true,
    inline: true,
    port,
    publicPath: "/",
  },
}
