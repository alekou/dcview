import {ExaminationType} from '../examination-type/examination-type.model';

export class Examination {
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public examinationTypeId: number = null;
  public hearingId: number = null;
  public bloodSamplingId: number = null;
  public examinationDate: Date = null;
  public results: string = null;
  public resultsDate: Date = null;
  public comments: string = null;
  
  public examinationType: ExaminationType =  new ExaminationType();
}
