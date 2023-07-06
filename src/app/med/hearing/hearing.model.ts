export class Hearing {
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public doctorId: number = null;
  public hearingApplicationId: number = null;
  public hearingTypeId: number = null;
  public hearingDate: Date = null;
  public hearingApplicationExists: boolean = false;
  public comments: string = null;
  public medicalHistory: boolean = false;
  public isInjury: boolean = false;
  public injuryKind: string = null;
  public injuryComments: string = null;
  public isDeath: boolean = false;
  public deathDate: Date = null;
  public deathReason: string = null;
  public deathComments: string = null;
  public reviewHearing: boolean = false;
  public reviewDate: Date = null;
}
