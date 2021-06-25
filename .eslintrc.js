module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    extends: ['prettier', 'plugin:prettier/recommended'],
    plugins: ['prettier'],
    rules: {
        'no-undef': 'off',
        'no-use-before-define': 'off',
    },
}
