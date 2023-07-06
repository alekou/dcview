import {Component} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {InmatePhotoService} from '../inmate-photo.service';
import {InmateStatus} from '../../inmate-status/inmate-status.model';

@Component({
  selector: 'app-inm-inmate-photo-display-current-dialog',
  templateUrl: 'inmate-photo-display-current-dialog.component.html',
  styleUrls: ['../inmate-photo.css']
})
export class InmatePhotoDisplayCurrentDialogComponent {

  inmateId: number = null;
  inmatePhotoPreviewSrc = null;
  currentInmatePhoto: any = {
    id: null,
    mediumBlob: null,
    photoDate: null,
    current: null,
    currentInmateStatus: InmateStatus
  };
  currentInmatePhotoDimensions: any = {
    width: 640 / 1.1,
    height: 480 / 1.1
  };

  loading: boolean = true;

  showInmateCurrentStatusDetails: boolean = true;
  showInmatePhotoDetails: boolean = false;


  constructor(
    private inmatePhotoService: InmatePhotoService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef
  ) {
    // Αρχικοποίηση δεδομένων
    this.inmateId = this.dynamicDialogConfig.data.inmateId;
    // Ανάκτηση τρέχουσας φωτογραφίας κρατουμένου
    this.getCurrentInmatePhoto();
  }

  getCurrentInmatePhoto() {
    // Ανάκτηση τρέχουσας φωτογραφίας κρατουμένου από τη βάση δεδομένων
    this.inmatePhotoService.getCurrentInmatePhoto(this.inmateId).subscribe({
      next: (responseData) => {
        this.currentInmatePhoto = responseData;
        if (this.currentInmatePhoto) {
          // Ορισμός της τρέχουσας φωτογραφίας για προβολή
          this.inmatePhotoPreviewSrc = this.currentInmatePhoto.mediumBlob;
          // Ανάκτηση των διαστάσεων της επιλεγμένης φωτογραφίας
          if (this.inmatePhotoPreviewSrc) {
            this.inmatePhotoService.getImageDimensionsFromBase64(this.inmatePhotoPreviewSrc)
              .then((dimensions: any) => {
                this.currentInmatePhotoDimensions.width = (dimensions.width) / 1.1;
                this.currentInmatePhoto.height = (dimensions.height) / 1.1;
              })
              .catch((error) => {
                console.error(error);
              });
          }
        }
      }
    }).add(() => {
      this.loading = false;
    });
  }

  close() {
    this.dynamicDialogRef.close();
  }

}
