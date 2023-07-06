import {DiseaseType} from '../disease-type/disease-type.model';

export class Disease {
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public diseaseTypeId: number = null;
  public hearingId: number = null;
  public diagnosisDate: Date = null;
  public isChronic: boolean = false;
  public progression: string = null;
  public symptoms: string = null;
  
  diseaseType: DiseaseType = new DiseaseType();
}
