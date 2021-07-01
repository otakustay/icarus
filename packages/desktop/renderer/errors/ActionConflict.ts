export default class ActionConflictError extends Error {
    action: string;

    constructor(action: string) {
        super(`${action} conflict`);
        this.action = action;
    }
}
