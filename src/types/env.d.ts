declare namespace NodeJS {
  interface ProcessEnv {
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PROJECT_ID: string;
    MONGODB_URI: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
} 