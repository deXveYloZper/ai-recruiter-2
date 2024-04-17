// babel.config.js (CommonJS syntax)
module.exports = {
  presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }]
  ],
  plugins: [
      '@babel/plugin-transform-runtime'
  ]
};



/*
This configuration sets up Babel to transpile the test code using the @babel/preset-env preset 
and the @babel/plugin-transform-runtime plugin.
*/