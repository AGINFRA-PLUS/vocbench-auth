import { Component, HostListener } from '@angular/core';
import { OverlayConfig } from 'ngx-modialog';
import { BSModalContextBuilder, Modal } from 'ngx-modialog/plugins/bootstrap';
import { ARTURIResource, LocalResourcePosition } from "../../models/ARTResources";
import { Project } from "../../models/Project";
import { AlignmentServices } from "../../services/alignmentServices";
import { ResourcesServices } from "../../services/resourcesServices";
import { Cookie } from "../../utils/Cookie";
import { HttpServiceContext } from "../../utils/HttpManager";
import { UIUtils } from "../../utils/UIUtils";
import { BasicModalServices } from "../../widget/modal/basicModal/basicModalServices";
import { SharedModalServices } from "../../widget/modal/sharedModal/sharedModalServices";
import { AlignmentCell } from "./AlignmentCell";
import { MappingPropertySelectionModal, MappingPropertySelectionModalData } from "./alignmentValidationModals/mappingPropertySelectionModal";
import { ValidationReportModal, ValidationReportModalData } from "./alignmentValidationModals/validationReportModal";
import { ValidationSettingsModal } from "./alignmentValidationModals/validationSettingsModal";

@Component({
    selector: 'alignment-validation-component',
    templateUrl: './alignmentValidationComponent.html',
    host: { class: "pageComponent" }
})
export class AlignmentValidationComponent {

    private alignmentFile: File;
    private alignmentCellList: Array<AlignmentCell> = [];
    private sourceBaseURI: string;
    private targetBaseURI: string;

    //for pagination
    private page: number = 0;
    private totPage: number;

    //quick actions
    private qaNull = "---";
    private qaAcceptAll = "Accept all";
    private qaAcceptAllAbove = "Accept all above threshold";
    private qaRejectAll = "Reject all";
    private qaRejectAllUnder = "Reject all under threshold";
    private quickActionList: Array<any> = [this.qaNull, this.qaAcceptAll, this.qaAcceptAllAbove, this.qaRejectAll, this.qaRejectAllUnder];
    private chosenQuickAction: any = this.quickActionList[0];
    private threshold: number = 0.0;

    //settings
    private rejectedAlignmentAction: string; //ask, delete or skip
    private showRelationType: string; //relation, dlSymbol or text
    private confOnMeter: boolean; //tells if relation confidence should be shown on meter
    private alignmentPerPage: number; //max alignments per page
    private rendering: boolean = false;

    private unknownRelation: boolean = false; //keep trace if there is some unknown relation (not a symbol, e.g. a classname)
    private knownRelations: string[] = ["=", ">", "<", "%", "HasInstance", "InstanceOf"];
    private relationSymbols: Array<any> = [
        { relation: "=", dlSymbol: "\u2261", text: "equivalent" },
        { relation: ">", dlSymbol: "\u2292", text: "subsumes" },
        { relation: "<", dlSymbol: "\u2291", text: "is subsumed" },
        { relation: "%", dlSymbol: "\u22a5", text: "incompatible" },
        { relation: "HasInstance", dlSymbol: "\u2192", text: "has instance" },
        { relation: "InstanceOf", dlSymbol: "\u2190", text: "instance of" }
    ];

    constructor(private alignmentService: AlignmentServices, private resourceService: ResourcesServices,
        private basicModals: BasicModalServices, private sharedModals: SharedModalServices, private modal: Modal) { }

    ngOnInit() {
        //init settings (where not provided, set a default)
        this.rejectedAlignmentAction = Cookie.getCookie(Cookie.ALIGNMENT_VALIDATION_REJECTED_ALIGNMENT_ACTION);
        if (this.rejectedAlignmentAction == null) {
            this.rejectedAlignmentAction = "ask";
            Cookie.setCookie(Cookie.ALIGNMENT_VALIDATION_REJECTED_ALIGNMENT_ACTION, this.rejectedAlignmentAction, 365*10);
        }
        this.showRelationType = Cookie.getCookie(Cookie.ALIGNMENT_VALIDATION_RELATION_SHOW);
        if (this.showRelationType == null) {
            this.showRelationType = "relation";
            Cookie.setCookie(Cookie.ALIGNMENT_VALIDATION_RELATION_SHOW, this.showRelationType, 365*10);
        }
        this.confOnMeter = Cookie.getCookie(Cookie.ALIGNMENT_VALIDATION_SHOW_CONFIDENCE) == "true";
        this.alignmentPerPage = +Cookie.getCookie(Cookie.ALIGNMENT_VALIDATION_ALIGNMENT_PER_PAGE);
        if (this.alignmentPerPage == 0) {
            this.alignmentPerPage = 15;
            Cookie.setCookie(Cookie.ALIGNMENT_VALIDATION_ALIGNMENT_PER_PAGE, this.alignmentPerPage + "", 365*10);
        }
    }

    //use HostListener instead of ngOnDestroy since this component is reused and so it is never destroyed
    @HostListener('window:beforeunload', [ '$event' ])
    beforeUnloadHandler(event: Event) {
        // close session server side
        this.alignmentService.closeSession().subscribe();
    }

    /**
     * Updates the file to load when user change file on from filepicker
     */
    private fileChangeEvent(file: File) {
        this.alignmentFile = file;
    }

    /**
     * Loads the alignment file and the mapping cells
     */
    private loadAlignment() {
        HttpServiceContext.initSessionToken();
        UIUtils.startLoadingDiv(UIUtils.blockDivFullScreen);
        this.alignmentService.loadAlignment(this.alignmentFile).subscribe(
            stResp => {
                UIUtils.stopLoadingDiv(UIUtils.blockDivFullScreen);
                this.sourceBaseURI = stResp.onto1;
                this.targetBaseURI = stResp.onto2;
                for (var i = 0; i < stResp.unknownRelations.length; i++) {
                    this.relationSymbols.push({
                        relation: stResp.unknownRelations[i],
                        dlSymbol: stResp.unknownRelations[i],
                        text: stResp.unknownRelations[i]
                    });
                }
                this.updateAlignmentCells();
            }
        );
    }

    /**
     * Gets alignment cells so updates the tables 
     */
    private updateAlignmentCells() {
        UIUtils.startLoadingDiv(UIUtils.blockDivFullScreen);
        this.alignmentService.listCells(this.page, this.alignmentPerPage).subscribe(
            map => {
                this.totPage = map.totPage;
                this.alignmentCellList = map.cells;
                //check if there is at least an unknown relation (could be a classname)
                //useful to enlarge the progress bar in the view in order to contains the relation name
                this.unknownRelation = false;
                for (var i = 0; i < this.alignmentCellList.length; i++) {
                    let relation = this.alignmentCellList[i].getRelation();
                    if (this.knownRelations.indexOf(relation) == -1) {
                        this.unknownRelation = true;
                        break;
                    }
                }
                //update the rendering of the entities
                //source ontology
                let sourceEntities: ARTURIResource[] = [];
                for (var i = 0; i < this.alignmentCellList.length; i++) {
                    sourceEntities.push(this.alignmentCellList[i].getEntity1());
                }
                this.resourceService.getResourcesInfo(sourceEntities).subscribe(
                    resources => {
                        UIUtils.stopLoadingDiv(UIUtils.blockDivFullScreen);
                        for (var i = 0; i < this.alignmentCellList.length; i++) {
                            for (var j = 0; j < resources.length; j++) {
                                if (this.alignmentCellList[i].getEntity1().getURI() == resources[j].getURI()) {
                                    this.alignmentCellList[i].setEntity1(resources[j]);
                                    break; //go to the next source entity
                                }
                            }           
                        }
                    }
                );
                //target ontology (only if is a local project, trying to detect it by getting the position of the target entity of the first alignment)
                this.resourceService.getResourcePosition(this.alignmentCellList[0].getEntity2()).subscribe(
                    position => {
                        //if target entities are from a local project, get the information of them
                        if (position.isLocal()) {
                            let targetProject: string = (<LocalResourcePosition>position).project;

                            let targetEntities: ARTURIResource[] = [];
                            for (var i = 0; i < this.alignmentCellList.length; i++) {
                                targetEntities.push(this.alignmentCellList[i].getEntity2());
                            }

                            HttpServiceContext.setContextProject(new Project(targetProject)); //set a temporary context project
                            this.resourceService.getResourcesInfo(targetEntities).subscribe(
                                resources => {
                                    HttpServiceContext.removeContextProject();
                                    for (var i = 0; i < this.alignmentCellList.length; i++) {
                                        for (var j = 0; j < resources.length; j++) {
                                            if (this.alignmentCellList[i].getEntity2().getURI() == resources[j].getURI()) {
                                                this.alignmentCellList[i].setEntity2(resources[j]);
                                                break; //go to the next source entity
                                            }
                                        }           
                                    }
                                },
                                () => HttpServiceContext.removeContextProject()
                            );
                        }
                    }
                )
            }
        );
    }

    /**
     * List cells of previous page.
     */
    private prevPage() {
        this.page--;
        this.updateAlignmentCells();
    }

    /**
     * List cells of next page.
     */
    private nextPage() {
        this.page++;
        this.updateAlignmentCells();
    }

    /**
     * Listener to the "Accept" button. Accepts the alignment and updates the UI
     */
    private acceptAlignment(cell: AlignmentCell) {
        this.alignmentService.acceptAlignment(cell.getEntity1(), cell.getEntity2(), cell.getRelation()).subscribe(
            resultCell => {
                //replace the accepted alignment cell with the returned one (keeping the "rendered" entities)
                let cellToUpdateIdx = this.getIndexOfCell(cell);
                resultCell.setEntity1(this.alignmentCellList[cellToUpdateIdx].getEntity1());
                resultCell.setEntity2(this.alignmentCellList[cellToUpdateIdx].getEntity2());
                this.alignmentCellList[cellToUpdateIdx] = resultCell;
                if ((<AlignmentCell>resultCell).getStatus() == "error") {
                    this.selectMappingProperty(resultCell).then(
                        (data: any) => {
                            let mappingProp: ARTURIResource = data.property;
                            let setAsDefault: boolean = data.setAsDefault;
                            this.alignmentService.acceptAlignment(cell.getEntity1(), cell.getEntity2(), cell.getRelation(), data.property, data.setAsDefault).subscribe(
                                resultCell => {
                                    //replace the accepted alignment cell with the returned one
                                    this.alignmentCellList[this.getIndexOfCell(cell)] = resultCell;
                                }
                            )
                        },
                        () => {}
                    )
                }
            }
        )
    }

    /**
     * 
     * @param cell 
     */
    private selectMappingProperty(cell: AlignmentCell) {
        var modalData = new MappingPropertySelectionModalData("Invalid relation", cell.getComment(), cell.getEntity1());
        const builder = new BSModalContextBuilder<MappingPropertySelectionModalData>(
            modalData, undefined, MappingPropertySelectionModalData
        );
        let overlayConfig: OverlayConfig = { context: builder.keyboard(27).toJSON() };
        return this.modal.open(MappingPropertySelectionModal, overlayConfig).result;
    }

    /**
     * Listener to the "Reject" button. Rejects the alignment and updates the UI
     */
    private rejectAlignment(cell: AlignmentCell) {
        this.alignmentService.rejectAlignment(cell.getEntity1(), cell.getEntity2(), cell.getRelation()).subscribe(
            resultCell => {
                //replace the rejected alignment cell with the returned one (keeping the "rendered" entities)
                let cellToUpdateIdx = this.getIndexOfCell(cell);
                resultCell.setEntity1(this.alignmentCellList[cellToUpdateIdx].getEntity1());
                resultCell.setEntity2(this.alignmentCellList[cellToUpdateIdx].getEntity2());
                this.alignmentCellList[cellToUpdateIdx] = resultCell;
            }
        )
    }

    /**
     * Returns the relation symbol rendered according to the show type in settings (relation, dlSymbol or text)
     */
    private getRelationRendered(cell: AlignmentCell): string {
        var result = cell.getRelation();
        var rel = cell.getRelation();
        for (var i = 0; i < this.relationSymbols.length; i++) {
            if (this.relationSymbols[i].relation == rel) {
                result = this.relationSymbols[i][this.showRelationType];
                break;
            }
        }
        if (this.confOnMeter) {
            result += " (" + cell.getMeasure() + ")";
        }
        return result;
    }

    /**
     * Called when user changes the relation of an alignment. Changes the relation and updates the UI.
     */
    private changeRelation(cell: AlignmentCell, relation: string) {
        //change relation only if user choses a relation different from the current
        if (cell.getRelation() != relation) {
            this.basicModals.confirm("Change relation",
                "Manually changing the relation will set automatically the measure of the alignment to 1.0. Do you want to continue?",
                "warning").then(
                (confirm: any) => {
                    this.alignmentService.changeRelation(cell.getEntity1(), cell.getEntity2(), relation).subscribe(
                        resultCell => {//replace the alignment cell with the new one
                            this.alignmentCellList[this.getIndexOfCell(cell)] = resultCell;
                        }
                    )
                },
                () => { }
            );
        }
    }

    /**
     * Called when user click on menu to change the mapping property of an alignment.
     * Useful to populate the menu of the mapping properties.
     * Retrieves the suggested mapping properties and set them to the alignment cell.
     */
    private getSuggestedMappingProperties(cell: AlignmentCell) {
        //call the service only if suggested properties for the given cell is not yet initialized
        if (cell.getSuggestedMappingProperties() == null) {
            this.alignmentService.getSuggestedProperties(cell.getEntity1(), cell.getRelation()).subscribe(
                props => {
                    cell.setSuggestedMappingProperties(props);
                }
            );
        } else {
            return cell.getSuggestedMappingProperties();
        }
        
    }

    /**
     * Called when user changes the mapping prop of an alignment. Changes the the prop and updates the UI.
     */
    private changeMappingProperty(cell: AlignmentCell, property: ARTURIResource) {
        //change property only if the user choses a property different from the current.
        if (property.getURI() != cell.getMappingProperty().getURI()) {
            this.alignmentService.changeMappingProperty(cell.getEntity1(), cell.getEntity2(), property.getURI()).subscribe(
                resultCell => {//replace the alignment cell with the new one
                    this.alignmentCellList[this.getIndexOfCell(cell)] = resultCell;
                }
            );
        }
    }

    /**
     * Opens a modal dialog to edit the settings
     */
    private openSettings() {
        var oldAlignPerPage = +Cookie.getCookie(Cookie.ALIGNMENT_VALIDATION_ALIGNMENT_PER_PAGE);

        const builder = new BSModalContextBuilder<any>();
        let overlayConfig: OverlayConfig = { context: builder.keyboard(27).toJSON() };

        this.modal.open(ValidationSettingsModal, overlayConfig).result.then(
            () => {
                //update settings
                this.rejectedAlignmentAction = Cookie.getCookie(Cookie.ALIGNMENT_VALIDATION_REJECTED_ALIGNMENT_ACTION);
                this.showRelationType = Cookie.getCookie(Cookie.ALIGNMENT_VALIDATION_RELATION_SHOW);
                this.confOnMeter = Cookie.getCookie(Cookie.ALIGNMENT_VALIDATION_SHOW_CONFIDENCE) == "true";
                this.alignmentPerPage = +Cookie.getCookie(Cookie.ALIGNMENT_VALIDATION_ALIGNMENT_PER_PAGE);
                if (oldAlignPerPage != this.alignmentPerPage) {
                    this.page = 0;
                    this.updateAlignmentCells();
                }
            },
            () => { }
        );
    }

    private doQuickAction() {
        UIUtils.startLoadingDiv(UIUtils.blockDivFullScreen);
        if (this.chosenQuickAction == this.qaAcceptAll) {
            this.alignmentService.acceptAllAlignment().subscribe(
                cells => {
                    this.updateAlignmentListAfterQuickAction(cells);
                    UIUtils.stopLoadingDiv(UIUtils.blockDivFullScreen);
                }
            )
        } else if (this.chosenQuickAction == this.qaAcceptAllAbove) {
            this.alignmentService.acceptAllAbove(this.threshold).subscribe(
                cells => {
                    this.updateAlignmentListAfterQuickAction(cells);
                    UIUtils.stopLoadingDiv(UIUtils.blockDivFullScreen);
                }
            )
        } else if (this.chosenQuickAction == this.qaRejectAll) {
            this.alignmentService.rejectAllAlignment().subscribe(
                cells => {
                    this.updateAlignmentListAfterQuickAction(cells);
                    UIUtils.stopLoadingDiv(UIUtils.blockDivFullScreen);
                }
            )
        } else if (this.chosenQuickAction == this.qaRejectAllUnder) {
            this.alignmentService.rejectAllUnder(this.threshold).subscribe(
                cells => {
                    this.updateAlignmentListAfterQuickAction(cells);
                    UIUtils.stopLoadingDiv(UIUtils.blockDivFullScreen);
                }
            )
        }
    }

    /**
     * Called after a quick action. Updates the list of the alignment cell
     */
    private updateAlignmentListAfterQuickAction(newAlignmentList: Array<AlignmentCell>) {
        for (var i = 0; i < newAlignmentList.length; i++) {
            //replace the updated alignment cell with the returned (keeping the "rendered" entities)
            let newCell = newAlignmentList[i];
            let cellToUpdateIdx = this.getIndexOfCell(newCell);
            if (cellToUpdateIdx != -1) { //cell available in the current page
                newCell.setEntity1(this.alignmentCellList[cellToUpdateIdx].getEntity1());
                newCell.setEntity2(this.alignmentCellList[cellToUpdateIdx].getEntity2());
                this.alignmentCellList[cellToUpdateIdx] = newCell;
            }
        }
    }

    /**
     * Listener to "Apply to ontology button"
     */
    private applyToOnto() {
        if (this.rejectedAlignmentAction == "skip") {
            this.basicModals.confirm("Apply validation", "This operation will add to the ontology the triples of the "
                + "accepted alignments. Are you sure to continue?", "warning").then(
                (confirm: any) => {
                    this.applyValidation(false);
                },
                () => { }
            );
        } else if (this.rejectedAlignmentAction == "delete") {
            this.basicModals.confirm("Apply validation", "This operation will add to the ontology the triples of the "
                + "accepted alignments and delete the triples of the ones rejected. Are you sure to continue?", "warning").then(
                (confirm: any) => {
                    this.applyValidation(true);
                },
                () => { }
            );
        } else if (this.rejectedAlignmentAction == "ask") {
            this.basicModals.confirmCheck("Apply valdiation", "This operation will add to the ontology the triples of the "
                + "accepted alignments. Are you sure to continue?", "Delete triples of rejected alignments", "warning").then(
                (confirm: any) => {
                    this.applyValidation(confirm);
                },
                () => { }
            );
        }
    }

    /**
     * calls the service to apply the validation and shows the report dialog.
     */
    private applyValidation(deleteReject: boolean) {
        UIUtils.startLoadingDiv(UIUtils.blockDivFullScreen);
        this.alignmentService.applyValidation(deleteReject).subscribe(
            report => {
                UIUtils.stopLoadingDiv(UIUtils.blockDivFullScreen);
                //open report modal
                var modalData = new ValidationReportModalData(report);
                const builder = new BSModalContextBuilder<ValidationReportModalData>(
                    modalData, undefined, ValidationReportModalData
                );
                let overlayConfig: OverlayConfig = { context: builder.size('lg').keyboard(27).toJSON() };
                return this.modal.open(ValidationReportModal, overlayConfig).result;
            }
        )
    }

    private export() {
        this.alignmentService.exportAlignment().subscribe(
            blob => {
                var exportLink = window.URL.createObjectURL(blob);
                this.basicModals.downloadLink("Export alignment", null, exportLink, "alignment.rdf");
            }
        );
    }

    /**
     * Retrieves the index of the given cell from the alignmentList so that the cell can be changed and
     * changes on model reflect on view
     */
    private getIndexOfCell(cell: AlignmentCell): number {
        return this.alignmentCellList.findIndex(c =>
            c.getEntity1().getURI() == cell.getEntity1().getURI() && c.getEntity2().getURI() == cell.getEntity2().getURI());
    }

    private openResView(resource: ARTURIResource) {
        this.sharedModals.openResourceView(resource, true);
    }
}