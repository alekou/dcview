import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {Director} from './director.model';
import {DirectorService} from './director.service';
import {EnumService} from '../../cm/enum/enum.service';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-sa-director-view',
  templateUrl: 'director-view.component.html'
})
export class DirectorViewComponent implements OnInit, ExitConfirmation {
  
  id: number;
  director: Director;
  @ViewChild(NgForm) directorForm: NgForm;
  
  directorTypes = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private directorService: DirectorService,
    private enumService: EnumService,
    public authService: AuthService,
  ) {}
  
  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.director = this.id ? this.route.snapshot.data['record'] : new Director();
  
    this.enumService.getEnumValues('cm.core.enums.DirectorType').subscribe(responseData => {
      this.directorTypes = responseData;
    });
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.directorForm.dirty;
  }
  
  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }
    
    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.director.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    
    return false;
  }
  
  newRecord() {
    this.router.navigate(['/sa/director/view']);
  }
  
  goToList() {
    this.router.navigate(['/sa/director/list']);
  }
  
  saveDirector() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.directorService.saveDirector(this.director).subscribe({
      next: (responseData: Director) => {
        this.toitsuToasterService.showSuccessStay();
        this.directorForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/director/view', responseData.id]);
        } else {
          this.director = responseData;
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
