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

import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FacetFieldBucket } from '../../facet-field-bucket.interface';

@Component({
    selector: 'adf-selected-facets',
    templateUrl: './selected-facets.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-selected-facets' }
})
export class SelectedFacetsComponent {

    @Input()
    facetQueries: string[] = [];

    @Input()
    facetBuckets: FacetFieldBucket[] = [];

    @Output()
    removeFacetQuery = new EventEmitter<string>();

    @Output()
    removeFacetBucket = new EventEmitter<FacetFieldBucket>();
}