
const path = require('path');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 

module.exports = {
  mode: process.env.NODE_ENV || 'development',

  entry: './public/js/app.js',

  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },

  // Moduli (loaders) per gestire i diversi tipi di file.
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },

  // Plugin per estendere le funzionalità di Webpack.
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv({
      path: './.env', 
      systemvars: true, 
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html', 
      filename: 'index.html', 
      inject: 'body', 
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/css', to: 'css' },
        {
          from: 'public/img/**/*',
          to: 'img/[name][ext]',
          noErrorOnMissing: true,
          globOptions: {
            dot: true,
          },
        },
      ],
    }),
  ],

  // Opzioni del server di sviluppo.
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8080,
    open: true,
    historyApiFallback: true,
  },
};

