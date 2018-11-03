const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

let config = {
  entry: {
    framehost: './src/framehost.js',
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [['env', { "modules": false }], 'react', 'stage-2']
          }
        }]
      }
    ]
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDom',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
        drop_debugger: true,
        drop_console: true
      }
    }),
    new CleanWebpackPlugin(['dist'])
  ]
}

module.exports = config;