import { EventHandler, Consume, AbstractEventHandler, EventData, System } from "vulcain-corejs";
import * as RX from "rx";
import { Customer } from "../models/models";


@EventHandler({ schema: "Customer", subscribeToDomain: System.domainName })
export class CustomerEventHandler extends AbstractEventHandler {

    // Event handler on domain customer, schema customer and action create
    // with a custom filter to take only action completed successfully
    @Consume({ description: "Simple event handler", subscribeToAction: "create", filter: (events: RX.Observable<EventData>) => events.filter(e => e.status === "Success") })
    async onCreateCustomerAsync(customer: Customer) {
        console.log(`${customer.lastName} ${customer.firstName} created`);
        return true;
    }
}
