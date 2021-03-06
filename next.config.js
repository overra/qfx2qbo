require("dotenv").config();
const webpack = require("webpack");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

module.exports = {
  webpack: (config, { dev }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.ALGOLIA_ID": JSON.stringify(process.env.ALGOLIA_ID),
        "process.env.ALGOLIA_KEY": JSON.stringify(process.env.ALGOLIA_KEY)
      })
    );
    if (!dev) {
      config.plugins.push(
        new SWPrecacheWebpackPlugin({
          cacheId: "convert-qfx",
          verbose: true,
          runtimeCaching: [
            {
              handler: "networkFirst",
              urlPattern: /^https?.*/
            }
          ],
          minify: true,
          staticFileGlobsIgnorePatterns: [
            /\.map$/,
            /asset-manifest\.json$/,
            /\.next\//
          ]
        })
      );
    }
    return config;
  }
};
