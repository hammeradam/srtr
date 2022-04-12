declare namespace NodeJS {
    export interface ProcessEnv {
        TOKEN_SECRET: string;
        DB_PASSWORD: string;
        DB_USER: string;
        DB_NAME: string;
        SESSION_SECRET: string;
        GITHUB_CLIENT_ID: string;
        GITHUB_CLIENT_SECRET: string;
    }
}
