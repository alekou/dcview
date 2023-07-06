import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {InmatePhoto} from '../../inmate-photo.model';
import {DateService} from '../../../../toitsu-shared/date.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ToitsuToasterService} from '../../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {InmatePhotoService} from '../../inmate-photo.service';
import {AuthService} from '../../../../toitsu-auth/auth.service';
import {FileUpload} from 'primeng/fileupload';

@Component({
  selector: 'app-inm-inmate-photo-upload-dialog',
  templateUrl: 'inmate-photo-upload-dialog.component.html',
  styleUrls: ['../../inmate-photo.css']
})
export class InmatePhotoUploadDialogComponent implements OnInit {

  inmateId: number;

  uploadedFiles = [];
  inmatePhotos = [];
  base64Strings = [];
  formData: FormData = new FormData();

  @ViewChild('fileUpload') fileUpload: FileUpload;

  constructor(
    private inmatePhotoService: InmatePhotoService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private translate: TranslateService,
    private dateService: DateService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    // Αρχικοποίηση δεδομένων
    this.inmateId = this.dynamicDialogConfig.data.inmateId;
  }

  openFileSelection(): void {
    // Άνοιγμα παραθύρου για την επιλογή αρχείων προς μεταφόρτωση
    this.fileUpload.choose();
  }

  onUpload(event) {
    // Αν ο χρήστης έχει ανεβάσει αρχεία και θέλει να προσθέσει και άλλα, τότε γίνεται ανανέωση των πινάκων
    if (this.uploadedFiles.length > 0 && this.inmatePhotos.length > 0 && this.base64Strings.length > 0) {
      this.uploadedFiles.length = 0;
      this.inmatePhotos.length = 0;
      this.base64Strings.length = 0;
      this.formData.delete('files');
      this.formData.delete('objects');
    }

    for (let file of event.files) {
      // Προσθήκη αντικειμένου File στον πίνακα uploadedFiles
      this.uploadedFiles.push(file);

      // Αρχικοποίηση αντικειμένου InmatePhoto και προσθήκη στον πίνακα InmatePhotos
      const inmatePhoto: InmatePhoto = new InmatePhoto();
      this.initializeInmatePhoto(inmatePhoto);
      this.inmatePhotos.push(inmatePhoto);

      // Μετατροπή αρχείου σε base64 μορφή και προσθήκη στον πίνακα base64Strings
      this.getBase64String(file).then((base64String) => {
        this.base64Strings.push(base64String);
      }).catch((error) => {
        console.error('Error on getBase64String():' + error);
      });
    }

    // Ορισμός της πρώτης φωτογραφίας που θα ανέβει ως η τρέχουσα
    this.inmatePhotos[0].current = true;

  }

  saveInmatePhotos() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    // Μετατροπή αρχείου σε blob μορφή και προσθήκη σε FormData
    this.initializeFormData(this.inmatePhotos, this.uploadedFiles);

    this.inmatePhotoService.saveInmatePhotoAndFileList(this.formData).subscribe({
      next: (responseData: InmatePhoto[]) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('inmatePhoto.save.success'));
        this.dynamicDialogRef.close(responseData);
      },
      error: (responseError: HttpErrorResponse) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
      // Καθαρισμός του formData
      this.formData.delete('files');
      this.formData.delete('objects');
    });
  }

  removeUploadedFile(index) {
    // Αφαίρεση επιλεγμένου αντικειμένου File από τον πίνακα uploadedFiles
    this.uploadedFiles.forEach((value) => {
      if (this.uploadedFiles.indexOf(value) === index) {
        this.uploadedFiles.splice(index, 1);
      }
    });
    // Αφαίρεση επιλεγμένου αντικειμένου InmatePhoto από τον πίνακα inmatePhotos
    this.inmatePhotos.forEach((value) => {
      if (this.inmatePhotos.indexOf(value) === index) {
        this.inmatePhotos.splice(index, 1);
        // Αν διαγραφεί το πρώτο ανεβασμένο αρχείο, ορισμός του επόμενου ως τρέχουσα φωτογραφία
        if (index === 0) {
          if (this.inmatePhotos.length > 0) {
            this.inmatePhotos[this.inmatePhotos.indexOf(value) + 1].current = true;
          }
        }
      }
    });
    // Αφαίρεση επιλεγμένου αντικειμένου base64String από τον πίνακα base64Strings
    this.base64Strings.forEach((value) => {
      if (this.base64Strings.indexOf(value) === index) {
        this.base64Strings.splice(index, 1);
      }
    });
  }

  cancel() {
    this.dynamicDialogRef.close();
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  // Αρχικοποίηση αντικειμένου InmatePhoto
  initializeInmatePhoto(inmatePhoto) {
    inmatePhoto.inmateId = this.inmateId;
    inmatePhoto.username = this.authService.getUserDisplayName();
    inmatePhoto.photoDate = this.getCurrentDate();
  }

  // Αρχικοποίηση αντικειμένου FormData για αποθήκευση
  initializeFormData(inmatePhotos, files) {
    try {
      // Ορισμός πεδίων στο formData για αποθήκευση
      for (let i = 0; i < files.length; i++) {
        this.formData.append('files', files[i], files[i].name);
      }
      this.formData.append('objects', JSON.stringify(inmatePhotos));
    } catch (error) {
      console.error('Error on getBlob():' + error);
    }
  }

  // Υπολογισμός συνόλου εικόνων με ένδειξη Τρέχουσα
  currentInmatePhotoCount() {
    let currentPhotosCount = 0;
    this.inmatePhotos.forEach(value => {
      if (value.current) {
        currentPhotosCount ++;
      }
    });
    return currentPhotosCount;
  }

  // Μετατροπή του μεγέθους αρχείου σε μορφή String για προβολή
  getFormatFileSize(bytes) {
    const sufixes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sufixes[i]}`;
  }

  // Μετατροπή του αρχείου σε base64 μορφή για προβολή
  getBase64String(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  // Ανάκτηση τρέχουσας ημερομηνίας σε μορφή String για αποθήκευση
  getCurrentDate() {
    return this.dateService.getCurrentDateString() as unknown as Date;
  }

}
