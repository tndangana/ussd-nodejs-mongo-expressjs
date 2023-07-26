import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  mode: 'production',
  entry: './server.js',
  target: 'node',
  externals: [nodeExternals()],
//   output: {
//     path: path.join(__dirname, 'dist'),
//     filename: 'server.js',
//     module: 'commonjs'
//   },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
    module: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  ],
};