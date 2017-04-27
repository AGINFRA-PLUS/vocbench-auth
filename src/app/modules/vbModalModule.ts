import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from "./sharedModule";
import { TreeAndListModule } from "./treeAndListModule";
import { CustomFormModule } from "./customFormModule";

//services to open modals
import { ModalServices } from "../widget/modal/modalServices";
import { BrowsingServices } from "../widget/modal/browsingModal/browsingServices";

//basic modals
import { AlertModal } from '../widget/modal/alertModal/alertModal';
import { ConfirmModal } from '../widget/modal/confirmModal/confirmModal';
import { ConfirmCheckModal } from '../widget/modal/confirmModal/confirmCheckModal';
import { DownloadModal } from '../widget/modal/downloadModal/downloadModal';
import { FilePickerModal } from '../widget/modal/filePickerModal/filePickerModal';
import { NewPlainLiteralModal } from '../widget/modal/newPlainLiteralModal/newPlainLiteralModal';
import { NewResourceModal } from '../widget/modal/newResourceModal/newResourceModal';
import { NewResourceCfModal } from '../widget/modal/newResourceModal/newResourceCfModal';
import { NewSkosResourceCfModal } from '../widget/modal/newResourceModal/newSkosResourceCfModal';
import { NewTypedLiteralModal } from '../widget/modal/newTypedLiteralModal/newTypedLiteralModal';
import { PromptModal } from '../widget/modal/promptModal/promptModal';
import { PromptPrefixedModal } from '../widget/modal/promptModal/promptPrefixedModal';
import { SelectionModal } from '../widget/modal/selectionModal/selectionModal';
import { ResourceSelectionModal } from '../widget/modal/selectionModal/resourceSelectionModal';
import { CustomFormSelectionModal } from '../widget/modal/selectionModal/customFormSelectionModal';

//shared modals
import { PluginConfigModal } from "../widget/modal/pluginConfigModal/pluginConfigModal";

//browsing modals
import { ClassTreeModal } from '../widget/modal/browsingModal/classTreeModal/classTreeModal';
import { ClassIndividualTreeModal } from "../widget/modal/browsingModal/classIndividualTreeModal/classIndividualTreeModal";
import { ConceptTreeModal } from '../widget/modal/browsingModal/conceptTreeModal/conceptTreeModal';
import { InstanceListModal } from '../widget/modal/browsingModal/instanceListModal/instanceListModal';
import { PropertyTreeModal } from '../widget/modal/browsingModal/propertyTreeModal/propertyTreeModal';
import { SchemeListModal } from '../widget/modal/browsingModal/schemeListModal/schemeListModal';
import { CollectionTreeModal } from '../widget/modal/browsingModal/collectionTreeModal/collectionTreeModal';

//metadata modals
import { ImportOntologyModal } from '../config/dataManagement/metadata/importOntologyModal';
import { PrefixNamespaceModal } from '../config/dataManagement/metadata/prefixNamespaceModal';
import { ReplaceBaseURIModal } from '../config/dataManagement/metadata/replaceBaseURIModal';

//alignment modals
import { ValidationSettingsModal } from '../alignment/alignmentValidation/validationSettingsModal/validationSettingsModal';
import { ValidationReportModal } from '../alignment/alignmentValidation/validationReportModal/validationReportModal';
import { ResourceAlignmentModal } from '../alignment/resourceAlignment/resourceAlignmentModal';
import { BrowseExternalResourceModal } from '../alignment/resourceAlignment/browseExternalResourceModal';

//project config modal
import { RemoteAccessConfigModal } from "../project/createProject/remoteAccessConfigModal";
import { ProjectPropertiesModal } from "../project/projectPropertiesModal";
import { ProjectACLModal } from "../project/projectACL/projectACLModal";
import { ACLEditorModal } from "../project/projectACL/aclEditorModal";
import { ProjectListModal } from "../project/projectListModal";

//administration modal
import { UserProjBindingModal } from "../administration/administrationModals/userProjBindingModal";
import { CapabilityEditorModal } from "../administration/administrationModals/capabilityEditorModal";
import { ImportRoleModal } from "../administration/administrationModals/importRoleModal";

//export modals
import { FilterGraphsModal } from "../config/dataManagement/exportData/filterGraphsModal/filterGraphsModal";

//this is used only in newResource modals, if it will be useful elsewhere, it can be moved in sharedModule
import { EditableNsInput } from '../widget/modal/newResourceModal/editableNsInput';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule, TreeAndListModule, CustomFormModule],
    declarations: [
        AlertModal, ConfirmModal, ConfirmCheckModal, DownloadModal, FilePickerModal,
        NewPlainLiteralModal, NewResourceModal, NewResourceCfModal, NewSkosResourceCfModal, NewTypedLiteralModal,
        PromptModal, PromptPrefixedModal, SelectionModal, ResourceSelectionModal, CustomFormSelectionModal,
        ClassTreeModal, ClassIndividualTreeModal, ConceptTreeModal, InstanceListModal,
        PropertyTreeModal, SchemeListModal, CollectionTreeModal,
        ImportOntologyModal, PrefixNamespaceModal, ReplaceBaseURIModal,
        ValidationSettingsModal, ValidationReportModal, ResourceAlignmentModal, BrowseExternalResourceModal,
        RemoteAccessConfigModal, ProjectPropertiesModal, ProjectACLModal, ACLEditorModal, ProjectListModal,
        UserProjBindingModal, CapabilityEditorModal, ImportRoleModal,
        PluginConfigModal, FilterGraphsModal,
        EditableNsInput
    ],
    exports: [],
    providers: [ModalServices, BrowsingServices],
    //components never used outside the module (so not in exports array), but rendered (loaded) dynamically
    /**
     * (From ngModule FAQ https://angular.io/docs/ts/latest/cookbook/ngmodule-faq.html#!#q-what-not-to-export)
     * What should I not export?
     * Components that are only loaded dynamically by the router or by bootstrapping.
     * Such entry components can never be selected in another component's template.
     * There's no harm in exporting them but no benefit either. 
     */
    entryComponents: [
        AlertModal, ConfirmModal, ConfirmCheckModal, DownloadModal, FilePickerModal,
        NewPlainLiteralModal, NewResourceModal, NewResourceCfModal, NewSkosResourceCfModal, NewTypedLiteralModal,
        PromptModal, PromptPrefixedModal, SelectionModal, ResourceSelectionModal, CustomFormSelectionModal,
        ClassTreeModal, ClassIndividualTreeModal, ConceptTreeModal, InstanceListModal,
        PropertyTreeModal, SchemeListModal, CollectionTreeModal,
        ImportOntologyModal, PrefixNamespaceModal, ReplaceBaseURIModal,
        ValidationSettingsModal, ValidationReportModal, ResourceAlignmentModal, BrowseExternalResourceModal,
        RemoteAccessConfigModal, ProjectPropertiesModal, ProjectACLModal, ACLEditorModal, ProjectListModal,
        UserProjBindingModal, CapabilityEditorModal, ImportRoleModal,
        PluginConfigModal, FilterGraphsModal
    ]
})
export class VBModalModule { }