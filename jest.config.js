// @ts-check

/** @type {jest.InitialOptions} */
const config = {
    // to allow using "lerna exec --since" we need to use process.cwd()
    // or elase jest will run all tests from all packages,
    // not just from the changed ones
    testMatch: [`${process.cwd()}/src/**/*.test.(js|ts)?(x)`],
    moduleFileExtensions: ['js', 'ts'],
    transform: {
        '\\.(js|ts)x?$': 'ts-jest'
    },
    testEnvironment: 'node'
}

module.exports = config
