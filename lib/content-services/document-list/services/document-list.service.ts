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

import {
    AlfrescoApiService,
    AuthenticationService,
    ContentService,
    LogService,
    PermissionsEnum,
    ThumbnailService
} from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { MinimalNodeEntity, MinimalNodeEntryEntity, NodePaging } from 'alfresco-js-api';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()
export class DocumentListService {

    static ROOT_ID = '-root-';

    constructor(authService: AuthenticationService,
                private contentService: ContentService,
                private apiService: AlfrescoApiService,
                private logService: LogService,
                private thumbnailService: ThumbnailService) {
    }

    private getNodesPromise(folder: string, opts?: any): Promise<NodePaging> {

        let rootNodeId = DocumentListService.ROOT_ID;
        if (opts && opts.rootFolderId) {
            rootNodeId = opts.rootFolderId;
        }

        let params: any = {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations']
        };

        if (folder) {
            params.relativePath = folder;
        }

        if (opts) {
            if (opts.maxItems) {
                params.maxItems = opts.maxItems;
            }
            if (opts.skipCount) {
                params.skipCount = opts.skipCount;
            }
        }

        return this.apiService.getInstance().nodes.getNodeChildren(rootNodeId, params);
    }

    /**
     * Deletes a node.
     * @param nodeId ID of the node to delete
     */
    deleteNode(nodeId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().nodes.deleteNode(nodeId));
    }

    /**
     * Copy a node to destination node
     *
     * @param nodeId The id of the node to be copied
     * @param targetParentId The id of the folder where the node will be copied
     */
    copyNode(nodeId: string, targetParentId: string) {
        return Observable.fromPromise(this.apiService.getInstance().nodes.copyNode(nodeId, { targetParentId }))
            .catch(err => this.handleError(err));
    }

    /**
     * Move a node to destination node
     *
     * @param nodeId The id of the node to be moved
     * @param targetParentId The id of the folder where the node will be moved
     */
    moveNode(nodeId: string, targetParentId: string) {
        return Observable.fromPromise(this.apiService.getInstance().nodes.moveNode(nodeId, { targetParentId }))
            .catch(err => this.handleError(err));
    }

    /**
     * Create a new folder in the path.
     * @param name Folder name
     * @param parentId Parent folder ID
     */
    createFolder(name: string, parentId: string): Observable<MinimalNodeEntity> {
        return Observable.fromPromise(this.apiService.getInstance().nodes.createFolder(name, '/', parentId))
            .catch(err => this.handleError(err));
    }

    /**
     * Gets the folder node with the specified relative name path below the root node.
     * @param folder Path to folder.
     * @param opts Options.
     */
    getFolder(folder: string, opts?: any): Observable<NodePaging> {
        return Observable.fromPromise(this.getNodesPromise(folder, opts))
            .map(res => <NodePaging> res)
            .catch(err => this.handleError(err));
    }

    /**
     * Gets a folder node via its node ID.
     * @param nodeId ID of the folder node
     */
    getFolderNode(nodeId: string): Promise<MinimalNodeEntryEntity> {
        let opts: any = {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations']
        };

        let nodes: any = this.apiService.getInstance().nodes;
        return nodes.getNodeInfo(nodeId, opts);
    }

    /**
     * Get thumbnail URL for the given document node.
     * @param node Node to get URL for.
     */
    getDocumentThumbnailUrl(node: MinimalNodeEntity): string {
        return this.thumbnailService.getDocumentThumbnailUrl(node);
    }

    /**
     * Gets the icon that represents a MIME type.
     * @param mimeType MIME type to get the icon for
     */
    getMimeTypeIcon(mimeType: string): string {
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    /**
     * Gets a default icon for MIME types with no specific icon.
     */
    getDefaultMimeTypeIcon(): string {
        return this.thumbnailService.getDefaultMimeTypeIcon();
    }

    /**
     * Checks if a node has the specified permission.
     * @param node Target node
     * @param permission Permission level to query
     */
    hasPermission(node: any, permission: PermissionsEnum | string): boolean {
        return this.contentService.hasPermission(node, permission);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }
}
