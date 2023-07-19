const express = require('express');
const dotenv = require('dotenv');
const globalErrorHandler = require('./util/globalErrorHandler');
const databaseConfig = require('./config/databaseConfig');
const expresConfig = require('./config/expresConfig');
const routesConfig = require('./config/routesConfig');

// Load environment variables from .env file
dotenv.config();

(async function start() {

    const app = express();

    const connectionString = process.env.CONNECTION_STRING;
    await databaseConfig(connectionString);
    expresConfig(app);
    routesConfig(app);
    // Global error handler must be the last
    app.use(globalErrorHandler);

    const port = process.env.PORT;
    app.listen(port, () => console.log(`Server is listening on port ${port}`));

})();