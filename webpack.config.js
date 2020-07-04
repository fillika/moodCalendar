const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const optimization = () => {
  const config = {};

  if (!isDev) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};

const styleLoader = () => {
  return {
    loader: MiniCssExtractPlugin.loader,
    options: {
      hmr: isDev,
      reloadAll: true,
    },
  };
};

const fileLoader = () => {
  return {
    loader: 'file-loader',
    options: {
      name: '[path][name].[ext]',
    },
  };
};

module.exports = {
  devServer: {
    port: 8110,
    hot: isDev,
  },
  context: path.resolve(__dirname, 'src'), // Место, откуда webpack по умолчанию берет конфиги
  mode: 'development',
  entry: {
    // main: './index.js',
    main: './index.ts',
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      '@images': path.resolve(__dirname, 'src/assets/media/img'),
      '@fonts': path.resolve(__dirname, 'src/assets/media/fonts'),
      '@styles': path.resolve(__dirname, 'src/assets/styles'),
      '@scripts': path.resolve(__dirname, 'src/assets/script'),
    },
  },
  optimization: optimization(),
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: false,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          styleLoader(),
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          styleLoader(),
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(otf|ttf|woff|woff2|eot)$/i,
        use: [fileLoader()],
      },
      {
        test: /\.(png|jp[e]g|svg|gif|webp)$/,
        use: [fileLoader()],
      },
    ],
  },
};
