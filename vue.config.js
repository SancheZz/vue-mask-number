const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  pages: {
    index: {
      entry: 'example/main',
      publicPath: 'example',
    },
  },

  configureWebpack: {
    output: {
      libraryExport: 'default',
    },

    plugins: [
      new StyleLintPlugin({
        files: [
          'VueMask/**/*.{vue,scss}',
          'example/**/*.{vue,scss}',
        ],
      }),
    ],
  },
};
