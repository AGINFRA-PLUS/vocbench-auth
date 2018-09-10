import { ComponentRef, Injector, ViewContainerRef } from '@angular/core';
export interface CreateComponentArgs {
    component: any;
    vcRef: ViewContainerRef;
    injector?: Injector;
    projectableNodes?: any[][];
}
export declare function createComponent(instructions: CreateComponentArgs): ComponentRef<any>;
