import {Component, ElementRef, EventEmitter, Input, OnChanges, Optional, Output, Renderer2, SimpleChanges, SkipSelf} from '@angular/core';
import {ControlContainer, DefaultValueAccessor} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';
import {VehicleService} from '../vehicle.service';
import {VehicleListDialogComponent} from '../vehicle-list-dialog/vehicle-list-dialog.component';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-select-vehicle',
  templateUrl: 'select-vehicle.component.html',
  styleUrls: ['./select-vehicle.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new Optional(), new SkipSelf(), ControlContainer]]
    }
  ]
})
export class SelectVehicleComponent extends DefaultValueAccessor implements OnChanges {

  @Input() model: number;
  @Output() modelChange = new EventEmitter<number>();

  @Input() name: string;
  @Input() inputId: string;
  @Input() disabled = false;
  @Input() canCreate = false;

  vehicleLabel: string;
  labelVisible = false; // Μπήκε γιατί δε γινόταν σωστά το autoResize του textarea

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private controlContainer: ControlContainer,
    private translate: TranslateService,
    private dialogService: DialogService,
    private vehicleService: VehicleService,
  ) {
    super(renderer, elementRef, true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.model) {
      this.setVehicleLabel(this.model);
    }
  }

  emitModelChange() {
    this.modelChange.emit(this.model);
  }

  writeVehicleValue(value: any) {
    super.writeValue(value);
    this.model = value;
    this.emitModelChange();
    this.setVehicleLabel(value);
  }

  setVehicleLabel(id) {
    if (id) {
      this.vehicleService.getVehicle(id).subscribe(responseData => {
        if (responseData) {
          let vehicleLabel = '';

          if (responseData['carModel']) {
            vehicleLabel += ' ' + responseData['carModel'];
          }
          if (responseData['plateNumber']) {
            vehicleLabel += ' (' + responseData['plateNumber'] + ')';
          }
          this.vehicleLabel = vehicleLabel;
        }
        else {
          this.vehicleLabel = '-';
        }
      }).add(() => {
        this.resizeLabel();
      });
    }
    else {
      this.vehicleLabel = null;
      this.resizeLabel();
    }
  }

  hasId() {
    return !!(this.model);
  }

  openVehicleListDialog() {
    const dialogRef = this.dialogService.open(VehicleListDialogComponent, {
      header: this.translate.instant('vehicle.select.dialogTitle'),
      width: '95%',
      data: {
        canCreate: this.canCreate
      }
    });

    dialogRef.onClose.subscribe((result) => {
      this.writeVehicleValue(result);
    });
  }

  removeRecord() {
    this.writeVehicleValue(null);
    this.resizeLabel();
  }

  resizeLabel() {
    this.labelVisible = false;
    setTimeout(() => {
      this.labelVisible = true;
    });
  }
}
