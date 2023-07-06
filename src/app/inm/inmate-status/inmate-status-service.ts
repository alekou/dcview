import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {Message, MessageService} from 'primeng/api';
import {AuthService} from '../../toitsu-auth/auth.service';
import {InmatePhotoService} from '../inmate-photo/inmate-photo.service';
import {AreaService} from '../area/area.service';
import {environment} from '../../../environments/environment';
import {inmateStatusConsts} from './inmate-status.consts';
import {InmateStatus} from './inmate-status.model';

@Injectable({providedIn: 'root'})
export class InmateStatusService {

  constructor(
    private http: HttpClient,
    private inmatePhotoService: InmatePhotoService,
    private areaService: AreaService,
    private toitsuSharedService: ToitsuSharedService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------


  // Προβολή πληροφοριών τρέχουσας κατάστασης(παρουσία/απουσία/κατάσταση κράτησης/κατάσταση φακέλου) του κρατουμένου, σε toast
  showInmateStatusToast(inmate) {

    // Δημιουργία αντικειμένων/μεταβλητών
    let inmateStatus: InmateStatus = new InmateStatus();
    let message: Message = null;
    let thumbnailBase64String = null;
    let thumbnailWidth = null;
    let thumbnailHeight = null;

    // Αν το συνδεμένο κατάστημα κράτησης είναι αυτό στο οποίο βρίσκεται ο κρατούμενος
    if (inmate.inmateRecord.dcId === this.authService.getUserDcId()) {
      // Ανάκτηση στοιχείων τρέχουσας κατάστασης κρατούμενου στο συνδεδεμένο κατάστημα κράτησης
      this.getCurrentInmateStatusInDc(inmate.id).subscribe((responseData: InmateStatus) => {
        inmateStatus = responseData;
        if (inmateStatus.currentInmatePhotoThumbnailBlob) {
          thumbnailBase64String = 'data:image/png;base64,' + inmateStatus.currentInmatePhotoThumbnailBlob;
          thumbnailWidth = 'auto';
          thumbnailHeight = 'auto';
        } else {
          thumbnailBase64String = 'assets/layout/images/avatar.png';
          thumbnailWidth = '50px';
          thumbnailHeight = '50px';
        }
        if (inmateStatus.id) {
          message = {
            severity: inmateStatus.severity,
            summary: '',
            detail: '<div class="flex justify-content-center align-items-start">' +
                      '<div class="justify-content-start align-items-start">' +
                        `<img src=${thumbnailBase64String} width=${thumbnailWidth} height=${thumbnailHeight}>` +
                      '</div>' +
                      '<div class="flex-1 justify-content-start align-items-start margin-left-1rem">' +
                        '<div class="font-semibold font-size-15">' +
                          `${inmateStatus.type || ''}` + '<br>' +
                          `${inmateStatus.title || ''}` +
                        '</div>' +
                        '<hr>' +
                        '<div>' +
                          `${inmateStatus.inmateDisplayName || ''}` + '<br>' + '<br>' +
                          `${inmateStatus.message || ''}` +
                        '</div>' +
                      '</div>' +
                    '</div>',
            life: 60000
          };
        }
      }).add(() => {
        this.messageService.add(message);
      });
    }

    // Αν το συνδεμένο κατάστημα κράτησης είναι διαφορετικό από αυτό στο οποίο βρίσκεται ο κρατούμενος ή είναι το υπουργείο, εμφάνιση βασικών πληροφοριών
    if (inmate.inmateRecord.dcId !== this.authService.getUserDcId() || this.authService.isMinistry()) {

      // Ανάκτηση του thumbnail της τρέχουσας φωτογραφίας κρατουμένου από τη βάση δεδομένων
      this.inmatePhotoService.getCurrentInmatePhotoThumbnail(inmate.id).subscribe({
        next: (responseData) => {
          // Μετατροπή του blob σε Base64 μορφή
          this.inmatePhotoService.convertBlobToBase64(responseData).then((base64String) => {
            if (base64String !== 'data:') {
              thumbnailBase64String = base64String;
              thumbnailWidth = 'auto';
              thumbnailHeight = 'auto';
            } else {
              thumbnailBase64String = 'assets/layout/images/avatar.png';
              thumbnailWidth = '50px';
              thumbnailHeight = '50px';
            }
          }).finally(() => {
            message = {
              severity: 'info',
              summary: '',
              detail: '<div class="flex justify-content-center align-items-start">' +
                        '<div class="justify-content-start align-items-start">' +
                          `<img src=${thumbnailBase64String} width=${thumbnailWidth} height=${thumbnailHeight}>` +
                        '</div>' +
                        '<div class="flex-1 justify-content-start align-items-start margin-left-1rem">' +
                          '<div>' +
                            `${inmate.lastName || '-'}` + `&nbsp;` + `${inmate.firstName || '-'}` + `&nbsp;` + '(' + `${inmate.fatherName || '-'}` + ')' + `&nbsp;` + '(' + `${inmate.motherName || '-'}` + ')' +
                          '</div>' +
                        '</div>' +
                      '</div>',
              life: 60000
            };
          }).then(() => {
            this.messageService.add(message);
          });
        }
      });
    }

  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  getCurrentInmateStatusInDc(inmateId) {
    return this.http
      .get(environment.apiBaseUrl + inmateStatusConsts.getCurrentInmateStatusInDcUrl,
        {
          params: this.toitsuSharedService.initHttpParams({inmateId})
        });
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

}
