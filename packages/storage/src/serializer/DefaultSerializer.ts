import Serializer from './Serializer';

export default class DefaultSerializer implements Serializer {
    serialize(data: any): string {
        return JSON.stringify(data);
    }

    deserialize(content: string): any {
        return JSON.parse(content);
    }
}
