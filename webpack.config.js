const path = require ('path');
const HtmlWebpackPlugin = require ('html-webpack-plugin');
const MiniCssExtractPlugin = require ('mini-css-extract-plugin');
const isDemo = process.env.DEMO === 'true'

const CleanWebpackPlugin = require ('clean-webpack-plugin');

const loaders = {
  cssRule: ['css-loader', 'postcss-loader'],
  scssRule: ['css-loader', 'postcss-loader', 'sass-loader'],
  lessRule: [
    'css-loader',
    'postcss-loader',
    {
      loader: 'less-loader',
    },
  ],
};

const plugins = [
  new CleanWebpackPlugin ([path.resolve (__dirname, 'dist')]),
  new MiniCssExtractPlugin ({
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),
  new HtmlWebpackPlugin ({
    template: path.resolve (__dirname, 'index.html'),
    filename: path.resolve (__dirname, 'dist/index.html')
  }),
]

const externals =  {
  react: 'react',
  lodash: 'lodash',
  brace: 'brace',
  "react-dom": "react-dom",
  "prop-types": "prop-types",
  antd: 'antd',
  immer: 'immer',
  ajv: 'ajv'
}

const entry = isDemo ? './examples/index.js' : './src/index.js'

Object.keys (loaders).forEach (item => {
  loaders[item].unshift (MiniCssExtractPlugin.loader);
});

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: loaders.cssRule,
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)(\?\S*)?$/,
        loader: 'url-loader?limit=1&name=fonts/[name].[ext]',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: loaders.scssRule,
      },
      {
        test: /\.less$/,
        use: loaders.lessRule,
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
          },
        ],
      },
    ],
  },
  plugins: isDemo &&  plugins || [
    new MiniCssExtractPlugin ({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  entry,
  output: {
    filename: '[name].js',
    path: path.resolve (__dirname, 'dist'),
    libraryTarget: "umd",
  },

  resolve: {

  },
  node: {
    fs: 'empty',
  },
  devServer: {
    contentBase: path.join (__dirname),
    compress: true,
    port: 8033,
    host: '127.0.0.1',
    historyApiFallback: true
  },
  externals : isDemo ? [] : externals
};
