import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {reportConsts} from './report.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class ReportService {
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getReport(id) {
    return this.http
      .get(
        environment.apiBaseUrl + reportConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveReport(report) {
    return this.http
      .post(
        environment.apiBaseUrl + reportConsts.saveUrl,
        report
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  createReport(reportParams) {
    
    let requestBody = {};
    if (reportParams.id) {
      requestBody = reportParams;
   
     
    }else {
      
      requestBody['application'] = reportParams['application'];
      requestBody['templateId'] = reportParams['templateId'];
      requestBody['entity'] = reportParams['entity'];
      requestBody['entityId'] = reportParams['entityId'];
      requestBody['protocolNo'] = reportParams['protocolNo'];
      requestBody['protocolDate'] = reportParams['protocolDate'];
    }
    
    let requestParams = {};
    if (reportParams && reportParams['entityIdColName']) {
      requestParams[reportParams['entityIdColName']] = reportParams['entityId'];
    }
    
    return this.http
      .post(
        environment.apiBaseUrl + reportConsts.createUrl,
        requestBody,
        {
          params: this.toitsuSharedService.initHttpParams(requestParams),
        }
      );
  }

  recreateReport(reportParams) {

    let reportDtoParams = {};
    if (reportParams) {
      reportDtoParams['application'] = reportParams['application'];
      reportDtoParams['templateId'] = reportParams['templateId'];
      reportDtoParams['entity'] = reportParams['entity'];
      reportDtoParams['entityId'] = reportParams['entityId'];
      reportDtoParams['protocolNo'] = reportParams['protocolNo'];
      reportDtoParams['protocolDate'] = reportParams['protocolDate'];
    }

    let requestParams = {};
    if (reportParams && reportParams['entityIdColName']) {
      requestParams[reportParams['entityIdColName']] = reportParams['entityId'];
    }

    return this.http
      .post(
        environment.apiBaseUrl + reportConsts.recreateUrl,
        reportParams
      );
  }
}
