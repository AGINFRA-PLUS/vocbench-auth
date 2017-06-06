import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpManager } from "../utils/HttpManager";
import { ProjectUserBinding, Role } from "../models/User";
import { Project } from "../models/Project";

@Injectable()
export class AdministrationServices {

    private serviceName = "Administration";

    constructor(private httpMgr: HttpManager) { }

    // ADMINISTRATION CONFIGURATION SERVICES 

    /**
     * Gets the administration config: a map with key value of configuration parameters
     */
    getAdministrationConfig() {
        console.log("[AdministrationServices] getAdministrationConfig");
        return this.httpMgr.doGet(this.serviceName, "getAdministrationConfig", null, true);
    }

    /**
     * Updates the administration config parameters
	 * @param emailAdminAddress
	 * @param emailFromAddress
	 * @param emailFromPassword
	 * @param emailFromAlias
	 * @param emailFromHost
	 * @param emailFromPort
     */
    updateAdministrationConfig(emailAdminAddress: string, emailFromAddress: string, emailFromPassword: string,
        emailFromAlias: string, emailFromHost: string, emailFromPort: string) {
        console.log("[AdministrationServices] updateAdministrationConfig");
        var params: any = {
            emailAdminAddress: emailAdminAddress,
            emailFromAddress: emailFromAddress,
            emailFromPassword: emailFromPassword,
            emailFromAlias: emailFromAlias,
            emailFromHost: emailFromHost,
            emailFromPort: emailFromPort
        }
        return this.httpMgr.doPost(this.serviceName, "updateAdministrationConfig", params, true);
    }


    //PROJECT-USER BINDING SERVICES

    /**
     * Adds a role to a user in a project
     * @param projectName
     * @param email
     * @param role
     */
    getProjectUserBinding(projectName: string, email: string): Observable<ProjectUserBinding> {
        console.log("[AdministrationServices] getProjectUserBinding");
        var params: any = {
            projectName: projectName,
            email: email
        };
        return this.httpMgr.doGet(this.serviceName, "getProjectUserBinding", params, true).map(
            stResp => {
                return new ProjectUserBinding(stResp.projectName, stResp.userEmail, stResp.roles);
            }
        );
    }

    /**
     * Assigns roles to a user in a project
     * @param projectName
     * @param email
     * @param roles
     */
    addRolesToUser(projectName: string, email: string, roles: string[]) {
        console.log("[AdministrationServices] addRolesToUser");
        var params: any = {
            projectName: projectName,
            email: email,
            roles: roles
        };
        return this.httpMgr.doGet(this.serviceName, "addRolesToUser", params, true);
    }

    /**
     * Removes a role to a user in a project
     * @param projectName
     * @param email
     * @param role
     */
    removeRoleFromUser(projectName: string, email: string, role: string) {
        console.log("[AdministrationServices] removeRoleFromUser");
        var params: any = {
            projectName: projectName,
            email: email,
            role: role
        };
        return this.httpMgr.doGet(this.serviceName, "removeRoleFromUser", params, true);
    }

    /**
     * Removes a role to a user in a project
     * @param projectName
     * @param email
     * @param role
     */
    removeAllRolesFromUser(projectName: string, email: string) {
        console.log("[AdministrationServices] removeAllRolesFromUser");
        var params: any = {
            projectName: projectName,
            email: email
        };
        return this.httpMgr.doGet(this.serviceName, "removeAllRolesFromUser", params, true);
    }

    //ROLES

    /**
     * Returns all the available roles for the given project
     * @param projectName if not provided returns the roles at system level
     */
    listRoles(project?: Project): Observable<Role[]> {
        console.log("[AdministrationServices] listRoles");
        var params: any = {};
        if (project != null) {
            params.projectName = project.getName();
        }
        return this.httpMgr.doGet(this.serviceName, "listRoles", params, true).map(
            stResp => {
                var roles: Role[] = [];
                for (var i = 0; i < stResp.length; i++) {
                    let roleJson = stResp[i];
                    var role = new Role(roleJson.name, roleJson.level);
                    roles.push(role);
                }
                return roles;
            }
        );
    }

    /**
     * Creates a role with the given name
     * @param roleName
     */
    createRole(roleName: string) {
        console.log("[AdministrationServices] createRole");
        var params: any = {
            roleName: roleName
        };
        return this.httpMgr.doGet(this.serviceName, "createRole", params, true);
    }

    /**
     * Deletes the role with the given name
     * @param roleName
     */
    deleteRole(roleName: string) {
        console.log("[AdministrationServices] deleteRole");
        var params: any = {
            roleName: roleName
        };
        return this.httpMgr.doGet(this.serviceName, "deleteRole", params, true);
    }

    /**
     * Exports the role with the given name
     * @param roleName 
     */
    exportRole(roleName: string) {
        console.log("[AdministrationServices] exportRole");
        var params: any = {
            roleName: roleName
        };
        return this.httpMgr.downloadFile(this.serviceName, "exportRole", params);
    }

    /**
     * Imports a role
     * @param inputFile file of the role to import 
     * @param newRoleName name of the new role (Optional, if not provided the name will be inferred from the input file)
     */
    importRole(inputFile: File, newRoleName?: string) {
        console.log("[AdministrationServices] importCustomForm");
        var data: any = {
            inputFile: inputFile
        };
        if (newRoleName != null) {
            data.newRoleName = newRoleName;
        }
        return this.httpMgr.uploadFile(this.serviceName, "importRole", data, true);
    }

    /**
     * Returns all the capabilities of the given role in the given project
     * @param projectName if not provided returns the roles at system level
     */
    listCapabilities(role: Role, project?: Project): Observable<string[]> {
        console.log("[AdministrationServices] listCapabilities");
        var params: any = {
            role: role.getName()
        };
        if (project != null) {
            params.projectName = project.getName();
        }
        return this.httpMgr.doGet(this.serviceName, "listCapabilities", params, true);
    }

    /**
     * Adds a capability to the given role
     * @param role name of the role
     * @param capability
     */
    addCapabilityToRole(role: string, capability: string) {
        console.log("[AdministrationServices] addCapabilityToRole");
        var params: any = {
            role: role,
            capability: capability
        };
        return this.httpMgr.doPost(this.serviceName, "addCapabilityToRole", params, true);
    }

    /**
     * Removes a capability from the given role
     * @param role name of the role
     * @param capability
     */
    removeCapabilityFromRole(role: string, capability: string) {
        console.log("[AdministrationServices] removeCapabilityFromRole");
        var params: any = {
            role: role,
            capability: capability
        };
        return this.httpMgr.doGet(this.serviceName, "removeCapabilityFromRole", params, true);
    }

    /**
     * Removes a capability from the given role
     * @param role name of the role
     * @param capability
     */
    updateCapabilityForRole(role: string, oldCapability: string, newCapability: string) {
        console.log("[AdministrationServices] updateCapabilityForRole");
        var params: any = {
            role: role,
            oldCapability: oldCapability,
            newCapability: newCapability
        };
        return this.httpMgr.doPost(this.serviceName, "updateCapabilityForRole", params, true);
    }

}