import { createClient } from 'redis';

const client = createClient({
  socket: {
    port: 6379,
    host: '3.35.127.36',
  },
  legacyMode: true, // 반드시 설정 !!
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function run() {
  await client.connect();
  console.log('connect success !');
}

run();

export { client };
