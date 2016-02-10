import {Component, Input, Output, EventEmitter} from "angular2/core";
import {ARTURIResource, ARTNode} from "../../utils/ARTResources";
import {VBEventHandler} from "../../utils/VBEventHandler";
import {RdfResourceComponent} from "../../widget/rdfResource/rdfResourceComponent";
import {SkosServices} from "../../services/skosServices";

@Component({
	selector: "broaders-renderer",
	templateUrl: "app/src/resourceView/renderer/objectListRenderer.html",
	directives: [RdfResourceComponent],
    providers: [SkosServices],
})
export class BroadersPartitionRenderer {
    
    @Input('object-list') objectList:ARTURIResource[];
    @Input() resource:ARTURIResource;
    @Output() update = new EventEmitter();
    
    private label = "Broaders";
    private addBtnImgSrc = "app/assets/images/concept_create.png";
    private addBtnImgTitle = "Add broader";
    private removeBtnImgSrc = "app/assets/images/concept_delete.png";
    private removeBtnImgTitle = "Remove broader";
    
    constructor(private skosService:SkosServices, private eventHandler:VBEventHandler) {}
    
    //add a broader
    public add() {
        alert("add broader to " + this.resource.getShow());
        this.update.emit(null);
    }
    
    public remove(broader: ARTURIResource) {
        this.skosService.removeBroaderConcept(this.resource.getURI(), broader.getURI())
            .subscribe(
                stResp => {
                    this.eventHandler.broaderRemovedEvent.emit({resource: this.resource, parent: broader});
                    this.update.emit(null);
                },
                err => {
                    alert("Error: " + err);
                    console.error(err.stack);
                }
            );
    }
    
}