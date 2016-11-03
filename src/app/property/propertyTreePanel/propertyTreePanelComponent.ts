import {Component, Input, Output, EventEmitter, ViewChild} from "@angular/core";
import {PropertyTreeComponent} from "../propertyTree/propertyTreeComponent";
import {ARTURIResource, RDFResourceRolesEnum} from "../../utils/ARTResources";
import {PropertyServices} from "../../services/propertyServices";
import {DeleteServices} from "../../services/deleteServices";
import {SearchServices} from "../../services/searchServices";
import {ModalServices} from "../../widget/modal/modalServices";

@Component({
	selector: "property-tree-panel",
	templateUrl: "./propertyTreePanelComponent.html",
})
export class PropertyTreePanelComponent {
    @Output() nodeSelected = new EventEmitter<ARTURIResource>();
    
    @ViewChild(PropertyTreeComponent) viewChildTree: PropertyTreeComponent;
    
    private selectedProperty:ARTURIResource;
    
	constructor(private propService:PropertyServices, private searchService: SearchServices, private deleteService: DeleteServices, 
        private modalService: ModalServices) {}
    
    private createProperty() {
        this.createPropertyForType(RDFResourceRolesEnum.property);
    }
    
    private createObjectProperty() {
        this.createPropertyForType(RDFResourceRolesEnum.objectProperty);
    }
    
    private createDatatypeProperty() {
        this.createPropertyForType(RDFResourceRolesEnum.datatypeProperty);
    }
    
    private createAnnotationProperty() {
        this.createPropertyForType(RDFResourceRolesEnum.annotationProperty);
    }
    
    private createOntologyProperty() {
        this.createPropertyForType(RDFResourceRolesEnum.ontologyProperty);
    }
    
    private createPropertyForType(type) {
        //currently uses prompt instead of newResource since addProperty service doesn't allow to provide a label
        this.modalService.prompt("Create a new " + type, "Name", null, false, true).then(
            result => {
                this.propService.addProperty(result, type).subscribe();
            },
            () => {}
        );
    }
    
    private createSubProperty() {
        //currently uses prompt instead of newResource since addSubProperty service doesn't allow to provide a label
        this.modalService.prompt("Create a subProperty", "Name", null, false, true).then(
            result => {
                this.propService.addSubProperty(result, this.selectedProperty).subscribe();
            },
            () => {}
        );
    }
    
    private deleteProperty() {
        this.deleteService.removeProperty(this.selectedProperty).subscribe(
            stResp => {
                this.selectedProperty = null;
                this.nodeSelected.emit(undefined);
            }
        );
    }
    
    private doSearch(searchedText: string) {
        if (searchedText.trim() == "") {
            this.modalService.alert("Search", "Please enter a valid string to search", "error");
        } else {
            this.searchService.searchResource(searchedText, [RDFResourceRolesEnum.property], true, false, "contain").subscribe(
                searchResult => {
                    if (searchResult.length == 0) {
                        this.modalService.alert("Search", "No results found for '" + searchedText + "'", "warning");
                    } else { //1 or more results
                        if (searchResult.length == 1) {
                            this.viewChildTree.openTreeAt(searchResult[0]);
                        } else { //multiple results, ask the user which one select
                            this.modalService.selectResource("Search", searchResult.length + " results found.", searchResult).then(
                                selectedResource => {
                                    this.viewChildTree.openTreeAt(selectedResource);
                                },
                                () => {}
                            );
                        }
                    }
                }
            );
        }
    }
    
    /**
     * Handles the keydown event in search text field (when enter key is pressed execute the search)
     */
    private searchKeyHandler(key, searchedText) {
        if (key == "13") {
            this.doSearch(searchedText);           
        }
    }
    
    //EVENT LISTENERS
    
    private onNodeSelected(node:ARTURIResource) {
        this.selectedProperty = node;
        this.nodeSelected.emit(node);
    }
    
    
}