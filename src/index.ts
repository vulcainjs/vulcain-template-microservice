import { DynamicConfiguration } from "vulcain-corejs";

// Configuration initialization must run first.
DynamicConfiguration
    .init(60) // Polling interval
    .addVulcainSource()
    .startPollingAsync()
    .then(() => { // Waiting for properties initialized
        // Initialization OK
        let startup = require("./startup"); // lazy loading
        new startup.Startup().runAsync();
    })
    .catch((e: Error) => {
        console.log("Bootstrap error " + e.stack + ". Process stopped");
        process.exit(1);
    });
