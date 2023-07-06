import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {inmatePhotoConsts} from './inmate-photo.consts';
import {InmatePhotoDisplayCurrentDialogComponent} from './inmate-photo-display-current-dialog/inmate-photo-display-current-dialog.component';
import {DialogService} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {Observable} from 'rxjs';


@Injectable({providedIn: 'root'})
export class InmatePhotoService {

  sharedInmatePhotoViewPanelData = null;

  constructor(
    private http: HttpClient,
    private dialogService: DialogService,
    private toitsuSharedService: ToitsuSharedService,
    private toitsuToasterService: ToitsuToasterService,
    private translate: TranslateService
  ) {
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  saveInmatePhotoAndFileList(formData) {
    return this.http
      .post(environment.apiBaseUrl + inmatePhotoConsts.saveInmatePhotoAndFileList,
        formData
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  deleteInmatePhoto(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + inmatePhotoConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        });
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  swapCurrentInmatePhoto(lastCurrentInmatePhoto, newCurrentInmatePhoto) {
    return this.http
      .post(
        environment.apiBaseUrl + inmatePhotoConsts.swapCurrentUrl,
        {lastCurrentInmatePhoto: lastCurrentInmatePhoto, newCurrentInmatePhoto: newCurrentInmatePhoto}
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  downloadInmatePhoto(id): Observable<Blob> {
    return this.http
      .get(
        environment.apiBaseUrl + inmatePhotoConsts.downloadUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id}),
          headers: new HttpHeaders({'Content-Type': 'image/png', responseType: 'blob'}),
          responseType: 'blob'
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  openInmatePhotoDisplayDialog(inmateId) {
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(InmatePhotoDisplayCurrentDialogComponent, {
      header: this.translate.instant('inmatePhoto.showPhotoHeader'),
      data: {
        inmateId: inmateId
      }
    });
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getCurrentInmatePhoto(inmateId) {
    return this.http
      .get(environment.apiBaseUrl + inmatePhotoConsts.getCurrentInmatePhotoUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId})
        });
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getCurrentInmatePhotoThumbnail(inmateId): Observable<Blob> {
    return this.http
      .get(
        environment.apiBaseUrl + inmatePhotoConsts.getCurrentInmatePhotoThumbnailUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId}),
          headers: new HttpHeaders({'Content-Type': 'image/png', responseType: 'blob'}),
          responseType: 'blob'
        }
      );
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getInmatePhotos(inmateId) {
    return this.http
      .get<{}[]>(
        environment.apiBaseUrl + inmatePhotoConsts.getInmatePhotosUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId})
        });
  }


  // Utils ---------------------------------------------------------------------------------------------------------------------------------

  // Μετατροπή ενός Blob σε μορφή Base64 για προβολή στο HTML
  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Ανάκτηση διαστάσεων εικόνας από base64
  getImageDimensionsFromBase64(base64String) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        resolve({ width: image.width, height: image.height });
      };
      image.onerror = (error) => {
        reject(error);
      };
      image.src = `data:image/png;base64,${base64String}`;
    });
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

}
