/* eslint-disable no-console */
import chalk from 'chalk';
import treeify from 'treeify';
import {DefaultServiceContext} from '@icarus/service';

const printSingleValueWithIndent = (indent: number) => {
    const prefix = ' '.repeat(indent);

    return (value: string) => {
        const message = value.length > 120 ? `${value.slice(0, 100)}...<long string>` : value;
        console.log(prefix + message);
    };
};

export const printExecuteResult = (serviceContext: DefaultServiceContext) => {
    if (serviceContext.response.state === 'pending') {
        console.log(`State: ${chalk.bgGray.whiteBright(' PENDING ')}`);
    }
    else if (serviceContext.response.state === 'hasValue') {
        console.log(`State: ${chalk.bgGreen.whiteBright(' SUCCESS ')}`);
        console.log('Data:');
        treeify.asLines(serviceContext.response.data, true, printSingleValueWithIndent(2));
    }
    else {
        console.log(`State: ${chalk.bgRed.whiteBright(' ERROR ')}`);
        console.log(`  Type: ${serviceContext.response.type}`);
        console.log(`  Code: ${serviceContext.response.code}`);
        console.log(`  Message: ${serviceContext.response.message}`);
        console.log(`  Cause: ${serviceContext.response.cause}`);
    }
};
