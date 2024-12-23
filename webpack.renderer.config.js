const rules = require('./webpack.rules')

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
})

rules.push({
  test: /\.mp3$/,
  loader: 'file-loader'
})

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules
  },
  output: {
    assetModuleFilename: 'assets/[hash][ext][query]'
  }
}
