import { Component } from "@angular/core";
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, ModalComponent } from "angular2-modal";
import { CommitInfo } from "../models/History";

export class OperationParamsModalData extends BSModalContext {
    constructor(public commit: CommitInfo) {
        super();
    }
}

@Component({
    selector: "operation-params-modal",
    templateUrl: "./operationParamsModal.html"
})
export class OperationParamsModal implements ModalComponent<OperationParamsModalData> {
    context: OperationParamsModalData;

    constructor(public dialog: DialogRef<OperationParamsModalData>) {
        this.context = dialog.context;
    }

    ok(event: Event) {
        event.stopPropagation();
        event.preventDefault();
        this.dialog.close();
    }

}