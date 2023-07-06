export class Medicine {
  public id: number = null;
  public categoryId: number = null;
  public subCategoryId: number = null;
  public supplierId: number = null;
  public characterizationPid: number = null;
  public substancesPid: number = null;
  public measurementUnitPid: number = null;
  public quantityPerPacket: number = null;
  public typePid: number = null;
  public code: string = null;
  public secondaryCode: string = null;
  public isPsychiatric: boolean = false;
  public isAntiRetroViral: boolean = false;
  public isVaccine: boolean = false;
  public isInjectable: boolean = false;
  public isParamedical: boolean = false;
  public isGeneric: boolean = false;
  public isInactive: boolean = false;
  public withDrawalDate: Date = null;
  public eofCode: string = null;
  public medicineName: string = null;
  public shape: string = null;
  public content: string = null;
  public packing: string = null;
  public atc: string = null;
  public comments: string = null;
}
