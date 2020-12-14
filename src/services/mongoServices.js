let db;
const MongoClient = require('mongodb').MongoClient;

module.exports = {
  getDb: () => {
    return db;
  },
  connectDb: (callback) => {
    MongoClient.connect(process.env.MONGODB_URI, (err, connectedDb) => {
      if (err) {
        return callback(err);
      }
      db = connectedDb.db(process.env.DB_NAME);
      return callback(null);
    });
  },
};
