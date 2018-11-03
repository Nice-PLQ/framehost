const webpack = require('webpack');
const path = require('path');
const globby = require('globby');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cwd = process.cwd();

let entry = {};
let files = globby.sync(['*', '!*.js'], { cwd: cwd + '/example' });
files.forEach(function (item) {
  entry[item] = path.join(__dirname, './' + item + '/index.js');
});

let config = {
  entry: entry,
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, '../build'),
    disableHostCheck: true,
    host: 'example.a.com',
    inline: true,
    open: true,
    hot: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [['env', { "modules": false }], 'stage-2']
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

files.forEach(function (item) {
  config.plugins.push(new HtmlWebpackPlugin({
    filename: item + '/index.html',
    template: './example/' + item + '/index.html',
    inject: 'body',
    chunks: [item]
  }));
});

module.exports = config;