import {Component, OnInit} from '@angular/core';
import {Inmate} from '../inmate/inmate.model';
import {LaborCatalogService} from './labor-catalog.service';
import {LaborCatalog} from './labor-catalog.model';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-inm-labor-catalog',
  templateUrl: 'labor-catalog.component.html'
})
export class LaborCatalogComponent implements OnInit {

  id: number;
  laborCatalog: LaborCatalog = new LaborCatalog();
  inmate: Inmate = new Inmate();

  constructor(
    private laborCatalogService: LaborCatalogService,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    // Αποθήκευση του id της εγγραφής από το URL
    this.id = +this.route.snapshot.params['id'];

    // Φόρτωση εγγραφής βάση του id
    this.laborCatalog = this.route.snapshot.data['record'];

    // Αρχικοποίηση των πεδίων του Κρατουμένου για ανάκτηση της τρέχουσας φωτογραφίας του
    if (this.id) {
      this.initializeInmate();
    }
  }

  initializeInmate() {
    this.inmate.id = this.laborCatalog.inmate.id;
    this.inmate.masterInmate.code = this.laborCatalog.inmate.code;
    this.inmate.lastName = this.laborCatalog.inmate.lastName;
    this.inmate.firstName = this.laborCatalog.inmate.firstName;
    this.inmate.fatherName = this.laborCatalog.inmate.fatherName;
    this.inmate.motherName = this.laborCatalog.inmate.motherName;
  }

}
