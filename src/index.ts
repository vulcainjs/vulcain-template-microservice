import { ApplicationBuilder, System } from "vulcain-corejs";

// The domain is mandatory
const domain = "<%=project.namespace %>";

// Default configuration
let port = 8080;

let builder = new ApplicationBuilder(domain);
// Uncomment the following lines to set specific data provider
// Default is memory without persistence
/*
if (System.isDevelopment) { // Developper desktop
    builder.useMemoryProvider();
}
else {
    builder.useRabbitmqBus();
    builder.useMongoProvider('mongo');
}
*/
builder.run(port);
