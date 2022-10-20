import { createClient } from "redis";

const client = createClient({
  legacyMode: true,
});

client.connect();

export default client;
