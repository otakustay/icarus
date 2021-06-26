module.exports = {
    preset: 'ts-jest/presets/default',
    testMatch: ['**/__tests__/**/*.test.ts'],
    testEnvironment: 'node',
    transformIgnorePatterns: [
        'node_modules',
    ],
    collectCoverageFrom: [
        'src/**',
        '!src/**/__tests__/**',
        '!src/index.ts',
    ],
};
