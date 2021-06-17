import Persistence from '../persistence/Persistence';
import Serializer from '../serializer/Serializer';

export default abstract class BaseStore<T> {
    private readonly persistence: Persistence;
    private readonly defaultValue: T;
    private readonly serializer: Serializer;

    constructor(defaultValue: T, persistence: Persistence, serializer: Serializer) {
        this.defaultValue = defaultValue;
        this.persistence = persistence;
        this.serializer = serializer;
    }

    async open(): Promise<void> {
        await this.persistence.open();
        const initialContent = await this.persistence.read();
        if (!initialContent) {
            await this.persistence.write(this.serializer.serialize(this.defaultValue));
        }
    }

    async close(): Promise<void> {
        await this.persistence.close();
    }

    protected async updateData(next: (current: T) => T): Promise<void> {
        const currentData = await this.readData();
        const nextData = next(currentData);
        await this.writeData(nextData);
    }

    protected async readData(): Promise<T> {
        const content = await this.persistence.read();

        if (!content) {
            throw new Error('Persisted data empty');
        }

        return this.serializer.deserialize(content);
    }

    private async writeData(data: T): Promise<void> {
        const content = this.serializer.serialize(data);
        await this.persistence.write(content);
    }
}
