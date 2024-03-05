import path from 'path';
import nodeExternals from 'webpack-node-externals';
import { Configuration } from 'webpack';

const config: Configuration = {
  entry: './src/bin/www.ts',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      "@utils": path.resolve(__dirname, 'src/utils/index'),
      "@configs": path.resolve(__dirname, 'src/configs/index'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;

// "dev": "webpack --mode development && nodemon --exec ts-node dist/app.js"
