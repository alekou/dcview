import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {InmatePhotoService} from '../../inmate-photo.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {TranslateService} from '@ngx-translate/core';
import {DateService} from '../../../../toitsu-shared/date.service';
import {InmatePhoto} from '../../inmate-photo.model';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../../../../toitsu-auth/auth.service';


@Component({
  selector: 'app-inm-inmate-photo-capture-dialog',
  templateUrl: 'inmate-photo-capture-dialog.component.html',
  styleUrls: ['../../inmate-photo.css']
})
export class InmatePhotoCaptureDialogComponent implements OnInit {

  inmateId: number;

  WIDTH = 640;
  HEIGHT = 480;

  @ViewChild('video') video: ElementRef;

  @ViewChild('canvas') canvas: ElementRef;

  captures: string[] = [];
  inmatePhotos = [];
  imageFiles: File[] = [];
  formData: FormData = new FormData();

  error: any;
  isCaptured: boolean;

  turnedOnCamera: boolean = false;

  selectedInmatePhotoSrc: string;

  loading: boolean = false;

  
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

  // Ενεργοποίηση κάμερας
  async turnOnCamera() {
    this.loading = true;

    // Έλεγχος αν ο χρήστης έχει επιτρέψει τη χρήση της κάμερας
    this.checkWebcamAccess().then((accessGranted: boolean) => {
      if (accessGranted) {
        this.setupDevices();
        this.turnedOnCamera = true;
      } else {
        this.turnedOnCamera = false;
        alert(this.translate.instant('inmatePhoto.error.cameraAccessDenied'));
      }
    });

    setTimeout(() => {
      this.loading = false;
    }, 100);

  }

  // Αναζήτηση για συνδεδεμένη κάμερα
  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = this.translate.instant('inmatePhoto.error.cameraNotFound');
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  // Έλεγχος Πρόσβασης στην Κάμερα
  async checkWebcamAccess(): Promise<boolean> {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      // User has allowed access to the webcam
      this.video.nativeElement.srcObject = videoStream;
      return true;
    } catch (err) {
      // User has denied access to the webcam
      return false;
    }
  }

  // Λήψη Φωτογραφίας
  capture() {
    this.loading = true;
    // Δημιουργία στιγμιότυπου κάμερας
    this.drawImageToCanvas(this.video.nativeElement);

    // Προσθήκη φωτογραφίας
    setTimeout(() => {
      // Προσθήκη στιγμιότυπου στον πίνακα captures (στιγμιότυπα κάμερας)
      const imageBase64String = this.canvas.nativeElement.toDataURL('image/png');
      this.captures.push(imageBase64String);

      // Αρχικοποίηση αντικειμένου InmatePhoto και προσθήκη στον πίνακα InmatePhotos
      const inmatePhoto: InmatePhoto = new InmatePhoto();
      this.initializeInmatePhoto(inmatePhoto);
      this.inmatePhotos.push(inmatePhoto);

      // Δημιουργία αρχείου φωτογραφίας File και προσθήκη στον πίνακα imageFiles
      const filename = 'inmatePhoto-' + this.dateService.getCurrentDateStringForExport() + '.png';
      const imageFile = this.base64toFile(imageBase64String, filename);
      this.imageFiles.push(imageFile);

      // Ορισμός της πρώτης φωτογραφίας που θα ανέβει ως η τρέχουσα
      this.inmatePhotos[0].current = true;

      // Εμφάνιση τελευταίου στιγμιότυπου στο gallery
      this.isCaptured = true;
      this.selectedInmatePhotoSrc = this.captures[this.captures.length - 1];
      this.loading = false;
    });
  }

  // Δημιουργία φωτογραφίας
  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }

  saveInmatePhotos() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    // Μετατροπή αρχείου σε blob μορφή και προσθήκη σε FormData
    this.initializeFormData(this.inmatePhotos, this.imageFiles);

    this.inmatePhotoService.saveInmatePhotoAndFileList(this.formData).subscribe({
      next: (responseData: InmatePhoto[]) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('inmatePhoto.save.success'));
        // Απενεργοποίηση κάμερας και κλείσιμο του dialog
        this.video.nativeElement.pause();
        this.video.nativeElement.remove();
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

  removeCapturedFile(index) {
    // Αφαίρεση στιγμιότυπου επιλεγμένης φωτογραφίας από τον πίνακα captures
    this.captures.forEach((value) => {
      if (this.captures.indexOf(value) === index) {
        this.captures.splice(index, 1);
      }
    });
    // Αφαίρεση επιλεγμένου αντικειμένου InmatePhoto από τον πίνακα inmatePhotos
    this.inmatePhotos.forEach((value) => {
      if (this.inmatePhotos.indexOf(value) === index) {
        this.inmatePhotos.splice(index, 1);
        // Αν διαγραφεί η πρώτη λήψη, ορισμός της επόμενης ως τρέχουσα φωτογραφία
        if (index === 0) {
          if (this.inmatePhotos.length > 0) {
            this.inmatePhotos[this.inmatePhotos.indexOf(value) + 1].current = true;
          }
        }
      }
    });
    // Αφαίρεση αρχείου επιλεγμένης φωτογραφίας από τον πίνακα imageFile
    this.imageFiles.forEach((value) => {
      if (this.imageFiles.indexOf(value) === index) {
        this.imageFiles.splice(index, 1);
      }
    });
  }

  cancel() {
    // Απενεργοποίηση Κάμερας
    if (this.turnedOnCamera) {
      this.video.nativeElement.pause();
      this.video.nativeElement.remove();
    }
    // Κλείσιμο παραθύρου
    this.dynamicDialogRef.close();
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  // Αρχικοποίηση αντικειμένου InmatePhoto
  initializeInmatePhoto(inmatePhoto) {
    inmatePhoto.inmateId = this.inmateId;
    inmatePhoto.username = this.authService.getUserDisplayName();
    inmatePhoto.photoDate = this.getCurrentDate();
  }

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

  // Αλλαγή τρέχουσας φωτογραφίας για προβολή
  selectedPhotoChanged(index) {
    this.captures.forEach((value) => {
      if (this.captures.indexOf(value) === index) {
        this.selectedInmatePhotoSrc = this.captures[index];
      }
    });
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

  // Μετατροπή του μεγέθους αρχείου για προβολή
  getFormatFileSize(bytes) {
    const sufixes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sufixes[i]}`;
  }

  // Μετατροπή του base64 σε File για αποθήκευση
  base64toFile(base64: string, filename: string): File {
    // Split the base64 string into its data and content type parts
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const data = parts[1];

    // Convert the base64 string to a Blob object
    const blob = this.base64toBlob(data, contentType);

    // Create a File object from the Blob and return it
    return new File([blob], filename, { type: contentType });
  }

  // Μετατροπή του base64 σε blob
  base64toBlob(base64: string, contentType: string): Blob {
    // Convert the base64 string to a Uint8Array
    const byteString = atob(base64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    // Create a Blob object from the Uint8Array and content type
    return new Blob([uint8Array], { type: contentType });
  }

  // Ανάκτηση τρέχουσας ημερομηνίας σε μορφή String για αποθήκευση
  getCurrentDate() {
    return this.dateService.getCurrentDateString() as unknown as Date;
  }

}
