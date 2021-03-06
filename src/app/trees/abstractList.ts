import { Component, Input, Output, ViewChild, ElementRef, EventEmitter, QueryList } from "@angular/core";
import { AbstractStruct } from "./abstractStruct";
import { AbstractListNode } from "./abstractListNode";
import { ARTURIResource, ResAttribute } from "../models/ARTResources";
import { VBEventHandler } from "../utils/VBEventHandler";

@Component({
    selector: "list",
    template: "",
})
export abstract class AbstractList extends AbstractStruct {

    @ViewChild('blockDivList') public blockDivElement: ElementRef; //the element in the view referenced with #blockDivList
    @ViewChild('scrollableContainer') scrollableElement: ElementRef;
    abstract viewChildrenNode: QueryList<AbstractListNode>;

    protected pendingSearchRes: ARTURIResource; //searched resource that is waiting to be selected once the list is initialized
    
    /**
     * ATTRIBUTES
     */

    list: any[];

    /**
     * CONSTRUCTOR
     */
    constructor(eventHandler: VBEventHandler) {
        super(eventHandler);
    }

    /**
     * METHODS
     */

    init() {
        this.initList();
    }

    abstract initList(): void;

    /**
     * type of the node param depends on the list implementation
     * (for example in instance list it is an object with individual and its class, in scheme list it is simply the scheme)
     */
    abstract selectNode(node: any): void;
    abstract onListNodeCreated(node: ARTURIResource): void;
    abstract onListNodeDeleted(node: ARTURIResource): void;
    abstract openListAt(node: ARTURIResource): void;

    //Nodes limitation management
    initialNodes: number = 100;
    nodeLimit: number = this.initialNodes;
    increaseRate: number = this.initialNodes/5;
    private onScroll() {
        let scrollElement: HTMLElement = this.scrollableElement.nativeElement;
        if (scrollElement.scrollTop === (scrollElement.scrollHeight - scrollElement.offsetHeight)) {
            //bottom reached => increase max range if there are more roots to show
            if (this.nodeLimit < this.list.length) { 
                this.nodeLimit = this.nodeLimit + this.increaseRate;
            }
        } 
    }
    ensureNodeVisibility(resource: ARTURIResource) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].getURI() == resource.getURI()) {
                if (i >= this.nodeLimit) {
                    //update nodeLimit so that node at index i is within the range
                    let scrollStep: number = ((i - this.nodeLimit)/this.increaseRate)+1;
                    this.nodeLimit = this.nodeLimit + this.increaseRate*scrollStep;
                }
                this.pendingSearchRes = null; //if there was any pending search, reset it
                return; //node found and visible
            }
        }
        //if this code is reached, the node is not found (so probably it is waiting that the list is initialized)
        this.pendingSearchRes = resource;
    }

}