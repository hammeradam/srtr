declare namespace NodeJS {
    export interface ProcessEnv {
        DB_PASSWORD: string;
        DB_USER: string;
        DB_NAME: string;

        TOKEN_SECRET: string;
        SESSION_SECRET: string;

        GITHUB_CLIENT_ID: string;
        GITHUB_CLIENT_SECRET: string;

        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;

        EMAIL_SERVER_USER: string;
        EMAIL_SERVER_PASSWORD: string;
        EMAIL_SERVER_HOST: string;
        EMAIL_SERVER_PORT: number;
        EMAIL_FROM: string;
    }
}
