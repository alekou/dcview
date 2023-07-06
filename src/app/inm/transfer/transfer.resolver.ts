import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {TransferService} from './transfer.service';

@Injectable({providedIn: 'root'})
export class TransferResolver implements Resolve<any> {
  
  constructor(private transferService: TransferService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.transferService.getTransfer(route.paramMap.get('id'));
  }
}
