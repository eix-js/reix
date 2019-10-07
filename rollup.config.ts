import nodeResolve from 'rollup-plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import { resolve } from 'path'
import { babelConfig } from './babel.config'

// @ts-ignore No declarations.
import babel from 'rollup-plugin-babel'

const packageDirectory = process.cwd()
const outputDirectory = resolve(packageDirectory, 'dist')
const inputFile = resolve(packageDirectory, 'src/index.ts')

const npmConfig = require(resolve(packageDirectory, `package.json`))

const external = Object.keys(npmConfig.dependencies || {})
const dev = Boolean(process.env.ROLLUP_WATCH)

export default [
    {
        input: inputFile,
        external,
        output: [
            {
                file: `${outputDirectory}/bundle.cjs.js`,
                format: 'cjs'
            },
            {
                file: `${outputDirectory}/bundle.esm.js`,
                format: 'esm'
            }
        ],
        plugins: [
            nodeResolve({
                extensions: ['.ts']
            }),
            typescript({
                tsconfig: resolve(__dirname, 'tsconfig.json')
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
        input: inputFile,
        output: [{ file: `${outputDirectory}/index.d.ts`, format: 'es' }],
        plugins: [dts()]
    }
]
