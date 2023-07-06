import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {printoutConsts} from './printout.consts';

@Injectable({providedIn: 'root'})
export class PrintoutService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  createPrintoutHtml(printoutName, args) {
    return this.http
      .post(
        environment.apiBaseUrl + printoutConsts.createHtmlUrl,
        args,
        {
          params: this.toitsuSharedService.initHttpParams({printoutName})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  createPrintoutPdf(printoutName, args) {
    return this.http
      .post(
        environment.apiBaseUrl + printoutConsts.createPdfUrl,
        args, {
          params: this.toitsuSharedService.initHttpParams({printoutName}),
          responseType: 'arraybuffer'
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  createPrintoutXls(printoutName, args) {
    return this.http
      .post(
        environment.apiBaseUrl + printoutConsts.createXlsUrl,
        args, {
          params: this.toitsuSharedService.initHttpParams({printoutName}),
          responseType: 'arraybuffer'
        }
      );
  }

}
