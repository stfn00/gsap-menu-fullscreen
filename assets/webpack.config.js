/**
 * ==========================================================================
 * Webpack configuration
 * ==========================================================================
 */

const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const OptimizeCssAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );
const cssnano = require( 'cssnano' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

// Directories path
const JS_DIR = path.resolve( __dirname, 'src/js' );
const IMG_DIR = path.resolve( __dirname, 'src/img' );
const LIB_DIR = path.resolve( __dirname, 'src/library' );
const BUILD_DIR = path.resolve( __dirname, 'build' );

const entry = {
	main: JS_DIR + '/main.js',
};

const output = {
	path: BUILD_DIR,
	filename: 'js/[name].js'
};

/**
 * Note: argv.mode will return "development" or "production"
 */
const plugins = ( argv ) => [
	
	new CleanWebpackPlugin( {
		/**
		 * Automatically remove all unused webpack assets on rebuild, when set to true in production
		 * https://www.npmjs.com/package/clean-webpack-plugin#options-and-defaults-optional
		 */
		cleanStaleWebpackAssets: ( 'production' === argv.mode  )
	} ),

	new MiniCssExtractPlugin( {
		filename: 'css/[name].css'
	} ),

	new CopyPlugin( {
		patterns: [
			{ from: LIB_DIR, to: BUILD_DIR + '/library' }
		]
	} )
];

const rules = [
	{
		test: /\.js$/,
		include: [ JS_DIR ],
		exclude: /node_modules/,
		use: 'babel-loader'
	},
	{
		test: /\.scss$/,
		exclude: /node_modules/,
		use: [
			MiniCssExtractPlugin.loader,
			{
				// Translates CSS into CommonJS modules
				loader: 'css-loader'
			},
			{
				// Run postcss actions
				loader: 'postcss-loader',
				options: {
					// 'postcssOptions' is needed for postcss 8.x
					// if you use postcss 7.x skip the key
					postcssOptions: {
						// postcss plugins, can be exported to postcss.config.js
						path: 'postcss.config.js'
					}
				}
			},
			{
				// Compiles Sass to CSS
				loader: 'sass-loader'
			},
		]
	},
	{
		test: /\.(png|jpg|svg|jpeg|gif|ico)$/,
		use: {
			loader: 'file-loader',
			options: {
				name: '[path][name].[ext]',
				publicPath: 'production' === process.env.NODE_ENV ? '../' : '../../'
			}
		}
	},
	{
		test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
		exclude: [ IMG_DIR, /node_modules/ ],
		use: {
			loader: 'file-loader',
			options: {
				name: '[path][name].[ext]',
				publicPath: 'production' === process.env.NODE_ENV ? '../' : '../../'
			}
		}
	}
];

/**
 * Since you may have to disambiguate in your webpack.config.js between development and production builds
 * you can export a function from your webpack configuration instead of exporting an object
 *
 * @param {string} env environment ( See the environment options CLI documentation for syntax examples. https://webpack.js.org/api/cli/#environment-options )
 * @param argv options map ( This describes the options passed to webpack, with keys such as output-filename and optimize-minimize )
 * 
 * @return {{output: *, devtool: string, entry: *, optimization: {minimizer: [*, *]}, plugins: *, module: {rules: *}, externals: {jquery: string}}}
 *
 * @see https://webpack.js.org/configuration/configuration-types/#exporting-a-function
 */
module.exports = ( env, argv ) => ({

	entry: entry,

	output: output,

	/**
	 * A full SourceMap is emitted as a separate file (e.g.  main.js.map)
	 * It adds a reference comment to the bundle so development tools know where to find it
	 * Set this to false if you don't need it
	 */
	devtool: ('production' === argv.mode ) ? false : 'source-map',

	module: {
		rules: rules,
	},

	optimization: {
		minimize: true,
		minimizer: [
			new OptimizeCssAssetsPlugin( {
				cssProcessor: cssnano
			} ),

			new TerserPlugin( {
				parallel: true,
				terserOptions: {
					compress: true
				},
			} )
		]
	},

	plugins: plugins( argv ),

	externals: {
		$: "jquery",
      	jQuery: "jquery"
	}
});
