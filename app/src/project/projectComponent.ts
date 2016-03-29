import {Component, OnInit, OnDestroy} from "angular2/core";
import {Router} from 'angular2/router';
import {ProjectServices} from "../services/projectServices";
import {VocbenchCtx} from '../utils/VocbenchCtx';
import {Project} from '../utils/Project';
import {ModalServices} from "../widget/modal/modalServices";

@Component({
    selector: "project-component",
    templateUrl: "app/src/project/projectComponent.html",
    providers: [ProjectServices],
    host: { class : "pageComponent" }
})
export class ProjectComponent implements OnInit {
    private projectList: Project[];
    private currentProject: Project; //project currently open
    private selectedProject: Project; //project selected in the list
    
    private exportLink: string;

    constructor(private projectService: ProjectServices, private vbCtx: VocbenchCtx, private router: Router,
        private modalService: ModalServices) {}

    ngOnInit() {
        this.projectService.listProjects().subscribe(
            projectList => {
                this.projectList = projectList;
                //Init closing potential multiple open projects. If just one, connect to it.
                var ctxProject = this.vbCtx.getProject();
                var openProjectList: Project[] = [];
                if (ctxProject == undefined) { //no project in context (first start or all projects are closed)
                    for (var i = 0; i < this.projectList.length; i++) { //collect projects remained open (in case of first start)
                        if (this.projectList[i].isOpen()) {
                            openProjectList.push(this.projectList[i]);
                        }
                    }
                    if (openProjectList.length == 1) { //just one open project => connect to it
                        this.connectToProject(openProjectList[0]);
                    } else if (openProjectList.length > 1) { //multiple open projects
                        for (var i = 0; i < openProjectList.length; i++) { //close all open projects
                            this.disconnectFromProject(openProjectList[i]);
                        }
                    }
                }
            },
            err => { }
        );
    }

    private selectProject(project) {
        this.selectedProject = project;
    }

    private isSelected(project) {
        return this.selectedProject == project;
    }
    
    /**
     * Redirects to the import project page
     */
    private createProject() {
        this.router.navigate(["CreateProject"]);
    }

    private deleteProject() {
        if (this.selectedProject.isOpen()) {
            this.modalService.alert("Delete project", this.selectedProject.getName() + 
                    " is currently open. Please, close the project and then retry.", "warning");
            return;
        } else {
            this.modalService.confirm("Delete project", "Attention, this operation will delete the project " +
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
                        },
                        err => { }
                    );
                }
            );
        }
    }
    
    /**
     * Redirects to the import project page
     */
    private importProject() {
        this.router.navigate(["ImportProject"]);
    }
    
    /**
     * Exports current selected project (only if it's open) as a zip archive
     */
    private exportProject() {
        if (!this.selectedProject.isOpen()) {
            this.modalService.alert("Export project", "You can export only open projects", "error");
            return;
        }
        this.projectService.exportProject(this.selectedProject).subscribe(
            stResp => {
                var data = new Blob([stResp], {type: "octet/stream"});
                this.exportLink = window.URL.createObjectURL(data);
            },
            err => { }
        );
    }

    private openProject(project: Project) {
        var ctxProject = this.vbCtx.getProject();
        if (ctxProject != undefined) { //a project is already open
            //first disconnect from old project
            //(don't call this.closeProject cause I need to execute connectToProject in syncronous way)
            document.getElementById("blockDivFullScreen").style.display = "block";
            this.projectService.disconnectFromProject(ctxProject).subscribe(
                stResp => {
                    document.getElementById("blockDivFullScreen").style.display = "none";
                    this.getProjectFromList(ctxProject.getName()).setOpen(false); //set as close the previous open project
                    this.vbCtx.setProject(undefined);
                    this.vbCtx.removeScheme();
                    //then connect to the new one
                    this.connectToProject(project);
                },
                err => {
                    document.getElementById("blockDivFullScreen").style.display = "none";
                });
        } else { //no project open
            this.connectToProject(project);
        }
    }

    private closeProject(project: Project) {
        this.disconnectFromProject(project);
    }
    
    private connectToProject(project: Project) {
        document.getElementById("blockDivFullScreen").style.display = "block";
        this.projectService.accessProject(project).subscribe(
            stResp => {
                this.vbCtx.setProject(project);
                project.setOpen(true);
            },
            err => { },
            () => document.getElementById("blockDivFullScreen").style.display = "none");
    }

    private disconnectFromProject(project: Project) {
        document.getElementById("blockDivFullScreen").style.display = "block";
        this.projectService.disconnectFromProject(project).subscribe(
            stResp => {
                this.vbCtx.setProject(undefined);
                this.vbCtx.removeScheme();
                project.setOpen(false);
            },
            err => { },
            () => document.getElementById("blockDivFullScreen").style.display = "none");
    }
    
    // get the project from projectList with the given name
    private getProjectFromList(projName): Project {
        for (var i = 0; i < this.projectList.length; i++) {
            if (this.projectList[i].getName() == projName) {
                return this.projectList[i];
            }
        }
    }

}