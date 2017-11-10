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

import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { FormModule } from '../../form';
import { AppConfigService, CommentProcessService, ServicesModule, TranslationService } from '@adf/core';
import { AppConfigServiceMock } from '../assets/app-config.service.mock';
import { TranslationMock } from '../assets/translation.service.mock';

import { DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material';
import { PeopleProcessService } from '@adf/core';
import { DataTableModule } from '@adf/core';
import { TaskListService } from './../services/tasklist.service';
import { CommentListComponent } from './comment-list.component';
import { CommentsComponent } from './comments.component';

describe('CommentsComponent', () => {

    let service: TaskListService;
    let component: CommentsComponent;
    let fixture: ComponentFixture<CommentsComponent>;
    let getCommentsSpy: jasmine.Spy;
    let addCommentSpy: jasmine.Spy;
    let commentProcessService: CommentProcessService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ServicesModule,
                FormModule,
                DataTableModule,
                MatInputModule
            ],
            declarations: [
                CommentsComponent,
                CommentListComponent
            ],
            providers: [
                TaskListService,
                DatePipe,
                PeopleProcessService,
                { provide: TranslationService, useClass: TranslationMock },
                { provide: AppConfigService, useClass: AppConfigServiceMock },
                CommentProcessService
            ]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommentsComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(TaskListService);
        commentProcessService = fixture.debugElement.injector.get(CommentProcessService);

        getCommentsSpy = spyOn(commentProcessService, 'getTaskComments').and.returnValue(Observable.of([
            { message: 'Test1', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'} },
            { message: 'Test2', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'} },
            { message: 'Test3', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'} }
        ]));
        addCommentSpy = spyOn(commentProcessService, 'addTaskComment').and.returnValue(Observable.of({id: 123, message: 'Test Comment', createdBy: {id: '999'}}));

    });

    it('should load comments when taskId specified', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });

        expect(getCommentsSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading comments', () => {
        let emitSpy = spyOn(component.error, 'emit');
        getCommentsSpy.and.returnValue(Observable.throw({}));

        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });

        expect(emitSpy).toHaveBeenCalled();
    });

    it('should not load comments when no taskId is specified', () => {
        fixture.detectChanges();
        expect(getCommentsSpy).not.toHaveBeenCalled();
    });

    it('should display comments when the task has comments', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelectorAll('#comment-message').length).toBe(3);
            expect(fixture.nativeElement.querySelector('#comment-message:empty')).toBeNull();
        });
    }));

    it('should display comments count when the task has comments', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let element = fixture.nativeElement.querySelector('#comment-header');
            expect(element.innerText).toBe('ADF_TASK_LIST.DETAILS.COMMENTS.HEADER');
        });
    });

    it('should not display comments when the task has no comments', async(() => {
        component.taskId = '123';
        getCommentsSpy.and.returnValue(Observable.of([]));
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('#comment-container')).toBeNull();
        });
    }));

    it('should display comments input by default', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('#comment-input')).not.toBeNull();
        });
    }));

    it('should not display comments input when the task is readonly', async(() => {
        component.readOnly = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('#comment-input')).toBeNull();
        });
    }));

    describe('change detection', () => {

        let change = new SimpleChange('123', '456', true);
        let nullChange = new SimpleChange('123', null, true);

        beforeEach(async(() => {
            component.taskId = '123';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                getCommentsSpy.calls.reset();
            });
        }));

        it('should fetch new comments when taskId changed', () => {
            component.ngOnChanges({ 'taskId': change });
            expect(getCommentsSpy).toHaveBeenCalledWith('456');
        });

        it('should not fetch new comments when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getCommentsSpy).not.toHaveBeenCalled();
        });

        it('should not fetch new comments when taskId changed to null', () => {
            component.ngOnChanges({ 'taskId': nullChange });
            expect(getCommentsSpy).not.toHaveBeenCalled();
        });
    });

    describe('Add comment', () => {

        beforeEach(async(() => {
            component.taskId = '123';
            fixture.detectChanges();
            fixture.whenStable();
        }));

        it('should call service to add a comment when enter key is pressed', async(() => {
            let event = new KeyboardEvent('keyup', {'key': 'Enter'});
            let element = fixture.nativeElement.querySelector('#comment-input');
            component.message = 'Test Comment';
            element.dispatchEvent(event);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(addCommentSpy).toHaveBeenCalled();
                let elements = fixture.nativeElement.querySelectorAll('#comment-message');
                expect(elements.length).toBe(1);
                expect(elements[0].innerText).toBe('Test Comment');
            });
        }));

        it('should not call service to add a comment when comment is empty', async(() => {
            let event = new KeyboardEvent('keyup', {'key': 'Enter'});
            let element = fixture.nativeElement.querySelector('#comment-input');
            component.message = '';
            element.dispatchEvent(event);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(addCommentSpy).not.toHaveBeenCalled();
            });
        }));

        it('should clear comment when escape key is pressed', async(() => {
            let event = new KeyboardEvent('keyup', {'key': 'Escape'});
            let element = fixture.nativeElement.querySelector('#comment-input');
            component.message = 'Test comment';
            element.dispatchEvent(event);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                element = fixture.nativeElement.querySelector('#comment-input');
                expect(element.value).toBe('');
            });
        }));

        it('should emit an error when an error occurs adding the comment', () => {
            let emitSpy = spyOn(component.error, 'emit');
            addCommentSpy.and.returnValue(Observable.throw({}));
            component.message = 'Test comment';
            component.add();
            expect(emitSpy).toHaveBeenCalled();
        });

    });

});
