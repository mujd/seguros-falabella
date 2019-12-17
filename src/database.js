const mongoose = require('mongoose')

mongoose.Promise = Promise

mongoose.connection.on('connected', () => {
    console.log('Mongo Connection Established')
})

mongoose.connection.on('reconnected', () => {
    console.log('Mongo Connection Reestablished')
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongo Connection Disconnected')
})

mongoose.connection.on('close', () => {
    console.log('Mongo Connection Closed')
})

mongoose.connection.on('error', (error) => {
    console.log('Mongo ERROR: ' + error)
})

// let mongoUrl = 'localhost';
let mongoUrl = 'mongodb://localhost:27017/segurosFalabellaDB';
if (process.env.DATABASE_HOST) {
    // mongoUrl = 'mongo';
    mongoUrl = 'mongodb://max-rojas:segurosfalabella@cluster0-shard-00-00-f42f4.mongodb.net:27017,cluster0-shard-00-01-f42f4.mongodb.net:27017,cluster0-shard-00-02-f42f4.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
}
const mongoDB = async() => {
    await mongoose.connect(mongoUrl, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).catch(err => console.log('Mongo error: ' + err));
}

mongoDB().catch(error => console.log('Mongo error: ' + error))

module.exports = { mongoDB };