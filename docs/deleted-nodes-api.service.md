---
Added: v2.0.0
Status: Active
---
# Deleted Nodes Api service

Gets a list of Content Services nodes currently in the trash.

## Methods

-   `getDeletedNodes(options?: Object): Observable<NodePaging>`  
    Gets a list of nodes in the trash.  
    -   `options` - (Optional) Options for JSAPI call

## Details

The `getDeletedNodes` method returns a NodePaging object that lists
the items in the trash (see [Document Library model](document-library.model.md) for
more information about this class). The format of the `options` parameter is
described in the [getDeletedNodes](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodesApi.md#getDeletedNodes)
page of the Alfresco JS API docs.

## See also

-   [Nodes api service](nodes-api.service.md)
-   [Node service](node.service.md)
