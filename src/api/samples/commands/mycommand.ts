import { System, IDynamicProperty, Command, HttpDependency, AbstractHttpCommand, Inject, IContainer, DefaultServiceNames, ConfigurationProperty } from "vulcain-corejs";

@Command({ executionTimeoutInMilliseconds: 1500 })
@HttpDependency("http://jsonplaceholder.typicode.com/posts/1")
@ConfigurationProperty("test", "string")
class MyCommand extends AbstractHttpCommand {
    private myvalue: IDynamicProperty<string>;

    constructor( @Inject(DefaultServiceNames.Container) container: IContainer) {
        super(container);
        // Create a custom service dynamic property
        this.myvalue = System.createServiceConfigurationProperty<string>("test", "<nothing>");
    }

    // Execute command
    async runAsync(a: number) {
        let response = await this.getAsync("http://jsonplaceholder.typicode.com/posts/" + a);
        return response.body.body;
    }

    // Fallback method if error on runAsync
    // ** This is optional : Only if you want to provide a compensation for this command **
    async fallbackAsync(a: number) {
        let x = this.myvalue.value;
        return "Default value is " + x;
    }
}
