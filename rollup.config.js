// @ts-check

import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'

// @ts-ignore
import npmConfig from './package.json'

const dist = './dist'
const dev = Boolean(process.env.ROLLUP_WATCH)
const babelConfig = require('./babel.config.js')
const input = './src/index.ts'

export default [
    {
        input,
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
    },
    {
        input,
        output: [{ file: `${dist}/index.d.ts`, format: 'es' }],
        plugins: [dts()]
    }
]
