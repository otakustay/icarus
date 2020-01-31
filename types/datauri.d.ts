declare module 'datauri' {
    export default class Datauri {
        fileName: string;
        mimetype: string;
        content: string;

        createMetadata(fileName: string): Datauri;
        format(fileName: string, fileContent: string | Buffer): Datauri;
    }
}
