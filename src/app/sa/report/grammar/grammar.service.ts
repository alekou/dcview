import {environment} from '../../../../environments/environment';
import {grammarConsts} from './grammar.consts';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../../toitsu-shared/toitsu-shared.service';
@Injectable({providedIn: 'root'})
export class GrammarService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {
  }
  saveGrammarList(grammarList) {
    return this.http
      .post(
        environment.apiBaseUrl + grammarConsts.saveListUrl,
        grammarList
      );
  }
}
