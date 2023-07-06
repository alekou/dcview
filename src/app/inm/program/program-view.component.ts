import {Component, OnInit, ViewChild} from '@angular/core';
import {Program} from './program.model';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {DateService} from '../../toitsu-shared/date.service';
import {Observable} from 'rxjs';
import {ProgramService} from './program.service';
import {programApplicationConsts} from '../program-application/program-application.consts';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ProgramTypeService} from '../../sa/program-type/program-type.service';
import {EnumService} from '../../cm/enum/enum.service';
import {ProgramType} from '../../sa/program-type/program-type.model';
import {ProfessionService} from '../../sa/profession/profession.service';
import {inmateLaborConsts} from '../inmate-labor/inmate-labor.consts';

@Component({
  selector: 'app-inm-program-view',
  templateUrl: 'program-view.component.html'
})
export class ProgramViewComponent implements OnInit {


  id: number;
  programTypes = [];
  statuses = [];
  professions = [];
  program: Program;
  certification;
  programType: ProgramType;

  @ViewChild(NgForm) programForm: NgForm;
  @ViewChild('table') table: ToitsuTableComponent;
  
  programApplicationsUrl = programApplicationConsts.indexUrl;
  
  programApplicationViewLink = 'inm/programapplication/view/';
  
  programApplicationCols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'view', width: '5rem', align: 'center', customCell: 'cell1'},
    {field: 'inmateFullName', header: this.translate.instant('programApplication.inmateId'), sortField: 'inmate.lastName', width: '15rem'},
    {field: 'protocolNo', header: this.translate.instant('programApplication.protocolNo'), sortField: 'protocolNo', width: '10rem', align: 'center'},
    {field: 'applicationDate', header: this.translate.instant('programApplication.applicationDate'), sortField: 'applicationDate', width: '8rem', align: 'center'},
    {field: 'professionLabel', header: this.translate.instant('programApplication.professionId'), sortField: 'professionLabel', width: '10rem', align: 'center'},
    {field: 'rejectedLabel', header: this.translate.instant('programApplication.rejected'), sortField: 'rejected', width: '10rem', align: 'center'},
    {field: 'withdrawalLabel', header: this.translate.instant('programApplication.withdrawal'), sortField: 'withdrawal', width: '10rem', align: 'center'}
  ];

  
  inmateLaborsUrl = inmateLaborConsts.indexUrl;
  
  inmateLaborViewLink = 'inm/inmatelabor/view/';
  
  inmateLaborCols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'view', width: '5rem', align: 'center', customCell: 'cell1'},
    {field: 'inmateFullName', header: this.translate.instant('inmateLabor.inmateId'), sortField: 'inmate.lastName', width: '15rem'},
    {field: 'professionName', header: this.translate.instant('inmateLabor.professionId'), sortField: 'professionName', width: '10rem', align: 'center'},
    {field: 'startDate', header: this.translate.instant('inmateLabor.startDate'), sortField: 'startDate', width: '8rem', align: 'center'},
    {field: 'endDate', header: this.translate.instant('inmateLabor.endDate'), sortField: 'actualEndDate', width: '10rem', align: 'center'}
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'startDate',
    sortOrder: -1
  };


  args;

  constructor(private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private confirmationService: ConfirmationService,
              private toitsuToasterService: ToitsuToasterService,
              private toitsuBlockUiService: ToitsuBlockUiService,
              private toitsuSharedService: ToitsuSharedService,
              public authService: AuthService,
              private dateService: DateService,
              private programTypeService: ProgramTypeService,
              private programService: ProgramService,
              private toitsuTableService: ToitsuTableService,
              private enumService: EnumService,
              private professionService: ProfessionService
  ) {}

  ngOnInit(): void {
    // Get the id from the activatedRoute
    this.id = +this.activatedRoute.snapshot.params['id'];
    // Get the record from the activatedRoute resolver or initialize a new one
    this.program = this.id ? this.activatedRoute.snapshot.data['record'] : new Program();

    this.args = this.initializeArgs();

    this.programTypeService.getAllProgramTypes(true, [this.program.programTypeId]).subscribe({
      next: (responseData) => {
        this.programTypes = responseData;
      }
    });

    if (this.id) {
      if (this.program.programType.kind === 'SCHOOL') {
        this.certification = false;
      } else if (this.program.programType.kind === 'COURSE') {
        this.certification = true;
      }
    }

    // Status
    this.enumService.getEnumValues('inm.core.enums.ProgramStatus').subscribe(responseData => {
      this.statuses = responseData;
    });

    if (!this.id) {
      this.program.status = 'PENDING';
    }

    // Φόρτωση λίστας ενεργών θέσεων εργασίας
    this.professionService.getActiveProfessionsByUserDc([this.program.professionId]).subscribe(responseData => {
      this.professions = responseData;
    });
    
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.programForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/inm/program/view']);
  }

  goToList() {
    this.router.navigate(['/inm/program/list']);
  }

  saveProgram() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.programService.saveProgram(this.program).subscribe({
      next: (responseData: Program) => {
        this.toitsuToasterService.showSuccessStay();
        this.programForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/program/view', responseData.id]);
        } else {
          this.program = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteProgram() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.programService.deleteProgram(this.program.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.programForm.form.markAsPristine();
            this.router.navigate(['/inm/program/list']);
          },
          error: (responseError) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
        });
      }
    });
  }

  initializeArgs() {
    return {
      programId: this.id
    };
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.program.dcId !== this.authService.getUserDcId()) {
      return true;
    }
  }

  programTypeChanged() {
    const foundCurrentProgramType = this.programTypes.find((result) => {
      return result.id === this.program.programTypeId;
    });

    if (foundCurrentProgramType.kind === 'SCHOOL') {
      this.certification = false;
    } else if (foundCurrentProgramType.kind === 'COURSE') {
      this.certification = true;
    }
  }
}
