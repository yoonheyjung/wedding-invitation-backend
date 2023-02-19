import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

async function run() {
  await client.connect();
  console.log('connect success !');
}

run();

export { client };
