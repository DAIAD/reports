var webpack = require('webpack');

var HOST = process.env.HOT_LOAD_HOST;
var HOTLOADPORT = process.env.HOT_LOAD_PORT;

module.exports = {
  context: __dirname + "/",
  devtool: 'eval', 
  entry: [
    "webpack-dev-server/client?http://0.0.0.0:" + HOTLOADPORT,
    "webpack/hot/only-dev-server",
    "./src/client.js"
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ["react-hot", "babel-loader"],
      },
      /*
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
        },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      },
      */
      {
        test: /\.(css|jpg|png)$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.ttf$/,
        loader: 'file?name=fonts/[name].[ext]'
      },
      /*
      { 
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
        loader: 'url-loader?limit=100000' 
      }
        */
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
      }
    }),
    //webpackIsomorphicToolsPlugin.development()
  ],
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist/client/",
    publicPath: 'http://' + HOST + ':' + HOTLOADPORT + '/dist/client/'
  },
}
