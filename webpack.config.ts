
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as path from 'path';
import { api } from './src/api';

const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const dashboard = new Dashboard();

var srcDir = path.resolve(__dirname, 'src');

module.exports = {
  context: srcDir,
  entry: { main: './main.ts', index: './index.tsx' },
  output: {
    path: '/dist',
    pathinfo: true,
    publicPath: '/',
    filename: '[name].js'
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: path.join(__dirname, 'node_modules')
      },
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'url-loader' },
      // Required for FontAwesome 
      {
        test: /\fontawesome-webfont.(eot|svg|ttf|woff|woff2)$/, loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: '../../../node_modules/font-awesome/'
        }
      },
      { test: /index\.html/, loader: "file-loader?name=[name].[ext]" },
      {
        test: /\.scss$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        },
        {
          loader: "css-loader",
          options: {
            sourceMap: true,
            modules: true,
            localIdentName: "[local]___[hash:base64:5]"
          }
        },
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    // Exposes dependencies in-memory by webpack-dev-server to allow for
    // async loads by head.js, any iframes, or the theme switch in the menu
    new CopyWebpackPlugin([
      // The Ace Editor
      {
        from: '../node_modules/ace-builds/src-min',
        to: './node_modules/ace-builds/src-min'
      },
      // Reveal.js: All Themes, Fonts & Default Plugins
      {
        from: { glob: '../node_modules/reveal.js/**/*' },
        to: './node_modules'
      },
      // Reveal.js: Menu Plugin
      { from: { glob: '../node_modules/reveal.js-menu/**/*' }, to: './node_modules' },
      { from: { glob: '../node_modules/reveal-badges/**/*' }, to: './node_modules' },
      { from: { glob: '../node_modules/reveal-elapsed-time-bar/**/*' }, to: './node_modules' },
      { from: { glob: '../node_modules/reveald3/**/*' }, to: './node_modules' },

      { from: { glob: '../node_modules/react/**/*' }, to: './node_modules' },
      { from: { glob: '../node_modules/react-dom/**/*' }, to: './node_modules' },

      { from: { glob: '../node_modules/bulma/**/*' }, to: './node_modules' },

      { from: { glob: '../node_modules/font-awesome/**/*' }, to: './node_modules' }
    ]),
    new MiniCssExtractPlugin(),
    new DashboardPlugin(dashboard.setData)
  ],
  devServer: {
    clientLogLevel: 'none',
    contentBase: srcDir,
    compress: true,
    historyApiFallback: true,
    port: 8080,
    host: '127.0.0.1',
    inline: true,
    quiet: true,
    open: false,
    before: (app: any) => new api(app)
  }
};