const path = require('path');

const tslintConfig = require('./tslint');

/**
 * Config file for the documentation project
 */
module.exports = {
  entry: './docs/Index.tsx',
  output: {
    path: path.join(__dirname, '/docs/assets'),
    publicPath: '/assets/',
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts(x?)$/i,
        exclude: [/node_modules/],
        use: {
          loader: 'tslint-loader',
          options: {
            configuration: tslintConfig,
            emitErrors: true,
            failOnHint: false,
            formattersDirectory: path.resolve(__dirname, 'node_modules/tslint-loader/formatters/'),
          },
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader',
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }],
      },
      {
        test: /\.png$/,
        loader: 'file-loader?mimetype=image/png',
      },
      {
        test: /\.(ttf|eot|woff|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },

      // Provide jQuery=require('jquery') to use the same jquery instance.
      // See http://reactkungfu.com/2015/10/integrating-jquery-chosen-with-webpack-using-imports-loader/ for more infos.
      {
        test: require.resolve('chosen-js'),
        loader: 'imports-loader?jQuery=jquery',
      },
    ],
  },
  devServer: {
    contentBase: './docs',
  },
};
