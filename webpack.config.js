var webpack = require('webpack');

module.exports = {
  context: __dirname + "/",
  devtool: 'cheap-module-source-map', 
  entry: [
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
        loaders: ["babel-loader"]
      },
      /*
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      */
      {
        test: /\.(css|jpg|png)$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.json$/,
        use: 'json-loader',
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
    new webpack.optimize.UglifyJsPlugin(),
    //new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
      }
    }),

  ],
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist/client/"
  },
}
