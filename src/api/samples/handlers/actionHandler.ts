import { ActionHandler, Action, DefaultActionHandler } from "vulcain-corejs";
import { Customer } from "../models/models";

// -----------------------------------------------------------
// Default crud action handlers
// -----------------------------------------------------------
@ActionHandler({ async: false, scope: "?", schema: Customer })
export class CustomerActionHandler extends DefaultActionHandler {

    @Action({ description: "Custom action", outputSchema: "string" }) // action = method name (minus Async)
    async myActionAsync() {

        // You can create a command and initialize its provider if a schema is provided
        const cmd = await this.requestContext.getCommandAsync("MyCommand", this.metadata.schema);
        return cmd.executeAsync(1);
    }
}

