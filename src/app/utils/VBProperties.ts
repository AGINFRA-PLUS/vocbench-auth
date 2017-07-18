import { Injectable } from '@angular/core';
import { PreferencesSettingsServices } from '../services/preferencesSettingsServices';
import { ARTURIResource, RDFResourceRolesEnum } from '../models/ARTResources';
import { Language, LanguageUtils } from '../models/LanguagesCountries';
import { Properties } from '../models/Properties';
import { Cookie } from '../utils/Cookie';
import { VBEventHandler } from '../utils/VBEventHandler';
import { UIUtils } from '../utils/UIUtils';
import { BasicModalServices } from '../widget/modal/basicModal/basicModalServices'

@Injectable()
export class VBProperties {

    private projectLanguages: Language[] = []; //all available languages in a project (settings)
    private activeSchemes: ARTURIResource[] = [];
    private showFlags: boolean = true;
    private showInstancesNumber: boolean = true;
    private projectThemeId: number = null;

    constructor(private prefService: PreferencesSettingsServices, private basicModals: BasicModalServices, private eventHandler: VBEventHandler) {}

    /**
     * To call each time the user change project
     */
    initUserProjectPreferences() {
        var properties: string[] = [
            Properties.pref_active_schemes, Properties.pref_show_flags,
            Properties.pref_show_instances_number, Properties.pref_project_theme
        ];
        this.prefService.getProjectPreferences(properties).subscribe(
            prefs => {
                this.activeSchemes = [];
                let activeSchemesPref: string = prefs[Properties.pref_active_schemes];
                if (activeSchemesPref != null) {
                    let skSplitted: string[] = activeSchemesPref.split(",");
                    for (var i = 0; i < skSplitted.length; i++) {
                        this.activeSchemes.push(new ARTURIResource(skSplitted[i], null, RDFResourceRolesEnum.conceptScheme));
                    }
                }

                this.showFlags = prefs[Properties.pref_show_flags];

                this.showInstancesNumber = prefs[Properties.pref_show_instances_number];
                
                let projThemePref = prefs[Properties.pref_project_theme];
                if (projThemePref != this.projectThemeId) {//update projectTheme only if changed
                    this.projectThemeId = prefs.project_theme;
                    UIUtils.changeNavbarTheme(this.projectThemeId);
                }
            }
        );
    }

    getActiveSchemes(): ARTURIResource[] {
        return this.activeSchemes;
    }
    setActiveSchemes(schemes: ARTURIResource[]) {
        if (schemes == null) {
            this.activeSchemes = [];
        } else {
            this.activeSchemes = schemes;
        }
        this.prefService.setActiveSchemes(schemes).subscribe(
            stResp => {
                this.eventHandler.schemeChangedEvent.emit(schemes);
            }
        );
    }
    isActiveScheme(scheme: ARTURIResource) {
        for (var i = 0; i < this.activeSchemes.length; i++) {
            if (scheme.getURI() == this.activeSchemes[i].getURI()) {
                return true;
            }
        }
        return false;
    }

    getShowFlags(): boolean {
        return this.showFlags;
    }
    setShowFlags(show: boolean) {
        this.showFlags = show;
        this.prefService.setShowFlags(show).subscribe();
    }

    getShowInstancesNumber(): boolean {
        return this.showInstancesNumber;
    }
    setShowInstancesNumber(show: boolean) {
        this.showInstancesNumber = show;
        this.prefService.setShowInstancesNumb(show).subscribe();
    }

    getProjectTheme(): number {
        return this.projectThemeId;
    }
    setProjectTheme(theme: number) {
        this.projectThemeId = theme;
        UIUtils.changeNavbarTheme(this.projectThemeId);
        this.prefService.setProjectTheme(theme).subscribe();
    }

    //PREFERENCES STORED IN COOKIES

    /**
     * Sets the preference to show or hide the inferred information in resource view
     */
    setInferenceInResourceView(showInferred: boolean) {
        Cookie.setCookie(Cookie.VB_INFERENCE_IN_RES_VIEW, showInferred + "", 365 * 10);
    }
    /**
     * Gets the preference to show or hide the inferred information in resource view
     */
    getInferenceInResourceView() {
        return Cookie.getCookie(Cookie.VB_INFERENCE_IN_RES_VIEW) == "true";
    }

    /**
     * Sets the preference about the resource view mode
     */
    setResourceViewMode(mode: ResourceViewMode) {
        Cookie.setCookie(Cookie.VB_RESOURCE_VIEW_MODE, mode, 365 * 10);
    }
    /**
     * Gets the preference about the resource view mode
     */
    getResourceViewMode(): ResourceViewMode {
        let mode: ResourceViewMode = <ResourceViewMode>Cookie.getCookie(Cookie.VB_RESOURCE_VIEW_MODE);
        if (mode != ResourceViewMode.splitted && mode != ResourceViewMode.tabbed) {
            mode = ResourceViewMode.tabbed;
            this.setResourceViewMode(mode);
        }
        return mode;
    }

    //SETTINGS
    initProjectSettings() {
        var properties: string[] = [Properties.setting_languages];
        this.prefService.getProjectSettings(properties).subscribe(
            settings => {
                var langsValue: string = settings[Properties.setting_languages];
                try {
                    this.projectLanguages = <Language[]>JSON.parse(langsValue);
                    LanguageUtils.sortLanguages(this.projectLanguages);
                } catch (err) {
                    this.basicModals.alert("Error", "Project setting initialization has encountered a problem during parsing " +
                        "languages settings. Default languages will be set for this project.", "error");
                    this.projectLanguages = [
                        { name: "German" , tag: "de" }, { name: "English" , tag: "en" }, { name: "Spanish" , tag: "es" },
                        { name: "French" , tag: "fr" }, { name: "Italian" , tag: "it" }
                    ];
                }
            }
        );
    }

    /**
     * Returns the language available in the project
     */
    getProjectLanguages(): Language[] {
        return this.projectLanguages;
    }
    setProjectLanguages(languages: Language[]) {
        this.projectLanguages = languages;
    }

}

export type ResourceViewMode = "tabbed" | "splitted";
export const ResourceViewMode = {
    tabbed: "tabbed" as ResourceViewMode,
    splitted: "splitted" as ResourceViewMode
}