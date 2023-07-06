import {Component, OnInit} from '@angular/core';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ActivatedRoute} from '@angular/router';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-inm-display-merged-disciplines-list-dialog',
  templateUrl: 'display-merged-disciplines-dialog.component.html'
})

export class DisplayMergedDisciplinesDialogComponent implements OnInit {
  id: number;
  mergedDisciplines = [];
  viewLink = '/inm/discipline/view';

  constructor(
    private dynamicDialogRef: DynamicDialogRef,
    private toitsuToasterService: ToitsuToasterService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private route: ActivatedRoute,
  ) {
    this.mergedDisciplines = this.dynamicDialogConfig.data['mergedDisciplines'];
  }

  ngOnInit() {

    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

  }
  confirm() {
    this.dynamicDialogRef.close();
  }


}
