import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Configuration, ConfigurationManager, Reference } from '../models/Configuration';
import { HttpManager } from "../utils/HttpManager";

@Injectable()
export class ConfigurationsServices {

    private serviceName = "Configurations";

    constructor(private httpMgr: HttpManager) { }

    getConfigurationManager(componentID: string): Observable<ConfigurationManager> {
        console.log("[ConfigurationsServices] getConfigurationManager");
        var params = {
            componentID: componentID
        };
        return this.httpMgr.doGet(this.serviceName, "getConfigurationManager", params);
    }

    getConfigurationManagers(): Observable<ConfigurationManager[]> {
        console.log("[ConfigurationsServices] getConfigurationManagers");
        var params = {};
        return this.httpMgr.doGet(this.serviceName, "getConfigurationManagers", params);
    }

    getConfiguration(componentID: string, relativeReference: string): Observable<Configuration> {
        console.log("[ConfigurationsServices] getConfiguration");
        var params = {
            componentID: componentID,
            relativeReference: relativeReference
        };
        return this.httpMgr.doGet(this.serviceName, "getConfiguration", params).map(
            stResp => {
                return Configuration.parse(stResp);
            }
        );
    }

    getConfigurationReferences(componentID: string): Observable<Reference[]> {
        console.log("[ConfigurationsServices] getConfiguration");
        var params = {
            componentID: componentID,
        };
        return this.httpMgr.doGet(this.serviceName, "getConfigurationReferences", params).map(
            stResp => {
                let references: Reference[] = [];
                for (var i = 0; i < stResp.length; i++) {
                    references.push(Reference.deserialize(stResp[i]));
                }
                return references;
            }
        );
    }

    storeConfiguration(componentID: string, relativeReference: string, configuration: { [key: string]: any }) {
        console.log("[ConfigurationsServices] storeConfiguration");
        var params = {
            componentID: componentID,
            relativeReference: relativeReference,
            configuration: JSON.stringify(configuration)
        };
        return this.httpMgr.doPost(this.serviceName, "storeConfiguration", params);
    }

    deleteConfiguration(componentID: string, relativeReference: string) {
        console.log("[ConfigurationsServices] deleteConfiguration");
        var params = {
            componentID: componentID,
            relativeReference: relativeReference
        };
        return this.httpMgr.doPost(this.serviceName, "deleteConfiguration", params);
    }

}