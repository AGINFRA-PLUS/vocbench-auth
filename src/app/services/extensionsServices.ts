import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpManager, VBRequestOptions } from "../utils/HttpManager";
import { Scope, ExtensionFactory, Settings, ConfigurableExtensionFactory, NonConfigurableExtensionFactory } from '../models/Plugins';

@Injectable()
export class ExtensionsServices {

    private serviceName = "Extensions";

    constructor(private httpMgr: HttpManager) { }

    getExtensionPoints(scopes?: Scope) {
        console.log("[ExtensionsServices] getExtensionPoints");
        var params: any = {};
        if (scopes != null) {
            params.scopes = scopes;
        }
        return this.httpMgr.doGet(this.serviceName, "getExtensionPoints", params)
    }

    getExtensionPoint(identifier: string) {
        console.log("[ExtensionsServices] getExtensionPoint");
        var params: any = {
            identifier: identifier
        };
        return this.httpMgr.doGet(this.serviceName, "getExtensionPoint", params)
    }

    getExtensions(extensionPointID: string): Observable<ExtensionFactory[]> {
        console.log("[ExtensionsServices] getExtensions");
        var params: any = {
            extensionPointID: extensionPointID
        };
        return this.httpMgr.doGet(this.serviceName, "getExtensions", params).map(
            stResp => {
                let exts: ExtensionFactory[] = [];
                for (var i = 0; i < stResp.length; i++) {
                    let extFact: ExtensionFactory;

                    //distinguish between Configurable and NonConfigurable ExtensionFactory
                    let configColl: any[] = stResp[i].configurations;
                    if (configColl != null) {
                        let configurations: Settings[] = [];
                        for (var j = 0; j < configColl.length; j++) {
                            configurations.push(Settings.parse(configColl[j]));
                        }
                        extFact = new ConfigurableExtensionFactory(stResp[i].id, stResp[i].name, stResp[i].description, 
                            stResp[i].extensionType, stResp[i].scope, stResp[i].configurationScopes, configurations);
                    } else {
                        extFact = new NonConfigurableExtensionFactory(stResp[i].id, stResp[i].name, stResp[i].description, 
                            stResp[i].extensionType, stResp[i].settingsScopes);
                    }
                    
                    exts.push(extFact);
                }
                exts.sort((e1: ExtensionFactory, e2: ExtensionFactory) => {
                    return e1.name.localeCompare(e2.name);
                });
                return exts;
            }
        );
    }

}