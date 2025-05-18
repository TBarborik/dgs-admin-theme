// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename]
        }
    },
    entry: {
        app: "./src/app.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: !isProduction ? "assets/[base]" : "assets/[hash][ext]"
    },
    plugins: [
        new MiniCssExtractPlugin(),
    ],
    module: {
        rules: [
			{
				test: /\.[jt]sx?/i,
				use: "ts-loader",
				exclude: /node_modules/,
				resolve: {
					extensions: [".ts", ".js"],
				},
			},
            {
                test: /\.s[ac]ss$/i,
                use: [
                    stylesHandler,
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: 'resolve-url-loader',
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                plugins: isProduction ? [
                                    "postcss-preset-env", "autoprefixer"
                                ] : ["autoprefixer"],
                            },
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, "css-loader", "postcss-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        fallback: {
            "util": require.resolve("util/"),
            "assert": require.resolve("assert/"),
            "path": require.resolve("path-browserify"),
            "url": require.resolve("url/")
        }
    }
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";
    } else {
        config.mode = "development";
    }
    return config;
};
