import { environment } from 'src/environments/environment';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {programTypeConsts} from './program-type.consts';

@Injectable({providedIn: 'root'})
export class ProgramTypeService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveProgramType(programType: any) {
    return this.http
      .post(
        environment.apiBaseUrl + programTypeConsts.saveUrl,
        programType
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteProgramType(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + programTypeConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getProgramType(id) {
    return this.http
      .get(
        environment.apiBaseUrl + programTypeConsts.getByIdUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  


  getAllProgramTypes(isActive, ids?) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + programTypeConsts.getAllMiniUrl, {
          params: this.toitsuSharedService.initHttpParams({isActive, ids})
        }
      );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
