const { NODE_ENV } = process.env
const test = NODE_ENV === 'test'
const loose = true

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose,
        modules: false,
      },
    ],
  ],
  plugins: ['macros', test && '@babel/transform-modules-commonjs'].filter(
    Boolean,
  ),
}
