module.exports = {
   "type": "postgres",
   "host": process.env.DB_HOST || "localhost",
   "port": process.env.DB_PORT || 5432,
   "username": process.env.DB_USER,
   "password": process.env.DB_PASS,
   "database": process.env.DB_DATABASE || "sncd",
   "synchronize": true,
   "entities": [
      "src/model/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/model/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
};
