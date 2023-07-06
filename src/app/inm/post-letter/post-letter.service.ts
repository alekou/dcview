import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {postLetterConsts} from './post-letter.consts';

@Injectable({providedIn: 'root'})
export class PostLetterService {
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getPostLetter(id) {
    return this.http
      .get(
        environment.apiBaseUrl + postLetterConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  savePostLetter(postLetter) {
    return this.http
      .post(
        environment.apiBaseUrl + postLetterConsts.saveUrl,
        postLetter
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deletePostLetter(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + postLetterConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------
}
