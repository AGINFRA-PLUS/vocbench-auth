import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';

import { AdministrationServices } from "../services/administrationServices";
import { AlignmentServices } from "../services/alignmentServices";
import { AuthServices } from "../services/authServices";
import { ClassesServices } from "../services/classesServices";
import { CODAServices } from "../services/codaServices";
import { CollaborationServices } from "../services/collaborationServices";
import { CustomFormsServices } from "../services/customFormsServices";
import { DatasetMetadataServices } from "../services/datasetMetadataServices";
import { ExportServices } from "../services/exportServices";
import { HistoryServices } from "../services/historyServices";
import { IcvServices } from "../services/icvServices";
import { IndividualsServices } from "../services/individualsServices";
import { InputOutputServices } from "../services/inputOutputServices";
import { ManchesterServices } from "../services/manchesterServices";
import { MetadataServices } from "../services/metadataServices";
import { OntoManagerServices } from "../services/ontoManagerServices";
import { PluginsServices } from "../services/pluginsServices";
import { PreferencesSettingsServices } from "../services/preferencesSettingsServices";
import { ProjectServices } from "../services/projectServices";
import { PropertyServices } from "../services/propertyServices";
import { RefactorServices } from "../services/refactorServices";
import { RepositoriesServices } from "../services/repositoriesServices";
import { ResourcesServices } from "../services/resourcesServices";
import { ResourceViewServices } from "../services/resourceViewServices";
import { SearchServices } from "../services/searchServices";
import { ServicesServices } from "../services/servicesServices";
import { Sheet2RDFServices } from "../services/sheet2rdfServices";
import { SkosServices } from "../services/skosServices";
import { SkosxlServices } from "../services/skosxlServices";
import { SparqlServices } from "../services/sparqlServices";
import { UserServices } from "../services/userServices";
import { ValidationServices } from "../services/validationServices";
import { VersionsServices } from "../services/versionsServices";

@NgModule({
    imports: [HttpModule],
    declarations: [],
    exports: [],
    providers: [
        AdministrationServices,
        AlignmentServices,
        AuthServices,
        ClassesServices,
        CODAServices,
        CollaborationServices,
        CustomFormsServices,
        DatasetMetadataServices,
        ExportServices,
        HistoryServices,
        IcvServices,
        IndividualsServices,
        InputOutputServices,
        ManchesterServices,
        MetadataServices,
        OntoManagerServices,
        PluginsServices,
        PreferencesSettingsServices,
        ProjectServices,
        PropertyServices,
        RefactorServices,
        RepositoriesServices,
        ResourcesServices,
        ResourceViewServices,
        SearchServices,
        ServicesServices,
        Sheet2RDFServices,
        SkosServices,
        SkosxlServices,
        SparqlServices,
        UserServices,
        ValidationServices,
        VersionsServices
    ]
})
export class STServicesModule { }