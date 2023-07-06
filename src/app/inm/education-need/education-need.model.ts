import {EducationNeedFeedback} from '../education-need-feedback/education-need-feedback.model';
import {Inmate} from '../inmate/inmate.model';

export class EducationNeed {
  public id: number = null;
  public inmateId: number = null;
  public dcId: number = null;
  public userId: number = null;
  public submitDate: Date = null;
  public educationUnitInterest: [{}];
  public individualTeachingInterest: boolean = false;
  public tertiaryEducationInterest: boolean = false;
  public programInterest: [{}];
  public formerProfession: [{}];
  public priorTraining: boolean = false;
  public priorTrainingDetails: [{}];
  public work: boolean = false;
  public professionId: number = null;
  public reintegrationSupport: [{}];
  
  public inmate: Inmate = new Inmate();

  public educationNeedFeedbacks: EducationNeedFeedback[] = [];
}
