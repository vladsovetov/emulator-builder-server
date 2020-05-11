declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string | undefined;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      API_PREFIX: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
