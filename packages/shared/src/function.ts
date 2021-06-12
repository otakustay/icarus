interface PendingContainer {
    currentPending: Promise<void> | null;
    hasWaitingTask: boolean;
}

export const runLatest = (task: () => Promise<void>): typeof task => {
    const pending: PendingContainer = {
        currentPending: null,
        hasWaitingTask: false,
    };

    const flushPending = async (): Promise<void> => {
        if (pending.hasWaitingTask) {
            pending.currentPending = task().then(flushPending);
            pending.hasWaitingTask = false;
            return pending.currentPending;
        }
        else {
            pending.currentPending = null;
        }
    };

    return () => {
        if (pending.currentPending) {
            pending.hasWaitingTask = true;
            return pending.currentPending;
        }
        else {
            const current = task().then(flushPending);
            pending.currentPending = current;
            return current;
        }
    };
};
