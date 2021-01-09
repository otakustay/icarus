module.exports = {
    appId: 'org.otakustay.icarus',
    productName: 'Icarus Comic Reader',
    directories: {
        output: 'dist/packages',
    },
    mac: {
        target: {
            target: 'dir',
            arch: ['arm64', 'x64'],
        },
    },
};
