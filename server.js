import * as http from 'http';
import * as url from 'url';
import { readFile, writeFile } from 'fs/promises';

async function basicServer(request, response) {
  // TODO: Implement the server

  // TODO: Replace this with your own logic
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify({ message: 'hello, world' }));
  response.end();
}

// Start the server on port 3000.
http.createServer(basicServer).listen(3000, () => {
  console.log('Server started on port 3000');
});
