export class ResponseException implements Error {

    readonly name: string = "ResponseException";

    readonly status: number;
    readonly message: string;
    readonly stack?: string;
    readonly cause?: unknown;

    constructor(status: number, message: string, error?: Error) {
        this.status = status;
        this.message = message;
        this.stack = error?.stack;
        this.cause = error?.cause;
    }

}