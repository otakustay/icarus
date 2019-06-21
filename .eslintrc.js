module.exports = {
    extends: require.resolve('reskript/config/eslint'),
    rules: {
        'import/no-unresolved': ['error', {ignore: ['electron']}],
        'import/order': 'off',
    }
};
