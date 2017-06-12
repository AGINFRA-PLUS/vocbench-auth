import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpManager } from "../utils/HttpManager";
import { Deserializer } from "../utils/Deserializer";
import { ARTURIResource } from "../models/ARTResources";

@Injectable()
export class SearchServices {

    private serviceName = "Search";

    constructor(private httpMgr: HttpManager) { }

    /**
     * Searches a resource in the model
     * @param searchString the string to search
     * @param rolesArray available roles: "concept", "cls", "property", "individual"
     * @param useLocalName tells if the searched string should be searched in the local name (as well as in labels)
     * @param useURI tells if the searched string should be searched in the entire URI (as well as in labels)
     * @param searchMode available searchMode values: "contain", "start", "end", "exact"
     * @param lang if provided tells in which language render the show of the results (only for concepts and schemes)
     * @param schemes scheme to which the concept should belong (optional and used only if rolesArray contains "concept")
     * @return an array of resources
     */
    searchResource(searchString: string, rolesArray: string[], useLocalName: boolean, useURI: boolean,
        searchMode: string, lang?: string, schemes?: ARTURIResource[]): Observable<ARTURIResource[]> {
        console.log("[SearchServices] searchResource");
        var params: any = {
            searchString: searchString,
            rolesArray: rolesArray,
            useLocalName: useLocalName,
            useURI: useURI,
            searchMode: searchMode,
        };
        if (lang != undefined) {
            params.lang = lang;
        }
        if (schemes != undefined) {
            params.scheme = schemes;
        }
        return this.httpMgr.doGet(this.serviceName, "searchResource", params, true).map(
            stResp => {
                return Deserializer.createURIArray(stResp);
            }
        );
    }

    /**
     * Searches a resource in the model
     * @param cls class to which the searched instance should belong
     * @param searchString the string to search
     * @param useLocalName tells if the searched string should be searched in the local name (as well as in labels)
     * @param useURI tells if the searched string should be searched in the entire URI (as well as in labels)
     * @param searchMode available searchMode values: "contain", "start", "end", "exact"
     * @param lang if provided tells in which language render the show of the results (only for concepts and schemes)
     * @return an array of resources
     */
    searchInstancesOfClass(cls: ARTURIResource, searchString: string, useLocalName: boolean, useURI: boolean,
        searchMode: string, lang?: string): Observable<ARTURIResource[]> {
        console.log("[SearchServices] searchInstancesOfClass");
        var params: any = {
            cls: cls,
            searchString: searchString,
            useLocalName: useLocalName,
            useURI: useURI,
            searchMode: searchMode,
        };
        if (lang != undefined) {
            params.lang = lang;
        }
        return this.httpMgr.doGet(this.serviceName, "searchInstancesOfClass", params, true).map(
            stResp => {
                return Deserializer.createURIArray(stResp);
            }
        );
    }

    /**
     * Returns the shortest path from a root to the given resource
     * @param resource
     * @param role role of the given resource, available roles: "concept", "cls", "property"
     * @param schemes where all the resource of the path should belong (optional and used only for concept)
     * @return an array of resources
     */
    getPathFromRoot(resource: ARTURIResource, role: string, schemes?: ARTURIResource[]) {
        console.log("[SearchServices] getPathFromRoot");
        var params: any = {
            role: role,
            resourceURI: resource
        };
        if (schemes != undefined) {
            params.schemesIRI = schemes;
        }
        return this.httpMgr.doGet(this.serviceName, "getPathFromRoot", params, true).map(
            stResp => {
                return Deserializer.createURIArray(stResp);
            }
        );
    }

}