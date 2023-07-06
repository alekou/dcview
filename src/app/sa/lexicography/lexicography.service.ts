import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {lexicographyConsts} from './lexicography.consts';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';

@Injectable({providedIn: 'root'})
export class LexicographyService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  getAllLexicographies() {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + lexicographyConsts.getAllUrl
      );
  }

  saveLexicographies(lexicographies) {
    return this.http
      .post(
        environment.apiBaseUrl + lexicographyConsts.saveUrl, lexicographies);
  }

  deleteLexicography(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + lexicographyConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
