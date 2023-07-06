import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';
import {InmatePhotoUploadDialogComponent} from './inmate-photo-upload-dialog/inmate-photo-upload-dialog.component';
import {InmatePhotoCaptureDialogComponent} from './inmate-photo-capture-dialog/inmate-photo-capture-dialog.component';
import {InmatePhotoService} from '../inmate-photo.service';
import {InmatePhoto} from '../inmate-photo.model';
import {Inmate} from '../../inmate/inmate.model';
import {HttpErrorResponse} from '@angular/common/http';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ConfirmationService} from 'primeng/api';
import {AuthService} from '../../../toitsu-auth/auth.service';

@Component({
  selector: 'app-inm-inmate-photo-view-panel',
  templateUrl: 'inmate-photo-view-panel.component.html',
  styleUrls: ['../inmate-photo.css'],
  providers: [
    DynamicDialogRef,
    DynamicDialogConfig
  ]
})
export class InmatePhotoViewPanelComponent implements OnInit {

  @Input() model: Inmate;
  @Input() name: string;
  @Input() hideUtils: boolean = false;

  inmatePhotos: any[] = [];
  totalInmatePhotos: number;
  inmateFullName: string;
  currentInmatePhoto: InmatePhoto = new InmatePhoto();

  selectedInmatePhoto: InmatePhoto = new InmatePhoto();
  selectedInmatePhotoDimensions: any = {
    width: 640 / 1.1,
    height: 480 / 1.1
  };
  activeIndex: number;
  activeNavigators: boolean;
  showThumbnailNavigators: boolean;

  loading: boolean = true;
  downloadLoading = false;

  constructor(
    private inmatePhotoService: InmatePhotoService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private dialogService: DialogService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {
    // Αν υπάρχει ο κρατούμενος
    if (this.model.id) {
      // Ανάκτηση των φωτογραφιών του από τη βάση δεδομένων
      this.getInmatePhotos();
      // Δημιουργία του fullName του κρατουμένου
      this.composeInmateFullName();
    }
  }

  getInmatePhotos() {
    // Ανάκτηση όλων των φωτογραφιών του κρατουμένου από τη βάση δεδομένων
    this.inmatePhotoService.getInmatePhotos(this.model.id).subscribe({
      next: (responseData) => {
        this.inmatePhotos = responseData;
      }
    }).add(() => {
      // Ορισμός της τρέχουσας φωτογραφίας για προβολή
      let hasCurrent = false;
      this.inmatePhotos.forEach((value: InmatePhoto) => {
        if (value.current) {
          hasCurrent = true;
          this.currentInmatePhoto = value;
          this.activeIndex = this.inmatePhotos.indexOf(value);
          this.selectedInmatePhoto = this.inmatePhotos[this.activeIndex];
        }
      });
      if (!hasCurrent) {
        this.activeIndex = 0;
        this.selectedInmatePhoto = this.inmatePhotos[0];
      }
      // Ανάκτηση των διαστάσεων της επιλεγμένης φωτογραφίας
      if (this.inmatePhotos.length > 0) {
        this.inmatePhotoService.getImageDimensionsFromBase64(this.selectedInmatePhoto.mediumBlob)
          .then((dimensions: any) => {
            this.selectedInmatePhotoDimensions.width = (dimensions.width) / 1.1;
            this.selectedInmatePhotoDimensions.height = (dimensions.height) / 1.1;
          })
          .catch((error) => {
            console.error(error);
          });
      }
      // Ορισμός του συνόλου φωτογραφιών του κρατουμένου
      this.totalInmatePhotos = this.inmatePhotos.length;
      // Αν οι φωτογραφίες του κρατουμένου είναι πάνω από μια, ενεργοποίηση των πλήκτρων πλοήγησης
      this.activeNavigators = this.inmatePhotos.length > 1;
      // Αν οι φωτογραφίες του κρατουμένου είναι πάνω από πέντε, ενεργοποίηση των πλήκτρων πλοήγησης στην μπάρα των thumbnails
      this.showThumbnailNavigators = this.inmatePhotos.length > 5;
      this.loading = false;
    });
  }

  swapCurrentInmatePhoto(lastCurrentInmatePhoto, newCurrentInmatePhoto) {
    // Εμφάνιση μηνύματος επιβεβαίωσης
    this.confirmationService.confirm({
      message: this.translate.instant('inmatePhoto.swapCurrent.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        // Αλλαγή τρέχουσας φωτογραφίας κρατουμένου
        this.inmatePhotoService.swapCurrentInmatePhoto(lastCurrentInmatePhoto, newCurrentInmatePhoto).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('inmatePhoto.swapCurrent.success'));
          },
          error: (responseError: HttpErrorResponse) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          // Ενημέρωση του πίνακα φωτογραφιών
          this.loading = true;
          this.getInmatePhotos();
          this.toitsuBlockUiService.unblockUi();
        });
      }
    });
  }

  deleteInmatePhoto(id) {
    // Εμφάνιση μηνύματος επιβεβαίωσης
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        // Διαγραφή φωτογραφίας κρατουμένου
        this.inmatePhotoService.deleteInmatePhoto(id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('inmatePhoto.delete.success'));
          },
          error: (responseError: HttpErrorResponse) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          // Ενημέρωση του πίνακα φωτογραφιών
          this.loading = true;
          this.getInmatePhotos();
          this.toitsuBlockUiService.unblockUi();
        });
      }
    });
  }

  downloadInmatePhoto(id) {
    this.downloadLoading = true;
    // Λήψη φωτογραφίας κρατουμένου
    this.inmatePhotoService.downloadInmatePhoto(id).subscribe({
      next: (responseData) => {
        const url = window.URL.createObjectURL(responseData);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.model.lastName + '_' + this.model.firstName + '_' + this.model.masterInmate.code + '-' + this.selectedInmatePhoto.photoDate + '.png';
        link.click();
        this.toitsuToasterService.showSuccessStay(this.translate.instant('inmatePhoto.download.success'));
      },
      error: (responseError: HttpErrorResponse) => {
        this.toitsuToasterService.apiValidationErrors(this.translate.instant('inmatePhoto.download.error') + ' ' + responseError);
      }
    }).add(() => {
      this.downloadLoading = false;
    });
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  selectedInmatePhotoChanged(index) {

    // Ανάκτηση της επιλεγμένης φωτογραφίας
    this.inmatePhotos.forEach((value) => {
      if (this.inmatePhotos.indexOf(value) === index) {
        this.selectedInmatePhoto = this.inmatePhotos[index];
      }
    });

    // Ανάκτηση των διαστάσεων της επιλεγμένης φωτογραφίας
    this.inmatePhotoService.getImageDimensionsFromBase64(this.selectedInmatePhoto.mediumBlob)
      .then((dimensions: any) => {
        this.selectedInmatePhotoDimensions.width = (dimensions.width) / 1.1;
        this.selectedInmatePhotoDimensions.height = (dimensions.height) / 1.1;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  composeInmateFullName() {
    if (this.model.lastName != null) {
      this.inmateFullName = this.model.lastName;
    }
    if (this.model.firstName != null) {
      this.inmateFullName += (' ' + this.model.firstName);
    }
    if (this.model.fatherName != null) {
      this.inmateFullName += (' (' + this.model.fatherName + ')');
    }
    if (this.model.motherName != null) {
      this.inmateFullName += (' (' + this.model.motherName + ')');
    }
    if (this.model.inmateRecord.code != null) {
      this.inmateFullName += (' [Α.Κ.:' + this.model.inmateRecord.code + ']');
    }
    if (this.model.masterInmate.code != null) {
      this.inmateFullName += (' [Α.Γ.Μ.:' + this.model.masterInmate.code + ']');
    }
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  openInmatePhotoUploadDialog() {
    this.toitsuToasterService.clearMessages();

    const inmatePhotoUploadDialog = this.dialogService.open(InmatePhotoUploadDialogComponent, {
      header: this.translate.instant('inmatePhoto.uploadPhotos'),
      height: '90%',
      width: '90%',
      data: {
        inmateId: this.model.id
      }
    });

    inmatePhotoUploadDialog.onClose.subscribe(result => {
      if (result) {
        // Ενημέρωση λίστας φωτογραφιών κρατουμένου
        this.loading = true;
        this.getInmatePhotos();
        this.dynamicDialogRef.close(result);
      }
    });
  }

  openInmatePhotoCaptureDialog() {
    this.toitsuToasterService.clearMessages();

    const inmatePhotoCaptureDialog = this.dialogService.open(InmatePhotoCaptureDialogComponent, {
      header: this.translate.instant('inmatePhoto.newPhoto'),
      height: '90%',
      width: '98%',
      data: {
        inmateId: this.model.id
      }
    });

    inmatePhotoCaptureDialog.onClose.subscribe(result => {
      if (result) {
        // Ενημέρωση λίστας φωτογραφιών κρατουμένου
        this.loading = true;
        this.getInmatePhotos();
        this.dynamicDialogRef.close(result);
      }
    });
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

}
