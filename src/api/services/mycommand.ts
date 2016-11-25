import { System, IDynamicProperty, Command, HttpDependency, AbstractHttpCommand, Inject, IContainer, DefaultServiceNames, ConfigurationProperty } from "vulcain-corejs";

@Command({ executionTimeoutInMilliseconds: 1500 })
@HttpDependency("http://jsonplaceholder.typicode.com/posts/1")
@ConfigurationProperty("test", "number")
class MyCommand extends AbstractHttpCommand {
    private myvalue: IDynamicProperty<number>;

    constructor( @Inject(DefaultServiceNames.Container) container: IContainer) {
        super(container);
        // Create a custom service dynamic property
        this.myvalue = System.createServiceConfigurationProperty<number>("test", "number", 0);
    }

    // Execute command
    async runAsync(a: number, b: number) {
        let response = await this.getAsync("http://jsonplaceholder.typicode.com/posts/1");
        return response.body.body;
    }

    // Fallback method if error on runAsync
    // ** This is optional : Only if you want to provide a compensation for this command **
    async fallbackAsync(a: number, b: number) {
        let x = this.myvalue.value;
        return Promise.resolve("Default value is " + x);
    }
}
