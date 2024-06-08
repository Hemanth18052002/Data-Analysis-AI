const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbs = client.db('project');
const collection = dbs.collection('original');
const messcollection = dbs.collection('messages');

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return collection;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

async function connectToMongomess() {
    try {
        await client.connect();
        console.log('Connected to messMongoDB');
        return messcollection;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = { connectToMongo, connectToMongomess };
