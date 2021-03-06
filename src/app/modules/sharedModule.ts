import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QueryParameterForm } from '../sparql/queryParameterization/queryParameterForm';
import { YasguiComponent } from '../sparql/yasguiComponent';
import { CodemirrorComponent } from "../widget/codemirror/codemirrorComponent";
import { SanitizerDirective } from "../widget/directives/sanitizerDirective";
import { ExtensionConfiguratorComponent } from '../widget/extensionConfigurator/extensionConfiguratorComponent';
import { InputEditableComponent } from '../widget/inputEditable/inputEditableComponent';
import { LanguageItemComponent } from '../widget/languageItem/languageItemComponent';
import { FilePickerComponent } from '../widget/pickers/filePicker/filePickerComponent';
import { LangPickerComponent } from '../widget/pickers/langPicker/langPickerComponent';
import { LiteralPickerComponent } from '../widget/pickers/valuePicker/literalPickerComponent';
import { ResourcePickerComponent } from '../widget/pickers/valuePicker/resourcePickerComponent';
import { ValuePickerComponent } from '../widget/pickers/valuePicker/valuePickerComponent';
import { RdfResourceComponent } from '../widget/rdfResource/rdfResourceComponent';
import { ResourceListComponent } from '../widget/rdfResource/resourceListComponent';
import { SettingMapRendererComponent } from '../widget/settingsRenderer/settingMapRendererComponent';
import { SettingSetRendererComponent } from '../widget/settingsRenderer/settingSetRendererComponent';
import { SettingsRendererComponent } from '../widget/settingsRenderer/settingsRendererComponent';
import { SettingsRendererPanelComponent } from '../widget/settingsRenderer/settingsRendererPanelComponent';
import { TypedLiteralInputComponent } from '../widget/typedLiteralInput/typedLiteralInputComponent';

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [
        FilePickerComponent, RdfResourceComponent, LangPickerComponent, SanitizerDirective,
        CodemirrorComponent, YasguiComponent, InputEditableComponent, ResourceListComponent,
        TypedLiteralInputComponent, LanguageItemComponent,
        SettingsRendererComponent, SettingsRendererPanelComponent, SettingSetRendererComponent, SettingMapRendererComponent,
        QueryParameterForm, ExtensionConfiguratorComponent, ResourcePickerComponent, LiteralPickerComponent, ValuePickerComponent,
    ],
    exports: [
        FilePickerComponent, RdfResourceComponent, SanitizerDirective, LangPickerComponent,
        CodemirrorComponent, YasguiComponent, InputEditableComponent, ResourceListComponent,
        TypedLiteralInputComponent, LanguageItemComponent, 
        SettingsRendererComponent, SettingsRendererPanelComponent, SettingSetRendererComponent, SettingMapRendererComponent,
        QueryParameterForm, ExtensionConfiguratorComponent, ResourcePickerComponent, LiteralPickerComponent, ValuePickerComponent,
    ],
    providers: []
})
export class SharedModule { }