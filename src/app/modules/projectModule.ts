import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './sharedModule';

import { ProjectComponent } from "../project/projectComponent";
import { CreateProjectComponent } from "../project/createProject/createProjectComponent";

//modals
import { ProjectPropertiesModal } from "../project/projectPropertiesModal";
import { ProjectACLModal } from "../project/projectACL/projectACLModal";
import { ACLEditorModal } from "../project/projectACL/aclEditorModal";
import { ProjectTableConfigModal } from "../project/projectTableConfig/projectTableConfigModal";
import { ProjectListModal } from "../project/projectListModal";
import { RemoteRepoModal } from "../project/remoteRepoModal";


@NgModule({
    imports: [CommonModule, FormsModule, SharedModule],
    declarations: [
        ProjectComponent, CreateProjectComponent,
        //modals
        ProjectPropertiesModal, ProjectACLModal, ACLEditorModal, ProjectTableConfigModal, ProjectListModal, RemoteRepoModal
    ],
    exports: [ProjectComponent],
    providers: [],
    entryComponents: [ProjectPropertiesModal, ProjectACLModal, ACLEditorModal, ProjectTableConfigModal, ProjectListModal, RemoteRepoModal]
})
export class ProjectModule { }