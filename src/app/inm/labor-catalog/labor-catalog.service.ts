import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {laborCatalogConsts} from './labor-catalog.consts';
import {LaborCatalog} from './labor-catalog.model';
import {map} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {EnumService} from '../../cm/enum/enum.service';


@Injectable({providedIn: 'root'})
export class LaborCatalogService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService,
    private enumService: EnumService,
    private translate: TranslateService
  ) {
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getInmateDetails(inmateId) {
    return this.http
      .get<LaborCatalog>(environment.apiBaseUrl + laborCatalogConsts.getInmateDetailsUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId})
        })
      .pipe(
        map(responseData => {
          // Δημιουργία του επιπλέον πεδίου lastInmateRecordDetails για συνοπτική προβολή των στοιχείων τελευταίας κράτησης σε dropdown(s)
          if (responseData.lastInmateRecordExitDate != null || undefined) {
            responseData['lastInmateRecordDetails'] = responseData['lastInmateRecordCode'] + ' : ' + responseData['lastInmateRecordStatusLabel'] + ' '
              + '(' + responseData['lastInmateRecordEntryDate'] + ' - ' + responseData['lastInmateRecordExitDate'] + ')';
          } else {
            responseData['lastInmateRecordDetails'] = responseData['lastInmateRecordCode'] + ' : ' + responseData['lastInmateRecordStatusLabel'] + ' '
              + '(' + responseData['lastInmateRecordEntryDate'] + ' - ' + ')';
          }
          // Δημιουργία του επιπλέον πεδίου lastInmateLaborDetails για συνοπτική προβολή των στοιχείων τελευταίας κράτησης σε dropdown(s)
          if (responseData.lastInmateLaborProfessionName != null || undefined) {
            if (responseData.lastInmateLaborEndDate != null || undefined) {
              responseData['lastInmateLaborDetails'] = responseData['lastInmateLaborProfessionName'] + ' '
                + '(' + responseData['lastInmateLaborStartDate'] + ' - ' + responseData['lastInmateLaborEndDate'] + ')';
            } else {
              responseData['lastInmateLaborDetails'] = responseData['lastInmateLaborProfessionName'] + ' '
                + '(' + responseData['lastInmateLaborStartDate'] + ' - ' + ')';
            }
          } else {
            responseData['lastInmateLaborDetails'] = this.translate.instant('global.noResultsFound');
          }
          // Αν δε βρεθεί τελευταία απουσία του κρατουμένου στο κατάστημα κράτησης, εμφάνιση ενημερωτικού μηνύματος
          if (responseData.inmateAbsenceDescription == null || undefined) {
            responseData.inmateAbsenceDescription = this.translate.instant('global.noResultsFound');
          }
          // Αν δε βρεθεί τελευταία ενεργή θέση, εμφάνιση ενημερωτικού μηνύματος
          if (responseData.lastActiveInmateAreaFullDescription == null || undefined) {
            responseData.lastActiveInmateAreaFullDescription = this.translate.instant('global.noResultsFound');
          }
          // Αν δε βρεθεί αριθμός βιβλίου για την τελευταία εργασία του κρατουμένου, εμφάνιση ενημερωτικού μηνύματος
          if (responseData.bookNo == null || undefined) {
            responseData.bookNo = this.translate.instant('global.noResultsFound');
          }
          return responseData;
        })
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

}

