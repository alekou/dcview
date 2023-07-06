import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {GenParameter} from '../gen-parameter.model';
import {GenParameterListDialogComponent} from '../gen-parameter-list-dialog/gen-parameter-list-dialog.component';
import {GenParameterViewDialogComponent} from '../gen-parameter-view-dialog/gen-parameter-view-dialog.component';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';

@Component({
  selector: 'app-select-gen-parameter',
  templateUrl: 'select-gen-parameter.component.html'
})
export class SelectGenParameterComponent implements OnChanges {
  
  @Input() model: number;
  @Output() modelChange = new EventEmitter<number>();
  
  @Input() models: number[];
  @Output() modelsChange = new EventEmitter<number[]>();
  
  @Input() name: string;
  @Input() disabled = false;
  @Input() type: any = {};
  @Input() hideAdd = false;
  @Input() multipleSelection = false;
  
  genParameters = [];
  
  constructor(
    private translate: TranslateService,
    private dialogService: DialogService,
    private toitsuToasterService: ToitsuToasterService,
  ) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    
   if (changes.type && this.type.category) {
     if (!this.type.isBigList || this.type.genParameters) {
       if (!this.models && this.multipleSelection) {
         this.models = [];
       }
       this.genParameters = this.type.genParameters;
     }
   }
  }

  /**
   * Έλεγχος αν υπάρχει τιμή στο component ή όχι. Λαμβάνονται υπόψη οι περιπτώσεις με ή χωρίς multipleSelection.
   */
  hasModel() {
    if (!this.multipleSelection) {
      return this.model;
    }
    else {
      return (this.models && this.models.length > 0);
    }
  }
  
  emitModelChange() {
    this.modelChange.emit(this.model);
  }
  
  emitModelsChange() {
    this.models = Object.assign([], this.models);
    // this.models = [...this.models];
    this.modelsChange.emit(this.models);
  }
  
  removeRecord() {
    this.model = null;
    this.models = [];
    this.emitModelChange();
    this.emitModelsChange();
  }
  
  openListDialog() {
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(GenParameterListDialogComponent, {
      header: this.type.description,
      width: '85%',
      data: {
        category: this.type.category,
        isHierarchical: this.type.isHierarchical,
        isBigList: this.type.isBigList,
        genParameterDescription: this.type.description,
        isEditable: this.type.isEditable,
        hideAdd: this.hideAdd,
        multipleSelection: this.multipleSelection
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (!this.multipleSelection) {
        if (result) {
          // Έλεγχος αν υπάρχει το παραμετρικό στη λίστα
          const foundResult = this.genParameters.find((storedGenParameter: GenParameter) => {
            return storedGenParameter.id === result.id;
          });
          // Αν υπάρχει δεν είναι νέα εγγραφή
          if (foundResult) {
            this.model = result.id;
            this.emitModelChange();
          }
          else {
            // Αλλιώς το προσθέτουμε στη λίστα με τα παραμετρικά
            this.genParameters.push(result);
            this.model = result.id;
            this.emitModelChange();
          }
        }
      }
      else {
        if (result) {
          for (let i = 0; i < result.length; i++) {
            // Έλεγχος αν υπάρχει το παραμετρικό στη λίστα
            const foundResult = this.genParameters.find((storedGenParameter: GenParameter) => {
              return storedGenParameter.id === result[i].id;
            });
            
            if (!foundResult) {
              this.genParameters.push(result[i]);
              this.models.push(result[i].id);
            }
            else {
              const foundParameterId = this.models.find(genParameterId => {
                return genParameterId === result[i].id;
              });

              if (!foundParameterId) {
                this.models.push(result[i].id);
              }
            }
          }
          this.emitModelsChange();
        }
      }
    });
  }
  
  openViewDialog() {
    this.toitsuToasterService.clearMessages();
    let genParameter: GenParameter = new GenParameter();
    const dialogRef = this.dialogService.open(GenParameterViewDialogComponent, {
      header: this.translate.instant('genParameter.dialog.title.create'),
      width: '50%',
      data: {
        genParameter: genParameter,
        category: this.type.category,
        isHierarchical: this.type.isHierarchical,
        genParameterDescription: this.type.description,
        hideCheckBox: true
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
     if (result) {
       this.genParameters.push(result);
       if (!this.multipleSelection) {
         this.model = result.id;
         this.emitModelChange();
       }
       else {
         this.models.push(result.id);
         this.emitModelsChange();
       }
     }
    });
  }
}
