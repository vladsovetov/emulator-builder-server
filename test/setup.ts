import mongoose from 'mongoose';

// Setup connection to a test mongoose DB
before(async () => {
  await mongoose.connect('mongodb://localhost:27017/emulator-builder-tests', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await mongoose.connection
    .once('open', () => console.log('Connected'))
    .on('error', (error) => {
      console.warn('Warning', error);
    });
});

// Cleanup mongoose DB before each test execution
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});
