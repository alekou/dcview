import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {DateService} from '../../toitsu-shared/date.service';
import {ExportModel} from './export.model';
import {exportConsts} from './export.consts';
import {environment} from '../../../environments/environment';
import * as fileSaver from 'file-saver';

@Injectable({providedIn: 'root'})
export class ExportService {
  
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService,
    private dateService: DateService
  ) {}
  
  prepareExcelModel(cols) {
    let finalCols = [];
    for (let col of cols) {
      if (col['field'] !== 'rowNum' && col['field'] !== 'extraActions' && !(col['customCell'] && !col['inExcel'])) {
        finalCols.push(col);
      }
    }
    return JSON.stringify(finalCols);
  }
  
  exportToExcel(searchString, model, sidx, sord, exportModel: ExportModel) {
    
    let title = exportModel.title;
    let controllerName = exportModel.controllerName;
    let methodName = exportModel.methodName;
    let argsClass = exportModel.argsClass;
    
    return this.http
      .post(
        environment.apiBaseUrl + exportConsts.exportExcelUrl,
        null,
        {
          params: this.toitsuSharedService.initHttpParams({searchString, model, sidx, sord, title, controllerName, methodName, argsClass}),
          responseType: 'arraybuffer'
        }
      );
  }
  
  saveAsExcelFile(buffer: any, fileName: string, excelExtension: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    fileSaver.saveAs(data, fileName + '_' + this.dateService.getCurrentDateStringForExport() + excelExtension);
  }
}
