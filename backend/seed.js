import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { runSeed } from './utils/seedRunner.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  const result = await runSeed({ force: true });
  console.log(result.message);
  console.log('Counts:', result.counts);
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
