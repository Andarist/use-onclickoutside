const { NODE_ENV } = process.env
const test = NODE_ENV === 'test'

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
      },
    ],
    '@babel/react',
  ],
  plugins: ['macros', test && '@babel/transform-modules-commonjs'].filter(
    Boolean,
  ),
}
