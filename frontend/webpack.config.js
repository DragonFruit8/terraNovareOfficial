const path = require('path');
modules.exports = {
    resolve: {
        fallback: {
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify"),
          "assert": require.resolve("assert"),
        },
        alias: {
          '@': path.resolve(__dirname, 'src'),
        }
      }
  };