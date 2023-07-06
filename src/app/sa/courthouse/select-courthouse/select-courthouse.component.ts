import {Component, ElementRef, EventEmitter, Input, OnChanges, Optional, Output, Renderer2, SimpleChanges, SkipSelf} from '@angular/core';
import {ControlContainer, DefaultValueAccessor} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {CourthouseService} from '../courthouse.service';
import {CourthouseListDialogComponent} from '../courthouse-list-dialog/courthouse-list-dialog.component';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
@Component({
  selector: 'app-select-courthouse',
  templateUrl: 'select-courthouse.component.html',
  styleUrls: ['./select-courthouse.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new Optional(), new SkipSelf(), ControlContainer]]
    }
  ]
})
export class SelectCourthouseComponent extends DefaultValueAccessor implements OnChanges {

  @Input() model: number;
  @Output() modelChange = new EventEmitter<number>();

  @Input() name: string;
  @Input() disabled = false;

  courthouseLabel: string;
  labelVisible = false; // Μπήκε γιατί δε γινόταν σωστά το autoResize του textarea

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private controlContainer: ControlContainer,
    private translate: TranslateService,
    private dialogService: DialogService,
    private courthouseService: CourthouseService,
    private toitsuToasterService: ToitsuToasterService
  ) {
    super(renderer, elementRef, true);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.model) {
      this.setCourthouseLabel(this.model);
    }
  }

  emitModelChange() {
    this.modelChange.emit(this.model);
  }

  writeValue(value: any) {
    super.writeValue(value);
    this.model = value;
    this.emitModelChange();
    this.setCourthouseLabel(value);
  }

  setCourthouseLabel(id) {
    if (id) {
      this.courthouseService.getCourthouse(id).subscribe(responseData => {
        if (responseData) {
          let courthouseLabel = '';

          if (responseData['name']) {
            courthouseLabel += responseData['name'];
          }
          this.courthouseLabel = courthouseLabel;
        }
        else {
          this.courthouseLabel = '-';
        }
      }).add(() => {
        this.resizeLabel();
      });
    }
    else {
      this.courthouseLabel = null;
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

  openListDialog() {
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(CourthouseListDialogComponent, {
      header: this.translate.instant('courthouse.select.dialogTitle'),
      width: '95%'
    });

    dialogRef.onClose.subscribe((result) => {
      this.writeValue(result);
    });
  }
}
