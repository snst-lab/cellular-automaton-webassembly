'use strict';
import * as root from 'app-root-path';
import * as express from 'express';
express.static.mime.define({'application/wasm': ['wasm']});


// Import * as redis from 'redis';
// Import * as url from 'url';

/**
 * Configure Redis
 */
// Let db = redis.createClient();
// If (process.env.REDISTOGO_URL) {
//     Const rtg = url.parse(process.env.REDISTOGO_URL);
//     If (rtg.auth) {
//         Db = redis.createClient(rtg.port, rtg.hostname);
//         Db.auth(rtg.auth.split(':')[1]);
//         Db.on('connect', () => console.log('Redis client connected.'));
//         Db.on('error', (err: redis.Error) => console.log('Error: ' + err as string));
//     }
// }

/**
 * Configure Server
 */
const app = express();
 app.use(express.static('.'));
app.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(root as string + '/index.html');
    return [req, res];
});
app.post('/api',  (req: express.Request, res: express.Response) => {
    res.send('POST request received.');
    return [req, res];
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));

export default app;
