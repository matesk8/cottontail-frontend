import {Component, OnInit, Input, OnDestroy} from "@angular/core";
import {BlockLoaderComponent} from "../block-loader/block-loader.component";
import {CodeEditorComponent} from "../code-editor/code-editor.component";
import {CltEditorComponent} from "../clt-editor/clt-editor.component";
import {Subscription, ReplaySubject, BehaviorSubject} from "rxjs/Rx";
import {ToolHeaderComponent} from "./tool-header/tool-header.component";
import {ViewModeService} from "./services/view-mode.service";
import {CommandLineToolModel} from "cwlts/models/d2sb";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {CommandLineComponent} from "../clt-editor/commandline/commandline.component";
import {ViewModeSwitchComponent} from "../view-switcher/view-switcher.component";
import {DataEntrySource} from "../../sources/common/interfaces";
import {ValidationResponse} from "../../services/web-worker/json-schema/json-schema.service";
import {ValidationIssuesComponent} from "../validation-issues/validation-issues.component";
import {CommandLinePart} from "cwlts/models/helpers/CommandLinePart";
import {WebWorkerService} from "../../services/web-worker/web-worker.service";
import {ToolSidebarService} from "../../services/sidebars/tool-sidebar.service";

import {ExpressionSidebarService} from "../../services/sidebars/expression-sidebar.service";
import {InputSidebarService} from "../../services/sidebars/input-sidebar.service";


require("./tool-editor.component.scss");

@Component({
    selector: "ct-tool-editor",
    providers: [ViewModeService, WebWorkerService, ToolSidebarService, ExpressionSidebarService, InputSidebarService],
    directives: [
        CodeEditorComponent,
        CltEditorComponent,
        BlockLoaderComponent,
        ToolHeaderComponent,
        CommandLineComponent,
        SidebarComponent,
        ViewModeSwitchComponent,
        ValidationIssuesComponent
    ],
    template: `
        <div class="editor-container">
            <tool-header class="editor-header"
                         (save)="save($event)"
                         [fileIsValid]="isValidCwl"
                         [data]="data"></tool-header>
        
            <div class="scroll-content">
                <ct-code-editor [hidden]="viewMode !== 'code'"
                                (contentChanges)="onEditorContentChange($event)"
                                [content]="data.content"
                                [readOnly]="!data.isWritable"
                                [language]="data.language">
                </ct-code-editor>
        
                <ct-clt-editor *ngIf="viewMode === 'gui'"
                               class="gui-editor-component"
                               [model]="toolModel"
                               [fileStream]="tabData">
                </ct-clt-editor>
        
                <sidebar-component></sidebar-component>
            </div>
            <div class="status-bar-footer">
                <div class="left-side">
                    <validation-issues [issuesStream]="schemaValidation"></validation-issues>
                    <commandline [commandLineParts]="commandLineParts"></commandline>
                </div>
                <div class="right-side">
                    <ct-view-mode-switch [viewMode]="viewMode"
                                         [disabled]="!guiAvailable"
                                         (onSwitch)="viewMode = $event">
                    </ct-view-mode-switch>
                </div>
            </div>
        </div>
    `
})
export class ToolEditorComponent implements OnInit, OnDestroy {
    @Input()
    public data: DataEntrySource;

    public schemaValidation = new ReplaySubject<ValidationResponse>(1);

    /** Default view mode. */
    private viewMode: "code"|"gui" = "code";

    private toolModel = new CommandLineToolModel();

    private commandLineParts: CommandLinePart[];

    /** Flag for validity of CWL document */
    private guiAvailable = true;

    /** List of subscriptions that should be disposed when destroying this component */
    private subs: Subscription[] = [];

    private rawEditorContent = new BehaviorSubject("");

    constructor(private webWorkerService: WebWorkerService) {

    }

    ngOnInit(): void {

        this.data.content.subscribe(this.rawEditorContent);

        this.webWorkerService.validationResultStream
            .subscribe(this.schemaValidation);

        this.rawEditorContent.subscribe(raw => {
            try {
                this.toolModel = new CommandLineToolModel(JSON.parse(raw));
                this.commandLineParts = this.toolModel.getCommandLineParts();
            } catch (ex) {
                // if the file isn't valid JSON, do nothing
            }
        });

        this.webWorkerService.validationResultStream.subscribe(err => {
            this.guiAvailable = err.isValidCwl;
        });
    }

    private onEditorContentChange(content: string){
        this.webWorkerService.validateJsonSchema(content);
        this.rawEditorContent.next(content);

    }

    private save(revisionNote){

        this.data.save(JSON.parse(this.rawEditorContent.getValue()), revisionNote).subscribe(data => {

        });
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}