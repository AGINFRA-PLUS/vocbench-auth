import { Component, ViewChild, ElementRef } from "@angular/core";
import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { DialogRef, ModalComponent } from "ngx-modialog";
import { AbstractCustomConstructorModal } from "./abstractCustomConstructorModal"
import { CustomFormsServices } from "../../../../services/customFormsServices"
import { BasicModalServices } from "../../basicModal/basicModalServices"
import { BrowsingModalServices } from "../../browsingModal/browsingModalServices"
import { ARTLiteral, ARTURIResource } from "../../../../models/ARTResources"
import { CustomFormValue } from "../../../../models/CustomForms"
import { SKOS } from "../../../../models/Vocabulary"

export class NewConceptCfModalData extends BSModalContext {
    constructor(
        public title: string = "Modal title",
        public broader: ARTURIResource,
        public clsChangeable: boolean = true,
        public lang: string
    ) {
        super();
    }
}

@Component({
    selector: "new-concept-cf-modal",
    templateUrl: "./newConceptCfModal.html",
})
export class NewConceptCfModal extends AbstractCustomConstructorModal implements ModalComponent<NewConceptCfModalData> {
    context: NewConceptCfModalData;

    @ViewChild("toFocus") inputToFocus: ElementRef;

    private viewInitialized: boolean = false; //in order to avoid ugly UI effect on the alert showed if no language is available

    //standard form
    private label: string;
    private lang: string;
    private uri: string;
    private schemes: ARTURIResource[];

    constructor(public dialog: DialogRef<NewConceptCfModalData>, cfService: CustomFormsServices,
        basicModals: BasicModalServices, browsingModals: BrowsingModalServices) {
        super(cfService, basicModals, browsingModals);
        this.context = dialog.context;
    }

    ngOnInit() {
        this.lang = this.context.lang;
        this.resourceClass = SKOS.concept;
        this.selectCustomForm();
    }

    ngAfterViewInit() {
        this.inputToFocus.nativeElement.focus();
        setTimeout(() => {
            this.viewInitialized = true;
        });
    }

    private onLangChange(newLang: string) {
        setTimeout(() => {
            this.lang = newLang;
        });
    }

    private onSchemesChanged(schemes: ARTURIResource[]) {
        this.schemes = schemes;
    }

    changeClass() {
        this.changeClassWithRoot(SKOS.concept);
    }

    isStandardFormDataValid(): boolean {
        return (this.label != undefined && this.label.trim() != "" && this.lang != null &&
            this.schemes != null && this.schemes.length > 0);
    }

    ok(event: Event) {
        event.stopPropagation();
        event.preventDefault();

        var entryMap: any = this.collectCustomFormData();

        var returnedData: { uriResource: ARTURIResource, label: ARTLiteral, cls: ARTURIResource, schemes: ARTURIResource[], cfValue: CustomFormValue } = {
            uriResource: null,
            label: new ARTLiteral(this.label, null, this.lang),
            cls: null,
            schemes: this.schemes,
            cfValue: new CustomFormValue(this.customFormId, entryMap)
        }
        //Set URI only if localName is not empty
        if (this.uri != null && this.uri.trim() != "") {
            returnedData.uriResource = new ARTURIResource(this.uri);
        }
        //set class only if not the default
        if (this.resourceClass.getURI() != SKOS.concept.getURI()) {
            returnedData.cls = this.resourceClass;
        }
        this.dialog.close(returnedData);
    }

    cancel() {
        this.dialog.dismiss();
    }

}