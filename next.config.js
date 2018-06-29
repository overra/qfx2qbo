require("dotenv").config();
const webpack = require("webpack");

module.exports = {
  webpack: (config, { dev }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.ALGOLIA_ID": JSON.stringify(process.env.ALGOLIA_ID),
        "process.env.ALGOLIA_KEY": JSON.stringify(process.env.ALGOLIA_KEY)
      })
    );
    return config;
  }
};
