import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-tr-report-create',
  template: ''
})
export class ReportCreateComponent implements OnInit {
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit() {
    let reportParams = {
      application: this.activatedRoute.snapshot.params['application'],
      templateId: this.activatedRoute.snapshot.params['templateId'],
      entity: this.activatedRoute.snapshot.params['entity'],
      entityId: this.activatedRoute.snapshot.params['entityId'],
      entityIdColName: this.activatedRoute.snapshot.params['entityIdColName']
    };
    
    if (reportParams.application === 'INM'){
      this.router.navigateByUrl('/inm/report/view', {state: reportParams});
    }
    else if (reportParams.application === 'MED'){
      this.router.navigateByUrl('/med/report/view', {state: reportParams});
    }

  }
}
