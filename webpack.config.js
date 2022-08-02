var path = require('path');
const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = (nodeEnv === 'production');

module.exports = {
  context: path.resolve(__dirname, 'scripts'),
  entry: {
    dist: './app.js'
  },
  devtool: (isProd) ? undefined : 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'three-image.js'
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
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
        include: [
          path.resolve(__dirname, 'scripts'),
          path.resolve(__dirname, 'assets')
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  }
};