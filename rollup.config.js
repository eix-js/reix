import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import npmConfig from './package.json'
import { terser } from 'rollup-plugin-terser'

const dist = './dist'
const dev = Boolean(process.env.ROLLUP_WATCH)
const babelConfig = require('./babel.config.js')

export default {
    input: './src/index.ts',
    output: [
        {
            file: `${dist}/bundle.cjs.js`,
            format: 'cjs'
        },
        {
            file: `${dist}/bundle.esm.js`,
            format: 'esm'
        }
    ],
    external: [...Object.keys(npmConfig.dependencies || {})],
    plugins: [
        nodeResolve({
            extensions: ['.ts']
        }),
        babel({
            exclude: 'node_modules/**',
            extensions: ['ts', 'js'],
            ...babelConfig
        }),
        !dev && terser()
    ]
}
