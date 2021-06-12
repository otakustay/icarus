export default interface Serializer {
    serialize(data: any): string;
    deserialize(content: string): any;
}
