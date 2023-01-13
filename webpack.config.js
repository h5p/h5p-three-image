const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const libraryName = process.env.npm_package_name;
var nodeEnv = process.env.NODE_ENV || 'development';
var isDev = (nodeEnv !== 'production');

const config = {
  context: path.resolve(__dirname, 'scripts'),
  entry: {
    dist: './app.js'
  },
  devtool: isDev ? 'inline-source-map' : undefined,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${libraryName}.js`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'scripts'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test:/\.(s*)css$/,
        include: path.resolve(__dirname, 'scripts'),
        use: [
          {
            loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /loading.svg$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: true,
            },
          },
        ],
      }
    ]
  }
};

if (isDev) {
  config.devtool = 'inline-source-map';
}
else {
  config.plugins = [new MiniCssExtractPlugin({
    filename: `${libraryName}.css?`
  })];
}

module.exports = config;