import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {map} from 'rxjs/operators';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {templateConsts} from './template.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class TemplateService {

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getTemplate(id) {
    return this.http
      .get(
        environment.apiBaseUrl + templateConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------


  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveTemplate(template) {
    return this.http
      .post(
        environment.apiBaseUrl + templateConsts.saveUrl,
        template
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
  getMainDatasets(application?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + templateConsts.getMainDatasetsUrl,
        {
          params: this.toitsuSharedService.initHttpParams({application})
        }
      )
      .pipe(
        map(responseData => {
          return responseData.map(responseItem => {
            return {
              value: responseItem['name'],
              label: responseItem['description'],
              application: responseItem['application']
            };
          });
        })
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDatasetTags(application, datasetName) {
    return this.http
      .get(
        environment.apiBaseUrl + templateConsts.getDatasetTagsUrl,
        {
          params: this.toitsuSharedService.initHttpParams({application, datasetName})
        }
      );
  }
}
