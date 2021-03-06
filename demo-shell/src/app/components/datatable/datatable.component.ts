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

import { Component, Input } from '@angular/core';
import { AlfrescoApiService, LogService } from '@alfresco/adf-core';
import { DataCellEvent, DataRowActionEvent, DataSorting, ObjectDataColumn, ObjectDataRow, ObjectDataTableAdapter } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-datatable',
    templateUrl: './datatable.component.html',
    styleUrls: ['./datatable.component.scss']
})
export class DataTableComponent {

    multiselect = false;
    data: ObjectDataTableAdapter;

    @Input()
    selectionMode = 'single';

    selectionModes = [
        { value: 'none', viewValue: 'None' },
        { value: 'single', viewValue: 'Single' },
        { value: 'multiple', viewValue: 'Multiple' }
    ];

    private _imageUrl = 'http://placehold.it/140x100';
    private _createdBy: any = {
        name: 'Denys Vuika',
        email: 'denys.vuika@alfresco.com'
    };

    constructor(private apiService: AlfrescoApiService, private logService: LogService) {
        this.reset();
    }

    reset() {
        this.data = new ObjectDataTableAdapter(
            [
                {
                    id: 1,
                    name: 'Name 1',
                    createdOn: new Date(2016, 6, 2, 15, 8, 1),
                    createdBy: this._createdBy,
                    icon: 'material-icons://folder_open'
                },
                {
                    id: 2,
                    name: 'Name 2',
                    createdOn: new Date(2016, 6, 2, 15, 8, 2),
                    createdBy: this._createdBy,
                    icon: 'material-icons://accessibility'
                },
                {
                    id: 3,
                    name: 'Name 3',
                    createdOn: new Date(2016, 6, 2, 15, 8, 3),
                    createdBy: this._createdBy,
                    icon: 'material-icons://alarm'
                },
                {
                    id: 4,
                    name: 'Image 1',
                    createdOn: new Date(2016, 6, 2, 15, 8, 4),
                    createdBy: this._createdBy,
                    icon: this._imageUrl
                }
            ],
            [
                { type: 'image', key: 'icon', title: '', srTitle: 'Thumbnail' },
                { type: 'text', key: 'id', title: 'Id', sortable: true , cssClass: 'desktop-only'},
                { type: 'text', key: 'createdOn', title: 'Created On', sortable: true },
                { type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true },
                { type: 'text', key: 'createdBy.name', title: 'Created By', sortable: true, cssClass: 'desktop-only'}
            ]
        );

        this.data.setSorting(new DataSorting('id', 'asc'));
    }

    addRow() {
        const id = this.data.getRows().length + 1;
        const row = new ObjectDataRow({
            id: id,
            name: 'Name ' + id,
            createdOn: new Date(),
            icon: 'material-icons://extension',
            createdBy: this._createdBy
        });
        this.data.getRows().push(row);
        this.data.sort();
    }

    replaceRows() {
        const objects = [
            {
                id: 10,
                name: 'Name 10',
                createdBy: this._createdBy,
                createdOn: new Date(2016, 6, 2, 15, 8, 5),
                icon: 'material-icons://face'
            },
            {
                id: 11,
                name: 'Name 11',
                createdBy: this._createdBy,
                createdOn: new Date(2016, 6, 2, 15, 8, 6),
                icon: 'material-icons://language'
            },
            {
                id: 12,
                name: 'Name 12',
                createdBy: this._createdBy,
                createdOn: new Date(2016, 6, 2, 15, 8, 7),
                icon: 'material-icons://pets'
            },
            {
                id: 13,
                name: 'Image 13',
                createdBy: this._createdBy,
                createdOn: new Date(2016, 6, 2, 15, 8, 8),
                icon: this._imageUrl
            }
        ];
        const rows = objects.map(obj => new ObjectDataRow(obj));
        this.data.setRows(rows);
    }

    replaceColumns() {
        const schema = [
            { type: 'text', key: 'id', title: 'Id', sortable: true },
            { type: 'text', key: 'name', title: 'Name', sortable: true, cssClass: 'full-width name-column' }
        ];
        const columns = schema.map(col => new ObjectDataColumn(col));
        this.data.setColumns(columns);
    }

    onShowRowActionsMenu(event: DataCellEvent) {
        const myAction = {
            title: 'Hello'
            // you custom metadata needed for onExecuteRowAction
        };
        event.value.actions = [
            myAction
        ];
    }

    onExecuteRowAction(event: DataRowActionEvent) {
        const args = event.value;
        this.logService.log(args.row);
        this.logService.log(args.action);
        window.alert(`My custom action: ${args.action.title}`);
    }

    onRowClick(event) {
        this.logService.log(event);
    }

    onRowDblClick(event) {
        this.logService.log(event);
    }

    getRowForNode() {
        const opts: any = {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations']
        };

        Observable.fromPromise(this.apiService.getInstance().nodes
            .getNodeInfo('-my-', opts)).subscribe((data) => {
                this.logService.log('FUnNy');
                this.logService.log(data);
                // let objects = new ObjectDataTableAdapter([
                //     {
                //         id: data.id,
                //         name: data.name,
                //         createdBy: data.createdByUser.displayName,
                //         createdOn: new Date(data.createdAt),
                //         icon: 'material-icons://face'
                //     }],
                //     [
                //         { type: 'image', key: 'icon', title: '', srTitle: 'Thumbnail' },
                //         { type: 'text', key: 'id', title: 'Id', sortable: true },
                //         { type: 'text', key: 'createdOn', title: 'Created On', sortable: true },
                //         { type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true },
                //         { type: 'text', key: 'createdBy.name', title: 'Created By', sortable: true }
                //     ]);
                // this.data = objects;
            });
    }
}
