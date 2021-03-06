import {Component, OnDestroy, Input} from "@angular/core";
import {InputPortService} from "../../../../services/input-port/input-port.service";
import {Subscription} from "rxjs/Subscription";
import {InputSidebarService} from "../../../../services/sidebars/input-sidebar.service";
import {CommandInputParameterModel as InputProperty} from "cwlts/models/d2sb";

@Component({
    selector: "input-port-list",
    template: `<div *ngIf="portList.length > 0">

            <div class="gui-section-list-title">
                <div class="col-sm-4">ID</div>
                <div class="col-sm-3">Type</div>
                <div class="col-sm-5">Binding</div>
            </div>
        
            <ul class="gui-section-list">
        
                <li class="gui-section-list-item clickable validatable"
                    [class.error]="input.validation.errors.length"
                    [class.warning]="input.validation.warnings.length"
                    [class.selected]="i === selectedIndex"
                    *ngFor="let input of portList; let i = index">
                    <!-- @todo: temporarily removing edit method -->
        
                    <div class="col-sm-4" [title]="input.id">
                        <i class="fa fa-warning validation-icon"
                           [title]="input.validation.warnings.join('\\n')"
                           *ngIf="input.validation.warnings.length"></i>
                        <i class="fa fa-times-circle validation-icon"
                           *ngIf="input.validation.errors.length"
                           [title]="input.validation.errors.join('\\n')"></i>
        
                        <span class="ellipsis">
                            {{input.id}}
                        </span>
                    </div>
        
                    <div class="col-sm-3 ellipsis" [title]="input.type">
                        {{ input.type | commandParameterType }}
                    </div>
        
                    <div class="col-sm-4 ellipsis" [title]="input.isRequired">
                        {{ input.inputBinding | commandInputBinding }}
                    </div>
        
                    <div class="col-sm-1 pull-right tool-input-icon">
                        <i class="fa fa-trash"
                           aria-hidden="true"
                           (click)="removeProperty($event, i)"></i>
                    </div>
                </li>
            </ul>
        </div> <!-- List end -->
        
        <div *ngIf="portList.length === 0" class="col-sm-12">
            No input ports defined.
        </div>
    `
})
export class InputPortListComponent implements OnDestroy {

    @Input()
    private selectedIndex: number;

    @Input()
    private context: any;

    private portList: Array<InputProperty> = [];

    private subs: Subscription[];

    constructor(private inputPortService: InputPortService,
                private inputSidebarService: InputSidebarService) {
        this.subs = [];

        this.inputPortService.inputPorts.subscribe((viewModelPortList: InputProperty[]) => {
            this.portList = viewModelPortList;
        });
    }

    private trackByIndex(index: number): any {
        return index;
    }

    private editProperty(index: number): void {
        this.selectedIndex = index;
        const selectedInputPort = this.portList[index];
        this.inputSidebarService.openInputInspector({
            inputProperty: selectedInputPort,
            context: this.context
        });
    }

    private removeProperty(event: Event, index: number): void {
        event.stopPropagation();
        this.inputPortService.deleteInputPort(index);

        if (this.selectedIndex === index) {
            this.inputSidebarService.closeInputInspector();
        }

        if (this.selectedIndex > index) {
            this.selectedIndex--;
        } else if (this.selectedIndex === index) {
            this.selectedIndex = undefined;
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
