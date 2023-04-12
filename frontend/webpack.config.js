const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    compress: true,
    historyApiFallback: true,
    hot: true,
    historyApiFallback: {
        index: '/'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: ({ htmlWebpackPlugin }) => '<!DOCTYPE html><html><head><meta charset=\"utf-8\"><script src="/bundle.js"></script><title>' + htmlWebpackPlugin.options.title + '</title></head><body><div id=\"root\"></div></body></html>',
      filename: 'index.html',
    }),
    new LodashModuleReplacementPlugin,
    new MiniCssExtractPlugin()
  ],
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.jsx',
      '.js'
    ]
  }
};

module.exports = config;