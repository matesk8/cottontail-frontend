import {Component, OnInit, Input, OnDestroy} from "@angular/core";
import {Subscription, ReplaySubject, BehaviorSubject} from "rxjs";
import {CodeEditorComponent} from "../code-editor/code-editor.component";
import {ValidationResponse} from "../../services/web-worker/json-schema/json-schema.service";
import {DataEntrySource} from "../../sources/common/interfaces";
import {WebWorkerService} from "../../services/web-worker/web-worker.service";

@Component({
    selector: 'ct-workflow-editor',
    directives: [CodeEditorComponent],
    template: `
        <div class="editor-container">
            <tool-header class="editor-header"
                         (save)="save($event)"
                         [fileIsValid]="isValidCWL"
                         [data]="data"></tool-header>
        
            <div class="scroll-content">
                <ct-code-editor [hidden]="viewMode !== 'code'"
                                (contentChanges)="onEditorContentChange($event)"
                                [content]="data.content"
                                [readOnly]="!data.isWritable"
                                [language]="data.language"></ct-code-editor>
        
                <div [hidden]="viewMode !== 'gui'">
                    Workflow Editor Coming Soon
                </div>
            </div>
        
            <div class="status-bar-footer">
                <div class="left-side">
                    <validation-issues [issuesStream]="schemaValidation" [show]="showValidation" (select)="showValidation = !showValidation"></validation-issues>
                </div>
                <div class="right-side">
                    <ct-view-mode-switch [viewMode]="viewMode"
                                         [disabled]="!isValidCWL"
                                         (switch)="viewMode = $event"></ct-view-mode-switch>
                </div>
            </div>
        </div>
`
})
export class WorkflowEditorComponent implements OnInit, OnDestroy {
    @Input()
    public data: DataEntrySource;

    public schemaValidation = new ReplaySubject<ValidationResponse>(1);

    /** Default view mode. */
    private viewMode: "code"|"gui" = "code";

    /** Flag for validity of CWL document */
    private isValidCWL = true;

    /** List of subscriptions that should be disposed when destroying this component */
    private subs: Subscription[] = [];

    /** Flag for showing validation panel. Because it is currently the only panel, there is a flag
     *  otherwise, WF editor should have same implementation as Tool editor */
    private showValidation = false;

    private rawEditorContent = new BehaviorSubject("");

    constructor(private webWorkerService: WebWorkerService) {

    }

    ngOnInit(): void {

        this.data.content.subscribe(this.rawEditorContent);

        this.webWorkerService.validationResultStream
            .subscribe(this.schemaValidation);

        this.webWorkerService.validationResultStream.subscribe(err => {
            this.isValidCWL = err.isValidCwl;
        });
    }

    private onEditorContentChange(content: string) {
        this.webWorkerService.validateJsonSchema(content);
        this.rawEditorContent.next(content);

    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    private save(revisionNote){

        if (this.data.data.source === "local") {
            this.data.data.save(this.rawEditorContent.getValue()).subscribe(_ => {
            });
        } else {
            this.data.save(JSON.parse(this.rawEditorContent.getValue()), revisionNote).subscribe(data => {
            });
        }

    }
}