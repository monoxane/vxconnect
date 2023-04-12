/* eslint-disable global-require */
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const port = process.env.PORT || 3000;

module.exports = (_, argv) => {
  const { mode } = argv;
  const isDevelopment = mode === 'development';

  return {
    entry: [
      './src/index.tsx',
    ],

    output: {
      path: path.resolve(__dirname, 'dist/'),
      publicPath: '/dist/',
      filename: '[name].[contenthash].js',
    },

    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        title: 'VXConnect',
        template: 'src/index.html',
        filename: 'index.html',
      }),
      isDevelopment && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),

    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
      usedExports: true,
    },

    performance: {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },

    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        '.jsx',
        '.js'
      ]
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                // this code will evaluate to "false" when
                // "isDevelopment" is "false"
                // otherwise it will return the plugin
                isDevelopment && require('react-refresh/babel'),
              // this line removes falsy values from the array
              ].filter(Boolean),
            },
          },
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
        },
      ],
    },

    devtool: isDevelopment && 'inline-source-map',

    devServer: isDevelopment ? {
      host: '0.0.0.0',
      port,
      open: false,
      allowedHosts: 'all',
      historyApiFallback: {
        index: '/dist/index.html',
      },
      magicHtml: true,
      proxy: {
        '/api/v1': {
          target: 'https://connect.vx0.dev',
          secure: false,
          changeOrigin: true,
        },
      },
    } : {

    },
  };
};
