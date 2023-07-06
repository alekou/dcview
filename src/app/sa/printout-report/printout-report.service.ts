import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {printoutReportConsts} from './printout-report.consts';

@Injectable({providedIn: 'root'})
export class PrintoutReportService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getPrintoutReport(id) {
    return this.http
      .get(
        environment.apiBaseUrl + printoutReportConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  savePrintoutReport(printoutReport) {
    return this.http
      .post(
        environment.apiBaseUrl + printoutReportConsts.saveUrl,
        printoutReport
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getPrintoutReportByName(name) {
    return this.http
      .get(
        environment.apiBaseUrl + printoutReportConsts.getByName,
        {
          params: this.toitsuSharedService.initHttpParams({name})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getPrintoutReportListBySection(dcSection) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + printoutReportConsts.getListBySection,
        {
          params: this.toitsuSharedService.initHttpParams({dcSection})
        }
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
