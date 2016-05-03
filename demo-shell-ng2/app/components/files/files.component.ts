/**
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
import {Component} from 'angular2/core';
import {
    DOCUMENT_LIST_DIRECTIVES,
    DOCUMENT_LIST_PROVIDERS,
    DocumentActionsService
} from 'ng2-alfresco-documentlist/ng2-alfresco-documentlist';
import {MDL} from 'ng2-alfresco-core/material';

declare let __moduleName:string;

@Component({
    moduleId: __moduleName,
    selector: 'files-component',
    templateUrl: './files.component.html',
    directives: [DOCUMENT_LIST_DIRECTIVES, MDL],
    providers: [DOCUMENT_LIST_PROVIDERS]
})
export class FilesComponent {
    thumbnails: boolean = true;
    breadcrumb: boolean = false;
    navigation: boolean = true;

    events: any[] = [];
    
    constructor(documentActions: DocumentActionsService) {
        documentActions.setHandler('my-handler', this.myDocumentActionHandler.bind(this));
    }

    myDocumentActionHandler(obj: any) {
        window.alert('my custom action handler');
    }

    onItemClick($event) {
        console.log($event.value);
        this.events.push({
            name: 'Item Clicked',
            value: $event.value
        });
    }

    myCustomAction1(event) {
        alert('Custom document action for ' + event.value.displayName);
    }

    myFolderAction1(event) {
        alert('Custom folder action for ' + event.value.displayName);
    }
}
