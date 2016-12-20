import { Application, IContainer, System } from "vulcain-corejs";

// The domain is mandatory
const domain = "<%=project.namespace %>";

// Default configurations
let port = 8080;                      // server port
const enableHystrixStream = false;    // enable hystrix monitoring

/**
 * Startup application class
 *
 * @export
 * @class Startup
 * @extends {Application}
 */
export class Startup extends Application {

    constructor() {
        super(domain);
    }

    /**
     * Provide a way to configure http server adapter before it starts
     *
     * @param {any} adapter
     */
    initializeServerAdapter(adapter) {
        // adapter.setStaticRoot("./www");
    }

    /**
     * Provide a way to add http server features (like socket io)
     *
     * @param {any} server
     */
    onServerStarted(server, adapter) {
    }

    /**
     * Register default services
     */
    initializeDefaultServices(container: IContainer) {
        if (System.isDevelopment) { // Developper desktop
            container.useMemoryProvider("data");
        }
        else {
           // container.useRabbitBusAdapter();
            container.useMongoProvider();
        }
    }

    /**
     * Register custom services
     *
     * @param {IContainer} container
     *
     * @memberOf Startup
     */
    initializeServices(container: IContainer) {
        // Register custom services from a specific folder
        // this.injectFrom("...");
    }

    /**
     * Entry point
     *
     *
     * @memberOf Startup
     */
    async runAsync() {

        // Set user test - Valid only in development
        this.setTestUser();

        this.enableHystrixStream = enableHystrixStream;

        await super.start(port);
    }
}

