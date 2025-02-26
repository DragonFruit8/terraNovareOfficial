const webpack = require('webpack');

module.exports = {
  // ... your other configuration options
  resolve: {
    fallback: {
      process: require.resolve('process/browser')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ]
};
