import {configure} from '@reskript/settings';

export default configure(
    'webpack',
    {
        build: {
            reportLintErrors: false,
            uses: ['emotion'],
        },
    }
);
