import 'colors';

import App from './App';

const app = new App();
const server = app.listen();

// Handle unhandled promise rejections
(process as NodeJS.EventEmitter).on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});

export default server;
