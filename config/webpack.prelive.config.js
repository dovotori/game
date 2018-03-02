const path = require("path")
const webpack = require("webpack")

const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "dovotori-game.js",
    path: path.resolve(__dirname, "../build/prelive/"),
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["env"]],
            },
          },
        ],
      },
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
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: ["url-loader?name=/img/[name].[ext]"],
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "game",
      filename: "index.html",
      inject: "body",
      template: path.resolve(__dirname, "../templates/index.ejs"),
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: false,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      },
      inlineSource: ".(js|css)$",
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    // new ServiceWorkerWebpackPlugin({
    //   entry: path.resolve(__dirname, "../src/utils/serviceWorker.js"),
    // }),
    new UglifyJSPlugin({
      uglifyOptions: {
        beautify: false,
        mangle: {
          keep_fnames: true,
        },
        compress: {
          warnings: false,
          // drop_console: true,
        },
        comments: false,
      },
    }),
    new CopyWebpackPlugin([{ from: "./assets/", to: "./assets/" }]),
  ],
}
