import { TransformOptions } from '@babel/core'

export const babelConfig: TransformOptions = {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false,
                targets: {
                    browsers: '> 0.5%, not dead, not IE 11',
                    node: 10
                }
            }
        ]
    ],
    plugins: [
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread'
    ]
}
