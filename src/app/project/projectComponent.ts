import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { OverlayConfig } from 'angular2-modal';
import { ProjectPropertiesModal, ProjectPropertiesModalData } from "./projectPropertiesModal";
import { ProjectACLModal } from "./projectACL/projectACLModal";
import { ProjectServices } from "../services/projectServices";
import { MetadataServices } from "../services/metadataServices";
import { VBContext } from '../utils/VBContext';
import { VBPreferences } from '../utils/VBPreferences';
import { UIUtils } from "../utils/UIUtils";
import { Project, ProjectTypesEnum } from '../models/Project';
import { BasicModalServices } from "../widget/modal/basicModal/basicModalServices";

@Component({
    selector: "project-component",
    templateUrl: "./projectComponent.html",
    host: { class: "pageComponent" }
})
export class ProjectComponent implements OnInit {
    private projectList: Project[];
    private selectedProject: Project; //project selected in the list

    constructor(private projectService: ProjectServices, private metadataService: MetadataServices,
        private preferences: VBPreferences, private router: Router, private basicModals: BasicModalServices, private modal: Modal) {
    }

    ngOnInit() {
        this.projectService.listProjects().subscribe(
            projectList => {
                this.projectList = projectList;
            }
        );
    }

    private selectProject(project: Project) {
        if (this.selectedProject == project) {
            this.selectedProject = null;
        } else {
            this.selectedProject = project;
        }
    }

    private accessProject(projectName: string) {
        var workingProj = VBContext.getWorkingProject();
        if (workingProj == undefined || workingProj.getName() != projectName) {
            this.openProject(this.getProjectObjectFromName(projectName));
        }
    }

    /**
     * Redirects to the import project page
     */
    private createProject() {
        this.router.navigate(["/Projects/CreateProject"]);
    }

    private deleteProject() {
        if (this.selectedProject.isOpen()) {
            this.basicModals.alert("Delete project", this.selectedProject.getName() +
                " is currently open. Please, close the project and then retry.", "warning");
            return;
        } else {
            this.basicModals.confirm("Delete project", "Attention, this operation will delete the project " +
                this.selectedProject.getName() + ". Are you sure to proceed?", "warning").then(
                result => {
                    this.projectService.deleteProject(this.selectedProject).subscribe(
                        stResp => {
                            for (var i = 0; i < this.projectList.length; i++) { //remove project from list
                                if (this.projectList[i].getName() == this.selectedProject.getName()) {
                                    this.projectList.splice(i, 1);
                                }
                            }
                            this.selectedProject = null;
                        }
                    );
                },
                () => { }
            );
        }
    }

    /**
     * Redirects to the import project page
     */
    private importProject() {
        this.router.navigate(["/Projects/ImportProject"]);
    }

    /**
     * Exports current selected project (only if it's open) as a zip archive
     */
    private exportProject() {
        if (!this.selectedProject.isOpen()) {
            this.basicModals.alert("Export project", "You can export only open projects", "error");
            return;
        }
        this.projectService.exportProject(this.selectedProject).subscribe(
            blob => {
                var exportLink = window.URL.createObjectURL(blob);
                this.basicModals.downloadLink("Export project", null, exportLink, "export.zip");
            }
        );
    }

    private openOrCloseProject(project: Project) {
        if (project.isOpen()) {
            this.closeProject(project);
        } else {
            this.openProject(project);
        }
    }

    private openProject(project: Project) {
        UIUtils.startLoadingDiv(UIUtils.blockDivFullScreen);
        this.projectService.accessProject(project).subscribe(
            stResp => {
                VBContext.setWorkingProject(project);
                VBContext.setProjectChanged(true);
                project.setOpen(true);
                UIUtils.stopLoadingDiv(UIUtils.blockDivFullScreen);
                //init the project preferences for the project
                this.preferences.initUserProjectPreferences().subscribe();
                //get default namespace of the project and set it to the vbContext
                this.metadataService.getNamespaceMappings().subscribe(
                    mappings => {
                        VBContext.setPrefixMappings(mappings);
                    }
                )
            }
        );
    }

    private closeProject(project: Project) {
        if (project.getType() == ProjectTypesEnum.saveToStore) {
            //if closing project is non-persistent ask to save
            this.basicModals.confirm("Save project", "You're closing a non-persistent project " + project.getName()
                + ". Do you want to save changes?", "warning").then(
                confirm => {//save then disconnect
                    this.projectService.saveProject(project).subscribe(
                        stResp => {
                            this.disconnectFromProject(project);
                        }
                    );
                },
                () => {//disconnect without saving
                    this.disconnectFromProject(project);
                }
                );
        } else {//persistent project => just disconnect
            this.disconnectFromProject(project);
        }
    }

    /**
     * Calls the proper service in order to disconnect from the given project.
     * Returns an observable so I can disconnect and connect to a new project in synchronous way
     */
    private disconnectFromProject(project: Project) {
        UIUtils.startLoadingDiv(UIUtils.blockDivFullScreen);
        this.projectService.disconnectFromProject(project).subscribe(
            stResp => {
                project.setOpen(false);
                UIUtils.stopLoadingDiv(UIUtils.blockDivFullScreen);
            }
        );
    }

    private saveProject(project: Project) {
        UIUtils.startLoadingDiv(UIUtils.blockDivFullScreen);
        this.projectService.saveProject(project).subscribe(
            stResp => {
                UIUtils.stopLoadingDiv(UIUtils.blockDivFullScreen);
                this.basicModals.alert("Save project", "Project " + project.getName() + " saved successfully");
            }
        );
    }

    /**
     * Opens a modal to show the properties of the selected project
     */
    private openPropertyModal() {
        var modalData = new ProjectPropertiesModalData(this.selectedProject);
        const builder = new BSModalContextBuilder<ProjectPropertiesModalData>(
            modalData, undefined, ProjectPropertiesModalData
        );
        builder.size("lg").keyboard(null);
        let overlayConfig: OverlayConfig = { context: builder.toJSON() };
        return this.modal.open(ProjectPropertiesModal, overlayConfig).then(
            dialog => dialog.result
        );
    }

    private openACLModal() {
        const builder = new BSModalContextBuilder<any>();
        let overlayConfig: OverlayConfig = { context: builder.keyboard(null).size('lg').toJSON() };
        return this.modal.open(ProjectACLModal, overlayConfig);
    }

    /**
     * Useful to set as selected the radio button of the working project
     */
    private isWorkingProject(projectName: string): boolean {
        var workingProj = VBContext.getWorkingProject();
        return (workingProj != undefined && workingProj.getName() == projectName);
    }

    /**
     * Useful to enable/disable the "Close all projects" button
     */
    private existOpenProject(): boolean {
        var foundOpen = false;
        for (var i = 0; i < this.projectList.length; i++) {
            if (this.projectList[i].isOpen()) {
                foundOpen = true;
                break;
            }
        }
        return foundOpen;
    }

    private getProjectObjectFromName(projectName: string): Project {
        return this.projectList.find(proj => proj.getName() == projectName);
    }

}