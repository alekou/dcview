

export class DisciplineDecision {
  public id: number = null;
  public dcId: number = null;
  public disciplineCouncilId: number = null;
  public decisionNo: string = null;
  public decisionDate: Date = null;
  public comments: string = null;
  
  public disciplineOffenses = [];
  public selectedDisciplineOffenses = [];
}
