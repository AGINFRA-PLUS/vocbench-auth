import { Component, Input, Output, EventEmitter, ViewChildren, ViewChild, QueryList, ElementRef, SimpleChanges } from "@angular/core";
import { ARTURIResource, ARTResource, ARTLiteral, ResAttribute, ResourceUtils, SortAttribute } from "../../../../models/ARTResources";
import { VBEventHandler } from "../../../../utils/VBEventHandler";
import { VBContext } from "../../../../utils/VBContext";
import { BasicModalServices } from "../../../../widget/modal/basicModal/basicModalServices";
import { SkosServices } from "../../../../services/skosServices";
import { AbstractTreeNode } from "../../../abstractTreeNode";

@Component({
    selector: "concept-tree-node",
    templateUrl: "./conceptTreeNodeComponent.html",
})
export class ConceptTreeNodeComponent extends AbstractTreeNode {

    @Input() schemes: ARTURIResource[];

    //ConceptTreeNodeComponent children of this Component (useful to open tree for the search)
    @ViewChildren(ConceptTreeNodeComponent) viewChildrenNode: QueryList<ConceptTreeNodeComponent>;

    constructor(private skosService: SkosServices, eventHandler: VBEventHandler, basicModals: BasicModalServices) {
        super(eventHandler, basicModals);
        this.eventSubscriptions.push(eventHandler.conceptDeletedEvent.subscribe(
            (deletedConcept: ARTURIResource) => this.onTreeNodeDeleted(deletedConcept)));
        this.eventSubscriptions.push(eventHandler.narrowerCreatedEvent.subscribe(
            (data: any) => this.onChildCreated(data.broader, data.narrower)));
        this.eventSubscriptions.push(eventHandler.broaderAddedEvent.subscribe(
            (data: any) => this.onParentAdded(data.broader, data.narrower)));
        this.eventSubscriptions.push(eventHandler.conceptRemovedFromSchemeEvent.subscribe(
            (data: any) => this.onConceptRemovedFromScheme(data.concept, data.scheme)));
        this.eventSubscriptions.push(eventHandler.broaderRemovedEvent.subscribe(
            (data: any) => this.onParentRemoved(data.broader, data.concept)));
        this.eventSubscriptions.push(eventHandler.broaderUpdatedEvent.subscribe(
            (data: any) => {
                this.onParentRemoved(data.oldParent, data.child);
                this.onParentAdded(data.newParent, data.child);
            }
        ));
    }

    expandNodeImpl() {
        return this.skosService.getNarrowerConcepts(this.node, this.schemes).map(
            narrower => {
                //sort by show if rendering is active, uri otherwise
                ResourceUtils.sortResources(narrower, this.rendering ? SortAttribute.show : SortAttribute.value);
                //append the retrieved node as child of the expanded node
                this.node.setAdditionalProperty(ResAttribute.CHILDREN, narrower);
                this.open = true;
            }
        );
    }

    //EVENT LISTENERS

    private onConceptRemovedFromScheme(concept: ARTURIResource, scheme: ARTURIResource) {
        //TODO See comment in onConceptRemovedFromScheme in conceptTreeComponent
        // if (this.scheme != undefined && this.scheme.getURI() == scheme.getURI()) {
        //     this.onConceptDeleted(concept);
        // }
    }

}