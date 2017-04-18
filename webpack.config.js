var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: {
		index: ['./src/index.js'],
		vendor: [
			'react',
			'react-dom',
			'redux'
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
		{test:/\.(png|jpg|ttf|woff|eot|woff2|svg)$/, loader: 'url-loader?limit=8192'}
		]
	},
	resolve: {
		extensions: [' ','.js','.jsx','.es6']
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({name:"vendor",filename: "vendor.bundle.js"})
	]
};
// 判断开发环境还是生产环境,添加uglify等插件
if (process.env.NODE_ENV.trim() === 'production') {
    module.exports.plugins = (module.exports.plugins || [])
        .concat([
            new webpack.DefinePlugin({
			   'process.env': {
			       NODE_ENV: '"production"'
			   }
			}),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]);
} else {
    module.exports.devtool = 'source-map';
    module.exports.devServer = {
        port: 8080,
        contentBase: './',
        historyApiFallback: true,
        publicPath: "",
        stats: {
            colors: true
        }
    };
}