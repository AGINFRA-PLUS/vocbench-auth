import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Subscriber } from "rxjs";
import { ARTURIResource, ResAttribute } from "../models/ARTResources";
import { TreeListContext } from "../utils/UIUtils";
import { VBEventHandler } from "../utils/VBEventHandler";

@Component({
    selector: "struct",
    template: "",
})
export abstract class AbstractStruct {

    @Input() rendering: boolean = true; //if true the nodes in the list should be rendered with the show, with the qname otherwise
    @Input() showDeprecated: boolean = true;
    @Input() context: TreeListContext;
    @Output() nodeSelected = new EventEmitter<ARTURIResource>();

    /**
     * ATTRIBUTES
     */

    eventSubscriptions: Subscriber<any>[] = [];
    selectedNode: ARTURIResource;

    /**
     * CONSTRUCTOR
     */
    protected eventHandler: VBEventHandler;
    constructor(eventHandler: VBEventHandler) {
        this.eventHandler = eventHandler;
        this.eventSubscriptions.push(eventHandler.refreshDataBroadcastEvent.subscribe(() => this.init()));
    }

    /**
     * METHODS
     */

    ngOnDestroy() {
        this.eventHandler.unsubscribeAll(this.eventSubscriptions);
    }

    abstract init(): void;

    private onNodeSelected(node: ARTURIResource) {
        if (this.selectedNode != undefined) {
            this.selectedNode.deleteAdditionalProperty(ResAttribute.SELECTED);
        }
        this.selectedNode = node;
        this.selectedNode.setAdditionalProperty(ResAttribute.SELECTED, true);
        this.nodeSelected.emit(node);
    }

}