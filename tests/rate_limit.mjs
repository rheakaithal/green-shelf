const url = 'http://localhost:3000/';
console.log(`Starting rate limit test: 1000 requests to ${url} in batches of 100...`);

const start = Date.now();
let successes = 0;
let failures = 0;

for (let batch = 0; batch < 10; batch++) {
  const requests = [];
  for (let i = 0; i < 100; i++) {
    requests.push(fetch(url).then(res => res.ok ? 1 : 0).catch(() => 0));
  }
  const results = await Promise.all(requests);
  const batchSuccess = results.reduce((a, b) => a + b, 0);
  successes += batchSuccess;
  failures += (100 - batchSuccess);
}

const end = Date.now();
const elapsed = (end - start) / 1000;

console.log(`\n--- Test Complete ---`);
console.log(`Total Requests: 1000`);
console.log(`Successes: ${successes}`);
console.log(`Failures/Errors: ${failures}`);
console.log(`Time Elapsed: ${elapsed.toFixed(2)} seconds`);
console.log(`Requests/Sec: ${(1000 / elapsed).toFixed(2)}`);
