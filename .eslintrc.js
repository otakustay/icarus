module.exports = {
    extends: '@ecomfe/eslint-config/strict',
    rules: {
        'import/no-unresolved': ['error', {ignore: ['electron']}],
        'import/extensions': 'off'
    }
};
