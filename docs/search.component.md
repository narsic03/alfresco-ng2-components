---
Added: v2.0.0
Status: Active
---
# Search component

Searches items for supplied search terms. 

## Basic usage

```html
<adf-search 
    [searchTerm]="searchTerm"
    (resultLoaded)="showSearchResult($event)">
</adf-search>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| displayWith | `(value: any) => string` | `null` | Function that maps an option's value to its display value in the trigger.  |
| maxResults | `number` | `20` | Maximum number of results to show in the search.  |
| skipResults | `number` | `0` | Number of results to skip from the results pagination.  |
| queryBody | `QueryBody` |  |  |
| searchTerm | `string` | `''` | Search term to use when executing the search. Updating this value will run a new search and update the results. |
| classList | `string` |  | CSS class for display.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| resultLoaded | `EventEmitter<NodePaging>` | Emitted when search results have fully loaded. |
| error | `EventEmitter<any>` | Emitted when an error occurs. |

## Details

### Customise Search Results

You have to add a template that will be shown when the results are loaded.

```html
<adf-search [searchTerm]="searchTerm">
    <ng-template let-result>
        <ul>
            <li *ngFor="let item of result?.list?.entries">
                {{ item?.entry.name }}
            </li>
        </ul>
    </ng-template>
</adf-search>
```

The results are provided via the [$implicit variable of angular2](https://angular.io/api/common/NgTemplateOutlet) and can be accessed via the sugar sintax 'let-yourChosenName'. As per example above the result will be something like : 

![adf-search-control](docassets/images/search-component-simple-template.png)

But you can define even a more complex template : 

```html
<adf-search class="adf-search-result-autocomplete"
            [rootNodeId]="liveSearchRoot"
            [resultType]="liveSearchResultType"
            [resultSort]="liveSearchResultSort"
            [maxResults]="liveSearchMaxResults">
    <ng-template let-data>
        <mat-list *ngIf="isSearchBarActive()" id="autocomplete-search-result-list">
            <mat-list-item
                *ngFor="let item of data?.list?.entries; let idx = index"
                id="result_option_{{idx}}"
                [tabindex]="0"
                (focus)="onFocus($event)"
                (blur)="onBlur($event)"
                class="adf-search-autocomplete-item"
                (click)="elementClicked(item)"
                (keyup.enter)="elementClicked(item)">
                <mat-icon mat-list-icon>
                    <img [src]="getMimeTypeIcon(item)" />
                </mat-icon>
                    <h4 mat-line id="result_name_{{idx}}"
                        *ngIf="highlight; else elseBlock"
                        class="adf-search-fixed-text"
                        [innerHtml]="item.entry.name | highlight: searchTerm">
                        {{ item?.entry.name }}</h4>
                    <ng-template #elseBlock>
                        <h4 class="adf-search-fixed-text" mat-line id="result_name_{{idx}}" [innerHtml]="item.entry.name"></h4>
                    </ng-template>
                    <p mat-line class="adf-search-fixed-text"> {{item?.entry.createdByUser.displayName}} </p>
            </mat-list-item>
            <mat-list-item
                id="search_no_result"
                *ngIf="data?.list?.entries.length === 0">
                <p mat-line class="adf-search-fixed-text">{{ 'SEARCH.RESULTS.NONE' | translate:{searchTerm: searchTerm} }}</p>
            </mat-list-item>
        </mat-list>
    </ng-template>
</adf-search>
```

Which will look like :

![adf-search-control](docassets/images/search-component-complex-template.png)

### Attach an input field to the search

You can also attach your input field to the adf-search component via the trigger [searchAutocomplete]
Yuo can do this by exporting the adf-search panel instance into a local template variable (here we called it "search"), and binding that variable to the input's searchAutocomplete property.

```html
<input type="text" [searchAutocomplete]="search">

<adf-search #search="searchAutocomplete">
    <ng-template let-result>
        <span *ngFor="let item of result?.list?.entries">
            {{ item?.entry.name }}
        </span>
    </ng-template>
</adf-search>        
```

In this way it is possible to fetch the results from the word typed into the input text straight into the adf-search component via the custom template variable.

### Custom search configuration

You can get finer control over the parameters of a search by defining them in a custom
[QueryBody](https://github.com/Alfresco/alfresco-js-api/blob/1.6.0/src/alfresco-search-rest-api/docs/QueryBody.md)
object. The recommended way to do this is with a custom implementation of the
[Search Configuration interface](search-configuration.interface.md) (the `queryBody` parameter of the `Search component` is now deprecated). The ADF source provides a standard implementation of this
interface, `SearchConfigurationService` that you can use as a base to adapt to your needs. See the
[Search Configuration interface](search-configuration.interface.md) page for full details of how to
customize your search.

## See Also

-   [Search configuration interface](search-configuration.interface.md)
-   [Search configuration service](search-configuration.service.md)
