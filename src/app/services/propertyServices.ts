import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ARTBNode, ARTLiteral, ARTNode, ARTResource, ARTURIResource, ResAttribute, ResourceUtils } from "../models/ARTResources";
import { CustomForm, CustomFormValue, FormCollection } from "../models/CustomForms";
import { RDFS } from "../models/Vocabulary";
import { Deserializer } from "../utils/Deserializer";
import { HttpManager } from "../utils/HttpManager";
import { VBEventHandler } from "../utils/VBEventHandler";
import { ResourcesServices } from "./resourcesServices";

@Injectable()
export class PropertyServices {

    private serviceName = "Properties";

    constructor(private httpMgr: HttpManager, private eventHandler: VBEventHandler, private resourceService: ResourcesServices) { }

    /**
     * Returns a list of top properties (properties which have not a superProperty)
     * @return an array of Properties
     */
    getTopProperties(): Observable<ARTURIResource[]> {
        console.log("[PropertyServices] getTopProperties");
        var params: any = {}
        return this.httpMgr.doGet(this.serviceName, "getTopProperties", params).map(
            stResp => {
                var topProperties = Deserializer.createURIArray(stResp);
                for (var i = 0; i < topProperties.length; i++) {
                    topProperties[i].setAdditionalProperty(ResAttribute.CHILDREN, []);
                }
                return topProperties;
            }
        );
    }

    /**
     * Returns a list of top Rdf Properties (properties which have not a superProperty)
     * @return an array of Properties
     */
    getTopRDFProperties(): Observable<ARTURIResource[]> {
        console.log("[PropertyServices] getTopRDFProperties");
        var params: any = {}
        return this.httpMgr.doGet(this.serviceName, "getTopRDFProperties", params).map(
            stResp => {
                var topProperties = Deserializer.createURIArray(stResp);
                for (var i = 0; i < topProperties.length; i++) {
                    topProperties[i].setAdditionalProperty(ResAttribute.CHILDREN, []);
                }
                return topProperties;
            }
        );
    }

    /**
     * Returns a list of top object properties (properties which have not a superProperty)
     * @return an array of Properties
     */
    getTopObjectProperties(): Observable<ARTURIResource[]> {
        console.log("[PropertyServices] getTopObjectProperties");
        var params: any = {}
        return this.httpMgr.doGet(this.serviceName, "getTopObjectProperties", params).map(
            stResp => {
                var topProperties = Deserializer.createURIArray(stResp);
                for (var i = 0; i < topProperties.length; i++) {
                    topProperties[i].setAdditionalProperty(ResAttribute.CHILDREN, []);
                }
                return topProperties;
            }
        );
    }

    /**
     * Returns a list of top datatype properties (properties which have not a superProperty)
     * @return an array of Properties
     */
    getTopDatatypeProperties(): Observable<ARTURIResource[]> {
        console.log("[PropertyServices] getTopDatatypeProperties");
        var params: any = {}
        return this.httpMgr.doGet(this.serviceName, "getTopDatatypeProperties", params).map(
            stResp => {
                var topProperties = Deserializer.createURIArray(stResp);
                for (var i = 0; i < topProperties.length; i++) {
                    topProperties[i].setAdditionalProperty(ResAttribute.CHILDREN, []);
                }
                return topProperties;
            }
        );
    }

    /**
     * Returns a list of top annotation properties (properties which have not a superProperty)
     * @return an array of Properties
     */
    getTopAnnotationProperties(): Observable<ARTURIResource[]> {
        console.log("[PropertyServices] getTopAnnotationProperties");
        var params: any = {}
        return this.httpMgr.doGet(this.serviceName, "getTopAnnotationProperties", params).map(
            stResp => {
                var topProperties = Deserializer.createURIArray(stResp);
                for (var i = 0; i < topProperties.length; i++) {
                    topProperties[i].setAdditionalProperty(ResAttribute.CHILDREN, []);
                }
                return topProperties;
            }
        );
    }

    /**
     * Returns a list of top ontology properties (properties which have not a superProperty)
     * @return an array of Properties
     */
    getTopOntologyProperties(): Observable<ARTURIResource[]> {
        console.log("[PropertyServices] getTopOntologyProperties");
        var params: any = {}
        return this.httpMgr.doGet(this.serviceName, "getTopOntologyProperties", params).map(
            stResp => {
                var topProperties = Deserializer.createURIArray(stResp);
                for (var i = 0; i < topProperties.length; i++) {
                    topProperties[i].setAdditionalProperty(ResAttribute.CHILDREN, []);
                }
                return topProperties;
            }
        );
    }

    /**
     * Returns the subProperty of the given property
     * @param property
     * @return an array of subProperties
     */
    getSubProperties(property: ARTURIResource): Observable<ARTURIResource[]> {
        console.log("[PropertyServices] getSubProperties");
        var params: any = {
            superProperty: property
        };
        return this.httpMgr.doGet(this.serviceName, "getSubProperties", params).map(
            stResp => {
                var subProps = Deserializer.createURIArray(stResp);
                for (var i = 0; i < subProps.length; i++) {
                    subProps[i].setAdditionalProperty(ResAttribute.CHILDREN, []);
                }
                return subProps;
            }
        );
    }

    /**
     * takes a list of Properties and return their description as if they were roots for a tree
	 * (so more, role, explicit etc...)
     * @param properties
     */
    getPropertiesInfo(properties: ARTURIResource[]): Observable<ARTURIResource[]> {
        console.log("[PropertyServices] getPropertiesInfo");
        var params: any = {
            propList: properties
        };
        return this.httpMgr.doGet(this.serviceName, "getPropertiesInfo", params).map(
            stResp => {
                var props = Deserializer.createURIArray(stResp);
                for (var i = 0; i < props.length; i++) {
                    props[i].setAdditionalProperty(ResAttribute.CHILDREN, []);
                }
                return props;
            }
        );
    }

    /**
     * Retrieves all types of res, then all properties having their domain on any of the types for res.
	 * Note that it provides only root properties (e.g. if both rdfs:label and skos:prefLabel,
	 * which is a subProperty of rdfs:label, have domain = one of the types of res, then only rdfs:label is returned)
     * @param resource service returns properties that have as domain the type of this resource 
     */
    getRelevantPropertiesForResource(resource: ARTResource): Observable<ARTURIResource[]> {
        console.log("[PropertyServices] getRelevantPropertiesForResource");
        var params: any = {
            res: resource
        };
        return this.httpMgr.doGet(this.serviceName, "getRelevantPropertiesForResource", params).map(
            stResp => {
                return Deserializer.createURIArray(stResp);
            }
        );
    }

    /**
     * Returns the range of a property
     * @param property
     * @return an object with:
     * - ranges: "classic" range of a property omitted if a FormCollection is provided for the given property
     *      and the "replace" attribute is true (so, the "classic" range in replaced by the custom one).
     *      Contains two attributes:
     *          - type: available values: resource, plainLiteral, typedLiteral, literal, undetermined, inconsistent;
     *          - rangeColl: an array of ARTURIResource 
     *              (available only if rngType is resource, then represent the admitted range classes,
     *              or typedLiteral, then represent the admitted datatypes);
     * - formCollection, an optional FormCollection object only if the property has form collection associated
     */
    getRange(property: ARTURIResource): Observable<RangeResponse> {
        console.log("[PropertyServices] getRange");
        var params: any = {
            property: property,
        };
        return this.httpMgr.doGet(this.serviceName, "getRange", params).map(
            stResp => {
                let range: RangeResponse = { ranges: null, formCollection: null };
                
                let ranges: any;
                if (stResp.ranges) {
                    let respRanges = stResp.ranges;
                    ranges = {};
                    ranges.type = respRanges.type;
                    if (respRanges.rangeCollection) {
                        var rangeCollection: { resources: ARTURIResource[], dataRanges: (ARTLiteral[])[]} = {
                            resources: null,
                            dataRanges: null
                        };
                        let rangeResources: ARTURIResource[] = [];
                        let rangeDataRanges: (ARTLiteral[])[] = [];
                        for (var i = 0; i < respRanges.rangeCollection.length; i++) {
                            let rngCollElem = respRanges.rangeCollection[i];
                            if (typeof rngCollElem == "string") {
                                rangeResources.push(new ARTURIResource(rngCollElem, null, null));    
                            } else if (rngCollElem.oneOf != null) { //typeof rngCollElem == "object" => is a datarange
                                let dataRange: ARTLiteral[] = Deserializer.createLiteralArray(rngCollElem.oneOf);
                                rangeDataRanges.push(dataRange);
                            }
                        }
                        if (rangeResources.length > 0) {
                            rangeCollection.resources = rangeResources;
                        }
                        if (rangeDataRanges.length > 0) {
                            rangeCollection.dataRanges = rangeDataRanges;
                        }
                        ranges.rangeCollection = rangeCollection;
                    }
                    range.ranges = ranges;
                }

                let formCollection: FormCollection;
                if (stResp.formCollection) {
                    let respFormColl = stResp.formCollection;
                    formCollection = new FormCollection(respFormColl.id);
                    var forms: CustomForm[] = [];
                    for (var i = 0; i < respFormColl.forms.length; i++) {
                        let cf: CustomForm = new CustomForm(respFormColl.forms[i].id);
                        cf.setName(respFormColl.forms[i].name);
                        cf.setType(respFormColl.forms[i].type);
                        cf.setDescription(respFormColl.forms[i].description);
                        forms.push(cf);
                    }
                    forms.sort(
                        function (a: CustomForm, b: CustomForm) {
                            if (a.getName() < b.getName()) return -1;
                            if (a.getName() > b.getName()) return 1;
                            return 0;
                        }
                    )
                    formCollection.setForms(forms);

                    range.formCollection = formCollection;
                }

                return range;
            }
        );
    }

    /**
     * Creates a property of the given type.
     * Emits a topPropertyCreatedEvent with the new property
     * @param propertyType uri of a property class
     * @param newProperty uri of the new property
     * @param superProperty if provided the new property will be subProperty of this
     * @param customFormValue custom form that set additional info to the property
     * @return the new property
     */
    createProperty(propertyType: ARTURIResource, newProperty: ARTURIResource, superProperty?: ARTURIResource, 
            customFormValue?: CustomFormValue) {
        console.log("[PropertyServices] createProperty");
        var params: any = {
            propertyType: propertyType,
            newProperty: newProperty
        };
        if (superProperty != null) {
            params.superProperty = superProperty;
        }
        if (customFormValue != null) {
            params.customFormValue = customFormValue;
        }
        return this.httpMgr.doPost(this.serviceName, "createProperty", params).map(
            stResp => {
                return Deserializer.createURI(stResp);
            }
        ).flatMap(
            property => {
                return this.resourceService.getResourceDescription(property).map(
                    resource => {
                        resource.setAdditionalProperty(ResAttribute.CHILDREN, []);
                        resource.setAdditionalProperty(ResAttribute.NEW, true);
                        if (superProperty != null) {
                            this.eventHandler.subPropertyCreatedEvent.emit({ subProperty: <ARTURIResource>resource, superProperty: superProperty });
                        } else {
                            this.eventHandler.topPropertyCreatedEvent.emit(<ARTURIResource>resource);
                        }
                        return resource;
                    }
                );
            }
        );
    }

    /**
     * Deletes a property. Emits a propertyDeletedEvent with property (the deleted property)
     * @param property 
     */
    deleteProperty(property: ARTURIResource) {
        console.log("[PropertyServices] deleteProperty");
        var params: any = {
            property: property
        };
        return this.httpMgr.doPost(this.serviceName, "deleteProperty", params).map(
            stResp => {
                this.eventHandler.propertyDeletedEvent.emit(property);
                return property;
            }
        );
    }


    /**
     * Adds a superProperty to the given property. Emits a subPropertyCreatedEvent with subProperty and superProperty
     * @param property property to which add a super property
     * @param superProperty the superProperty to add
     */
    addSuperProperty(property: ARTURIResource, superProperty: ARTURIResource, linkingPredicate?: ARTURIResource, inverse?: boolean) {
        console.log("[PropertyServices] addSuperProperty");
        var params: any = {
            property: property,
            superProperty: superProperty,
        };
        if (linkingPredicate != null) {
            params.linkingPredicate = linkingPredicate;
        }
        if (inverse != null) {
            params.inverse = inverse;
        }
        return this.httpMgr.doPost(this.serviceName, "addSuperProperty", params).map(
            stResp => {
                //in case superProperty is an IRI (not an expression "inverse...")
                if (!inverse) {
                    var subProperty = property.clone(); //create subProperty by duplicating property param
                    this.eventHandler.superPropertyAddedEvent.emit({ subProperty: subProperty, superProperty: superProperty });
                }
                return stResp;
            }
        );
    }

    /**
     * Removes a superProperty from the given property.
     * Emits a superPropertyRemovedEvent with property and superProperty
     * @param property property to which remove a super property
     * @param superProperty the superProperty to remove
     */
    removeSuperProperty(property: ARTURIResource, superProperty: ARTURIResource, linkingPredicate?: ARTURIResource) {
        console.log("[PropertyServices] removeSuperProperty");
        var params: any = {
            property: property,
            superProperty: superProperty,
        };
        return this.httpMgr.doPost(this.serviceName, "removeSuperProperty", params).map(
            stResp => {
                this.eventHandler.superPropertyRemovedEvent.emit({ property: property, superProperty: superProperty });
                return stResp;
            }
        );
    }

    /**
     * 
     * @param property 
     * @param equivalentProperty
     * @param linkingPredicate 
     */
    addEquivalentProperty(property: ARTURIResource, equivalentProperty: ARTURIResource, linkingPredicate?: ARTURIResource, inverse?: boolean) {
        console.log("[PropertyServices] addEquivalentProperty");
        var params: any = {
            property: property,
            equivalentProperty: equivalentProperty,
        };
        if (linkingPredicate != null) {
            params.linkingPredicate = linkingPredicate;
        }
        if (inverse != null) {
            params.inverse = inverse;
        }
        return this.httpMgr.doPost(this.serviceName, "addEquivalentProperty", params);
    }

    /**
     * 
     * @param property 
     * @param equivalentProperty 
     * @param linkingPredicate 
     */
    removeEquivalentProperty(property: ARTURIResource, equivalentProperty: ARTURIResource, linkingPredicate?: ARTURIResource) {
        console.log("[PropertyServices] removeEquivalentProperty");
        var params: any = {
            property: property,
            equivalentProperty: equivalentProperty,
        };
        if (linkingPredicate != null) {
            params.linkingPredicate = linkingPredicate;
        }
        return this.httpMgr.doPost(this.serviceName, "removeEquivalentProperty", params);
    }

    /**
     * 
     * @param property 
     * @param disjointProperty
     * @param linkingPredicate 
     */
    addPropertyDisjointWith(property: ARTURIResource, disjointProperty: ARTURIResource, linkingPredicate?: ARTURIResource, inverse?: boolean) {
        console.log("[PropertyServices] addPropertyDisjointWith");
        var params: any = {
            property: property,
            disjointProperty: disjointProperty,
        };
        if (linkingPredicate != null) {
            params.linkingPredicate = linkingPredicate;
        }
        if (inverse != null) {
            params.inverse = inverse;
        }
        return this.httpMgr.doPost(this.serviceName, "addPropertyDisjointWith", params);
    }

    /**
     * 
     * @param property 
     * @param disjointProperty 
     * @param linkingPredicate 
     */
    removePropertyDisjointWith(property: ARTURIResource, disjointProperty: ARTURIResource, linkingPredicate?: ARTURIResource) {
        console.log("[PropertyServices] removePropertyDisjointWith");
        var params: any = {
            property: property,
            disjointProperty: disjointProperty,
        };
        if (linkingPredicate != null) {
            params.linkingPredicate = linkingPredicate;
        }
        return this.httpMgr.doPost(this.serviceName, "removePropertyDisjointWith", params);
    }

    /**
     * 
     * @param property 
     * @param disjointProperty
     * @param linkingPredicate 
     */
    addInverseProperty(property: ARTURIResource, inverseProperty: ARTURIResource, linkingPredicate?: ARTURIResource, inverse?: boolean) {
        console.log("[PropertyServices] addInverseProperty");
        var params: any = {
            property: property,
            inverseProperty: inverseProperty,
        };
        if (linkingPredicate != null) {
            params.linkingPredicate = linkingPredicate;
        }
        if (inverse != null) {
            params.inverse = inverse;
        }
        return this.httpMgr.doPost(this.serviceName, "addInverseProperty", params);
    }

    /**
     * 
     * @param property 
     * @param disjointProperty 
     * @param linkingPredicate 
     */
    removeInverseProperty(property: ARTURIResource, inverseProperty: ARTURIResource, linkingPredicate?: ARTURIResource) {
        console.log("[PropertyServices] removeInverseProperty");
        var params: any = {
            property: property,
            inverseProperty: inverseProperty,
        };
        if (linkingPredicate != null) {
            params.linkingPredicate = linkingPredicate;
        }
        return this.httpMgr.doPost(this.serviceName, "removeInverseProperty", params);
    }

    /**
     * Adds a class as domain of a property
     * @param property property to which add the domain
     * @param domain the domain class of the property
     */
    addPropertyDomain(property: ARTURIResource, domain: ARTURIResource) {
        console.log("[PropertyServices] addPropertyDomain");
        var params: any = {
            property: property,
            domain: domain
        };
        return this.httpMgr.doPost(this.serviceName, "addPropertyDomain", params);
    }

    /**
     * Removes the domain of a property
     * @param property property to which remove the domain
     * @param domain the domain class of the property
     */
    removePropertyDomain(property: ARTURIResource, domain: ARTResource) {
        console.log("[PropertyServices] removePropertyDomain");
        var params: any = {
            property: property,
            domain: domain,
        };
        return this.httpMgr.doPost(this.serviceName, "removePropertyDomain", params);
    }

    /**
     * Adds a class as range of a property
     * @param property property to which add the domain
     * @param range the range class of the property
     */
    addPropertyRange(property: ARTURIResource, range: ARTURIResource) {
        console.log("[PropertyServices] addPropertyRange");
        var params: any = {
            property: property,
            range: range
        };
        return this.httpMgr.doPost(this.serviceName, "addPropertyRange", params);
    }

    /**
     * Removes the range of a property
     * @param property property to which remove the range
     * @param range the range class of the property
     */
    removePropertyRange(property: ARTURIResource, range: ARTResource) {
        console.log("[PropertyServices] removePropertyRange");
        var params: any = {
            property: property,
            range: range,
        };
        return this.httpMgr.doPost(this.serviceName, "removePropertyRange", params);
    }

    /**
     * Set a list of literals as datarange of a property
     * @param property 
     * @param literals 
     * @param predicate (optional subproperty of rdfs:range)
     */
    setDataRange(property: ARTURIResource, literals: ARTLiteral[], predicate?: ARTURIResource) {
        console.log("[PropertyServices] setDataRange");
        var params: any = {
            property: property,
            literals: literals,
        };
        if (predicate != null) {
            params.predicate = predicate;
        }
        return this.httpMgr.doPost(this.serviceName, "setDataRange", params);
    }

    /**
     * Removes the datarange of a property
     * @param property 
     * @param datarange 
     */
    removeDataranges(property: ARTURIResource, datarange: ARTBNode) {
        console.log("[PropertyServices] removeDataranges");
        var params: any = {
            property: property,
            datarange: datarange,
        };
        return this.httpMgr.doPost(this.serviceName, "removeDataranges", params);
    }

    /**
     * Updates the literals of a datarange
     * @param property 
     * @param literals 
     */
    updateDataranges(datarange: ARTBNode, literals: ARTLiteral[]) {
        console.log("[PropertyServices] updateDataranges");
        var params: any = {
            datarange: datarange,
            literals: literals,
        };
        return this.httpMgr.doPost(this.serviceName, "updateDataranges", params);
    }

    /**
     * Returns the enumeration of the literals that compose a datarange
     * @param datarange 
     */
    getDatarangeLiterals(datarange: ARTBNode): Observable<ARTLiteral[]> {
        console.log("[PropertyServices] getDatarangeLiterals");
        var params: any = {
            datarange: datarange
        };
        return this.httpMgr.doGet(this.serviceName, "getDatarangeLiterals", params).map(
            stResp => {
                return Deserializer.createLiteralArray(stResp);
            }
        );
    }

    /**
     * Returns the inverse properties of the given
     * @param properties 
     */
    getInverseProperties(properties: ARTURIResource[]) {
        console.log("[PropertyServices] getInverseProperties");
        var params: any = {
            properties: properties
        };
        return this.httpMgr.doGet(this.serviceName, "getInverseProperties", params).map(
            stResp => {
                return Deserializer.createURIArray(stResp, ["inverseOf"]);
            }
        );
    }

    /**
     * 
     * @param property 
     * @param chainedProperties 
     * @param linkingPredicate 
     */
    addPropertyChainAxiom(property: ARTURIResource, chainedProperties: string, linkingPredicate?: ARTURIResource) {
        console.log("[PropertyServices] addPropertyChainAxiom");
        var params: any = {
            property: property,
            chainedProperties: chainedProperties,
        };
        if (linkingPredicate != null) {
            params.linkingPredicate = linkingPredicate;
        }
        return this.httpMgr.doPost(this.serviceName, "addPropertyChainAxiom", params);
    }

    /**
     * 
     * @param property 
     * @param chain 
     * @param linkingPredicate 
     */
    removePropertyChainAxiom(property: ARTURIResource, chain: ARTResource, linkingPredicate?: ARTURIResource) {
        console.log("[PropertyServices] removePropertyChainAxiom");
        var params: any = {
            property: property,
            chain: chain,
        };
        if (linkingPredicate != null) {
            params.linkingPredicate = linkingPredicate;
        }
        return this.httpMgr.doPost(this.serviceName, "removePropertyChainAxiom", params);
    }

    /**
     * 
     * @param property 
     * @param replacedChain 
     * @param chainedProperties 
     * @param linkingPredicate 
     */
    updatePropertyChainAxiom(property: ARTURIResource, replacedChain: ARTResource, chainedProperties: string, linkingPredicate?: ARTURIResource) {
        console.log("[PropertyServices] updatePropertyChainAxiom");
        var params: any = {
            property: property,
            replacedChain: replacedChain,
            chainedProperties: chainedProperties,
        };
        if (linkingPredicate != null) {
            params.linkingPredicate = linkingPredicate;
        }
        return this.httpMgr.doPost(this.serviceName, "updatePropertyChainAxiom", params);
    }

}

export enum RangeType {
    resource = "resource",
    plainLiteral = "plainLiteral",
    typedLiteral = "typedLiteral",
    literal = "literal",
    undetermined = "undetermined",
    inconsistent = "inconsistent"
}

export class RangeResponse {
    ranges: {
        type: RangeType,
        rangeCollection: { 
            resources: ARTURIResource[],
            dataRanges: (ARTLiteral[])[]
        }
    };
    formCollection: FormCollection;

    static isRangeCompliant(response: RangeResponse, value: ARTNode): boolean {
        let rngType = response.ranges.type;
        if (rngType == RangeType.undetermined) {
            return true;
        } else {
            if (value.isLiteral()) {
                let rngColl: ARTURIResource[] = response.ranges.rangeCollection ? response.ranges.rangeCollection.resources : [];
                return (
                    rngType == RangeType.literal || rngType == RangeType.typedLiteral || rngType == RangeType.plainLiteral ||
                    (rngType == RangeType.resource && ResourceUtils.containsNode(rngColl, RDFS.literal))
                );
            } else { //resource
                return rngType == RangeType.resource;
            }
        }
    }
}