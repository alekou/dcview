import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {Observable} from 'rxjs';
import {Visit} from './visit.model';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {VisitService} from './visit.service';
import {DateService} from '../../toitsu-shared/date.service';
import {VisitTypeService} from '../../sa/visit-type/visit-type.service';
import {VisitorService} from '../visitor/visitor.service';
import {VisitVisitor} from '../visit-visitor/visit-visitor.model';
import {inmateConsts} from '../inmate/inmate.consts';
import {Visitor} from '../visitor/visitor.model';
import {VisitVisitorService} from '../visit-visitor/visit-visitor.service';
import {VisitorListDialogComponent} from '../visitor/visitor-list-dialog/visitor-list-dialog.component';
import {DialogService} from 'primeng/dynamicdialog';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {EnumService} from '../../cm/enum/enum.service';
import {GenParameterService} from '../../sa/gen-parameter/gen-parameter.service';
import {InmateRelation} from '../inmate-relation/inmate-relation.model';
import {InmateLawyer} from '../inmate-lawyer/inmate-lawyer.model';
import {VisitApplication} from '../visit-application/visit-application.model';
import {ApprovedAndPendingVisitApplicationsDialogComponent} from '../visit-application/visit-application-list-dialog/approved-and-pending-visit-applications-dialog.component';
import {VisitApplicationService} from '../visit-application/visit-application.service';
import {CityService} from '../../sa/city/city.service';
import {CountryService} from '../../sa/country/country.service';
import {GenParameterType} from '../../sa/gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';


@Component({
  selector: 'app-inm-visit-view',
  templateUrl: 'visit-view.component.html'
})
export class VisitViewComponent implements OnInit, ExitConfirmation {

  id: number;
  visit: Visit;
  fromVisitApplication = false;

  viewLink = '/inm/visit/view';
  indexLink = '/inm/visit/list';

  visitTypes = [];
  inmateDialogUrl: string;
  existingVisitors = [];

  @ViewChild(NgForm) visitForm: NgForm;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    public authService: AuthService,
    private dateService: DateService,
    private visitService: VisitService,
    private visitTypeService: VisitTypeService,
    private visitVisitor: VisitVisitorService,
    private visitorService: VisitorService,
    private visitApplicationService: VisitApplicationService,
    private enumService: EnumService,
    private genParameterService: GenParameterService,
    private genParameterTypeService: GenParameterTypeService,
    private cityService: CityService,
    private countryService: CountryService
  ) {
  }

  ngOnInit() {
    // Φόρτωση όλων των RelationKinds
    this.enumService.getEnumValues('inm.core.enums.InmateRelationKind').subscribe(responseData => {
      this.relationKinds = responseData;
    });
    
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    if (this.id) {
      this.visit = this.route.snapshot.data['record'];
    } else {
      this.visit = new Visit();
      this.visit.visitDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
    }

    // Inmates
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;

    // Φόρτωση όλων των VisitTypes
    this.visitTypeService.getAllVisitTypes().subscribe({
      next: (responseData) => {
        if (responseData) {
          this.visitTypes = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    });

    this.fromVisitApplication = !!this.visit.visitApplicationId; // Αν το επισκεπτήριο έχει ιd αίτησης επισκεπτηρίου δείχνουμε το πεδίο αίτησης

    
    
    // Φόρτωση όλων των υπάρχοντων επισκεπτών αν υπάρχει κρατούμενος ή τύπος επισκεπτηρίου
    this.populateExistingVisitorsDropDownIfInmateIdAndVisitTypeIdExist();
    
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.visitForm.dirty;
  }

  lockedRecord() {
    if (this.visit.dcId) {
      return (this.visit.dcId !== this.authService.getUserDcId());
    }
  }
  newRecord() {
    this.router.navigate([this.viewLink]);
  }

  goToList() {
    this.router.navigate([this.indexLink]);
  }

  saveVisit() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.visitService.saveVisit(this.visit).subscribe({
      next: (responseData: Visit) => {
        this.toitsuToasterService.showSuccessStay();
        this.visitForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/visit/view', responseData.id]);
        } else {
          this.visit = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteVisit() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.visitService.deleteVisit(this.visit.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.visitForm.form.markAsPristine();
            this.router.navigate(['/inm/visit/list']);
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
  
  populateExistingVisitorsDropDownIfInmateIdAndVisitTypeIdExist() {
    let inmateId = this.visit.inmateId;
    let visitTypeId = this.visit.visitTypeId;

    if (inmateId && visitTypeId) {

      this.visitorService.getVisitorsByInmateIdAndVisitTypeId(inmateId, visitTypeId).subscribe({
        next: (responseData) => {
          this.toitsuBlockUiService.blockUi();
          if (responseData) {

            this.existingVisitors = responseData;
            
            this.visit.visitTypeId = visitTypeId;
          }
        },
        error: (responseError) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
        }
      }).add(() => {
        this.toitsuBlockUiService.unblockUi();
      });
    }
  }
  inmateIdOrVisitTypeIdChanged() {
    
    if (this.visit.inmateId && this.visit.visitTypeId) {
      this.openApprovedAndPendingVisitApplicationsDialog();
    }
    this.clearExistingVisitors(); 

    this.populateExistingVisitorsDropDownIfInmateIdAndVisitTypeIdExist();
    // clear visitorVisitors of visit
    if (!this.id) {
      this.clearForm();
    }
  }
  visitApplicationIdChanged(visitApplication: VisitApplication) {
    if (!this.id) {
      this.clearVisitorsFromApplication();
      this.clearExistingVisitors();
      this.clearForm();
    }

    this.visitTypesFromVisitApplication = this.visitTypes.filter(visitType => visitType.kind === this.getVisitTypeKindByVisitTypeId(this.visit.visitTypeId));

    if (visitApplication.id) {

      this.fromVisitApplication = true;
      this.visit.visitApplicationId = visitApplication.id;
      this.visitApplication = visitApplication;

      // Γέμισμα drop down επισκεπτών από αίτημα
      visitApplication.visitApplicationVisitors.forEach(visitApplicationVisitor => {
        this.visitorsFromApplication.push(visitApplicationVisitor.visitor);
      });
    }
  }
  
  clearForm() {
    this.visit.visitVisitors = [];
    this.clearVisitorForm();
  }
  clearExistingVisitors() {
    this.existingVisitors = [];
  }

  
  deleteVisitVisitor(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.visit.visitVisitors.splice(index, 1);
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();

          this.visitVisitor.deleteVisitVisitor(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.visit.visitVisitors.splice(index, 1);
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


  // Μέθοδοι προσθήκης και ανάκτησης από τους τρέχοντες επισκέπτες, υπάρχοντες επισκέπτες και επισκέπτες από αίτημα
  addVisitorToCurrentVisitors(visitor) {

    // Βρίσκω τις φορές που υπάρχει ο επισκέπτης 
    let visitVisitors = this.visit.visitVisitors.filter(visitVisitor => visitVisitor.visitorId === visitor.id);
    
    if (visitor.id && visitVisitors.length === 0) {
      
      let visitVisitor = new VisitVisitor();
      
      visitVisitor.visitorId = visitor.id;
      visitVisitor.visitor = visitor;
      
      this.visit.visitVisitors.push(visitVisitor);
      
    } else if (visitor.id && visitVisitors.length === 1) {
      this.visit.visitVisitors.filter(visitVisitor => visitVisitor.visitorId === visitor.id)[0].visitor = visitor;
    }
  }
  getVisitorFromCurrentVisitorsById(visitorId): Visitor {

    let visitVisitor = this.visit.visitVisitors.filter(currentVisitVisitor => currentVisitVisitor.visitorId === visitorId);
    if (visitVisitor[0] != null && visitVisitor[0].visitor != null) {
      return visitVisitor[0].visitor;
    } else {
      return new Visitor();
    }
  }
  
  addVisitorToExistingVisitors(visitor: Visitor) {
    let existingVisitorIndex = this.existingVisitors.findIndex(existingVisitor => existingVisitor.id === visitor.id);
    
    if (existingVisitorIndex !== -1) {
      this.existingVisitors[existingVisitorIndex] = visitor;
    } else {
      this.existingVisitors.push(visitor);
    }
  }
  getVisitorFromExistingVisitorsById(visitorId): Visitor {
    let visitor = this.existingVisitors.filter(existingVisitor => existingVisitor.id === visitorId);
    if (visitor != null && visitor[0] != null) {
      return visitor[0];
    } else {
      return new Visitor();
    }
  }
  
  getVisitorFromVisitorsFromApplicationById(visitorId): Visitor {
    let visitor = this.visitorsFromApplication.filter(visitorFromApplication => visitorFromApplication.id === visitorId);
    if (visitor != null && visitor[0] != null) {
      return visitor[0];
    } else {
      return new Visitor();
    }
  }
  
  addVisitorToCurrentOrDisplayVisitorForEdit(visitor: Visitor) {
    if (this.getVisitTypeKindByVisitTypeId(this.visit.visitTypeId) === 'RELATION') {

      if (this.getLastIndexOfInmateRelationIfExists(visitor, this.visit.inmateId) !== -1) {
        this.addVisitorToCurrentVisitors(visitor);
      }
      else {
        // Παίρνω τα δηλωμένα στοιχεία για τον επισκέπτη, καταχωρώ μια νέα σχέση με τον τρέχον κρατούμενο και την στέλνω προς επεξεργασία
        let visitorStatedData = this.visitApplication.visitApplicationVisitors.filter(visitApplicationVisitor => visitApplicationVisitor.visitorId === visitor.id)[0];

        let inmateRelation: InmateRelation = new InmateRelation();

        inmateRelation.relationKind =  visitorStatedData.statedRelationKind;
        inmateRelation.otherRelationKindPid =  visitorStatedData.statedOtherRelationKindPid;

        inmateRelation.inmateId = this.visit.inmateId;

        visitor.inmateRelations.push(inmateRelation);

        this.displayEditVisitor(visitor);
      }
    }

    if (this.getVisitTypeKindByVisitTypeId(this.visit.visitTypeId) === 'LAWYER') {

      if (this.getLastIndexOfInmateLawyerIfExists(visitor, this.visit.inmateId) !== -1) {
        this.addVisitorToCurrentVisitors(visitor);
      }
      else {
        // Παίρνω τα δηλωμένα στοιχεία για τον επισκέπτη, καταχωρώ μια νέα σχέση με τον τρέχον κρατούμενο και την στέλνω προς επεξεργασία
        let visitorStatedData = this.visitApplication.visitApplicationVisitors.filter(visitApplicationVisitor => visitApplicationVisitor.visitorId === visitor.id)[0];

        let inmateLawyer: InmateLawyer = new InmateLawyer();

        inmateLawyer.inmateId = this.visit.inmateId;

        visitor.inmateLawyers.push(inmateLawyer);

        this.displayEditVisitor(visitor);
      }
    }
    
  }
  
  // Μέθοδος που στέλνει ένα κενό αντικείμενο επισκέπτη προς αποθήκευση
  createNewVisitorWithNoRelation() {

    this.clearVisitorForm();
    this.initializeVisitor(new Visitor());
  }

  // Μέθοδος που στέλνει προς προβολή-επεξεργασία ένα υπάρχον αντικείμενο επισκέπτη
  displayEditVisitor(visitor: Visitor) {
    this.clearVisitorForm();
    this.initializeVisitor(visitor);
  }

  // Μέθοδος που ανοίγει ένα dialog, ο χρήστης διαλέγει έναν επισκέπτη και τον στέλνει προς προβολή επεξεργασία
  openExistingVisitorWithNoRelationDialog() {

    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(VisitorListDialogComponent, {
      header: this.translate.instant('visitor.select.dialogTitle'),
      width: '95%',
      data: {
        canCreate: false,
        fromTodayGateMovements: true
      }
    });

    dialogRef.onClose.subscribe((visitorId) => {
      if (visitorId) {
        this.visitorService.getVisitor(visitorId).subscribe({
          next: (responseData) => {
            this.toitsuBlockUiService.blockUi();
            if (responseData) {

              this.visitor = <Visitor> responseData;
              this.displayEditVisitor(this.visitor);
            }
          },
          error: (responseError) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
        });

      } else {
        // VisitorId is undefined when user presses cancel in dialog
      }
    });
  }


  // ---------------------------------------------------------------------------------------------------------------------------------------

  // Visitor
  visitor: Visitor; // will be used for visitor form
  inmateRelationIndex: number = -1; // Δείκτης της υπάρχουσας σχέσης συγγένειας του επισκέπτη με τον κρατούμενο
  inmateLawyerIndex: number = -1; // Δείκτης της υπάρχουσας σχέσης δικηγόρου του επισκέπτη με τον κρατούμενο
  inmateLawyer: InmateLawyer; // Πεδίο που κρατάει το πιθανό ΙnmateLawyer προς αποθήκευση
  inmateRelation: InmateRelation; // Πεδίο που κρατάει το πιθανό ΙnmateRelation προς αποθήκευση
  
  visitorCategories = [];
  lawyerClubs = [];
  relationKinds = [];
  otherRelationKinds = [];
  allCountries = [];
  cities = [];
  pOtherRelationKind = {};


  // Επιστρέφει τον index από το τελευταία υπάρχον InmateRelation αν υπάρχει, αλλιώς επιστρέφει -1
  getLastIndexOfInmateRelationIfExists(visitor: Visitor, inmateId: number): number {
    let indexOfInmateRelation;
    
    if (visitor.inmateRelations.filter(inmateRelation => inmateRelation.inmateId === inmateId).length >= 1) {
      for (let i = 0; i < visitor.inmateRelations.length; i++) {
        if (visitor.inmateRelations[i].inmateId === inmateId) {
          indexOfInmateRelation = i;
        }
      }
      return  indexOfInmateRelation; 
    } else {
      return -1;
    }
  }

  // Επιστρέφει τον index από το τελευταία υπάρχον InmateLawyer αν υπάρχει, αλλιώς επιστρέφει -1
  getLastIndexOfInmateLawyerIfExists(visitor: Visitor, inmateId: number): number {
    let indexOfInmateLawyer;
    
    if (visitor.inmateLawyers.filter(inmateLawyer => inmateLawyer.inmateId === inmateId).length >= 1) {
      for (let i = 0; i < visitor.inmateLawyers.length; i++) {
        if (visitor.inmateLawyers[i].inmateId === inmateId) {
          indexOfInmateLawyer = i;
        }
      }
      return indexOfInmateLawyer;
    } else {
      return -1;
    }
  }


  initializeVisitor(visitor: Visitor) {
    this.visitor = visitor;
    
    if (this.getVisitTypeKindByVisitTypeId(this.visit.visitTypeId) === 'RELATION') {
      this.inmateRelationIndex = this.getLastIndexOfInmateRelationIfExists(this.visitor, this.visit.inmateId);

      // Αν δεν υπάρχει δείκτης για σχέση συγγένειας, προσθέτουμε νέα σχέση συγγένειας, αλλιώς επεξεργαζόμαστε-δείχνουμε την υπάρχουσα σχέση
      if (this.inmateRelationIndex === -1) {
        this.inmateRelation = new InmateRelation();
      } else {
        this.inmateRelation = this.visitor.inmateRelations[this.inmateRelationIndex];
      }

    } else if (this.getVisitTypeKindByVisitTypeId(this.visit.visitTypeId) === 'LAWYER') {
      this.inmateLawyerIndex = this.getLastIndexOfInmateLawyerIfExists(this.visitor, this.visit.inmateId);

      // Αν δεν υπάρχει δείκτης για σχέση δικηγορόυ, προσθέτουμε νέα σχέση δικηγορόυ, αλλιώς επεξεργαζόμαστε-δείχνουμε την υπάρχουσα σχέση
      if (this.inmateLawyerIndex === -1) {
        this.inmateLawyer = new InmateLawyer();
      } else {
        this.inmateLawyer = this.visitor.inmateLawyers[this.inmateLawyerIndex];
      }
    }


    // VisitorCategories
    this.genParameterService.getByCategory(GenParameterCategory.Visitor_Category, true, [this.visitor.visitorCategoryPid]).subscribe(responseData => {
      this.visitorCategories = responseData;
    });

    // LawyerClubs
    this.genParameterService.getByCategory(GenParameterCategory.Visitor_LawyerClub, true, [this.visitor.lawyerClubPid]).subscribe(responseData => {
      this.lawyerClubs = responseData;
    });

    // RelationKinds
    this.enumService.getEnumValues('inm.core.enums.InmateRelationKind').subscribe(responseData => {
      this.relationKinds = responseData;
    });

    // OtherRelationKinds
    let otherRelationKindPids = [];
    if (this.visitor.inmateRelations) {
      this.visitor.inmateRelations.forEach(inmateRelation => {
        if (inmateRelation.otherRelationKindPid) {
          otherRelationKindPids.push(inmateRelation.otherRelationKindPid);
        }
      });
    }
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRelation_OtherRelationKind, otherRelationKindPids).subscribe((responseData: GenParameterType) => {
      this.pOtherRelationKind = responseData;
    });
    
    this.countryService.getCountries(true, [this.visitor.birthCountryId]).subscribe(responseData => {
      this.allCountries = responseData;
    });

    if (this.visitor.homeCountryId) {
      this.cityService.getCitiesByCountryId(this.visitor.homeCountryId, true, [this.visitor.homeCityId]).subscribe(responseData => {
        this.cities = responseData;
      });
    }

  }
  homeCountryIdChanged() {
    if (this.visitor.homeCountryId) {
      this.cityService.getCitiesByCountryId(this.visitor.homeCountryId, true, [this.visitor.homeCityId]).subscribe(responseData => {
        this.cities = responseData;
      });
    } else {
      this.cities = [];
    }
  }
  
  // Μέθοδος που καθαρίζει την φόρμα του επισκέπτη και τις σχέσεις προς επεξεργασία-προβολή
  clearVisitorForm() {
    this.visitor = null;
    this.inmateRelation = null;
    this.inmateLawyer = null;
  }
  saveVisitor() {
    
    // Αν το αντικείμενο σχέσης συγγένειας δεν είναι null και δεν τροποποιούμε υπάρχουσα συγγένεια στον επισκέπτη, προσθέτουμε την νέα συγγένεια
    if (this.inmateRelation && this.inmateRelationIndex === -1) {
      this.inmateRelation.inmateId = this.visit.inmateId;
      this.visitor.inmateRelations.push(this.inmateRelation);
    }
    // Αν το αντικείμενο σχέσης δικηγόρου δεν είναι null και δεν τροποποιούμε υπάρχουσα συγγένεια στον επισκέπτη, προσθέτουμε την νέα συγγένεια
    else if (this.inmateLawyer && this.inmateLawyerIndex === -1) {
      this.inmateLawyer.inmateId = this.visit.inmateId;
      this.visitor.inmateLawyers.push(this.inmateLawyer);
    }


    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.visitorService.saveVisitor(this.visitor).subscribe({
      next: (responseData: Visitor) => {
        this.toitsuToasterService.showSuccessStay();

        let savedVisitor: Visitor = responseData;
        
        this.addVisitorToExistingVisitors(savedVisitor);
        
        if (this.inmateRelation || this.inmateLawyer) {
          this.addVisitorToCurrentVisitors(savedVisitor);
        }
        
        this.clearVisitorForm();

      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
        if (this.inmateRelation) {
          this.visitor.inmateRelations.pop();
        }
        else if (this.inmateLawyer) {
          this.visitor.inmateLawyers.pop();
        }
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });


  }
  getLastInmateRelationKindLabelFromVisitorByInmateId(visitor: Visitor, inmateId: number) {
    
    // Βρίσκω πόσες σχέσεις συγγένειας έχει ο επισκέπτης με τον κρατούμενο
    let inmateRelationsSize = visitor.inmateRelations.filter(inmateRelation => inmateRelation.inmateId === inmateId).length;

    if (inmateRelationsSize  !== 0) {
      let lastInmateRelation = inmateRelationsSize - 1;
      let kind = visitor.inmateRelations.filter(inmateRelation => inmateRelation.inmateId === inmateId)[lastInmateRelation].relationKind;
      if (kind != null) {
        return this.relationKinds.filter(relationKind => relationKind['value'] === kind)[0]['label'];
      }
    }
    return '';
  }
  
  // Μέθοδος που επιστρέφει το είδος του επισκεπτηρίου με βάση το id του τύπου επισκεπτηρίου
  getVisitTypeKindByVisitTypeId(visitTypeId: number) {
    if (this.visitTypes.filter(visitType => visitType.id === visitTypeId).length !== 0) {
      return (this.visitTypes.filter(visitType => visitType.id === visitTypeId)[0]['kind']);
    }
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  // VisitApplication
  visitApplication: VisitApplication;
  visitTypesFromVisitApplication = [];
  visitorsFromApplication = [];
  
  clearVisitorsFromApplication() {
    this.visitorsFromApplication = [];
  }
  openApprovedAndPendingVisitApplicationsDialog(): void {
    
    this.visitApplicationService.getVisitApplicationByInmateAndVisitTypeId(this.visit.inmateId, this.visit.visitTypeId).subscribe(response => {

      let visitApplications = <[]> response;
      
      if (visitApplications.length !== 0) {

        this.toitsuToasterService.clearMessages();
        const ref = this.dialogService.open(ApprovedAndPendingVisitApplicationsDialogComponent, {
          header: this.translate.instant('visitApplication.select.dialogTitle'),
          data: {
                visitApplications: visitApplications
              },
          closable: false,
        });
        
        ref.onClose.subscribe(visitApplication => {
          if (visitApplication) {
            this.visitApplicationIdChanged(visitApplication);
          }
        });
      }
    }
    );
  }
}
