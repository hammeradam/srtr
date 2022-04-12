declare namespace NodeJS {
    export interface ProcessEnv {
        DB_PASSWORD: string;
        DB_USER: string;
        DB_NAME: string;

        TOKEN_SECRET: string;
        SESSION_SECRET: string;

        GITHUB_CLIENT_ID: string;
        GITHUB_CLIENT_SECRET: string;

        EMAIL_SERVER_USER: 'elta.wintheiser53@ethereal.email';
        EMAIL_SERVER_PASSWORD: PfZTddJGpSqkDPR5XK;
        EMAIL_SERVER_HOST: 'smtp.ethereal.email';
        EMAIL_SERVER_PORT: 587;
        EMAIL_FROM: 'elta.wintheiser53@ethereal.email';
    }
}
