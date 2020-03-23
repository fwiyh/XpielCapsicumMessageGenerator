// const webpack = require("webpack");
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");

let config = {
	// モード値を production に設定すると最適化された状態で、
	// development に設定するとソースマップ有効でJSファイルが出力される
	// mode: 'development', // "production" | "development" | "none"

	// メインとなるJavaScriptファイル（エントリーポイント）
	entry: __dirname + '/src/ts/index.ts',
	output: {
		path: path.join(__dirname, "dist"),
		filename: "index.js",
	},

	module: {
		rules: [
			{
				// 拡張子 .ts の場合
				test: /\.ts$/,
				// TypeScript をコンパイルする
				use: [
					{ 
						loader: "babel-loader",
						options: {
							presets: [
							  // プリセットを指定することで、ES2020 を ES5 に変換
							  '@babel/preset-env',
							]
						  }
					},
					{ loader: "ts-loader" },
				],
				exclude: /node_modules|\.d\.ts$/,
			},
		]
	},
	// import 文で .ts ファイルを解決するため
	resolve: {
		modules: [
			"node_modules", // node_modules 内も対象とする
		],
		extensions: [
			'.ts',
			'.js' // node_modulesのライブラリ読み込みに必要
		]
	},
	plugins: [
		new CopyPlugin([
			{
			  from: `${__dirname}/public`,
			  to: `${__dirname}/dist`,
			  context: `${__dirname}`
			}
		  ]),
	],
	externals: {
		jQuery: "jQuery",
	},
};

module.exports = (env, argv) => {
	if (argv.mode === "production"){
		config.mode = "production";
	}else {
		config.mode = "development";
		config.devtool = "source-map";
	}
	return config;
};