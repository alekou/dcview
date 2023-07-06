import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {ReportService} from './report.service';

@Injectable({providedIn: 'root'})
export class ReportResolver implements Resolve<any> {
  
  constructor(private reportService: ReportService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.reportService.getReport(route.paramMap.get('id'));
  }
}
