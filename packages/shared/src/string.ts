export const stringifyError = (mayBeError: unknown): string => {
    return mayBeError instanceof Error ? mayBeError.message : `${mayBeError}`;
};
