
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  // Punto di ingresso dell'applicazione.
  entry: './public/js/app.js',

  // Configurazione dell'output dei file compilati.
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true,
  },

  // Regole per la gestione dei diversi tipi di moduli.
  module: {
    rules: [
      {
        // Regola per i file JavaScript.
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        // Regola per i file CSS.
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Regola per i file immagine.
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },
    ],
  },

  // Plugin utilizzati da Webpack.
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new Dotenv(),
  ],

  // Configurazione del server di sviluppo.
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 8080,
    open: true,
    hot: true,
    historyApiFallback: true,
  },
};
