import {DisciplineOffense} from '../discipline-offense/discipline-offense.model';

export class DiscCouncilOffense {
  public id: number = null;
  public disciplineCouncilId: number = null;
  public disciplineOffenseId: number = null;
  public postponed: boolean = false;

  public disciplineOffense: DisciplineOffense = null;
  
}
