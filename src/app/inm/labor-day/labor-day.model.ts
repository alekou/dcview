export class LaborDay {
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public judgmentId: number = null;
  public census: boolean = false;
  public retractive: boolean = false;
  public creationDate: Date = null;
  public presence: boolean = false;
  public laborProtocolId: number = null;
  public approved: boolean = false;
  public inmateLaborId: number = null;
  public professionId: number = null;
  public factor: number = null;
  public workDays: number = null;
  public laborDate: Date = null;
  public laborDateTo: Date = null;
  public locationPid: number = null;
  public comments: string = null;
  public paid: boolean = false;
  public paymentCategoryId: number = null;
  public dayPayment: number = null;
  
  public judgment: JudgmentMini = null;
  public laborProtocol: LaborProtocolMini = null;
}

class JudgmentMini {
  public displayName: string = null;
}

class LaborProtocolMini {
  public displayName: string = null;
}
