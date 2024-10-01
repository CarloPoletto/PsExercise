const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = env => {
    return {
        //target: 'electron-renderer',
        mode: env === "development" ? "development" : "production",
        devtool: env === "development" ? "cheap-eval-source-map" : false,
        node: {
            fs: 'empty',
            http2: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: "empty",
        },
        entry: {
            bundle: "./src/Index.tsx"
        },
        output: {
            filename: "[name].[contenthash].js",
            path: path.join(__dirname, "build/")
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            modules: [
                path.resolve('./node_modules/'),
                path.resolve('./src')
            ]
        },
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /it/),
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
            new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.optimize\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }],
                },
                canPrint: true
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.wasm$/,
                    type: 'javascript/auto',
                },
                {
                    test: /\.(jsx|tsx|js|ts)$/,
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                        compilerOptions: {
                            target: env === "development" ? "ES6" : "ES6"
                        }
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: [env === "development" ? 'style-loader' : 'style-loader', 'css-loader']
                },
                {
                    test: /\.(png|jpg|webp|woff|woff2|eot|ttf|svg)$/,
                    loader: 'url-loader?limit=100000'
                }
            ]
        },
        devServer: {
            host: "localhost",
            contentBase: path.join(__dirname, "build/")
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    sourceMap: env === "development"
                }),
                new OptimizeCssAssetsPlugin({})
            ],
            splitChunks: {
                cacheGroups: {
                    node_modules: {
                        test: /[\\/]node_modules[\\/].*\.js$/,
                        name: 'node_modules',
                        chunks: 'all'
                    },
                    ext_modules: {
                        name: 'ext_modules',
                        test: /[\\/]ext_modules[\\/]azure_storage[\\/]/,
                        minSize: 0,
                        chunks: 'all'
                    }
                }
            }
        },
        //externals: { 'Config': null }
    }
};

module.exports = env => webpackConfig(env);