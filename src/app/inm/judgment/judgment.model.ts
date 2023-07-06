export class Judgment {
  public id: number = null;
  public inmateId: number = null;
  public current: boolean = false;
  public completed: boolean = false;
  public cancelled: boolean = false;
  public merging: boolean = false;
  public merged: boolean = false;
  public relatedJudgmentId: number = null;
  public cancelComments: string = null;
  public sortField: string = null;
  public orderNo: string = null;
  public orderDate: Date = null;
  public daOfficePid: number = null;
  public daOfficeCityId: number = null;
  public type: string = null;
  public judgmentNo: string = null;
  public judgmentDate: Date = null;
  public courthouseId: number = null;
  public categoryPid: number = null;
  public factPid: number = null;
  public fact2Pid: number = null;
  public fact3Pid: number = null;
  public fact4Pid: number = null;
  public fact5Pid: number = null;
  public fact6Pid: number = null;
  public fact7Pid: number = null;
  public fact8Pid: number = null;
  public fact9Pid: number = null;
  public fact10Pid: number = null;
  public sentencePid: number = null;
  public factClassificationId: number = null;
  public sentenceStartDate: Date = null;
  public imprisonDate: Date = null;
  public interrupted: boolean = false;
  public forLife: boolean = false;
  public forLifeMultiplier: number = null;
  public userRest: boolean = false;
  public sentenceYears: number = null;
  public sentenceMonths: number = null;
  public sentenceDays: number = null;
  public imprisonYears: number = null;
  public imprisonMonths: number = null;
  public imprisonDays: number = null;
  public detentionYears: number = null;
  public detentionMonths: number = null;
  public detentionDays: number = null;
  public escapeYears: number = null;
  public escapeMonths: number = null;
  public escapeDays: number = null;
  public restYears: number = null;
  public restMonths: number = null;
  public restDays: number = null;
  public sentenceFee: number = null;
  public sentenceFeeText: string = null;
  public doiChecked: boolean = false;
  public doi: string = null;
  public sentenceFeeCurrencyPid: number = null;
  public expulsion: boolean = false;
  public sequentialPid: number = null;
  public comments: string = null;
  
  public sentenceEndDate: Date = null;
  public beneficialCalculation: number = null;
  public beneficialCalculationText: string = null;
  public daysSubtracted: number = null;
  public sentenceNewEndDate: Date = null;
  
  public relatedJudgment: JudgmentMini = null;
  public displayName: string = null;
  public isHidden: boolean = false;
  public isRelated: boolean = false;
  public isChecked: boolean = false;
}

class JudgmentMini {
  public displayName: string = null;
}
