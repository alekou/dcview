import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DisciplineOffense} from '../discipline-offense.model';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../../toitsu-auth/auth.service';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DisciplineReportService} from '../../discipline-report/discipline-report.service';
import {EnumService} from '../../../cm/enum/enum.service';
import {InmateService} from '../../inmate/inmate.service';
import {GenParameterService} from '../../../sa/gen-parameter/gen-parameter.service';
import {DiscReportOffenseService} from '../../disc-report-offense/disc-report-offense.service';
import {DisciplineReport} from '../../discipline-report/discipline-report.model';
import {inmateConsts} from '../../inmate/inmate.consts';
import {GenParameterCategory} from '../../../sa/gen-parameter/gen-parameter.category';
import {DisciplineOffenseService} from '../discipline-offense.service';
import {
  SelectDisciplineOffensesToRelateDialogComponent
} from './select-discipline-offenses-to-relate/select-discipline-offenses-to-relate-dialog.component';
import {NgForm} from '@angular/forms';
import {GenParameterTypeService} from '../../../sa/gen-parameter-type/gen-parameter-type.service';
import {DiscCouncilOffenseService} from '../../disc-council-offense/disc-council-offense.service';
import {th} from 'date-fns/locale';

@Component({
  selector: 'app-inm-discipline-offense-view-dialog',
  templateUrl: 'discipline-offense-view-dialog.component.html'
})

export class DisciplineOffenseViewDialogComponent implements OnInit {

  id: number;
  disciplineReport: DisciplineReport;
  disciplineOffense: DisciplineOffense = new DisciplineOffense();
  disciplineOffenseCopy: DisciplineOffense = new DisciplineOffense();
  firstDisciplineReportId: number = null;
  inmates = [];
  inmateDialogUrl: string;
  disciplineOffenseTypeParams = {};
  disciplineOffensesToRelate = [];
  selectedDisciplineOffenseToRelate: DisciplineOffense = new DisciplineOffense();
  isDisciplineOffenseDialogLoading: boolean = true;
  disciplineOffenseIsAddedInDisciplineCouncil: any;

  @ViewChild(NgForm) disciplineOffenseForm: NgForm;


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    public authService: AuthService,
    public dialogService: DialogService,
    private disciplineReportService: DisciplineReportService,
    private enumService: EnumService,
    private inmateService: InmateService,
    private genParameterService: GenParameterService,
    private genParameterTypeService: GenParameterTypeService,
    private discReportOffenseService: DiscReportOffenseService,
    private disciplineOffenseService: DisciplineOffenseService,
    private discCouncilOffenseService: DiscCouncilOffenseService,


  ) {
    this.disciplineOffense = this.dynamicDialogConfig.data['disciplineOffense'];
    this.firstDisciplineReportId = this.dynamicDialogConfig.data['firstDisciplineReportId'];
  }
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.disciplineReport = this.id ? this.route.snapshot.data['record'] : new DisciplineReport();

    // Αντίγραφο πειθαρχικού παραπτώματος
    this.disciplineOffenseCopy = this.copyObject(this.disciplineOffense);

    // Inmates
    this.inmateService.getActiveInmates().subscribe(responseData => {
      this.inmates = responseData;
    });
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;

    // Offense Types
    this.genParameterTypeService.getByCategory(GenParameterCategory.DisciplineOffense_OffenseType,  []).subscribe(responseData => {
      this.disciplineOffenseTypeParams = responseData;
    });

    // Έλεγχος ύπαρξης πειθαρχικού παραπτώματος σε συμβούλιο πειθαρχικών
    if (this.disciplineOffense.id ) {
      this.discCouncilOffenseService.disciplineOffenseIsAddedInDisciplineCouncil(this.disciplineOffense.id).subscribe(responseData => {
        this.disciplineOffenseIsAddedInDisciplineCouncil = responseData;
      }).add(() => {
        this.isDisciplineOffenseDialogLoading = false;
      });
    } else {
      this.isDisciplineOffenseDialogLoading = false;
    }

  }

  // Μέθοδος Αντιγραφής Αντικειμένου
  copyObject(originalObject: any): any {
    return JSON.parse(JSON.stringify(originalObject));
  }
  
  // Εύρεση παρόμοιων πειθαρχικών παραπτωμάτων
  searchSimilarDisciplineOffenses() {
    let data = {
      inmateId: this.disciplineOffense.inmateId,
      incidentDate: this.disciplineOffense.incidentDate,
      firstDisciplineReportId: this.firstDisciplineReportId,
    };

    this.toitsuToasterService.clearMessages();
    this.disciplineOffenseService.getDisciplineOffensesToRelate(data).subscribe(response => {
      this.disciplineOffensesToRelate = response;
      if (this.disciplineOffensesToRelate.length !== 0) {
        const ref = this.dialogService.open(SelectDisciplineOffensesToRelateDialogComponent, {
          header: this.translate.instant('disciplineOffense.selectDisciplineOffensesToRelate.dialogTitle'),
          data: {
            disciplineOffensesToRelate: this.disciplineOffensesToRelate,
            selectedDisciplineOffenseToRelate: this.selectedDisciplineOffenseToRelate
          },
          closable: false,
        });
        ref.onClose.subscribe(result => {
          if (result) {
            this.selectedDisciplineOffenseToRelate = result;
            this.dynamicDialogRef.close(this.selectedDisciplineOffenseToRelate);
          }
        });
      }
    });
  }

  // Έλεγχος αλλαγής id κρατουμένου και ημερομηνίας συμβάντος, με σκοπό την εύρεση παρόμοιων πειθαρχικών παραπτωμάτων
  inmateIdOrIncidentDateChanged() {
    
    if (this.disciplineOffense.inmateId && this.disciplineOffense.incidentDate && !this.disciplineOffense.id) {
      this.searchSimilarDisciplineOffenses();
    }
  }
  
  // Αποθήκευση πειθαρχικού παραπτώματος
  saveDisciplineOffense() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.disciplineOffenseService.saveDisciplineOffense(this.disciplineOffense).subscribe({
      next: (responseData: DisciplineOffense) => {

        let savedDisciplineOffense: DisciplineOffense = responseData;
        this.changeDetectorRef.detectChanges();
        this.dynamicDialogRef.close(savedDisciplineOffense);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  // Ακύρωση
  cancel() {
    if (this.disciplineOffenseForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
          // Αντίγραφο πειθαρχικού παραπτώματος.
          // Χρησιμοποιείται έτσι ώστε αν ο χρήστης πατήσει ακύρωση του dialog, ο πίνακας (p-table) Αναφερόμενοι στην σελίδα της αναφοράς πειθαρχικού να έχει τις αρχικές του τιμές.
          this.dynamicDialogRef.close(this.disciplineOffenseCopy);
          console.log(this.disciplineOffenseCopy);
        },
        reject: () => {

        }
      });
    }
    else {
      // Αντίγραφο πειθαρχικού παραπτώματος.
      // Χρησιμοποιείται έτσι ώστε αν ο χρήστης πατήσει ακύρωση του dialog, ο πίνακας (p-table) Αναφερόμενοι στην σελίδα της αναφοράς πειθαρχικού να έχει τις αρχικές του τιμές.
      this.dynamicDialogRef.close(this.disciplineOffenseCopy);
      console.log(this.disciplineOffenseCopy);
    }
  }

  // Μέθοδος κλειδώματος πεδίων υπό συνθήκη 
  // Ελέγχει αν το πειθαρχικό παράπτωμα έχει μπει σε συμβούλιο πειθαρχικών.
  lockIfDisciplineOffenseIsAddedInDisciplineCouncil(): boolean {
    return this.disciplineOffenseIsAddedInDisciplineCouncil;
  }

  // Μέθοδος απόκρυψης πεδίων υπό συνθήκη 
  // Ελέγχει αν το πειθαρχικό παράπτωμα έχει μπει σε συμβούλιο πειθαρχικών.
  showIfDisciplineOffenseIsAddedInDisciplineCouncil(): boolean {
    return this.disciplineOffenseIsAddedInDisciplineCouncil;
  }
  
}
