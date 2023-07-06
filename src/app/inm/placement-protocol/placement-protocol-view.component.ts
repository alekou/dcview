import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../toitsu-auth/auth.service';
import {NgForm} from '@angular/forms';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {DateService} from '../../toitsu-shared/date.service';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {PlacementProtocol} from './placement-protocol.model';
import {PlacementProtocolService} from './placement-protocol.service';
import {AreaService} from '../area/area.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {InmateLaborApplicationListDialogComponent} from '../inmate-labor-application/inmate-labor-application-list-dialog/inmate-labor-application-list-dialog.component';
import {ProfessionService} from '../../sa/profession/profession.service';
import {InmateLaborApplication} from '../inmate-labor-application/inmate-labor-application.model';
import {InmateLaborApplicationRejectionDetailsDialogComponent} from '../inmate-labor-application/inmate-labor-application-rejection-details-dialog/inmate-labor-application-rejection-details-dialog.component';
import {ToitsuNavService} from '../../toitsu-layout/toitsu-nav/toitsu-nav.service';
import {InmateLaborApplicationService} from '../inmate-labor-application/inmate-labor-application.service';

@Component({
  selector: 'app-inm-placement-protocol-view',
  templateUrl: 'placement-protocol-view.component.html',
  providers: [
    DynamicDialogRef,
    DynamicDialogConfig
  ]
})
export class PlacementProtocolViewComponent implements OnInit, ExitConfirmation {

  id: number;
  placementProtocol: PlacementProtocol;
  @ViewChild(NgForm) placementProtocolForm: NgForm;

  areas = [];
  pLocations: {} = [];
  professions = [];

  inmateLaborApplicationsToDetachCounter: number = 0;

  approveStatus: boolean = null;
  loading = false;

  constructor(
    private placementProtocolService: PlacementProtocolService,
    private inmateLaborApplicationService: InmateLaborApplicationService,
    private areaService: AreaService,
    private professionService: ProfessionService,
    private genParameterTypeService: GenParameterTypeService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuNavService: ToitsuNavService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dateService: DateService,
    private translate: TranslateService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    // Αποθήκευση του id της εγγραφής από το URL
    this.id = +this.route.snapshot.params['id'];

    // Φόρτωση εγγραφής βάση του id ή δημιουργία νέας εγγραφής
    this.placementProtocol = this.id ? this.route.snapshot.data['record'] : new PlacementProtocol();

    // Αποθήκευση της αρχικής κατάστασης του πρακτικού τοποθέτησης
    if (this.id) {
      this.approveStatus = this.placementProtocol.approved;
    }

    // Φόρτωση λίστας περιοχών
    this.areaService.getAreasWithoutPositions().subscribe(responseData => {
      this.areas = responseData;
    });

    // Φόρτωση λίστας Τοποθεσιών
    this.genParameterTypeService.getByCategory(GenParameterCategory.Labor_Location, [this.placementProtocol.locationPid]).subscribe(responseData => {
      this.pLocations = responseData;
    });

    // Φόρτωση λίστας ενεργών θέσεων εργασίας
    this.professionService.getActiveProfessionsByUserDc([]).subscribe(responseData => {
      this.professions = responseData;
    });

  }

  confirmExit(): boolean | Observable<boolean> {
    return this.placementProtocolForm.dirty;
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.placementProtocol.dcId !== this.authService.getUserDcId()) {
      return true;
    }

    return false;
  }

  lockedApproved(){
    if (this.id && this.placementProtocol.approved) {
      return true;
    }
  }

  newRecord() {
    this.router.navigate(['/inm/placementprotocol/view']);
  }

  goToList() {
    this.router.navigate(['/inm/placementprotocol/list']);
  }

  savePlacementProtocol() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.placementProtocolService.savePlacementProtocol(this.placementProtocol).subscribe({
      next: (responseData: PlacementProtocol) => {
        this.toitsuToasterService.showSuccessStay();
        this.placementProtocolForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/placementprotocol/view', responseData.id]);
        } else {
          this.placementProtocol = responseData;
        }
      },
      error: (responseError: HttpErrorResponse) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
        // Αν δε γίνει αποθήκευση, επιστροφή στην αρχική κατάσταση έγκρισης
        if (this.approveStatus !== this.placementProtocol.approved) {
          this.placementProtocol.approved = this.approveStatus;
        }
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
      this.loading = false;
    });
  }

  deletePlacementProtocol() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.placementProtocolService.deletePlacementProtocol(this.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.placementProtocolForm.form.markAsPristine();
            this.router.navigate(['/inm/placementprotocol/list']);
          },
          error: (responseError: HttpErrorResponse) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
        });
      }
    });
  }

  approvePlacementProtocol() {
    this.confirmationService.confirm({
      message: this.translate.instant('placementProtocol.approve.confirmation'),
      accept: () => {
        this.loading = true;
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        // Έγκριση και αποθήκευση πρακτικού τοποθέτησης
        this.placementProtocol.approved = true;
        this.enableApproveDate();
        this.savePlacementProtocol();

        this.toitsuBlockUiService.unblockUi();
      }
    });
  }

  createInmateLaborsByInmateLaborApplications() {
    this.confirmationService.confirm({
      message: this.translate.instant('placementProtocol.createInmateLaborsByInmateLaborApplications.confirmation'),
      accept: () => {
        this.loading = true;
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.placementProtocolService.createInmateLaborsForInmateLaborApplications(this.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('placementProtocol.createInmateLaborsByInmateLaborApplications.allInmateLaborsCreated.success'));
            this.placementProtocolForm.form.markAsPristine();
          },
          error: (responseError: HttpErrorResponse) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
          this.loading = false;
        });
      }
    });
  }

  enableApproveDate() {
    if (this.placementProtocol.approved) {
      this.placementProtocol.protocolDate = this.dateService.getCurrentDateString() as unknown as Date;
    }
    else {
      this.placementProtocol.protocolDate = null;
    }
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  openInmateLaborApplicationListDialog() {
    this.toitsuToasterService.clearMessages();

    const inmateLaborApplicationListDialog = this.dialogService.open(InmateLaborApplicationListDialogComponent, {
      header: this.translate.instant('inmateLaborApplication.selectApplications'),
      width: '90%',
      data: {
        selectedAreaId: this.placementProtocol.areaId
      }
    });

    inmateLaborApplicationListDialog.onClose.subscribe(result => {
      if (result) {
        this.dynamicDialogRef.close(result);
        // Αρχικοποίηση και εισαγωγή των επιλεγμένων αιτημάτων εργασίας στο πρακτικό τοποθέτησης
        const inmateLaborApplicationsToSave = this.initializeInmateLaborApplications(result);

        // Αν δεν έχουν προστεθεί άλλα αιτήματα στο πρακτικό, προσθήκη όλων των επιλεγμένων
        if (this.placementProtocol.inmateLaborApplications.length === 0) {
          inmateLaborApplicationsToSave.forEach(inmateLaborApplicationToSave => {
            this.placementProtocol.inmateLaborApplications.push(inmateLaborApplicationToSave);
          });
        }
        // Αν υπάρχουν προηγούμενα αιτήματα στο πρακτικό, έλεγχος αν το αίτημα δεν υπάρχει ήδη στο πρακτικό το αίτημα εργασίας και προσθήκη
        else if (this.placementProtocol.inmateLaborApplications.length > 0) {
          inmateLaborApplicationsToSave.forEach(inmateLaborApplicationToSave => {
            let alreadyAddedInmateLaborApplications = this.placementProtocol.inmateLaborApplications.filter(inmateLaborApplication => inmateLaborApplication.id === inmateLaborApplicationToSave.id);
            if (inmateLaborApplicationToSave.id && alreadyAddedInmateLaborApplications.length === 0 ) {
              this.placementProtocol.inmateLaborApplications.push(inmateLaborApplicationToSave);
            }
          });
        }
      }
    });
  }

  openInmateLaborApplicationRejectionDetailsDialog(index) {
    this.toitsuToasterService.clearMessages();

    const inmateLaborApplicationRejectionDetailsDialog = this.dialogService.open(InmateLaborApplicationRejectionDetailsDialogComponent, {
      header: this.translate.instant('inmateLaborApplication.rejectionDialog.header'),
      width: '50%',
      data: {
        placementProtocolApproveStatus: this.placementProtocol.approved,
        inmateLaborApplicationToReject: this.placementProtocol.inmateLaborApplications[index]
      },
      closable: false
    });

    inmateLaborApplicationRejectionDetailsDialog.onClose.subscribe(result => {
      if (result) {
        this.dynamicDialogRef.close(result);
        this.initializeInmateLaborRejectionDetails(result, index);
      }
    });
  }

  removeInmateLaborApplication(index) {
    this.confirmationService.confirm({
      message: this.translate.instant('placementProtocol.inmateLaborApplications.remove.confirmation'),
      accept: () => {
        // Αν το πρακτικό τοποθέτησης δεν έχει αποθηκευτεί, γίνεται αφαίρεση τοπικά
        if (!this.placementProtocol.id) {
          this.placementProtocol.inmateLaborApplications.splice(index, 1);
        // Αν το πρακτικό τοποθέτησης έχει αποθηκευτεί, γίνεται αφαίρεση του placementProtocolId από την εγγραφή στη βάση
        } else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.inmateLaborApplicationService.detachInmateLaborApplicationFromProtocol(this.placementProtocol.inmateLaborApplications[index].id).subscribe({
            next: (responseData) => {
              this.placementProtocol.inmateLaborApplications.splice(index, 1);
              this.toitsuToasterService.showSuccessStay(this.translate.instant('placementProtocol.inmateLaborApplications.remove.success'));
            },
            error: (responseError) => {
              this.toitsuToasterService.apiValidationErrors(responseError);
            }
          }).add(() => {
            this.toitsuBlockUiService.unblockUi();
          });
        }
      }
    });
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  initializeInmateLaborApplications(result) {
    let inmateLaborApplicationsToSave: InmateLaborApplication[] = [];

    result.forEach(value => {
      const inmateLaborApplicationToSave: InmateLaborApplication = new InmateLaborApplication();
      inmateLaborApplicationToSave.id = value.id;
      inmateLaborApplicationToSave.dcId = value.dcId;
      inmateLaborApplicationToSave.inmateId = value.inmate.id;
      inmateLaborApplicationToSave.inmateFullName = value.inmateFullName;
      inmateLaborApplicationToSave.protocolNo = value.protocolNo;
      inmateLaborApplicationToSave.protocolDate = value.protocolDate;
      inmateLaborApplicationToSave.requestedProfessionId = this.getProfessionId(value.requestedProfessionName);
      inmateLaborApplicationToSave.finalProfessionId = this.getProfessionId(value.requestedProfessionName);
      inmateLaborApplicationToSave.rejected = value.rejected;

      inmateLaborApplicationsToSave.push(inmateLaborApplicationToSave);
    });

    return inmateLaborApplicationsToSave;
  }

  getProfessionId(requestedProfessionName) {
    const profession = this.professions.find(i => i.name === requestedProfessionName);
    if (profession) {
      return profession.id;
    }
    else {
      return null;
    }
  }

  initializeInmateLaborRejectionDetails(result, index) {
    this.placementProtocol.inmateLaborApplications[index].rejected = result.rejected;
    this.placementProtocol.inmateLaborApplications[index].rejectionDate = result.rejectionDate;
    this.placementProtocol.inmateLaborApplications[index].rejectionComments = result.rejectionComments;
  }

  enableRejectionDate(index) {
    if (this.placementProtocol.inmateLaborApplications[index].rejected) {
      this.placementProtocol.inmateLaborApplications[index].rejectionDate = this.dateService.getCurrentDateString() as unknown as Date;
    }
    else {
      this.placementProtocol.inmateLaborApplications[index].rejectionDate = null;
    }
  }

}
