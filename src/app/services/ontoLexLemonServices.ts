import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpManager } from "../utils/HttpManager";
import { Deserializer } from '../utils/Deserializer';
import { VBEventHandler } from '../utils/VBEventHandler';
import { ARTURIResource, ARTLiteral, ResAttribute, ARTResource } from "../models/ARTResources";
import { CustomFormValue } from '../models/CustomForms';
import { ResourcesServices } from './resourcesServices';

@Injectable()
export class OntoLexLemonServices {

    private serviceName = "OntoLexLemon";

    constructor(private httpMgr: HttpManager, private eventHandler: VBEventHandler, private resourceService: ResourcesServices) { }

    /**
     * Creates a new lime:Lexicon for the provided language.
     * @param language 
     * @param newLexicon 
     * @param title 
     * @param customFormValue 
     */
    createLexicon(language: string, newLexicon?: ARTURIResource, title?: ARTLiteral, customFormValue?: CustomFormValue): Observable<ARTURIResource> {
        console.log("[OntoLexLemonServices] createLexicon");
        var params: any = {
            language: language
        };
        if (newLexicon != null) {
            params.newLexicon = newLexicon;
        }
        if (title != null) {
            params.title = title;
        }
        if (customFormValue != null) {
            params.customFormValue = customFormValue;
        }

        return this.httpMgr.doPost(this.serviceName, "createLexicon", params).map(
            stResp => {
                return Deserializer.createURI(stResp);
            }
        ).flatMap(
            lexicon => {
                return this.resourceService.getResourceDescription(lexicon).map(
                    resource => {
                        resource.setAdditionalProperty(ResAttribute.NEW, true);
                        this.eventHandler.lexiconCreatedEvent.emit(<ARTURIResource>resource);
                        return <ARTURIResource>resource;
                    }
                );
            }
        );
    }

    /**
     * Returns lexicons
     */
    getLexicons(): Observable<ARTURIResource[]> {
        console.log("[OntoLexLemonServices] getLexicons");
        var params: any = {};
        return this.httpMgr.doGet(this.serviceName, "getLexicons", params).map(
            stResp => {
                var lexicons = Deserializer.createURIArray(stResp);
                return lexicons;
            }
        );
    }

    /**
     * Deletes a lexicon.
     * @param lexicon 
     */
    deleteLexicon(lexicon: ARTURIResource) {
        console.log("[OntoLexLemonServices] deleteLexicon");
        var params: any = {
            lexicon: lexicon
        };
        return this.httpMgr.doPost(this.serviceName, "deleteLexicon", params).map(
            stResp => {
                this.eventHandler.lexiconDeletedEvent.emit(lexicon);
                return stResp;
            }
        );
    }

    /**
     * 
     * @param lexicon 
     */
    getLexiconLanguage(lexicon: ARTURIResource) {
        console.log("[OntoLexLemonServices] getLexiconLanguage");
        var params: any = {
            lexicon: lexicon
        };
        return this.httpMgr.doGet(this.serviceName, "getLexiconLanguage", params);
    }

    /**
     * Creates a new ontolex:LexicalEntry.
     * @param canonicalForm 
     * @param lexicon 
     * @param newLexicalEntry 
     * @param lexicalEntryCls
     * @param customFormValue 
     */
    createLexicalEntry(canonicalForm: ARTLiteral, lexicon: ARTURIResource, newLexicalEntry?: ARTURIResource, lexicalEntryCls?: ARTURIResource,
        customFormValue?: CustomFormValue): Observable<ARTURIResource> {
        
        console.log("[OntoLexLemonServices] createLexicalEntry");
        var params: any = {
            canonicalForm: canonicalForm,
            lexicon: lexicon
        };
        if (newLexicalEntry != null) {
            params.newLexicalEntry = newLexicalEntry;
        }
        if (lexicalEntryCls != null) {
            params.lexicalEntryCls = lexicalEntryCls;
        }
        if (customFormValue != null) {
            params.customFormValue = customFormValue;
        }
        return this.httpMgr.doPost(this.serviceName, "createLexicalEntry", params).map(
            stResp => {
                return Deserializer.createURI(stResp);
            }
        ).flatMap(
            entry => {
                return this.resourceService.getResourceDescription(entry).map(
                    resource => {
                        resource.setAdditionalProperty(ResAttribute.NEW, true);
                        this.eventHandler.lexicalEntryCreatedEvent.emit({ entry: (<ARTURIResource>resource), lexicon: lexicon });
                        return <ARTURIResource>resource;
                    }
                );
            }
        );
    }

    /**
     * Returns the entries in a given lexicon that starts with the supplied character.
     * @param index 
     * @param lexicon 
     */
    getLexicalEntriesByAlphabeticIndex(index: string, lexicon: ARTURIResource): Observable<ARTURIResource[]> {
        console.log("[OntoLexLemonServices] getLexicalEntriesByAlphabeticIndex");
        var params: any = {
            index: index,
            lexicon: lexicon
        };
        return this.httpMgr.doGet(this.serviceName, "getLexicalEntriesByAlphabeticIndex", params).map(
            stResp => {
                return Deserializer.createURIArray(stResp);
            }
        );
    }

    /**
     * Returns the lexicon which the lexicalEntry belongs to
     * @param lexicalEntry 
     */
    getLexicalEntryLexicons(lexicalEntry: ARTURIResource): Observable<ARTURIResource[]> {
        console.log("[OntoLexLemonServices] getLexicalEntryLexicons");
        var params: any = {
            lexicalEntry: lexicalEntry
        };
        return this.httpMgr.doGet(this.serviceName, "getLexicalEntryLexicons", params).map(
            stResp => {
                return Deserializer.createURIArray(stResp);
            }
        );
    }

    /**
     * Returns the senses of a lexicalEntry
     * @param lexicalEntry 
     */
    getLexicalEntrySenses(lexicalEntry: ARTURIResource): Observable<ARTURIResource[]> {
        console.log("[OntoLexLemonServices] getLexicalEntrySenses");
        var params: any = {
            lexicalEntry: lexicalEntry
        };
        return this.httpMgr.doGet(this.serviceName, "getLexicalEntrySenses", params).map(
            stResp => {
                return Deserializer.createURIArray(stResp);
            }
        );
    }

    /**
     * Returns the 2-digits index of the given lexicalEntry 
     * @param lexicalEntry 
     */
    getLexicalEntryIndex(lexicalEntry: ARTURIResource): Observable<string> {
        console.log("[OntoLexLemonServices] getLexicalEntryLexicons");
        var params: any = {
            lexicalEntry: lexicalEntry
        };
        return this.httpMgr.doGet(this.serviceName, "getLexicalEntryIndex", params);
    }

    /**
     * 
     * @param lexicalEntry 
     */
    getLexicalEntryLanguage(lexicalEntry: ARTURIResource): Observable<string> {
        console.log("[OntoLexLemonServices] getLexicalEntryLanguage");
        var params: any = {
            lexicalEntry: lexicalEntry
        };
        return this.httpMgr.doGet(this.serviceName, "getLexicalEntryLanguage", params);
    }

    /**
     * 
     * @param lexicalEntry 
     * @param constituentLexicalEntries 
     * @param ordered 
     */
    setLexicalEntryConstituents(lexicalEntry: ARTURIResource, constituentLexicalEntries: ARTURIResource[], ordered: boolean) {
        console.log("[OntoLexLemonServices] setLexicalEntryConstituents");
        var params: any = {
            lexicalEntry: lexicalEntry,
            constituentLexicalEntries: constituentLexicalEntries,
            ordered: ordered
        };
        return this.httpMgr.doPost(this.serviceName, "setLexicalEntryConstituents", params);
    }

    /**
     * 
     * @param lexicalEntry 
     */
	clearLexicalEntryConstituents(lexicalEntry: ARTURIResource) {
        console.log("[OntoLexLemonServices] clearLexicalEntryConstituents");
        var params: any = {
            lexicalEntry: lexicalEntry
        };
        return this.httpMgr.doPost(this.serviceName, "clearLexicalEntryConstituents", params);
    }


    /**
     * Sets the canonical form of a given lexical entry.
     * @param lexicalEntry 
     * @param writtenRep 
     * @param newForm 
     * @param customFormValue 
     */
    setCanonicalForm(lexicalEntry: ARTURIResource, writtenRep: ARTLiteral, newForm?: ARTURIResource, customFormValue?: CustomFormValue) {
        console.log("[OntoLexLemonServices] setCanonicalForm");
        var params: any = {
            lexicalEntry: lexicalEntry,
            writtenRep: writtenRep
        };
        if (newForm != null) {
            params.newForm = newForm;
        }
        if (customFormValue != null) {
            params.customFormValue = customFormValue;
        }
        return this.httpMgr.doPost(this.serviceName, "setCanonicalForm", params);
    }

    /**
     * Adds an other form of a given lexical entry.
     * @param lexicalEntry 
     * @param writtenRep 
     * @param newForm 
     * @param customFormValue 
     */
    addOtherForm(lexicalEntry: ARTURIResource, writtenRep: ARTLiteral, newForm: ARTURIResource, customFormValue?: CustomFormValue) {
        console.log("[OntoLexLemonServices] addOtherForm");
        var params: any = {
            lexicalEntry: lexicalEntry,
            writtenRep: writtenRep
        };
        if (newForm != null) {
            params.newForm = newForm;
        }
        if (customFormValue != null) {
            params.customFormValue = customFormValue;
        }
        return this.httpMgr.doPost(this.serviceName, "addOtherForm", params);
    }

    /**
     * 
     * @param form 
     */
    getFormLanguage(form: ARTResource): Observable<string> {
        console.log("[OntoLexLemonServices] getFormLanguage");
        var params: any = {
            form: form
        };
        return this.httpMgr.doGet(this.serviceName, "getFormLanguage", params);
    }
    
    /**
     * Removes a form of a lexical entry, and deletes it.
     * @param lexicalEntry 
     * @param property 
     * @param form 
     */
    removeForm(lexicalEntry: ARTResource, property: ARTURIResource, form: ARTResource) {
        console.log("[OntoLexLemonServices] removeForm");
        var params: any = {
            lexicalEntry: lexicalEntry,
            property: property,
            form: form
        };
        return this.httpMgr.doPost(this.serviceName, "removeForm", params);
    }

    /**
     * Deletes a lexical entry.
     * @param lexicalEntry 
     */
    deleteLexicalEntry(lexicalEntry: ARTURIResource) {
        console.log("[OntoLexLemonServices] deleteLexicon");
        var params: any = {
            lexicalEntry: lexicalEntry
        };
        return this.httpMgr.doPost(this.serviceName, "deleteLexicalEntry", params).map(
            stResp => {
                this.eventHandler.lexicalEntryDeletedEvent.emit(lexicalEntry);
                return stResp;
            }
        );
    }

    /**
     * Adds a lexicalization of the RDF resource reference using the ontolex:LexicalEntry lexicalEntry. 
     * @param lexicalEntry 
     * @param reference 
     * @param createPlain 
     * @param createSense 
     * @param lexicalSenseCls 
     * @param customFormValue 
     */
    addLexicalization(lexicalEntry: ARTResource, reference: ARTResource, createPlain: boolean, createSense: boolean, 
        lexicalSenseCls?: ARTURIResource, customFormValue?: CustomFormValue) {
        console.log("[OntoLexLemonServices] addLexicalization");
        var params: any = {
            lexicalEntry: lexicalEntry,
            reference: reference,
            createPlain: createPlain,
            createSense: createSense
        };
        if (lexicalSenseCls != null) {
            params.lexicalSenseCls = lexicalSenseCls;
        }
        if (customFormValue != null) {
            params.customFormValue = customFormValue;
        }
        return this.httpMgr.doPost(this.serviceName, "addLexicalization", params);
    }

    /**
     * Removes a plain lexicalization. This operation removes the triples connecting the lexical entry and the
	 * reference in both directions.
     * @param lexicalEntry 
     * @param reference 
     */
    removePlainLexicalization(lexicalEntry: ARTResource, reference: ARTResource) {
        console.log("[OntoLexLemonServices] removePlainLexicalization");
        var params: any = {
            lexicalEntry: lexicalEntry,
            reference: reference,
        };
        return this.httpMgr.doPost(this.serviceName, "removePlainLexicalization", params);
    }

    /**
     * Removes a reified lexicalization expressed as an ontolex:LexicalSense.
     * Optionally, it is possible to remove the corresponding plain lexicalization(s).
     * @param lexicalSense 
     * @param removePlain 
     */
    removeReifiedLexicalization(lexicalSense: ARTResource, removePlain: boolean) {
        console.log("[OntoLexLemonServices] removeReifiedLexicalization");
        var params: any = {
            lexicalSense: lexicalSense,
            removePlain: removePlain,
        };
        return this.httpMgr.doPost(this.serviceName, "removeReifiedLexicalization", params);
    }

    /**
     * Adds a representation to an ontolex:Form.
     * @param form 
     * @param representation 
     * @param property 
     */
    addFormRepresentation(form: ARTResource, representation: ARTLiteral, property: ARTURIResource) {
        console.log("[OntoLexLemonServices] addFormRepresentation");
        var params: any = {
            form: form,
            representation: representation,
            property: property
        };
        return this.httpMgr.doPost(this.serviceName, "addFormRepresentation", params);
    }

    /**
     * Removes a representations from an ontolex:Form.
     * @param form 
     * @param representation 
     * @param property 
     */
    removeFormRepresentation(form: ARTResource, representation: ARTLiteral, property: ARTURIResource) {
        console.log("[OntoLexLemonServices] removeFormRepresentation");
        var params: any = {
            form: form,
            representation: representation,
            property: property
        };
        return this.httpMgr.doPost(this.serviceName, "removeFormRepresentation", params);
    }

    /**
     * Adds a subterm to an ontolex:LexicalEntry.
     * @param lexicalEntry 
     * @param sublexicalEntry 
     * @param property 
     */
    addSubterm(lexicalEntry: ARTURIResource, sublexicalEntry: ARTURIResource, property?: ARTURIResource) {
        console.log("[OntoLexLemonServices] addSubterm");
        var params: any = {
            lexicalEntry: lexicalEntry,
            sublexicalEntry: sublexicalEntry
        };
        if (property != null) {
            params.property = property
        }
        return this.httpMgr.doPost(this.serviceName, "addSubterm", params);
    }

    /**
     * Removes a subterm from an ontolex:LexicalEntry.
     * @param lexicalEntry 
     * @param sublexicalEntry 
     * @param property 
     */
    removeSubterm(lexicalEntry: ARTURIResource, sublexicalEntry: ARTURIResource, property?: ARTURIResource) {
        console.log("[OntoLexLemonServices] removeSubterm");
        var params: any = {
            lexicalEntry: lexicalEntry,
            sublexicalEntry: sublexicalEntry
        };
        if (property != null) {
            params.property = property
        }
        return this.httpMgr.doPost(this.serviceName, "removeSubterm", params);
    }

}
