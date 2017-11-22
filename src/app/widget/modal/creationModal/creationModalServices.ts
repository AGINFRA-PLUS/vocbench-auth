import { Injectable } from '@angular/core';
import { Modal, BSModalContextBuilder } from 'ngx-modialog/plugins/bootstrap';
import { OverlayConfig } from 'ngx-modialog';
import { ARTURIResource, ARTResource, ARTLiteral } from "../../../models/ARTResources";
import { NewResourceModal, NewResourceModalData } from "./newResourceModal/newResourceModal";
import { NewResourceCfModal, NewResourceCfModalData } from "./newResourceModal/newResourceCfModal";
import { NewSkosResourceCfModal, NewSkosResourceCfModalData } from "./newResourceModal/newSkosResourceCfModal";
import { NewPlainLiteralModal, NewPlainLiteralModalData } from "./newPlainLiteralModal/newPlainLiteralModal";
import { NewTypedLiteralModal, NewTypedLiteralModalData } from "./newTypedLiteralModal/newTypedLiteralModal";
import { NewConceptFromLabelModal, NewConceptFromLabelModalData } from "./newResourceModal/newConceptFromLabelModal";
import { NewConceptCfModal, NewConceptCfModalData } from "./newResourceModal/newConceptCfModal";

@Injectable()
export class CreationModalServices {

    constructor(private modal: Modal) { }

    /**
     * Opens a modal to create a new resource with name, label and language tag
     * @param title the title of the modal dialog
     * @param lang the selected default language in the lang-picker of the modal. If not provided, set the default VB language
     * @return if the modal closes with ok returns a promise containing an object with uri, label and lang
     */
    newResource(title: string, lang?: string) {
        var modalData = new NewResourceModalData(title, lang);
        const builder = new BSModalContextBuilder<NewResourceModalData>(
            modalData, undefined, NewResourceModalData
        );
        let overlayConfig: OverlayConfig = { context: builder.keyboard(null).toJSON() };
        return this.modal.open(NewResourceModal, overlayConfig).result;
    }

    /**
     * Opens a modal to create a new resource with uri plus custom form supplement fields
     * @param title the title of the modal dialog
     * @param cls class of the new creating resource
     * @param clsChangeable tells if the class of the creating resource can be changed
     * @param cfId the custom form id
     * @return
     */
    newResourceCf(title: string, cls: ARTURIResource, clsChangeable?: boolean) {
        var modalData = new NewResourceCfModalData(title, cls, clsChangeable);
        const builder = new BSModalContextBuilder<NewResourceCfModalData>(
            modalData, undefined, NewResourceCfModalData
        );
        let overlayConfig: OverlayConfig = { context: builder.keyboard(null).toJSON() };
        return this.modal.open(NewResourceCfModal, overlayConfig).result;
    }

    /**
     * Opens a modal to create a new skos concept with label, language, uri (optional) and schemes, plus custom form supplement fields
     * @param title the title of the modal dialog
     * @param broader the broader concept of the new creating (only if not topConcept)
     * @param clsChangeable tells if the class of the creating resource can be changed
     * @param lang the selected default language in the lang-picker of the modal. If not provided, set the default VB language
     * @return 
     */
    newConceptCf(title: string, broader?: ARTURIResource, clsChangeable?: boolean, lang?: string) {
        var modalData = new NewConceptCfModalData(title, broader, clsChangeable, lang);
        const builder = new BSModalContextBuilder<NewConceptCfModalData>(
            modalData, undefined, NewConceptCfModalData
        );
        let overlayConfig: OverlayConfig = { context: builder.keyboard(null).toJSON() };
        return this.modal.open(NewConceptCfModal, overlayConfig).result;
    }

    /**
     * Opens a modal to create a new skos resource with label, language and uri (optional), plus custom form supplement fields
     * @param title the title of the modal dialog
     * @param cls class of the new creating resource
     * @param clsChangeable tells if the class of the creating resource can be changed
     * @param lang the selected default language in the lang-picker of the modal. If not provided, set the default VB language
     * @return
     */
    newSkosResourceCf(title: string, cls: ARTURIResource, clsChangeable?: boolean, lang?: string) {
        var modalData = new NewSkosResourceCfModalData(title, cls, clsChangeable, lang);
        const builder = new BSModalContextBuilder<NewSkosResourceCfModalData>(
            modalData, undefined, NewSkosResourceCfModalData
        );
        let overlayConfig: OverlayConfig = { context: builder.keyboard(null).toJSON() };
        return this.modal.open(NewSkosResourceCfModal, overlayConfig).result;
    }

    /**
     * Opens a modal to create a new literal with language tag
     * @param title the title of the modal dialog
     * @param value the value inserted by default
     * @param valueReadonly if true the input field is disable and cannot be changed
     * @param lang the language selected as default
     * @param langReadonly if true the language selection is disable and language cannot be changed
     * @return if the modal closes with ok returns a promise containing an ARTLiteral
     */
    newPlainLiteral(title: string, value?: string, valueReadonly?: boolean, lang?: string, langReadonly?: boolean) {
        var modalData = new NewPlainLiteralModalData(title, value, valueReadonly, lang, langReadonly);
        const builder = new BSModalContextBuilder<NewPlainLiteralModalData>(
            modalData, undefined, NewPlainLiteralModalData
        );
        let overlayConfig: OverlayConfig = { context: builder.keyboard(null).toJSON() };
        return this.modal.open(NewPlainLiteralModal, overlayConfig).result;
    }

    /**
     * Opens a modal to create a new literal with datatype
     * @param title the title of the modal dialog
     * @param allowedDatatypes datatypes allowed in the datatype selection list
     * @return if the modal closes with ok returns a promise containing an ARTLiteral
     */
    newTypedLiteral(title: string, allowedDatatypes?: ARTURIResource[], dataRanges?: (ARTLiteral[])[]) {
        var modalData = new NewTypedLiteralModalData(title, allowedDatatypes, dataRanges);
        const builder = new BSModalContextBuilder<NewTypedLiteralModalData>(
            modalData, undefined, NewTypedLiteralModalData
        );
        let overlayConfig: OverlayConfig = { context: builder.keyboard(null).toJSON() };
        return this.modal.open(NewTypedLiteralModal, overlayConfig).result;
    }

    /**
     * Opens a modal to create a new concept with a preset skosxl:Label
     * @param title the title of the modal dialog
     * @param xLabel label that the new concept will have
     * @param cls class of the new creating resource
     * @param clsChangeable tells if the class of the creating resource can be changed
     * @param sibling a concept that if provided, set the default sibling in case of position chosen "sibling"
     */
    newConceptFromLabel(title: string, xLabel: ARTResource, cls: ARTURIResource, clsChangeable?: boolean, sibling?: ARTURIResource) {
        var modalData = new NewConceptFromLabelModalData(title, xLabel, cls, clsChangeable, sibling);
        const builder = new BSModalContextBuilder<NewConceptFromLabelModalData>(
            modalData, undefined, NewConceptFromLabelModalData
        );
        let overlayConfig: OverlayConfig = { context: builder.keyboard(null).toJSON() };
        return this.modal.open(NewConceptFromLabelModal, overlayConfig).result;
    }

}