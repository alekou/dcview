import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {visitProgramConsts} from './visit-program.consts';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class VisitProgramService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getVisitProgram(id) {
    return this.http
      .get(
        environment.apiBaseUrl + visitProgramConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveVisitProgram(visitProgram) {
    return this.http
      .post(
        environment.apiBaseUrl + visitProgramConsts.saveUrl,
        visitProgram
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  deleteVisitProgram(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + visitProgramConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
