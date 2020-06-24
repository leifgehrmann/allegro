const path = require("path");
const nodeExternals = require("webpack-node-externals");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

module.exports = env => {
  return {
    node: {
      __dirname: false,
      __filename: false
    },
    mode: env !== 'production' ? 'development' : 'production',
    externals: [nodeExternals()],
    resolve: {
      alias: {
        env: path.resolve(__dirname, `../config/env_${env}.json`)
      },
      extensions: ['.tsx', '.ts', '.js']
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: { appendTsSuffixTo: [/\.vue$/] },
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        },
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new FriendlyErrorsWebpackPlugin({ clearConsole: env === "development" })
    ]
  };
};
