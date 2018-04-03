import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FilePickerComponent } from '../widget/filePicker/filePickerComponent';
import { LangPickerComponent } from '../widget/langPicker/langPickerComponent';
import { RdfResourceComponent } from '../widget/rdfResource/rdfResourceComponent';
import { ResourceListComponent } from '../widget/rdfResource/resourceListComponent';
import { SanitizerDirective } from "../widget/directives/sanitizerDirective";
import { CodemirrorComponent } from "../widget/codemirror/codemirrorComponent";
import { InputEditableComponent } from '../widget/inputEditable/inputEditableComponent';
import { TypedLiteralInputComponent } from '../widget/typedLiteralInput/typedLiteralInputComponent';
import { LanguageItemComponent } from '../widget/languageItem/languageItemComponent';
import { SettingsRendererComponent } from '../widget/settingsRenderer/settingsRendererComponent';
import { ExtensionConfiguratorComponent } from '../widget/extensionConfigurator/extensionConfiguratorComponent';

import { YasguiComponent } from '../sparql/yasguiComponent';

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [
        FilePickerComponent, RdfResourceComponent, LangPickerComponent, SanitizerDirective,
        YasguiComponent, CodemirrorComponent, InputEditableComponent, ResourceListComponent,
        TypedLiteralInputComponent, LanguageItemComponent, SettingsRendererComponent,
        ExtensionConfiguratorComponent
    ],
    exports: [
        FilePickerComponent, RdfResourceComponent, SanitizerDirective, LangPickerComponent,
        YasguiComponent, CodemirrorComponent, InputEditableComponent, ResourceListComponent,
        TypedLiteralInputComponent, LanguageItemComponent, SettingsRendererComponent,
        ExtensionConfiguratorComponent
    ],
    providers: []
})
export class SharedModule { }