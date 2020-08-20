exports.featureMatrix = {
    stable: {},
};

exports.build = {
    copies: [],
    extraLessPaths: [],
    extraLessVariables: {},
    styleResources: [],
    sourceCompilePackages: [],
    noCompileScripts: [],
    noModulesStyles: [],
    reportLintErrors: true,
    styleName: false,
    cssScope: false,
    largeAssetSize: 1024 * 1024 * 1024,
    browserSupport: {
        electron: '7.0.0',
    },
};

exports.devServer = {
    hot: 'none',
};

exports.addition = () => ({});
