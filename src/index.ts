import 'colors';

import { server } from './server';

server.listen();

// Handle unhandled promise rejections
(process as NodeJS.EventEmitter).on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});

export default server;
