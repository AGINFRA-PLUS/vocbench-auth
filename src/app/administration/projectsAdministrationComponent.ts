import { Component } from "@angular/core";
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { OverlayConfig } from 'angular2-modal';

import { UserProjBindingModal, UserProjBindingModalData } from "./administrationModals/userProjBindingModal";

import { User, Role, ProjectUserBinding } from "../models/User";
import { Project } from "../models/Project";
import { ProjectServices } from "../services/projectServices";
import { UserServices } from "../services/userServices";
import { AdministrationServices } from "../services/administrationServices";


@Component({
    selector: "projects-admin-component",
    templateUrl: "./projectsAdministrationComponent.html",
    host: { class: "pageComponent" }
})
export class ProjectsAdministrationComponent {

    private projectList: Project[];
    private selectedProject: Project;

    private usersBound: User[]; //list of User bound to selected project 
    private selectedUser: User; //user selected in the list of bound users

    private puBinding: ProjectUserBinding; //binding between selectedProject and selectedUser
    private selectedUserRole: string; //selected role in the list of the roles assigned to selectedUser in the selectedProject

    private roleList: Role[]; //all available roles
    private selectedRole: Role; //role selected in roleList


    constructor(private projectService: ProjectServices, private userService: UserServices, private adminService: AdministrationServices,
        private modal: Modal) { }

    ngOnInit() {
        this.projectService.listProjects().subscribe(
            projects => {
                this.projectList = projects;
            }
        );
    }

    //==== PROJECT PANEL ====

    private selectProject(project: Project) {
        if (this.selectedProject != project) {
            this.selectedProject = project;
            this.userService.listUsersBoundToProject(this.selectedProject.getName()).subscribe(
                users => {
                    this.usersBound = users;
                    this.selectedUser = null;
                    this.puBinding = null;
                    this.selectedUserRole = null;
                }
            );
            this.adminService.listRoles(this.selectedProject).subscribe(
                roles => {
                    this.roleList = roles;
                }
            );
        }
    }

    //==== USER PANEL ====

    private selectUser(user: User) {
        this.selectedUser = user;
        this.adminService.getProjectUserBinding(this.selectedProject.getName(), this.selectedUser.getEmail()).subscribe(
            puBinding => {
                this.puBinding = puBinding;
                this.selectedUserRole = null;
            }
        );
    }

    private addUserToProject() {
        var modalData = new UserProjBindingModalData("Add user to " + this.selectedProject.getName(), this.usersBound);
        const builder = new BSModalContextBuilder<UserProjBindingModalData>(
            modalData, undefined, UserProjBindingModalData
        );
        let overlayConfig: OverlayConfig = { context: builder.keyboard(null).toJSON() };
        return this.modal.open(UserProjBindingModal, overlayConfig).then(
            dialog => dialog.result.then(
                data => {
                    var user: User = data.user;
                    var roles: string[] = data.roles;
                    this.adminService.addRolesToUser(this.selectedProject.getName(), user.getEmail(), roles).subscribe(
                        stResp => {
                            this.usersBound.push(user);
                        }
                    )
                },
                () => { }
            )
        );
    }

    private removeUserFromProject() {
        this.adminService.removeAllRolesFromUser(this.selectedProject.getName(), this.selectedUser.getEmail()).subscribe(
            stResp => {
                this.puBinding.addRole(this.selectedRole.getName());
                this.selectedRole = null;
            }
        );
    }

    //==== PROJECT-USER PROPERTIES PANEL ====

    private selectUserRole(role: string) {
        this.selectedUserRole = role;
    }

    private selectRole(role: Role) {
        if (!this.isRoleAlreadyAssigned(role)) {
            this.selectedRole = role;
        }
    }

    private addRole() {
        this.adminService.addRolesToUser(this.selectedProject.getName(), this.selectedUser.getEmail(), [this.selectedRole.getName()]).subscribe(
            stResp => {
                this.puBinding.addRole(this.selectedRole.getName());
                this.selectedRole = null;
            }
        );
    }

    private removeRole() {
        this.adminService.removeRoleFromUser(this.selectedProject.getName(), this.selectedUser.getEmail(), this.selectedUserRole).subscribe(
            stResp => {
                this.puBinding.removeRole(this.selectedUserRole);
                this.selectedUserRole = null;
            }
        );
    }

    /**
     * Return true if the given role is already assigned to the selectedUser in the selectedProject
     */
    private isRoleAlreadyAssigned(role: Role): boolean {
        if (this.puBinding == undefined) {
            return true;
        }
        var pubRoles: string[] = this.puBinding.getRoles();
        for (var i = 0; i < pubRoles.length; i++) {
            if (pubRoles[i] == role.getName()) {
                return true;
            }
        }
        return false;
    }

}