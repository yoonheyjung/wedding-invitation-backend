import { createClient, commandOptions } from 'redis';
// import { promisify } from 'util';

const client = createClient(6379, process.env.REDIS_HOST, {
  no_ready_check: true,
  legacyMode: true,
});
async function run() {
  await client.connect();
  // client.blPop(commandOptions({ isolated: true }), 'Messages', 0);
}

run();

export { client };
