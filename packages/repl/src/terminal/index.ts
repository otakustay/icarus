import inquirer from 'inquirer';
import BackendRegistry from '../BackendRegistry';
import BackendService from '../BackendService';
import {parseArgs} from './parse';
import {printExecuteResult} from './print';
import open from './open';

const parseAndRoute = async (registry: BackendRegistry, input: string) => {
    const [command, ...args] = parseArgs(input);

    switch (command) {
        case 'open':
        case 'restore':
            return open(registry, args);
        case 'print':
            return registry.execute('GET', '/state');
        default:
            return registry.execute('GET', '/404');
    }
};

export const start = async (service: BackendService) => {
    await service.setup();

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const questions = [
            {
                type: 'input',
                name: 'command',
                message: '>',
            },
        ];
        const answers = await inquirer.prompt(questions);
        const command = answers.command.trim();

        if (command === 'exit') {
            await service.dispose();
            process.exit(0);
        }

        const result = await parseAndRoute(service.registry, answers.command);

        printExecuteResult(result);
    }
};
