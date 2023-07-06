import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToitsuSharedService} from 'src/app/toitsu-shared/toitsu-shared.service';
import {fieldRevisionsConsts} from './display-field-revisions.consts';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DisplayFieldRevisionsService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService,
  ){}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getRevisionFields(entityClass) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + fieldRevisionsConsts.getRevisionFields,
        {
          params: this.toitsuSharedService.initHttpParams({entityClass})
        }
      )
      .pipe(
        map(responseData => {
          return responseData.map(responseItem => {
            return {
              value: responseItem['fieldName'],
              label: responseItem['fieldNameLabel']
            };
          });
        })
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
}
