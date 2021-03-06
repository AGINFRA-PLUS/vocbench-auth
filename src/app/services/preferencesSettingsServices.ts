import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ARTURIResource } from "../models/ARTResources";
import { Project } from "../models/Project";
import { Deserializer } from "../utils/Deserializer";
import { HttpManager } from "../utils/HttpManager";

@Injectable()
export class PreferencesSettingsServices {

    private serviceName = "PreferencesSettings";

    constructor(private httpMgr: HttpManager) { }

    /**
     * Sets the rendering languages preference
     * @param languages list of languages, list with just one element "*" in order to set "all languages"
     * @param level tells at which level to set the property
     */
    setLanguages(languages: string[]) {
        console.log("[PreferencesServices] setLanguages");
        var params = {
            languages: languages
        };
        return this.httpMgr.doPost(this.serviceName, "setLanguages", params);
    }

    /**
     * Sets the show_flag preference
     * @param show 
     */
    setShowFlags(show: boolean) {
        console.log("[PreferencesServices] setShowFlags");
        var params = {
            show: show
        };
        return this.httpMgr.doPost(this.serviceName, "setShowFlags", params);
    }

    /**
     * Sets the show_instances_number preference
     * @param show 
     */
    setShowInstancesNumb(show: boolean) {
        console.log("[PreferencesServices] setShowInstancesNumb");
        var params = {
            show: show
        };
        return this.httpMgr.doPost(this.serviceName, "setShowInstancesNumb", params);
    }

    /**
     * Sets the default active skos concept schemes
     * @param scheme s
     */
    setActiveSchemes(schemes?: ARTURIResource[]) {
        console.log("[PreferencesServices] setActiveSchemes");
        var params: any = {}
        if (schemes != null) {
            params.schemes = schemes;
        }
        return this.httpMgr.doPost(this.serviceName, "setActiveSchemes", params);
    }

    /**
     * 
     * @param themeId 
     */
    setProjectTheme(themeId: number) {
        console.log("[PreferencesServices] setProjectTheme");
        var params: any = {
            themeId: themeId
        }
        return this.httpMgr.doPost(this.serviceName, "setProjectTheme", params);
    }

    /**
     * Returns the active schemes for the given project
     * @param projectName 
     */
    getActiveSchemes(projectName: string): Observable<ARTURIResource[]> {
        console.log("[PreferencesServices] getActiveSchemes");
        var params: any = {
            projectName: projectName
        }
        return this.httpMgr.doGet(this.serviceName, "getActiveSchemes", params).map(
            stResp => {
                if (stResp == null) {
                    return null;
                } else {
                    return Deserializer.createURIArray(stResp);
                }
            }
        );
    }

    /**
     * Gets the preferences of the currently logged user for the currently open project
     */
    getPUSettings(properties: string[], pluginID?: string) {
        console.log("[PreferencesServices] getPUSettings");
        var params: any = {
            properties: properties
        };
        if (pluginID != null) {
            params.pluginID = pluginID
        }
        return this.httpMgr.doGet(this.serviceName, "getPUSettings", params);
    }

    /**
     * 
     * @param property 
     * @param value 
     */
    setPUSetting(property: string, value?: string, pluginID?: string) {
        console.log("[PreferencesServices] setPUSetting");
        var params: any = {
            property: property,
        };
        if (value != null) {
            params.value = value;
        }
        if (pluginID != null) {
            params.pluginID = pluginID
        }
        return this.httpMgr.doPost(this.serviceName, "setPUSetting", params);
    }

    /**
     * Gets the preferences of the currently logged user for the currently open project
     */
    getPGSettings(properties: string[], groupIri: ARTURIResource, project?: Project, pluginID?: string) {
        console.log("[PreferencesServices] getPGSettings");
        var params: any = {
            properties: properties,
            groupIri: groupIri
        };
        if (project != null) {
            params.projectName = project.getName();
        }
        if (pluginID != null) {
            params.pluginID = pluginID
        }
        return this.httpMgr.doGet(this.serviceName, "getPGSettings", params);
    }

    /**
     * 
     * @param property 
     * @param value 
     */
    setPGSetting(property: string, groupIri: ARTURIResource, value?: string, project?: Project, pluginID?: string) {
        console.log("[PreferencesServices] setPGSetting");
        var params: any = {
            property: property,
            groupIri: groupIri
        };
        if (value != null) {
            params.value = value;
        }
        if (project != null) {
            params.projectName = project.getName();
        }
        if (pluginID != null) {
            params.pluginID = pluginID
        }
        return this.httpMgr.doPost(this.serviceName, "setPGSetting", params);
    }

    /**
     * Gets the settings for the currently open project
     * @param properties 
     * @param project 
     */
    getProjectSettings(properties: string[], project?: Project) {
        console.log("[PreferencesServices] getProjectSettings");
        var params: any = {
            properties: properties
        };
        if (project != null) {
            params.projectName = project.getName();
        }
        return this.httpMgr.doGet(this.serviceName, "getProjectSettings", params);
    }

    /**
     * @param property 
     * @param project 
     */
    setProjectSetting(property: string, value?: string, project?: Project) {
        console.log("[PreferencesServices] setProjectSetting");
        var params: any = {
            property: property,
        };
        if (value != null) {
            params.value = value;
        }
        if (project != null) {
            params.projectName = project.getName();
        }
        return this.httpMgr.doPost(this.serviceName, "setProjectSetting", params);
    }

    /**
     * Gets the default project settings
     * @param properties 
     */
    getDefaultProjectSettings(properties: string[]) {
        console.log("[PreferencesServices] getDefaultProjectSettings");
        var params = {
            properties: properties
        };
        return this.httpMgr.doGet(this.serviceName, "getDefaultProjectSettings", params);
    }

    /**
     * Gets the project settings needed during system startup
     */
    getStartupSystemSettings() {
        console.log("[PreferencesServices] getStartupSystemSettings");
        var params = {};
        return this.httpMgr.doGet(this.serviceName, "getStartupSystemSettings", params);
    }

    /**
     * 
     * @param property 
     * @param value 
     */
    setSystemSetting(property: string, value?: string) {
        console.log("[PreferencesServices] setSystemSetting");
        var params: any = {
            property: property,
        };
        if (value != null) {
            params.value = value;
        }
        return this.httpMgr.doPost(this.serviceName, "setSystemSetting", params);
    }

    /**
     * 
     * @param properties 
     */
    getSystemSettings(properties: string[]) {
        console.log("[PreferencesServices] getSystemSettings");
        var params = {
            properties: properties
        };
        return this.httpMgr.doGet(this.serviceName, "getSystemSettings", params);
    }

}