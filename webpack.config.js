const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

var config = {
  entry: {
    dist: './scripts/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'h5p-three-image.js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'h5p-three-image.css'
    })
  ],
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
        test: /\.(s[ac]ss|css)$/,
        include: path.resolve(__dirname, 'scripts'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
        include: [
          path.resolve(__dirname, 'scripts'),
          path.resolve(__dirname, 'assets')
        ],
        type: 'asset/resource'
      }
    ]
  }
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
  }

  return config;
};
