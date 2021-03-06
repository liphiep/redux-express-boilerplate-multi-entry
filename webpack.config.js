const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC = path.join(__dirname, "client", "src");
const DIST = path.join(__dirname, "client", "dist", "bundles");

const isProd = process.env.NODE_ENV === 'production';

const entry = {
    index: [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client?noInfo=false',
        SRC + "/index/js/index.js",
        SRC + "/index/scss/index.scss"
    ],
    admin: [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client?noInfo=false',
        SRC + "/admin/js/index.js",
        SRC + "/admin/scss/index.scss"
    ]
};

let plugins = [];

let rules = [{
    test: /\.js$/,
    use: [{
        loader: 'babel-loader'
    }],
    exclude: /node_modules/
}];

const output = {
    filename: '[name].js',
    path: DIST,
    pathinfo: true,
    publicPath: '/bundles/'
};

// Configuration changes
if (isProd) {

    // Remove development entries
    entry.index.splice(0, 2);
    entry.admin.splice(0, 2);


    // Add production plugins
    plugins = [
        new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js'}),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify("production")
        }),
        new ExtractTextPlugin("[name].css"),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false,
            },
        })
    ];

    // Production rules
    rules.push({
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader!sass-loader"
        }),
    });
} else {

    plugins = [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ];

    rules.push({
            test: /\.scss$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }, {
                loader: 'sass-loader'
            }],
        }
    );
}

module.exports = {
    target: 'web',
    entry,
    output,
    devtool: isProd ? 'cheap-module-source-map' : 'inline-source-map',
    performance: {
        hints: false
    },
    module: {
        rules
    }
    ,
    plugins
};
