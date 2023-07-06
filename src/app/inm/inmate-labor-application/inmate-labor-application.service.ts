import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {inmateLaborApplicationConsts} from './inmate-labor-application.consts';
import {environment} from '../../../environments/environment';
import {InmateLaborApplication} from './inmate-labor-application.model';
import {map} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class InmateLaborApplicationService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService,
    private translate: TranslateService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getInmateLaborApplication(id) {
    return this.http
      .get(
        environment.apiBaseUrl + inmateLaborApplicationConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveInmateLaborApplication(inmateLaborApplication) {
    return this.http
      .post(
        environment.apiBaseUrl + inmateLaborApplicationConsts.saveUrl,
        inmateLaborApplication
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------


  massCreateInmateLaborApplication(inmateLaborApplications: InmateLaborApplication[]) {
    return this.http
      .post(
        environment.apiBaseUrl + inmateLaborApplicationConsts.massCreateUrl,
        inmateLaborApplications
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  deleteInmateLaborApplication(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + inmateLaborApplicationConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  detachInmateLaborApplicationFromProtocol(id) {
    return this.http
      .post(
        environment.apiBaseUrl + inmateLaborApplicationConsts.detachInmateLaborApplicationFromProtocolUrl,
        id
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getAttachedInmateLaborApplicationsByInmate(inmateId) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + inmateLaborApplicationConsts.getAttachedInmateLaborApplicationsByInmateUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId})
        }
      )
      // Δημιουργία του επιπλέον πεδίου displayDetails για συνοπτική προβολή σε dropdown(s)
      .pipe(
        map(responseData => {
          return responseData.map(responseItem => {
            if (responseItem['placementProtocolNo'] != null) {
              responseItem['displayDetails'] =
                this.translate.instant('placementProtocol.title.abbreviation') + ': ' +
                responseItem['placementProtocolNo'] + ' / ' + responseItem['placementProtocolDate'] + ', ' +
                this.translate.instant('inmateLaborApplication.title.abbreviation') + ': ' +
                responseItem['inmateLaborApplicationNo'] + ' / ' + responseItem['inmateLaborApplicationDate'];
            } else {
              responseItem['displayDetails'] =
                this.translate.instant('placementProtocol.title.abbreviation') + ': ' +
                '-' + ' / ' + responseItem['placementProtocolDate'] + ', ' +
                this.translate.instant('inmateLaborApplication.title.abbreviation') + ': ' +
                responseItem['inmateLaborApplicationNo'] + ' / ' + responseItem['inmateLaborApplicationDate'];
            }
            return responseItem;
          });
        })
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

}
