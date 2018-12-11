const env = process.env.NODE_ENV || 'development';

module.exports = {
  mode: env,
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
      },
    ],
  },
};
