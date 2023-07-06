import {Examination} from '../examination/examination.model';

export class BloodSampling {
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public hearingId: number = null;
  public samplingDate: Date = null;
  public testDate: Date = null;
  public resultDate: Date = null;
  public comments: string = null;
  
  public examinations: Examination[] = [];
}
