module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    globals: {
        'ts-jest': {
            tsconfig: './tsconfig.json',
        },
    },
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    moduleDirectories: ['node_modules', 'src'],
};
