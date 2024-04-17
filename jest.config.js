// jest.config.js
export default {
    transform: {
        '^.+\\.m?js$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
    testEnvironment: 'node',
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
