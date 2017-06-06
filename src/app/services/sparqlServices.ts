import { Injectable } from '@angular/core';
import { HttpManager } from "../utils/HttpManager";
import { ARTURIResource } from "../models/ARTResources";

@Injectable()
export class SparqlServices {

    private serviceName = "SPARQL";

    constructor(private httpMgr: HttpManager) { }

    /**
     * @param query 
     * @param includeInferred indicates whether inferred statements should be included in the evaluation of the query. Default true
     * @param ql the query language (default 'SPARQL')
     * @param bindings variable to value bindings. Json map object { key1: value1, key2: value2 } where values are ARTResource(s)
     * @param maxExecTime maximum execution time measured in seconds (a zero or negative value indicates an unlimited execution time)
     * @param defaultGraphs the graphs that constitute the default graph. The default value is the empty set.
     * @param namedGraphs the graphs that constitute the set of named graphs.
     */
    evaluateQuery(query: string, includeInferred?: boolean, ql?: "SPARQL" | "SERQL", bindings?: any, maxExecTime?: number,
            defaultGraphs?: ARTURIResource[], namedGraphs?: ARTURIResource[]) {
        console.log("[SparqlServices] evaluateQuery");
        var params: any = {
            query: query,
        };
        if (includeInferred != null) {
            params.includeInferred = includeInferred;
        }
        if (ql != null) {
            params.ql = ql;
        }
        if (bindings != null) {
            params.bindings = bindings;
        }
        if (maxExecTime != null) {
            params.maxExecTime = maxExecTime;
        }
        if (defaultGraphs != null) {
            params.defaultGraphs = defaultGraphs;
        }
        if (namedGraphs != null) {
            params.namedGraphs = namedGraphs;
        }
        return this.httpMgr.doPost(this.serviceName, "evaluateQuery", params, true);
    }

    /**
     * 
     * @param query 
     * @param includeInferred indicates whether inferred statements should be included in the evaluation of the query. Default true
     * @param ql the query language (default 'SPARQL')
     * @param bindings variable to value bindings. Json map object { key1: value1, key2: value2 } where values are ARTResource(s)
     * @param maxExecTime maximum execution time measured in seconds (a zero or negative value indicates an unlimited execution time)
     * @param defaultGraphs the graphs that constitute the default graph. The default value is the empty set.
     * @param namedGraphs the graphs that constitute the set of named graphs.
     * @param defaultInsertGraph the default insert graph to be used.
     * @param defaultRemoveGraphs the default remove graphs.
     */
    executeUpdate(query: string, includeInferred?: boolean, ql?: "SPARQL" | "SERQL", bindings?: any, maxExecTime?: number,
            defaultGraphs?: ARTURIResource[], namedGraphs?: ARTURIResource[], 
            defaultInsertGraph?: ARTURIResource, defaultRemoveGraphs?: ARTURIResource[]) {
        console.log("[SparqlServices] executeUpdate");
        var params: any = {
            query: query,
        };
        if (includeInferred != null) {
            params.includeInferred = includeInferred;
        }
        if (ql != null) {
            params.ql = ql;
        }
        if (bindings != null) {
            params.bindings = bindings;
        }
        if (maxExecTime != null) {
            params.maxExecTime = maxExecTime;
        }
        if (defaultGraphs != null) {
            params.defaultGraphs = defaultGraphs;
        }
        if (namedGraphs != null) {
            params.namedGraphs = namedGraphs;
        }
        if (defaultInsertGraph != null) {
            params.defaultInsertGraph = defaultInsertGraph;
        }
        if (defaultRemoveGraphs != null) {
            params.defaultRemoveGraphs = defaultRemoveGraphs;
        }
        return this.httpMgr.doPost(this.serviceName, "executeUpdate", params, true);
    }

}