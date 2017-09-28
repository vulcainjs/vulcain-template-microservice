import { ActionHandler, Action, DefaultActionHandler, Inject } from "vulcain-corejs";
import { CustomerQueryHandler } from './queryHandler';
import { MyCommand } from '../commands/mycommand';

// -----------------------------------------------------------
// Default crud action handlers
// -----------------------------------------------------------
@ActionHandler({ async: false, scope: "?", schema: "Customer" })
export class CustomerActionHandler extends DefaultActionHandler {

    @Inject()
    customers: CustomerQueryHandler;

    createAsync(entity) {
        return super.createAsync(entity);
    }
    @Action({ description: "Custom action", outputSchema: "string" }) // action = method name (minus Async)
    async myActionAsync() {
        // The following line shows how to make an in-process handler method call
        // tslint:disable-next-line:no-unused-variable
        let customerList = await this.customers.getAllAsync();

        // Using a command
        const cmd = this.createCommand<MyCommand>("MyCommand");
        return cmd.runAsync(1);
    }
}

