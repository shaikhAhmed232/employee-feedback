const { DB_CRED } = require('../../config');
const mongoose = require('mongoose');
const { username, password, host, port, database } = DB_CRED;

class DatabaseConnector {
    constructor() {
        this.connections = {};
        this.dbType = DB_CRED.type;
    }

    async connect() {
        return this.connectMongoDB();
    }

    async connectMongoDB() {
        if (this.connections.mongodb) return this.connections.mongodb;

        const { username, password, host, port, database } = DB_CRED;
        const connectionString = username && password
            ? `mongodb://${username}:${password}@${host}:${port}/${database}`
            : `mongodb://${host}:${port}/${database}`;
        try {
            const connection = await mongoose.connect(connectionString);
            console.log('MongoDB connected successfully');
            this.connections.mongodb = connection;
            return connection;
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }

    getConnection() {
        return this.connection;
    }

    async disconnect() {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
        this.connection = null;
    }
}

const dbConnector = new DatabaseConnector();
module.exports = dbConnector;