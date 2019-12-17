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

let mongoUrl = 'localhost';
if (process.env.DATABASE_HOST) {
    mongoUrl = 'mongo';
}
const mongoDB = async() => {
    await mongoose.connect(`mongodb://${mongoUrl}:27017/segurosFalabellaDB`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).catch(err => console.log('Mongo error: ' + err));
}

mongoDB().catch(error => console.log('Mongo error: ' + error))

module.exports = { mongoDB };