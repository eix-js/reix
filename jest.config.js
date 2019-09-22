// @ts-check

/** @type {jest.InitialOptions} */
const config = {
    testMatch: ['**/*.test.(js|ts)?(x)'],
    moduleFileExtensions: ['js', 'ts'],
    transform: {
        '\\.(js|ts)x?$': 'ts-jest'
    },
    testEnvironment: 'node'
}

module.exports = config
