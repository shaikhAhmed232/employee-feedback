require("dotenv").config();
const dbConnector = require("./src/connections/dbConnector");
const startApp = require("./src/server");
const seedRequiredCategories = require("./src/utils/seedCategories");
const seedAdminUser = require("./src/utils/seedAdminUser");

(async function () {
    try {
        await dbConnector.connect();
        await seedRequiredCategories();
        console.log("Categories initialized successfully");
        await seedAdminUser();
        console.log("Admin user initialization completed");
        startApp();
    } catch (error) {
        console.log(`Server failed to start due to: `, error);
        process.exit(1);
    }

    const gracefulShutdown = async (error) => {
        if (error) {
            console.log(`Shutting down gracefully due to: `, error)
        }
        else console.log("Shutting down gracefully...");
        try {
            await dbConnector.disconnect();
            console.log("Database disconnected");
            process.exit(0);
        } catch (error) {
            console.error("Error during shutdown:", error);
            process.exit(1);
        }
    }

    const errorTypes = ["unhandledRejection", "uncaughtException"];
    const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

    errorTypes.forEach((type) => {
        process.on(type, gracefulShutdown);
    });

    signalTraps.forEach((type) => {
        process.once(type, gracefulShutdown);
    });

})();