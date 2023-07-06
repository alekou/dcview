export class Referral {
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public inmateRecordId: number = null;
  public doctorId: number = null;
  public hospitalId: number = null;
  public hospitalDepartmentId: number = null;
  public frequency: boolean = false;
  public rejectedTransfer: boolean = false;
  public transferDate: Date = null;
  public returnDate: Date = null;
  public incident: string = null;
  public reason: string = null;
  public comments: string = null;
}
