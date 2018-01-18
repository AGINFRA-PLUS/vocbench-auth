import { Component } from "@angular/core";
import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { DialogRef, ModalComponent } from "ngx-modialog";
import { PluginsServices } from "../services/pluginsServices";
import { Plugin, PluginConfiguration, ExtensionPoint } from "../models/Plugins";
import { CollaborationServices } from "../services/collaborationServices";

@Component({
    selector: "collaboration-config-modal",
    templateUrl: "./collaborationConfigModal.html",
})
export class CollaborationConfigModal implements ModalComponent<BSModalContext> {
    context: BSModalContext;

    private availableCollaborationPlugins: Plugin[];
    private selectedPlugin: Plugin;

    private collSysSettings: PluginConfiguration;
    private collSysPreferences: PluginConfiguration;

    constructor(public dialog: DialogRef<BSModalContext>, private pluginService: PluginsServices, private collaborationService: CollaborationServices) {
        this.context = dialog.context;
    }

    ngOnInit() {
        this.pluginService.getAvailablePlugins(ExtensionPoint.COLLABORATION_BACKEND_ID).subscribe(
            plugins => {
                this.availableCollaborationPlugins = plugins;
                this.selectedPlugin = this.availableCollaborationPlugins[0];
                this.initCollaborationSystemConf();
            }
        );

    }

    private initCollaborationSystemConf() {
        this.collaborationService.getProjectSettings(this.selectedPlugin.factoryID).subscribe(
            settings => {
                this.collSysSettings = settings;
            }
        );
        this.collaborationService.getProjectPreferences(this.selectedPlugin.factoryID).subscribe(
            prefs => {
                this.collSysPreferences = prefs;
            }
        );
    }

    private isOkClickable(): boolean {
        if (this.collSysSettings == null || this.collSysPreferences == null) {
            return false;
        }
        if (this.collSysPreferences.requireConfiguration()) {
            return false;
        }
        if (this.collSysSettings.requireConfiguration()) {
            return false;
        }
        return true;
    }

    ok(event: Event) {
        let settingsParam = this.collSysSettings.getPropertiesAsMap();
        let prefsParam = this.collSysPreferences.getPropertiesAsMap();
        this.collaborationService.activateCollaboratioOnProject(this.selectedPlugin.factoryID, settingsParam, prefsParam).subscribe(
            resp => {
                event.stopPropagation();
                event.preventDefault();
                this.dialog.close();
            }
        )
    }

    cancel() {
        this.dialog.dismiss();
    }

}