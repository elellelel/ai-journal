const { environment } = require('@rails/webpacker');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const vue = require('./loaders/vue');

// Access the resolve.alias property safely
environment.config.merge({
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm-bundler.js', // Ensure runtime template compilation
    },
  },
});

// Add feature flags for Vue
environment.plugins.append(
  'Provide',
  new webpack.DefinePlugin({
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  })
);

// Add VueLoaderPlugin and loader for .vue files
environment.plugins.prepend('VueLoaderPlugin', new VueLoaderPlugin());
environment.loaders.prepend('vue', {
  test: /\.vue$/,
  use: [
    {
      loader: 'vue-loader',
      options: {
        compilerOptions: {
          isCustomElement: (tagName) => {
            return tagName === 'vue-advanced-chat' || tagName === 'emoji-picker';
          },
        },
      },
    },
  ],
});

// Babel loader for JS files
environment.loaders.append('babel', {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
  },
});

module.exports = environment;