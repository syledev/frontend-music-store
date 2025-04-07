const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      main: './assets/js/main.js',
      cart: './assets/js/cart.js',
      wishlist: './assets/js/wishlist.js',
      blog: './assets/js/blog.js',
      contact: './assets/js/contact.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'assets/js/[name].[contenthash].js' : 'assets/js/[name].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[hash][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash][ext]'
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        chunks: ['main']
      }),
      new HtmlWebpackPlugin({
        template: './pages/cart.html',
        filename: 'cart.html',
        chunks: ['cart']
      }),
      new HtmlWebpackPlugin({
        template: './pages/wishlist.html',
        filename: 'wishlist.html',
        chunks: ['wishlist']
      }),
      new HtmlWebpackPlugin({
        template: './pages/blog.html',
        filename: 'blog.html',
        chunks: ['blog']
      }),
      new HtmlWebpackPlugin({
        template: './pages/contact.html',
        filename: 'contact.html',
        chunks: ['contact']
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? 'assets/css/[name].[contenthash].css' : 'assets/css/[name].css'
      })
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction
            }
          }
        }),
        new CssMinimizerPlugin()
      ],
      splitChunks: {
        chunks: 'all',
        name: 'vendors'
      }
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      compress: true,
      port: 9000,
      hot: true
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map'
  };
}; 