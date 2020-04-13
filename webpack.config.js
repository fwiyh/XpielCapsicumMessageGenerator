// const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

let config = {
	// モード値を production に設定すると最適化された状態で、
	// development に設定するとソースマップ有効でJSファイルが出力される
	// mode: "development", // "production" | "development" | "none"

	// メインとなるJavaScriptファイル（エントリーポイント）
	entry: {
		index: __dirname + "/src/ts/index.tsx",
	},
	output: {
		path: path.join(__dirname, "dist"),
		filename: "index.js",
	},

	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: ["/node_modules/", "/src/scss/"],
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: [
								// プリセットを指定することで、ES2020 を ES5 に変換
								"@babel/preset-env",
							]
						}
					},
					{ loader: "ts-loader" },
				],
				exclude: /node_modules|\.d\.ts$|\.config\.ts$/,
			},
		]
	},
	// import 文で .ts ファイルを解決するため
	resolve: {
		alias: {
			userEnv$: path.resolve(__dirname, "src/development.config.ts")
		},
		modules: [
			"node_modules", // node_modules 内も対象とする
		],
		extensions: [
			".ts",
			".tsx",
			".js", // node_modulesのライブラリ読み込みに必要
		]
	},
	plugins: [
		new CopyWebpackPlugin([
			{
				from: `${__dirname}/public`,
				to: `${__dirname}/dist`,
				context: `${__dirname}`,
				force: true,
			},
		],
			{ copyUnmodified: true }
		),
		new CleanWebpackPlugin(),
	],
};

module.exports = (env, argv) => {
	if (argv.mode === "production") {
		config.mode = "production";
		config.resolve["alias"] = { userEnv$: path.resolve(__dirname, "src/production.config.ts") };
	} else {
		config.mode = "development";
		config.devtool = "source-map";
	}
	return config;
};