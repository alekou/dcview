import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {documentConsts} from './document.consts';

@Injectable({providedIn: 'root'})
export class DocumentService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService,
  ){}
  
  // ---------------------------------------------------------------------------------------------------------------------------------------

  getDocumentsByEntityAndEntityId(entity, entityId) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + documentConsts.getByEei,
        {
          params: this.toitsuSharedService.initHttpParams({entity, entityId})
        }
      );
  }
  
  // --------------------------------------------------------------------------------------------------------------------------------
  downloadDocumentOpen1Fs(documentId, fileName) {
    return this.http
      .get(
        environment.apiBaseUrl + documentConsts.downloadUrl,
        {
          params: this.toitsuSharedService.initHttpParams({documentId, fileName}),
          responseType: 'arraybuffer'
        });
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  saveDocuments(formData) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http
      .post(
        environment.apiBaseUrl + documentConsts.saveAllUrl, 
        formData,
        {headers: headers});
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  delete(id){
    return this.http
      .delete(
        environment.apiBaseUrl + documentConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------
  
  previewDocument(documentId, fileName) {
    return this.http
      .get(
        environment.apiBaseUrl + documentConsts.downloadUrl, 
        {
          params: this.toitsuSharedService.initHttpParams({documentId, fileName}), 
          responseType: 'arraybuffer'
        });
  }
}
