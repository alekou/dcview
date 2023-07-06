export class EventParticipant {

  // Τα ονόματα των πεδίων, *ακριβώς* όπως αυτά δηλώθηκαν στο EventParticipantDto
  public id: number = null;
  public dcId: number = null;
  public eventRecordId: number = null;
  public eventTypePid: number = null;
  public eventPlacePid: number = null;
  public participantType: string = null;
  public participantRole: string = null;
  public inmateId: number = null;
  public employeeId: number = null;
  public lastName: string = null;
  public firstName: string = null;
  public nationalityId: number = null;
  public isNewcomer: boolean = false;
  public externalTreatment: string = null;
  public hasProsecution: boolean = false;
  public protectionMeasures: string = null;
  public hasEventReport: boolean = false;
  public hasForensicReport: boolean = false;
  public hasForensicEvaluation: boolean = false;
}
