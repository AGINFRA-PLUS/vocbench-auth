//https://www.softwarearchitekt.at/post/2016/12/02/sticky-routes-in-angular-2-3-with-routereusestrategy.aspx
//Nice explanation of RouteReuseStrategy: http://stackoverflow.com/a/41515648/5805661

import {RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot} from "@angular/router";
import {ComponentRef} from "@angular/core";
import {ProjectComponent} from "../project/projectComponent";
import {DataComponent} from "../data/dataComponent";

// This impl. bases upon one that can be found in the router's test cases.
export class CustomReuseStrategy implements RouteReuseStrategy {

    //Projects need to be stored since it keeps the state of projectChanged
    //Sparql should be without state since it depends from projects (prefix mapping definition in query)
    private pathWithState: string[] = ["Projects", "Data"];

    /**
     * map containing key-value pair that chaches routes, where
     * key is the path of the route
     * value is the DetachedRouteHandle of the route
     */
    handlers: { [key: string]: DetachedRouteHandle } = {};

    /**
     * Determines if this route (and its subtree) should be detached to be reused later.
     * Returning true, the route is stored and then, when requested again, the same route is reattached.
     * Returning false, the route is lost/destroyed and then, when requested again, the route (and its subtree) is reinitialized.
     * @param is the route that is going to leave
     */
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // console.debug('CustomReuseStrategy:shouldDetach storing ' + route.routeConfig.path);
        if (this.pathWithState.indexOf(route.routeConfig.path) != -1) {
            return true;
        }
        return false;
    }

    /**
     * Stores the detached route.
     * This method is called only if shouldDetach return true.
     * Add the handle of the route to the handlers map.
     */
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        // console.debug('CustomReuseStrategy:store', route, handle);
        this.handlers[route.routeConfig.path] = handle;
    }

    /**
     * Determines if this route (and its subtree) should be reattached
     * Returns true if it should reattach a route previously stored.
     */
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        // console.debug('CustomReuseStrategy:shouldAttach', route);

        // Return false (that means "don't attach the cached route") if it's going to "Data" route and project was changed in the meantime
        if (route.routeConfig.path == "Data" && this.handlers["Projects"]) {
            var projRouteHandler: any = this.handlers["Projects"];
            var projComponent: ProjectComponent = projRouteHandler.componentRef._component;
            if (projComponent.projectChanged) {
                projComponent.projectChanged = false;
                // destroy the previous stored DataComponent
                if (this.handlers["Data"]) {
                    var dataDetachedRouteHandle = this.handlers["Data"];
                    var dataComponentRef: ComponentRef<DataComponent> = dataDetachedRouteHandle['componentRef'];
                    dataComponentRef.destroy();
                }
                //return false, so it attacches a new DataComponent
                return false;
            }
        }

        return !!route.routeConfig && !!this.handlers[route.routeConfig.path];
    }

    /**
     * Retrieve and return a previously stored route (if a route was stored in handlers map),
     * or undefined if the route is not stored previously
     */
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        // console.debug('CustomReuseStrategy:retrieve', route);
        if (!route.routeConfig) {
            return null;
        }
        //retireve the DetachedRouteHandle stored in the handlers map for the path of the requested route (key of the map)
        return this.handlers[route.routeConfig.path];
    }

    /**
     * Determines if a route should be reused
     */
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        // console.debug('CustomReuseStrategy:shouldReuseRoute', future, curr);
        return future.routeConfig === curr.routeConfig;
    }

}