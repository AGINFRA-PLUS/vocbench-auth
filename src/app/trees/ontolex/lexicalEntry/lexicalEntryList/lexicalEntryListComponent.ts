import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList, SimpleChanges } from "@angular/core";
import { AbstractList } from "../../../abstractList";
import { LexicalEntryListNodeComponent } from "./lexicalEntryListNodeComponent";
import { ARTURIResource, ResAttribute, RDFResourceRolesEnum, ResourceUtils } from "../../../../models/ARTResources";
import { SemanticTurkey } from "../../../../models/Vocabulary";
import { SearchSettings } from "../../../../models/Properties";
import { AuthorizationEvaluator } from "../../../../utils/AuthorizationEvaluator";
import { VBProperties } from "../../../../utils/VBProperties";
import { UIUtils } from "../../../../utils/UIUtils";
import { VBEventHandler } from "../../../../utils/VBEventHandler";
import { VBContext } from "../../../../utils/VBContext";
import { OntoLexLemonServices } from "../../../../services/ontoLexLemonServices";
import { SearchServices } from "../../../../services/searchServices";
import { BasicModalServices } from "../../../../widget/modal/basicModal/basicModalServices";

@Component({
    selector: "lexical-entry-list",
    templateUrl: "./lexicalEntryListComponent.html",
})
export class LexicalEntryListComponent extends AbstractList {

    @ViewChildren(LexicalEntryListNodeComponent) viewChildrenNode: QueryList<LexicalEntryListNodeComponent>;

    @Input() index: string; //initial letter of the entries to show
    @Input() lexicon: ARTURIResource;

    constructor(private ontolexService: OntoLexLemonServices, private searchService: SearchServices, private vbProp: VBProperties,
        private basicModals: BasicModalServices, eventHandler: VBEventHandler) {
        super(eventHandler);
        this.eventSubscriptions.push(eventHandler.lexicalEntryCreatedEvent.subscribe((node: ARTURIResource) => this.onListNodeCreated(node)));
        this.eventSubscriptions.push(eventHandler.lexicalEntryDeletedEvent.subscribe((node: ARTURIResource) => this.onListNodeDeleted(node)));
    }

    ngOnInit() {
        if (!AuthorizationEvaluator.isAuthorized(AuthorizationEvaluator.Actions.ONTOLEX_GET_LEXICAL_ENTRY)) {
            return;
        }
        this.initList();
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log("changes lexicalEntryList", changes);
        if (changes['index'] && !changes['index'].firstChange || changes['lexicon'] && !changes['lexicon'].firstChange) {
            this.initList();
        }
    }

    initList() {
        if (this.lexicon != undefined && this.index != undefined) {
            this.list = [];
            this.selectedNode = null;
            UIUtils.startLoadingDiv(this.blockDivElement.nativeElement);
            this.ontolexService.getLexicalEntriesByAlphabeticIndex(this.index, this.lexicon).subscribe(
                entries => {
                    //sort by show if rendering is active, uri otherwise
                    let attribute: "show" | "value" = this.rendering ? "show" : "value";
                    ResourceUtils.sortResources(entries, attribute);
                    this.list = entries;
                    UIUtils.stopLoadingDiv(this.blockDivElement.nativeElement);
                }
            );
        }
    }

    onListNodeCreated(node: ARTURIResource) {
        this.list.unshift(node);
    }

    onListNodeDeleted(node: ARTURIResource) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].getURI() == node.getURI()) {
                if (VBContext.getWorkingProject().isValidationEnabled()) {
                    //replace the resource instead of simply change the graphs, so that the rdfResource detect the change
                    let stagedRes: ARTURIResource = this.list[i].clone();
                    stagedRes.setGraphs([new ARTURIResource(SemanticTurkey.stagingRemoveGraph + VBContext.getWorkingProject().getBaseURI())]);
                    stagedRes.setAdditionalProperty(ResAttribute.EXPLICIT, false);
                    stagedRes.setAdditionalProperty(ResAttribute.SELECTED, false);
                    this.list[i] = stagedRes;
                } else {
                    this.list.splice(i, 1);
                }
                break;
            }
        }
    }

    selectNode(node: ARTURIResource) {
        if (this.selectedNode != undefined) {
            this.selectedNode.deleteAdditionalProperty(ResAttribute.SELECTED);
        }
        this.selectedNode = node;
        this.selectedNode.setAdditionalProperty(ResAttribute.SELECTED, true);
        this.nodeSelected.emit(node);
    }

    openListAt(node: ARTURIResource) {
        this.ensureNodeVisibility(node);
        setTimeout( //apply timeout in order to wait that the children node is rendered (in case the openPages has been increased)
            () => {
                var childrenNodeComponent = this.viewChildrenNode.toArray();
                for (var i = 0; i < childrenNodeComponent.length; i++) {
                    if (childrenNodeComponent[i].node.getURI() == node.getURI()) {
                        childrenNodeComponent[i].ensureVisible();
                        if (!childrenNodeComponent[i].node.getAdditionalProperty(ResAttribute.SELECTED)) {
                            childrenNodeComponent[i].selectNode();
                        }
                        break;
                    }
                }
            }
        );
    }


}