import {DisciplineOffense} from '../discipline-offense/discipline-offense.model';

export class DiscReportOffense {
  public id: number = null;
  public disciplineReportId: number = null;
  public disciplineOffenseId: number = null;
  public disciplineOffense: DisciplineOffense = null;
  public relatedDisciplineReportsOfDisciplineOffense = [];
  
}
