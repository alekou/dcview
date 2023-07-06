import {Component, OnInit, ViewChild} from '@angular/core';
import {Area} from './area.model';
import {NgForm} from '@angular/forms';
import {AreaService} from './area.service';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {AuthService} from '../../toitsu-auth/auth.service';
import {Observable} from 'rxjs';
import {AreaTypeService} from '../../sa/area-type/area-type.service';

@Component({
  selector: 'app-area-view',
  templateUrl: './area-view.component.html'
})

export class AreaViewComponent implements OnInit, ExitConfirmation {

  id: number;
  area: Area;
  @ViewChild(NgForm) areaForm: NgForm;

  areaTypes = [];

  parentAreas = [];

  inputPositions = false;


  constructor(
    private areaService: AreaService,
    private areaTypeService: AreaTypeService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    // Αποθήκευση του id της εγγραφής από το URL
    this.id = +this.route.snapshot.params['id'];

    // Φόρτωση εγγραφής βάση του id ή δημιουργία νέας εγγραφής
    this.area = this.id ? this.route.snapshot.data['record'] : new Area();

    // Φόρτωση λιστών
    this.areaTypeService.getAreaTypes()
      .subscribe(responseData => {
        this.areaTypes = responseData;
      });

    this.areaService.getParentAreas()
      .subscribe(responseData => {
        this.parentAreas = responseData;
      });

    // Αλλαγή της κατάστασης του πεδίου "Θέσεις" βάση του Τύπου Περιοχής
    if (this.area.positions != null) {
        this.inputPositions = true;
    }

  }

  confirmExit(): boolean | Observable<boolean> {
    return this.areaForm.dirty;
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.area.dcId !== this.authService.getUserDcId()) {
      return true;
    }

    return false;
  }

  newRecord() {
    this.router.navigate(['/inm/area/view']);
  }

  goToList() {
    this.router.navigate(['/inm/area/list']);
  }

  saveArea() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.areaService.saveArea(this.area).subscribe({
      next: (responseData: Area) => {
        this.toitsuToasterService.showSuccessStay();
        this.areaForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/area/view', responseData.id]);
        } else {
          this.area = responseData;
        }
      },
      error: (responseError: HttpErrorResponse) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteArea() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.areaService.deleteArea(this.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.areaForm.form.markAsPristine();
            this.router.navigate(['/inm/area/list']);
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

  areaTypeChanged() {
    // Αλλαγή της κατάστασης του πεδίου "Θέσεις" βάση του "Τύπου Περιοχής"
    let selectedAreaType;
    if (this.area.areaTypeId) {
      selectedAreaType = this.areaTypes.find(i => i.id === this.area.areaTypeId);
      if (selectedAreaType.hasPositions) {
        this.inputPositions = true;
      } else {
        this.inputPositions = false;
      }

      // Αλλαγή των στοιχείων του πεδίου "Ανωτεροβάθμια Περιοχή" βάση του επιλεγμένου "Τύπου Περιοχής"
      let selectedParentArea = this.parentAreas.find(i => i.areaTypeId === selectedAreaType.id);
      if (selectedParentArea != null || undefined) {
        selectedParentArea.inactive = true;
      }

      // Ορισμός μόνο μιας απενεργοποιημένης περιοχής κάθε φορά, βάση του επιλεγμένου τύπου
      let inactiveParentAreasCounter = 0;
      this.parentAreas.forEach( (element) => {
        if (element.inactive === true) {
          inactiveParentAreasCounter++;
        }
      });
      if (inactiveParentAreasCounter > 1) {
        this.parentAreas.forEach( (element) => {
          if (element.areaTypeId !== selectedAreaType.id) {
            element.inactive = false;
          }
        });
      }

      // Ενεργοποίηση όλων των γονικών περιοχών
      this.parentAreas.forEach( (element) => {
        element.inactive = false;
      });
      // Απενεργοποίηση της περιοχής του επιλεγμένου τύπου περιοχής
      if (this.area.areaTypeId) {
        selectedAreaType = this.areaTypes.find(i => i.id === this.area.areaTypeId);
        selectedParentArea = this.parentAreas.find(i => i.areaTypeId === selectedAreaType.id);
        if (selectedParentArea != null || undefined) {
          selectedParentArea.inactive = true;
        }
      }

      // Αν ο χρήστης έχει επιλέξει αντεροβάθμια περιοχή που δεν μπορεί να επιλεχτεί βάση του επιλεγμένου τύπου, τότε γίνεται null
      if (selectedParentArea) {
        if (selectedAreaType.id === selectedParentArea.areaTypeId) {
          this.area.parentAreaId = null;
        }
      }
    }
  }

  parentAreaChanged() {
    // Ενεργοποίηση όλων των γονικών περιοχών
    this.parentAreas.forEach( (element) => {
      element.inactive = false;
    });
    // Απενεργοποίηση της περιοχής του επιλεγμένου τύπου περιοχής
    if (this.area.areaTypeId) {
      let selectedAreaType = this.areaTypes.find(i => i.id === this.area.areaTypeId);
      let selectedParentArea = this.parentAreas.find(i => i.areaTypeId === selectedAreaType.id);
      if (selectedParentArea != null || undefined) {
        selectedParentArea.inactive = true;
      }
    }
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

}
