import { Component, Input, Output, EventEmitter, ViewChildren, ViewChild, QueryList } from "@angular/core";
import { ARTURIResource, ResAttribute } from "../../../../models/ARTResources";
import { VBEventHandler } from "../../../../utils/VBEventHandler";
import { VBContext } from "../../../../utils/VBContext";
import { SkosServices } from "../../../../services/skosServices";

@Component({
    selector: "scheme-list-node",
    templateUrl: "./schemeListNodeComponent.html",
})
export class SchemeListNodeComponent {
    @Input() node: ARTURIResource;
    @Input() rendering: boolean = true; //if true the nodes in the list should be rendered with the show, with the qname otherwise
    @Output() nodeSelected = new EventEmitter<ARTURIResource>();

    private eventSubscriptions: any[] = [];

    constructor(private skosService: SkosServices, private eventHandler: VBEventHandler) {
        this.eventSubscriptions.push(eventHandler.resourceRenamedEvent.subscribe(
            (data: any) => this.onResourceRenamed(data.oldResource, data.newResource)));
        this.eventSubscriptions.push(eventHandler.skosPrefLabelSetEvent.subscribe(
            (data: any) => this.onPrefLabelSet(data.resource, data.label, data.lang)));
        this.eventSubscriptions.push(eventHandler.skosxlPrefLabelSetEvent.subscribe(
            (data: any) => this.onPrefLabelSet(data.resource, data.label, data.lang)));
        this.eventSubscriptions.push(eventHandler.skosPrefLabelRemovedEvent.subscribe(
            (data: any) => this.onPrefLabelRemoved(data.resource, data.label, data.lang)));
        this.eventSubscriptions.push(eventHandler.skosxlPrefLabelRemovedEvent.subscribe(
            (data: any) => this.onPrefLabelRemoved(data.resource, data.label, data.lang)));
    }

    ngOnDestroy() {
        this.eventHandler.unsubscribeAll(this.eventSubscriptions);
    }

    /**
     * Called when a node in the tree is clicked. This function emit an event 
     */
    private selectNode() {
        this.nodeSelected.emit(this.node);
    }

    //EVENT LISTENERS

    private onResourceRenamed(oldResource: ARTURIResource, newResource: ARTURIResource) {
        if (oldResource.getURI() == this.node.getURI()) {
            this.node['uri'] = newResource.getURI();
        }
    }

    private onPrefLabelSet(resource: ARTURIResource, label: string, lang: string) {
        /**
         * the following code is commented since the show of a resource is computed by the server according to the languages preference
         * and there is no way update the show after a pref label is set
         */
        // if (this.rendering && VBContext.getContentLanguage() == lang && resource.getURI() == this.node.getURI()) {
        //     this.node['show'] = label;
        // }
    }

    private onPrefLabelRemoved(resource: ARTURIResource, label: string, lang: string) {
        /**
         * the following code is commented since the getShow() service, that is used to update the show of the concept,
         * gets as parameter just one language instead of an array of lang representing all the language that are used currently
         */
        // if (this.rendering && VBContext.getContentLanguage() == lang && resource.getURI() == this.node.getURI()) {
        //     this.skosService.getShow(resource, VBContext.getContentLanguage()).subscribe(
        //         show => {
        //             this.node['show'] = show;
        //         }
        //     )
        // }
    }

}