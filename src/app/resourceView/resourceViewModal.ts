import { Component } from "@angular/core";
import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { DialogRef, ModalComponent } from "ngx-modialog";
import { ARTResource } from '../models/ARTResources';

export class ResourceViewModalData extends BSModalContext {
    constructor(public resource: ARTResource, public readonly: boolean = true) {
        super();
    }
}

@Component({
    selector: "resource-view-modal",
    templateUrl: "./resourceViewModal.html",
})
export class ResourceViewModal implements ModalComponent<ResourceViewModalData> {
    context: ResourceViewModalData;

    constructor(public dialog: DialogRef<ResourceViewModalData>) {
        this.context = dialog.context;
    }

    ok(event: Event) {
        event.stopPropagation();
        event.preventDefault();
        this.dialog.close();
    }

}