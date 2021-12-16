const path = require('path');
const { override, addWebpackAlias} = require('customize-cra');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function resolve(dir) {
    return path.join(__dirname, '.', dir)
}


const addCustomize = () => config => {
    if (process.env.npm_config_report) {
        config.devtool = false;
        if (config.plugins) {
            config.plugins.push(new BundleAnalyzerPlugin());
        }
    }
    return config
}

module.exports = override(
    addWebpackAlias({
        "@": resolve('src')
    }),
    addCustomize()
)