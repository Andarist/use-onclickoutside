import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import pkg from './package.json'

const extensions = ['.ts', '.js']

const createConfig = ({ output, browser = false }) => ({
  input: 'src/index.ts',
  output: output.map(format => ({ exports: 'named', ...format })),
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    nodeResolve({ extensions }),
    babel({ extensions }),
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
