import {InmateRecord} from '../inmate-record/inmate-record.model';
import {Judgment} from '../judgment/judgment.model';
import {Appeal} from '../appeal/appeal.model';

class MasterInmate {
  public id: number = null;
  public code: string = null;
  public fingerprint: string = null;
  public dee: string = null;
}

export class Inmate {
  public id: number = null;
  public masterInmate: MasterInmate = new MasterInmate();
  public oldCode: string = null;
  public lastName: string = null;
  public firstName: string = null;
  public nickName: string = null;
  public fatherName: string = null;
  public motherName: string = null;
  public motherGenos: string = null;
  public gender: string = null;
  public adt: string = null;
  public adtAuthority: string = null;
  public passport: string = null;
  public afm: string = null;
  public doi: string = null;
  public amka: string = null;
  public ageCategory: string = null;
  public birthCountryId: number = null;
  public birthMunicipalityId: number = null;
  public birthCityId: number = null;
  public birthPlace: string = null;
  public birthDate: Date = null;
  public birthYear: number = null;
  public religionPid: number = null;
  public recidivist: boolean = false;
  public nationalityMainId: number = null;
  public nationality2Id: number = null;
  public nationality3Id: number = null;
  public nationality4Id: number = null;
  public nationality5Id: number = null;
  public educationPid: number = null;
  public foreignLanguagePid: number = null;
  public professionPid: number = null;
  public otherEducation: string = null;
  public newEducationInsidePid: number = null;
  public newEducationOutsidePid: number = null;
  public otherNewEducation: string = null;
  public verbalSkillGreekPid: number = null;
  public writtenSkillGreekPid: number = null;
  public homeCountryId: number = null;
  public homeCityId: number = null;
  public homeArea: string = null;
  public homeAddress: string = null;
  public homePhone: string = null;
  public residenceCountryId: number = null;
  public residenceCityId: number = null;
  public residenceArea: string = null;
  public residenceAddress: string = null;
  public residencePhone: string = null;
  public residenceYearsGreece: number = null;
  public maritalStatus: string = null;
  public otherMaritalStatusPid: number = null;
  public height: number = null;
  public eyeColorPid: number = null;
  public hairColorPid: number = null;
  public lineaments: string = null;
  public comments: string = null;
  public medComments: string = null;
  
  public folderStatus: string = null;
  public folderSerialNo: number = null;
  public folderOpeningDate: Date = null;
  public folderOpeningReasonPid: number = null;
  public folderEuroWarrant: boolean = false;
  public folderClosingDate: Date = null;
  public folderClosingClassificationId: number = null;
  public folderClosingComments: string = null;
  public folderComments: string = null;
  
  public inmateRecord: InmateRecord = new InmateRecord();
  public judgment: Judgment = new Judgment();
  public inmateAbsence: InmateAbsence = new InmateAbsence();
  
  public inmateRecords: InmateRecord[] = [];
  public judgments: Judgment[] = [];
  public appeals: Appeal[] = [];
  
  public canEditInmate: boolean = false;
  public temporaryRecordExistsInDifferentDc: boolean = false;
}

class InmateAbsence {
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public type: string = null;
  public fromDate: Date = null;
  public toDate: Date = null;
  public destination: string = null;
  public reason: string = null;
  public displayDetails: string = null;
}
