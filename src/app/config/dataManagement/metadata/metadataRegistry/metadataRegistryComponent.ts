import { Component } from "@angular/core";
import { Modal, BSModalContextBuilder } from 'ngx-modialog/plugins/bootstrap';
import { OverlayConfig } from 'ngx-modialog';
import { NewCatalogRecordModal } from "./newCatalogRecordModal";
import { NewDatasetVersionModal, NewDatasetVersionModalData } from "./newDatasetVersionModal";
import { MetadataRegistryServices } from "../../../../services/metadataRegistryServices";
import { BasicModalServices } from "../../../../widget/modal/basicModal/basicModalServices";
import { CatalogRecord, DatasetMetadata } from "../../../../models/Metadata";
import { ARTURIResource } from "../../../../models/ARTResources";
import { AuthorizationEvaluator } from "../../../../utils/AuthorizationEvaluator";

@Component({
    selector: "metadata-registry-component",
    templateUrl: "./metadataRegistryComponent.html",
    host: { class: "pageComponent" },
    styles: [`.activeVers { border: 2px solid #cde8ff; border-radius: 6px; }`]
})
export class MetadataRegistryComponent {

    private catalogs: CatalogRecord[];
    private selectedCatalog: CatalogRecord;
    private selectedVersion: DatasetMetadata;
    
    constructor(private metadataRegistryService: MetadataRegistryServices, private basicModals: BasicModalServices, private modal: Modal) { }

    ngOnInit() {
        this.initCatalogRecords();
    }

    private initCatalogRecords(catalogToSelect?: string) {
        this.metadataRegistryService.getCatalogRecords().subscribe(
            catalogs => {
                this.catalogs = catalogs;
                this.selectedCatalog = null;
                this.selectedVersion = null;
                //if catalogToSelect has been provided, select it
                if (catalogToSelect != null) {
                    this.catalogs.forEach(c => {
                        if (c.identity == catalogToSelect) {
                            this.selectCatalog(c);
                            return;
                        }
                    })
                }
            }
        );
    }

    private selectCatalog(catalog: CatalogRecord) {
        if (this.selectedCatalog != catalog) {
            this.selectedVersion = null;
        }
        this.selectedCatalog = catalog;
    }

    private selectVersion(version: DatasetMetadata) {
        this.selectedVersion = version;
    }

    private addCatalogRecord() {
        const builder = new BSModalContextBuilder<any>();
        let overlayConfig: OverlayConfig = { context: builder.keyboard(null).toJSON() };
        this.modal.open(NewCatalogRecordModal, overlayConfig).result.then(
            ok => {
                this.initCatalogRecords();
            },
            () => {}
        );
    }

    private deletCatalogRecord() {
        this.metadataRegistryService.deleteCatalogRecord(new ARTURIResource(this.selectedCatalog.identity)).subscribe(
            stResp => {
                this.initCatalogRecords();
            }
        );
    }

    private addDatasetVersion() {
        var modalData = new NewDatasetVersionModalData(this.selectedCatalog.identity);
        const builder = new BSModalContextBuilder<NewDatasetVersionModalData>(
            modalData, undefined, NewDatasetVersionModalData
        );
        let overlayConfig: OverlayConfig = { context: builder.keyboard(null).toJSON() };
        return this.modal.open(NewDatasetVersionModal, overlayConfig).result.then(
            ok => {
                this.initCatalogRecords(this.selectedCatalog.identity);
            },
            () => {}
        );
    }

    private deleteDatasetVersion() {
        this.metadataRegistryService.deleteDatasetVersions(new ARTURIResource(this.selectedVersion.identity)).subscribe(
            stResp => {
                this.initCatalogRecords();
            }
        );
    }

    private isAddDatasetAuthorized(): boolean {
        return AuthorizationEvaluator.isAuthorized(AuthorizationEvaluator.Actions.METADATA_REGISTRY_CREATE);
    }
    private isRemoveDatasetAuthorized(): boolean {
        return AuthorizationEvaluator.isAuthorized(AuthorizationEvaluator.Actions.METADATA_REGISTRY_DELETE);
    }
    private isEditDatasetAuthorized(): boolean {
        return AuthorizationEvaluator.isAuthorized(AuthorizationEvaluator.Actions.METADATA_REGISTRY_UPDATE);
    }
    

}