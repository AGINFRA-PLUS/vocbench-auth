import {RouterModule, Routes} from '@angular/router';

import {AuthGuard, AdminGuard, ProjectGuard, UnsavedChangesGuard} from "./utils/CanActivateGuards";

import {HomeComponent} from "./homeComponent";
import {ProjectComponent} from "./project/projectComponent";
import {DataComponent} from "./data/dataComponent";
import {SparqlComponent} from "./sparql/sparqlComponent";
// import {IcvComponent} from "./icv/icvComponent";
import {AlignmentValidationComponent} from "./alignment/alignmentValidation/alignmentValidationComponent";
import {CustomFormConfigComponent} from "./customForms/customFormConfComponent";
import {ImportProjectComponent} from "./project/importProject/importProjectComponent";
import {CreateProjectComponent} from "./project/createProject/createProjectComponent";
import {LoadDataComponent} from "./config/dataManagement/loadData/loadDataComponent";
import {ExportDataComponent} from "./config/dataManagement/exportData/exportDataComponent";
import {MetadataManagementComponent} from "./config/dataManagement/metadata/metadataManagementComponent";
import {RefactorComponent} from "./config/dataManagement/refactor/refactorComponent";
import {VocbenchSettingsComponent} from "./settings/vocbenchSettingsComponent";
import {UserProfileComponent} from "./user/userProfileComponent";
import {RegistrationComponent} from "./user/registrationComponent";
// import {AdministrationComponent} from "./administration/administrationComponent"

import {TestComponent} from "./test/testComponent";

export const routes: Routes = [
    {path: "", redirectTo: "/Home", pathMatch: "full"},
    {path: "Home", component: HomeComponent},
    // route config of navigation bar
    {path: "Projects", component: ProjectComponent, canActivate: [AdminGuard]},
    {path: "Data", component: DataComponent, canActivate: [AuthGuard, ProjectGuard]},
    {path: "Sparql", component: SparqlComponent, canActivate: [AuthGuard, ProjectGuard]},
    {path: "AlignmentValidation", component: AlignmentValidationComponent, canActivate: [AuthGuard, ProjectGuard]},
    {path: "CustomForm", component: CustomFormConfigComponent, canActivate: [AuthGuard, ProjectGuard]},
    {path: "Registration", component: RegistrationComponent},
    {path: "Profile", component: UserProfileComponent, canActivate: [AuthGuard]},
    {path: "Settings", component: VocbenchSettingsComponent, canActivate: [AuthGuard, ProjectGuard], canDeactivate: [UnsavedChangesGuard]},
    {path: "Test", component: TestComponent},
    //lazy loading of module with child route
    {path: "Administration", loadChildren: "./modules/administrationModule#AdministrationModule", canLoad: [AdminGuard]},
    {path: "Icv", loadChildren: "./modules/icvModule#IcvModule", canLoad: [AuthGuard, ProjectGuard]},
    // route config of config bar
    {path: "Config/LoadData", component: LoadDataComponent, canActivate: [AuthGuard, ProjectGuard]},
    {path: "Config/ExportData", component: ExportDataComponent, canActivate: [AuthGuard, ProjectGuard]},
    {path: "Config/Metadata", component: MetadataManagementComponent, canActivate: [AuthGuard, ProjectGuard]},
    {path: "Config/Refactor", component: RefactorComponent, canActivate: [AuthGuard, ProjectGuard]},
    // route config for project management
    {path: "Projects/ImportProject", component: ImportProjectComponent, canActivate: [AuthGuard]},
    {path: "Projects/CreateProject", component: CreateProjectComponent, canActivate: [AuthGuard]},
];

/*
useHash: true sets the HashLocationStrategy instead of the default "HTML 5 pushState" PathLocationStrategy
this solves the 404 error problem when reloading a page in a production server.
(see http://stackoverflow.com/questions/35284988/angular-2-404-error-occur-when-i-refresh-through-browser)
Another solution could be to configure the application server to support HTML5 pushState
(but this requires changes by the client on the application server that hosts VB3)
*/
export const appRouting = RouterModule.forRoot(routes, {useHash: true});