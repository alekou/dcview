import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {VisitorService} from '../visitor.service';
import {InmateRelationService} from '../../inmate-relation/inmate-relation.service';
import {InmateRelativeViewDialogComponent} from '../../inmate/inmate-relative-view-dialog/inmate-relative-view-dialog.component';
import {GenParameterCategory} from '../../../sa/gen-parameter/gen-parameter.category';
import {GenParameterTypeService} from '../../../sa/gen-parameter-type/gen-parameter-type.service';
import {InmateRelativeListDialogComponent} from '../../inmate/inmate-relative-list-dialog/inmate-relative-list-dialog.component';

@Component({
  selector: 'app-inmate-relatives',
  templateUrl: 'inmate-relatives.component.html'
})
export class InmateRelativesComponent implements OnInit {

  @Input() inmateId: number;
  relatives = [];
  otherRelatives = [];
  otherRelationKinds = [];


  constructor(
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private visitorService: VisitorService,
    private inmateRelationService: InmateRelationService,
    private genParameterTypeService: GenParameterTypeService
  ) {}

  ngOnInit(): void {
    this.genParameterTypeService.getByCategory(GenParameterCategory.InmateRelation_OtherRelationKind, []).subscribe(responseData => {
      this.otherRelationKinds = responseData['genParameters'];
    });
  }
  
  openInmateRelativeListDialog(relationKind?) {
    const dialogTitle = 'visitor.inmateRelatives.new';
    const inmateCloseRelativeDialog = this.dialogService.open(InmateRelativeListDialogComponent, {
      header: this.translate.instant('visitor.select.dialogTitle'),
      width: '97%',
      data: {
        inmateId: this.inmateId,
        relationKind: relationKind
      },
    });
    inmateCloseRelativeDialog.onClose.subscribe(result => {
      if (result) {
        if (result.inmateRelations[0].relationKind === 'OTHER') {
          this.otherRelatives.push(result);
        } else {
          this.relatives.push(result);
        }
      }
    });
  }

  /**
   * Επεξεργασία επισκέπτη / συγγενή
   */
  openInmateRelativeDialogForUpdate(relative) {
    if (this.inmateId) {
      this.dialogService.open(InmateRelativeViewDialogComponent, {
        header: this.translate.instant('inm.visitor.edit'),
        width: '97%',
        data: {
          inmateId: this.inmateId,
          visitor: relative
        }
      });
    }
  }

  /**
   * Διαγραφή συσχέτισης επισκέπτη με κρατούμενο
   */
  deleteInmateRelation(relationId, relative) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.inmateRelationService.deleteInmateRelation(relationId).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            relative.inmateRelations = relative.inmateRelations.filter(relation => relation.id !== relationId);
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
  

  /**
   * Ανάκτηση τιμής "Πλησιέστερος Συγγενής" για την κάθε Συγγένεια Κρατουμένου
   */
  getFirstIsCloseRelative(visitor, id) {
    const relation = visitor.inmateRelations.find(inmateRelation => inmateRelation.inmateId === id);
    return relation ? relation.isClosestRelative : false;
  }

  /**
   * Ανάκτηση των συγγενειών του κρατόυμενου και ταξινόμηση με βάση το είδος
   */
  getRelationsForInmate(relative, id) {
    return relative.inmateRelations.filter(relation => relation.inmateId === id)
      .sort((a, b) => {
        if (a.relationKind < b.relationKind) {
          return -1;
        } else if (a.relationKind > b.relationKind) {
          return 1;
        } else {
          return 0;
        }
      });
  }

  /**
   * Ταξινόμιση των επισκεπτών με βάση τον τύπο συγγένειας
   */
  sortVisitors(): void {
    this.relatives.sort((visitor1, visitor2) => {
      const relationKinds1 = this.getRelationKinds(visitor1);
      const relationKinds2 = this.getRelationKinds(visitor2);
      const relationKind1 = relationKinds1.length > 0 ? relationKinds1[0] : '';
      const relationKind2 = relationKinds2.length > 0 ? relationKinds2[0] : '';
      return relationKind1.localeCompare(relationKind2);
    });
  }

  /**
   * Ανάκτηση των τύπων συγγένειας του κάθε επισκέπτη
   */
  getRelationKinds(visitor): string[] {
    const relations = this.getRelationsForInmate(visitor, this.inmateId);
    return relations.map(relation => relation['relationKindLabel']);
  }

  /**
   * Ανάκτηση των λεκτικών της άλλης συγγένειας με βάση την συγγένεια του κρατούμενου
   */
  getOtherRelationKindDescription(inmateRelationId) {
    const type = this.otherRelationKinds.find(genParameter => genParameter.id === inmateRelationId);
    return type ? type.description : '';
  }

  /**
   * Ανάκτηση των δεδομένων τους συγγενείς
   */
  getInmateRelatives() {
    // Αν δεν έχουν ήδη φορτωθεί τα δεδομένα
    if (this.relatives.length === 0 && this.inmateId) {
      this.visitorService.getVisitorsByInmateId(this.inmateId).subscribe(responseData => {
        this.relatives = responseData;
        this.sortVisitors();
      });
    }
  }

  /**
   * Ανάκτηση των δεδομένων τους λοιπούς συγγενείς
   */
  getInmateOtherRelatives() {
    // Αν δεν έχουν ήδη φορτωθεί τα δεδομένα
    if (this.otherRelatives.length === 0 && this.inmateId) {
      this.visitorService.getVisitorsByInmateId(this.inmateId, 'OTHER').subscribe(responseData => {
        this.otherRelatives = responseData;
        this.sortVisitors();
      });
    }
  }
}
