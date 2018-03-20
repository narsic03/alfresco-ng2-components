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

import { Component, Optional, OnInit } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';

@Component({
    selector: 'app-permissions',
    templateUrl: './demo-permissions.component.html',
    styleUrls: ['./demo-permissions.component.scss']
})
export class DemoPermissionComponent implements OnInit {

    nodeId: string;

    constructor(@Optional() private route: ActivatedRoute) {
    }

    ngOnInit(){
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['id']) {
                    this.nodeId = params['id'];
                }
            });
        }
    }

}
