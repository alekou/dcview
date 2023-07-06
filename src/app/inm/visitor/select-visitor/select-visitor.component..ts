import {Component, ElementRef, EventEmitter, Input, OnChanges, Optional, Output, Renderer2, SimpleChanges, SkipSelf} from '@angular/core';
import {ControlContainer, DefaultValueAccessor} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {VisitorService} from '../visitor.service';
import {VisitorListDialogComponent} from '../visitor-list-dialog/visitor-list-dialog.component';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';

@Component({
  selector: 'app-select-visitor',
  templateUrl: 'select-visitor.component.html',
  styleUrls: ['./select-visitor.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new Optional(), new SkipSelf(), ControlContainer]]
    }
  ]
})
export class SelectVisitorComponent extends DefaultValueAccessor implements OnChanges {

  @Input() model: number;
  @Output() modelChange = new EventEmitter<number>();

  @Input() name: string;
  @Input() disabled = false;

  @Input() canCreate = false;
  @Input() searchLawyer = false;

  visitorLabel: string;
  labelVisible = false; // Μπήκε γιατί δε γινόταν σωστά το autoResize του textarea

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private controlContainer: ControlContainer,
    private translate: TranslateService,
    private dialogService: DialogService,
    private visitorService: VisitorService,
    private toitsuToasterService: ToitsuToasterService
  ) {
    super(renderer, elementRef, true);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.model) {
      this.setVisitorLabel(this.model);
    }
  }

  emitModelChange() {
    this.modelChange.emit(this.model);
  }

  writeValue(value: any) {
    super.writeValue(value);
    this.model = value;
    this.emitModelChange();
    this.setVisitorLabel(value);
  }

  setVisitorLabel(id) {
    if (id) {
      this.visitorService.getVisitorMini(id).subscribe(responseData => {
        if (responseData) {
          let visitorLabel = '';

          if (responseData['adt']) {
            visitorLabel += '[' + responseData['adt'] + '] ';
          }
          if (responseData['lastName']) {
            visitorLabel += responseData['lastName'];
          }
          if (responseData['firstName']) {
            visitorLabel += ' ' + responseData['firstName'];
          }
          this.visitorLabel = visitorLabel;
        }
        else {
          this.visitorLabel = '-';
        }
      }).add(() => {
        this.resizeLabel();
      });
    }
    else {
      this.visitorLabel = null;
      this.resizeLabel();
    }
  }

  hasId() {
    return !!(this.model);
  }

  removeRecord() {
    this.writeValue(null);
    this.resizeLabel();
  }

  resizeLabel() {
    this.labelVisible = false;
    setTimeout(() => {
      this.labelVisible = true;
    });
  }

  dialogTitle = 'visitor.select.dialogTitle';
  openListDialog() {
    
    if (this.searchLawyer) {
      this.dialogTitle = 'visitor.select.dialogTitleLawyer';
    }
    
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(VisitorListDialogComponent, {
      header: this.translate.instant(this.dialogTitle),
      width: '95%',
      data: {
        canCreate: this.canCreate,
        searchLawyer: this.searchLawyer
      }
    });

    dialogRef.onClose.subscribe((result) => {
      this.writeValue(result);
    });
  }
}
