const app = require('./app');
const { mongoDB } = require('./database');

async function main() {
    await app.listen(3000);
    console.log('Server running');
}

mongoDB();
main();