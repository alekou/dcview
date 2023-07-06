import {DisciplinePenalty} from '../discipline-penalty/discipline-penalty.model';

export class Discipline {
  
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public inmateRecordId: number = null;
  public merging: boolean = false;
  public merged: boolean = false;
  public relatedDisciplineId: number = null;
  public serialNo: number = null;
  public reportProtocolNo: string = null;
  public disciplineTypePid: number = null;
  public decisionNo: string = null;
  public decisionDate: Date = null;
  public endDate: Date = null;
  public decisionAuthorityPid: number = null;
  public reason: string = null;
  public behaviorPid: number = null;
  public points: number = null;
  public visitDenied: boolean = false;
  public solitaryConfinement: boolean = false;
  public solitaryConfinementDuration: number = null;
  public disciplinaryTransfer: boolean = false;
  public workDeprivation: boolean = false;
  public workDeprivationDuration: number = null;
  public comments: string = null;
  public disciplinePenalties: DisciplinePenalty[] = [];
  
  public selectedDisciplines = [];

  public decisionName: string = null;
  public inmateFullName: string = null;
  public disciplinePenaltiesFullDescription: string = null;
  
}
