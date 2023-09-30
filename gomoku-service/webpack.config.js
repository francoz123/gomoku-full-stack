const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, '/src'),
    publicPath: '/',
    filename: 'src/final.js',
  },
  target: 'node',
  resolve:{
    fallback: {
        util: require.resolve("util/")
    }
  }
};