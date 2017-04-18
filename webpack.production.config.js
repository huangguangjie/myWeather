var webpack = require('webpack');

module.exports = {
	entry: {
		index: ['./src/index.js'],
		vendor: [
			'react',
			'react-dom'
		]
	},
	output: {
		path: __dirname + '/public',
		publicPath: '/public/',
		filename: '[name].bundle.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: [
					'react',
					'es2015',
					'stage-0'
				],
				plugins: ['transform-decorators-legacy']
			}
		},
		{test: /\.css$/, loader: 'style-loader!css-loader'},
		{test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
		{test:/\.(png|jpg|ttf|woff|eot|woff2|svg)$/, loader: 'url-loader?limit=8192'},
		{test: /\.js$/, loader: 'jshint-loader', include: __dirname + '/src'}
		]
	},
	resolve: {
		extensions: [' ','.js','.jsx','.es6']
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({name:"vendor",filename: "vendor.bundle.js"}),
		new webpack.optimize.UglifyJsPlugin({minimize: true})
	]
}