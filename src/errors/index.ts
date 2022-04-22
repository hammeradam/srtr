export class ApplicationError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super();
        this.name = this.constructor.name;

        this.message = message;
        this.statusCode = statusCode;
    }
}
