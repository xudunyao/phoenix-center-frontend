const CracoLessPlugin = require('craco-less');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');

const smp = new SpeedMeasurePlugin();

module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    hot: false,
    watchContentBase: false,
    liveReload: false,
  },
  webpack: smp.wrap(
    {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@constants': path.resolve(__dirname, 'src/constants'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@layouts': path.resolve(__dirname, 'src/layouts'),
        '@modules': path.resolve(__dirname, 'src/modules'),
        '@stores': path.resolve(__dirname, 'src/stores'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
      plugins: [
        // new BundleAnalyzerPlugin(),
        //  new WebpackBar(),
      ],
    },
  ),
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // Customize theme, follow https://ant.design/docs/react/customize-theme-cn
            modifyVars: {
              // '@primary-color': '#1DA57A',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
