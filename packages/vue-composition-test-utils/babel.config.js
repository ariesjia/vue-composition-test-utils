module.exports = {
  presets: [
    [
      "@babel/env",
      {
        spec: true,
        useBuiltIns: false
      }
    ],
    "@babel/preset-typescript",
    "@vue/babel-preset-app"
  ],
  plugins: [
  ]
};
