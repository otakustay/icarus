const path = require('node:path');

module.exports = async (env, args) => {
    const options = {
        cwd: path.resolve(__dirname, '..'),
        commandName: args.mode === 'production' ? 'build' : 'dev',
        mode: args.mode,
        srcDirectory: 'renderer',
        entriesDirectory: 'entries',
        entriesOnly: ['index'],
        strict: false,
        analyze: false,
        clean: false,
        profile: false,
        sourceMaps: true,
        watch: false,
    };
    const {readProjectSettings} = await import('@reskript/settings');
    const entryLocation = {
        cwd: options.cwd,
        srcDirectory: options.srcDirectory,
        entryDirectory: options.entriesDirectory,
        only: options.entriesOnly,
    };
    const {collectEntries, createWebpackConfig} = await import('@reskript/config-webpack');
    const settings = await readProjectSettings(options);
    const entries = await collectEntries(entryLocation);
    const buildEnv = {
        hostPackageName: '@icarus/desktop',
        projectSettings: settings,
        usage: args.mode === 'production' ? 'build' : 'dev',
        mode: options.mode,
        cwd: options.cwd,
        srcDirectory: options.srcDirectory,
        cache: 'transient',
    };
    const {createRuntimeBuildEnv} = await import('@reskript/build-utils');
    const runtimeBuildEnv = await createRuntimeBuildEnv(buildEnv);
    const buildContext = {
        ...runtimeBuildEnv,
        entries,
        features: {},
        buildTarget: 'stable',
        isDefaultTarget: true,
    };
    const config = await createWebpackConfig(buildContext);
    delete config.entry;
    delete config.output;
    config.target = 'electron-renderer';
    return config;
};
