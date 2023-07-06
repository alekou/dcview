import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DetentionCenterService} from '../../sa/detention-center/detention-center.service';

@Component({
  selector: 'app-other-dc-name',
  templateUrl: 'other-dc-name.component.html',
  styleUrls: ['other-dc-name.component.css']
})
export class OtherDcNameComponent implements OnInit {
  
  @Input() dcId: number;
  dcName: string;
  
  constructor(
    public authService: AuthService,
    private detentionCenterService: DetentionCenterService
  ) {
  }
  
  ngOnInit() {
    if (this.dcId && this.authService.getUserDcId() !== this.dcId) {
      this.detentionCenterService.getName(this.dcId).subscribe(responseData => {
        this.dcName = responseData['name'];
      });
    }
  }
}
