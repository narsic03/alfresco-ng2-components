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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AlfrescoApiService } from './alfresco-api.service';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class PeopleContentService {

    constructor(private apiService: AlfrescoApiService) {}

    private get peopleApi() {
       return this.apiService.getInstance().core.peopleApi;
    }

    /**
     * Gets information about a user identified by their username.
     * @param personId ID of the target user
     */
    getPerson(personId: string): Observable<any> {
        const { peopleApi, handleError } = this;
        const promise = peopleApi.getPerson(personId);

        return Observable
            .fromPromise(promise)
            .catch(handleError);
    }

    /** Gets information about the user who is currently logged-in. */
    getCurrentPerson(): Observable<any> {
        return this.getPerson('-me-');
    }

    private handleError(error): Observable<any> {
        return Observable.of(error);
    }
}
