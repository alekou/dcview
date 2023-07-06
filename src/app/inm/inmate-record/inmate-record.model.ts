export class InmateRecord {
  public id: number = null;
  public inmateId: number = null;
  public dcId: number = null;
  public lastRecordDc: boolean = false;
  public lastRecord: boolean = false;
  public status: string = null;
  public code: string = null;
  public category: string = null;
  public serialNo: number = null;
  public relatedInmateRecordId: number = null;
  public characterizationPid: number = null;
  public durationTypePid: number = null;
  public durationPid: number = null;
  public entryDate: Date = null;
  public entryReasonPid: number = null;
  public arrestDate: Date = null;
  public custodyEndDate: Date = null;
  public transferFromId: number = null;
  public cameFromPlacePid: number = null;
  public cameFromCityId: number = null;
  public hosted: boolean = false;
  public hostDate: Date = null;
  public wrongDetention: boolean = false;
  public transferInability: boolean = false;
  public transferInabilityReason: string = null;
  public transferInabilityEndDate: Date = null;
  public exitDate: Date = null;
  public closingClassificationId: number = null;
  public closingComments: string = null;
  public escortName: string = null;
  public escortStatusPid: number = null;
  public escortServicePid: number = null;
  public comments: string = null;
  public electroActive: boolean = false;
  public electroJudgmentNo: string = null;
  public electroStartDate: Date = null;
  public electroSerialNo: string = null;
  public electroInfringement: boolean = false;
  public electroComments: string = null;
  
  public transferFrom: TransferMini = null;
}

class TransferMini {
  public displayName: string = null;
}
