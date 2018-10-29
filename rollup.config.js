import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import pkg from './package.json'

const createConfig = ({ output, browser = false }) => ({
  input: 'src/index.js',
  output: output.map(format => ({ exports: 'named', ...format })),
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    babel(),
    replace({
      'process.env.BROWSER': JSON.stringify(browser),
    }),
  ],
})

export default [
  createConfig({
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'esm' },
    ],
  }),
  createConfig({
    output: [
      { file: pkg.browser[pkg.main], format: 'cjs' },
      { file: pkg.browser[pkg.module], format: 'esm' },
    ],
    browser: true,
  }),
]
