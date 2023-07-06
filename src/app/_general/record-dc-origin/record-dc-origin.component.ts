import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AuthService} from '../../toitsu-auth/auth.service';
import {EnumService} from '../../cm/enum/enum.service';
import {DetentionCenterService} from '../../sa/detention-center/detention-center.service';

@Component({
  selector: 'app-record-dc-origin',
  templateUrl: 'record-dc-origin.component.html'
})
export class RecordDcOriginComponent implements OnInit, OnChanges {
  
  showRecordDcOrigin = false;
  
  @Input() recordDcOrigin: string = 'USER';
  @Output() recordDcOriginChange = new EventEmitter<string>();
  
  @Input() dcId: number;
  @Output() dcIdChange = new EventEmitter<number>();
  
  recordDcOrigins = [];
  detentionCenters = [];
  
  constructor(
    public authService: AuthService,
    private enumService: EnumService,
    private detentionCenterService: DetentionCenterService
  ) {
  }
  
  ngOnInit() {
    if (!this.authService.isMinistry()) {
      this.enumService.getEnumValues('global.core.enums.option.RecordDcOriginOption').subscribe(responseData => {
        this.recordDcOrigins = responseData;
      });
    }
    else {
      this.detentionCenterService.getDetentionCenters().subscribe(responseData => {
        this.detentionCenters = responseData;
      });
    }
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('recordDcOrigin') && changes['recordDcOrigin'].isFirstChange()) {
      this.showRecordDcOrigin = true;
    }
  }
  
  emitRecordDcOriginChange() {
    this.recordDcOriginChange.emit(this.recordDcOrigin);
  }
  
  emitDcIdChange() {
    this.dcIdChange.emit(this.dcId);
  }
}
