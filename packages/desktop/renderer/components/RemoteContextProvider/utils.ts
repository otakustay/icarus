import ActionConflictError from '@/errors/ActionConflict';

type AnyAsync = (...args: any[]) => Promise<any>;

type Methods = Record<string, AnyAsync>;

interface GetSet {
    get: () => boolean;
    set: (value: boolean) => void;
}

export const wrapToNotifyPending = <T extends Methods>(parentName: string, methods: T, state: GetSet): T => {
    const wrapped = Object.entries(methods).reduce(
        (wrapped, [key, fn]) => {
            wrapped[key] = async (...args: any[]) => {
                if (state.get()) {
                    throw new ActionConflictError(`ipc ${parentName}.${key}`);
                }

                state.set(true);
                try {
                    const result = await fn(...args);
                    return result;
                }
                finally {
                    state.set(false);
                }
            };
            return wrapped;
        },
        {} as Methods
    );
    return wrapped as T;
};
