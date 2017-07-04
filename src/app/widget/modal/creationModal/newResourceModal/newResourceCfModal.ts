import { Component } from "@angular/core";
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, ModalComponent } from "angular2-modal";
import { AbstractCustomConstructorModal } from "./abstractCustomConstructorModal"
import { CustomFormsServices } from "../../../../services/customFormsServices"
import { BrowsingModalServices } from "../../browsingModal/browsingModalServices"
import { BasicModalServices } from "../../basicModal/basicModalServices"
import { ARTLiteral, ARTURIResource } from "../../../../models/ARTResources"

export class NewResourceCfModalData extends BSModalContext {
    constructor(
        public title: string = "Modal title",
        public cls: ARTURIResource, //class that this modal is creating
        public clsChangeable: boolean = true,
    ) {
        super();
    }
}

@Component({
    selector: "new-resource-cf-modal",
    templateUrl: "./newResourceCfModal.html",
})
export class NewResourceCfModal extends AbstractCustomConstructorModal implements ModalComponent<NewResourceCfModalData> {
    context: NewResourceCfModalData;

    //standard form
    private uri: string;

    constructor(public dialog: DialogRef<NewResourceCfModalData>, cfService: CustomFormsServices,
        basicModals: BasicModalServices, browsingModals: BrowsingModalServices) {
        super(cfService, basicModals, browsingModals);
        this.context = dialog.context;
    }

    ngOnInit() {
        this.resourceClass = this.context.cls;
        this.selectCustomForm();
    }

    changeClass() {
        this.changeClassWithRoot(this.context.cls);
    }

    isStandardFormDataValid(): boolean {
        return (this.uri != null && this.uri.trim() != "");
    }

    ok(event: Event) {
        event.stopPropagation();
        event.preventDefault();

        var entryMap: any = this.collectCustomFormData();

        var returnedData: { uriResource: ARTURIResource, cls: ARTURIResource, cfId: string, cfValueMap: any} = {
            uriResource: new ARTURIResource(this.uri),
            cls: null,
            cfId: this.customFormId,
            cfValueMap: entryMap
        }
        //set class only if not the default
        if (this.resourceClass.getURI() != this.context.cls.getURI()) {
            returnedData.cls = this.resourceClass;
        }
        this.dialog.close(returnedData);
    }

    cancel() {
        this.dialog.dismiss();
    }

}