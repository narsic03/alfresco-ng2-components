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

import { Component, ViewChild } from '@angular/core';
import { FormComponent, FormModel, FormService } from '@adf/process-services';
import { LogService } from '@adf/core';

@Component({
    selector: 'form-list',
    templateUrl: 'form-list.component.html',
    styleUrls: ['form-list.component.scss']
})
export class FormListComponent {

    @ViewChild(FormComponent)
    activitiForm: FormComponent;

    formList: any [] = [];

    form: FormModel;
    formId: string;

    storedData: any = {};
    restoredData: any = {};

    constructor(private formService: FormService, private logService: LogService) {
        // Prevent default outcome actions
        formService.executeOutcome.subscribe(e => {
            e.preventDefault();
            this.logService.log(e.outcome);
        });
    }

    onRowDblClick(event: CustomEvent) {
        let rowForm = event.detail.value.obj;

        this.formService.getFormDefinitionById(rowForm.id).subscribe((formModel) => {
            let form = this.formService.parseForm(formModel.formDefinition);
            this.form = form;
        });

        this.logService.log(rowForm);
    }

    isEmptyForm() {
        return this.form === null || this.form === undefined;
    }

    store() {
        this.clone(this.activitiForm.form.values, this.storedData);
        this.logService.log('DATA SAVED');
        this.logService.log(this.storedData);
        this.logService.log('DATA SAVED');
        this.restoredData = null;
    }

    clone(objToCopyFrom, objToCopyTo) {
        for (let attribute in objToCopyFrom) {
            if (objToCopyFrom.hasOwnProperty(attribute)) {
                objToCopyTo[attribute] = objToCopyFrom[attribute];
            }
        }
        return objToCopyTo;
    }

    restore() {
        this.restoredData = this.storedData;
        this.storedData = {};
    }

}
