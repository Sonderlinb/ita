import express from 'express';
import pg from 'pg';

console.log('Connecting to the database...');
const db = new pg.Pool({
    host:     'localhost',
    port:     5432,
    database: 'helloweb',
    user:     'postgres',
    password: 'sonderlin2355',
});
const dbResult = await db.query('select now() as now');
console.log('Database connection established on', dbResult.rows[0].now);

const port = 3000;
const server = express();


server.use(express.static('frontend'));
server.use(onEachRequest)
server.get('/api/opgave1', onGetOpgave1);
server.get('/api/opgave2a', onGetOpgave2a);
server.get('/api/opgave2b', onGetOpgave2b);
server.get('/api/opgave3', onGetOpgave3);
server.get('/api/allAlbums', onGetAllAlbums);
server.get('/api/opgave5a', onGetopgave5a);
server.get('/api/opgave5b', onGetopgave5b);
server.get('/api/opgave5c', onGetopgave5c);
server.listen(port, onServerReady);

async function onGetAllAlbums(request, response) {
    const dbResult = await db.query('select * from albums');
    response.send(dbResult.rows);
}

function onGetOpgave1(request, response) {
    response.send ([Date.now()]);
}

function onGetOpgave2a(request, response) {
    response.send({'2a': 2348});
}

function onGetOpgave2b(request, response) {
    response.send('wuhuuuuu');
}

function onGetOpgave3(request, response) {
    const query = request.query;
    const a = Number (query.a);
    const b = Number (query.b);
    response.send({'a':a, 'b':b, 'sum':a + b});
}

function onGetopgave5a(request, response) {
    response.send(db.exec('select title, year from albums'));
}

function onGetopgave5b(request, response) {
    response.send(db.exec('select year as released, title, artist from albums'));
}

function onGetopgave5c(request, response) {
    response.send(db.exec('select distinct * from albums where year <=1980'));
}

function onEachRequest(request, response, next) {
    console.log(new Date(), request.method, request.url);
    next();
}

function onServerReady() {
    console.log('Webserver running on port', port);
}