import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {Injectable} from '@angular/core';
import {directorConsts} from './director.consts';

// CRUD Υλοποιήσεις για τη ΒΔ
@Injectable({providedIn: 'root'})
export class DirectorService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
    
  // GET
  getDirector(id) {
    return this.http
      .get(
        environment.apiBaseUrl + directorConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // SAVE και UPDATE μαζί, με βάση το id
  saveDirector(director) {
    return this.http
      .post(
        environment.apiBaseUrl + directorConsts.saveUrl, director);
  }
}
