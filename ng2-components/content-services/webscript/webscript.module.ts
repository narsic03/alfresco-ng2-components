/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DataTableModule, PipeModule } from '@alfresco/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { TRANSLATION_PROVIDER } from '@alfresco/core';
import { MaterialModule } from '../material.module';
import { WebscriptComponent } from './webscript.component';

@NgModule({
    imports: [
        CommonModule,
        PipeModule,
        MaterialModule,
        DataTableModule,
        TranslateModule
    ],
    exports: [
        WebscriptComponent
    ],
    declarations: [
        WebscriptComponent
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'ng2-alfresco-webscript',
                source: 'assets/ng2-alfresco-webscript'
            }
        }
    ]
})
export class WebScriptModule {}
