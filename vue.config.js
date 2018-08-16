module.exports = {
  lintOnSave: false,

  chainWebpack(config) {
    (function(rule) {
      rule
        .use('doc-md-loader')
        .loader('./doc-md-loader.js');
    })(config.module.rule('doc-md').test(/\.doc\.md$/));
  },
};
