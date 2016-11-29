import {Component, forwardRef, Input} from "@angular/core";
import {
    NG_VALUE_ACCESSOR,
    ControlValueAccessor,
    FormBuilder,
    Validators,
    FormGroup,
    NG_VALIDATORS,
    FormControl
} from "@angular/forms";
import {ComponentBase} from "../../../components/common/component-base";
import {CustomValidators} from "../../../validators/custom.validator";
import {ExpressionModel, CommandLineBindingModel} from "cwlts/models/d2sb";

@Component({
    selector: 'input-binding-section',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputBindingSectionComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => InputBindingSectionComponent), multi: true }
    ],
    template: `
    <div class="form-group" *ngIf="inputBindingFormGroup && propertyType">
    
            <div class="form-group" *ngIf="propertyType !== 'record'">
                <label>Value</label>
                <expression-input
                            [context]="context"
                            [formControl]="inputBindingFormGroup.controls['valueFrom']">
                </expression-input>
            </div>
        
            <div class="form-group">
                <label>Position</label>
                <input class="form-control"
                       type="text"
                       [formControl]="inputBindingFormGroup.controls['position']"/>
             </div>
        
            <div class="form-group">
                <label>Prefix</label>
                <input class="form-control"
                       [formControl]="inputBindingFormGroup.controls['prefix']"/>
            </div>
                   
           <div class="form-group">
               <label>Separator</label>
               <select class="form-control" 
                       [formControl]="inputBindingFormGroup.controls['separate']">
                       
                    <option *ngFor="let separatorOption of separatorOptions" 
                            [value]="separatorOption.value">
                        {{separatorOption.text}}
                    </option>
               </select>
           </div>
           
           <div class="form-group" *ngIf="propertyType === 'array'">
                <label>Item Separator</label>
                <select class="form-control" 
                        [formControl]="inputBindingFormGroup.controls['itemSeparator']">
                    <option *ngFor="let itemSeparator of itemSeparators" 
                            [value]="itemSeparator.value">
                        {{itemSeparator.text}}
                    </option>
                </select>
           </div>
    </div>
    `
})
export class InputBindingSectionComponent extends ComponentBase implements ControlValueAccessor {

    /** The type of the property as an input, so we can react to changes in the component */
    @Input()
    public propertyType: string;

    private inputBinding: CommandLineBindingModel;

    private valueFrom: ExpressionModel;

    private inputBindingFormGroup: FormGroup;

    private onTouched = () => { };

    private propagateChange = (_) => {};

    private separatorOptions: {text: string, value: boolean}[] = [
        { text: "space", value: true },
        { text: "empty string", value: false }
    ];

    private itemSeparators: {text: string, value: string}[] = [
        { text: "equal", value: "=" },
        { text: "comma", value: "," },
        { text: "semicolon", value: ";" },
        { text: "space", value: " " },
        { text: "repeat", value: null }
    ];

    constructor(private formBuilder: FormBuilder) {
        super();
    }

    private writeValue(value: {inputBinding: CommandLineBindingModel, valueFrom: ExpressionModel}): void {
        this.inputBinding = value.inputBinding;
        this.valueFrom = !!value.valueFrom? value.valueFrom: new ExpressionModel(value.inputBinding.loc, "");

        if (!!this.inputBinding && !!this.valueFrom) {
            this.createInputBindingForm(this.inputBinding, this.valueFrom);
            this.inputBindingFormGroup.updateValueAndValidity();
        }
    }

    private ngOnChanges(): void {
        if (!!this.inputBindingFormGroup) {
            this.inputBindingFormGroup.updateValueAndValidity();
        }
    }

    private registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    private registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    private validate(c: FormControl) {
        if (!!this.inputBindingFormGroup) {
            return !!this.inputBindingFormGroup.valid ? null: { error: "Input binding section is not valid." }
        }
    }

    private createInputBindingForm(inputBinding: CommandLineBindingModel, valueFrom: ExpressionModel): void {
        this.inputBindingFormGroup = this.formBuilder.group({
            valueFrom: [valueFrom, [CustomValidators.cwlModel]],
            position:        [inputBinding.position, [Validators.pattern(/^\d+$/)]],
            prefix:          [inputBinding.prefix],
            separate:        [!!inputBinding.separate? inputBinding.separate: true],
            itemSeparator:   [!!inputBinding.itemSeparator? inputBinding.itemSeparator : null]
        });

        this.listenToInputBindingFormChanges();
    }

    private listenToInputBindingFormChanges(): void {
        this.tracked = this.inputBindingFormGroup.valueChanges
            .distinctUntilChanged()
            .debounceTime(300)
            .subscribe(value => {
                this.setInputBindingProperty(this.inputBindingFormGroup, 'position', Number(value.position));
                this.setInputBindingProperty(this.inputBindingFormGroup, 'prefix', value.prefix);
                this.setInputBindingProperty(this.inputBindingFormGroup, 'separate', JSON.parse(value.separate));
                this.setInputBindingProperty(this.inputBindingFormGroup, 'itemSeparator', value.itemSeparator);

                if (this.inputBindingFormGroup.controls['valueFrom'].valid) {
                    this.valueFrom = value.valueFrom;
                } else {
                    this.valueFrom = value.undefined;
                }

                this.propagateChange({
                    inputBinding: this.inputBinding,
                    valueFrom: this.valueFrom
                });
            });
    }

    private setInputBindingProperty(form: FormGroup, propertyName: string, newValue: any): void {
        if (form.controls[propertyName].valid) {
            this.inputBinding[propertyName] = newValue;
        } else {
            this.inputBinding[propertyName] = undefined;
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}