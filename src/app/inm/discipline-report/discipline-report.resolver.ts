import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {DisciplineReportService} from './discipline-report.service';

@Injectable({providedIn: 'root'})
export class DisciplineReportResolver implements Resolve<any> {

  constructor(private disciplineReportService: DisciplineReportService) {}

  resolve(route: ActivatedRouteSnapshot)
  {
    return this.disciplineReportService.getDisciplineReport(route.paramMap.get('id'));
  }
}
