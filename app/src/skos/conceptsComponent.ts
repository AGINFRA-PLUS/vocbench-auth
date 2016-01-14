import {Component, OnInit} from "angular2/core";
import {RdfResourceComponent} from "../widget/rdfResource/rdfResourceComponent";
import {ConceptTreePanelComponent} from "./conceptTreePanel/ConceptTreePanelComponent";
import {ARTNode, ARTURIResource} from "../utils/ARTResources";
import {VocbenchCtx} from "../utils/VocbenchCtx";

@Component({
	selector: "concepts-component",
	templateUrl: "app/src/skos/conceptsComponent.html",
	directives: [ConceptTreePanelComponent]
})
export class ConceptsComponent implements OnInit {
    
    public scheme:ARTURIResource;
    
	constructor(public vbCtx:VocbenchCtx) {}
    
    ngOnInit() {
        this.scheme = this.vbCtx.getScheme();
    }
    
}