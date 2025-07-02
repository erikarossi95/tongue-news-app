
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin'); 

module.exports = {

  
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  // Punto di ingresso dell'applicazione.
  entry: './public/js/app.js',

  // Configurazione dell'output dei file compilati.
  output: {
    // Il percorso assoluto della directory di output.
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
        // Esclude i file nella cartella node_modules per velocizzare la compilazione.
        exclude: /node_modules/,
        use: {
          // Usa Babel per la trascompilazione del codice ES6+ in ES5.
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

        test: /\.(png|svg|jpg|jpeg|gif|ico|webmanifest)$/i, 
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/img', 
          to: 'img',          
          noErrorOnMissing: true, 
        },
      ],
    }),
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
