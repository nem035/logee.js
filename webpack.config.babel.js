import path from 'path';

module.exports = {
	entry: ['webpack-dev-server/client?http://localhost:8080', './src/js/logee.js'],
	watch: true,
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '',
		filename: 'dev-build.js',
		chunkFilename: '[id].bundle.js',
		hotUpdateMainFilename: 'dev-build.js',
		hotUpdateChunkFilename: 'dev-build.json'
	},
	module: {
    loaders: [
      {
        test: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: 'es2015'
        }
      }
    ]
  }
};