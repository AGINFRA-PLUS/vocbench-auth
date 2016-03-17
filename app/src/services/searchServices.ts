import {Injectable} from 'angular2/core';
import {HttpManager} from "../utils/HttpManager";
import {Deserializer} from "../utils/Deserializer";
import {ARTURIResource} from "../utils/ARTResources";

@Injectable()
export class SearchServices {

    private serviceName = "Search";
    private oldTypeService = false;
    
    constructor(private httpMgr: HttpManager, private deserializer: Deserializer) { }

    /**
     * Searches a resource in the model
     * @param searchString the string to search
     * @param rolesArray available roles: "concept", "cls", "property", "individual"
     * @param useLocalName tells if the searched string should be searched in the local name (as well as in labels)
     * @param searchMode available searchMode values: "contain", "start", "end", "exact"
     * @param scheme scheme to which the concept should belong (optional and used only if rolesArray contains "concept")
     */
    searchResource(searchString: string, rolesArray: string[], useLocalName: boolean, searchMode: string, scheme?: string) {
        console.log("[SearchServices] searchResource");
        var params: any = {
            searchString: searchString,
            rolesArray: rolesArray,
            useLocalName: useLocalName,
            searchMode: searchMode,
        };
        if (scheme != undefined) {
            params.scheme = scheme;
        }
        return this.httpMgr.doGet(this.serviceName, "searchResource", params, this.oldTypeService).map(
            stResp => {
                return this.deserializer.createURIArray(stResp);
            }
        );
    }
    
    /**
     * Returns the shortest path from a root to the given resource
     * @param resource
     * @string role role of the given resource, available roles: "concept", "cls", "property"
     * @scheme scheme where all the resource of the path should belong (optional and used only for concept)
     */
    getPathFromRoot(resource: ARTURIResource, role: string, scheme?: ARTURIResource) {
        console.log("[SearchServices] getPathFromRoot");
        var params: any = {
            role: role,
            resourceURI: resource.getURI()
        };
        if (scheme != undefined) {
            params.scheme = scheme.getURI();
        }
        return this.httpMgr.doGet(this.serviceName, "getPathFromRoot", params, this.oldTypeService).map(
            stResp => {
                var path = new Array<ARTURIResource>();
                var pathColl = stResp.getElementsByTagName("path");
                var shortestPathLength = 99999;
                var shortestPathElem;
                for (var i = 0; i < pathColl.length; i++) { //retrieve shortest path
                    var pathLength = pathColl[i].getAttribute("length");
                    if (pathLength < shortestPathLength) {
                        shortestPathElem = pathColl[i];
                        shortestPathLength = pathLength;
                    }
                }
                path = this.deserializer.createURIArray(shortestPathElem);
                return path;
            }
        );
    }

}