const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const BrotliPlugin = require("brotli-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin")

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "dovotori-game.js",
    path: path.resolve(__dirname, "../build/prod/"),
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
        test: /\.(jpe?g|png|gif)$/i,
        use: ["url-loader?name=/img/[name].[ext]"],
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
    new UglifyJSPlugin({
      uglifyOptions: {
        beautify: false,
        mangle: {
          keep_fnames: true,
        },
        compress: {
          warnings: false,
          drop_console: true,
        },
        comments: false,
      },
    }),
    new CopyWebpackPlugin([{ from: "./assets/", to: "./assets/" }]),
    new BrotliPlugin({
      asset: "[path].br[query]",
      test: /\.(html)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      test: /\.(html)$/,
      threshold: 0,
      minRatio: 0.8,
    }),
  ],
}
