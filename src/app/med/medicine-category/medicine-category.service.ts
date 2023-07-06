import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {medicineCategoryConsts} from './medicine-category.consts';

@Injectable({providedIn: 'root'})
export class MedicineCategoryService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}

  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  getAllMedicineCategories(categoryKind) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + medicineCategoryConsts.getAllUrl,
        {
          params: this.toitsuSharedService.initHttpParams({categoryKind})
          
    });
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
