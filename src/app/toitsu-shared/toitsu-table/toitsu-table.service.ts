import {Injectable} from '@angular/core';
import {ToitsuTableComponent} from './toitsu-table.component';

@Injectable({providedIn: 'root'})
export class ToitsuTableService {
  
  constructor() {}
  
  ROWS_PER_PAGE_OPTIONS = [100, 200, 500];
  FIRST = 0;
  ROWS = this.ROWS_PER_PAGE_OPTIONS[0];
  
  private getArgsLocalStorageKey(key: string) {
    return 'ToitsuTableArgs - ' + key;
  }
  
  private getPagingLocalStorageKey(key: string) {
    return 'ToitsuTablePaging - ' + key;
  }
  
  storeArgsAndPagingInLocalStorage(key: string, args: any, table: ToitsuTableComponent) {
    localStorage.setItem(this.getArgsLocalStorageKey(key), JSON.stringify(args));
    localStorage.setItem(this.getPagingLocalStorageKey(key), JSON.stringify(table.storedPaging));
  }
  storeArgsAndRemovePagingFromLocalStorage(key: string, args: any) {
    localStorage.setItem(this.getArgsLocalStorageKey(key), JSON.stringify(args));
    localStorage.removeItem(this.getPagingLocalStorageKey(key));
  }
  
  removeArgsAndPagingFromLocalStorage(key: string) {
    localStorage.removeItem(this.getArgsLocalStorageKey(key));
    localStorage.removeItem(this.getPagingLocalStorageKey(key));
  }
  
  initializeArgsFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(this.getArgsLocalStorageKey(key)));
  }
  
  initializePagingFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(this.getPagingLocalStorageKey(key)));
  }
  
  removeAllArgsAndPagingFromLocalStorage() {
    Object.keys(localStorage).filter(item => item.startsWith('ToitsuTableArgs')).forEach(item => localStorage.removeItem(item));
    Object.keys(localStorage).filter(item => item.startsWith('ToitsuTablePaging')).forEach(item => localStorage.removeItem(item));
  }
}
