var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

new WebpackDevServer(webpack({
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './pages/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: [
          path.join(__dirname, 'pages'),
          path.join(__dirname, '../src'),
          path.join(__dirname, '../libs')
        ]
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.(png|eot|svg|ttf|woff|woff2)(\?.+)?$/,
        loader : 'url-loader'
      }
    ]
  }
}), {
  publicPath: '/',
  hot: true,
  historyApiFallback: true
}).listen(3000, 'localhost', (error, result) => {
  if (error) {
    console.log(error);
  }
});