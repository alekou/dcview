export class Transport {

  // Τα ονόματα των πεδίων, *ακριβώς* όπως αυτά δηλώθηκαν στο TransportDto
  public id: number = null;
  public inmateId: number = null;
  public inmateRecordId: number = null;
  public dcId: number = null;
  public lastName: string = null;
  public firstName: string = null;
  public nickName: string = null;
  public gender: string = null;
  public fatherName: string = null;
  public motherName: string = null;
  public motherGenos: string = null;
  public adt: string = null;
  public passport: string = null;
  public afm: string = null;
  public birthCountryId: number = null;
  public birthCityId: number = null;
  public nationalityMainId: number = null;
  public birthDate: Date = null;
  public birthYear: number = null;
  public folderEuroWarrant: boolean = false;
  public hasExtraProtocol: boolean = false;
  public isArchived: boolean = false;
  public expulsion: boolean = false;
  public hasMentalDetention: boolean = false;
  public hasSentenceFee: boolean = false;
  public isReleased: boolean = false;
  public folderSerialNo: number = null;
  public requestNo: string = null;
  public requestDate: Date = null;
  public decisionNo: string = null;
  public decisionDate: Date = null;
  public authorityPid: number = null;
  public reevaluationDate: Date = null;
  public abroadConvictions: string = null;
  public factPid: number = null;
  public convictionCountryId: number = null;
  public executionCountryId: number = null;
  public factStartDate: Date = null;
  public factEndDate: Date = null;
  public irrevocableDate: Date = null;
  public internalReleaseDate: Date = null;
  public externalReleaseDate: Date = null;
  public comments: string = null;
  public monitorDate: Date = null;
  public notes: string = null;
  public status: string = null;
  public approvalDate: Date = null;
  public requestStatusPid: number = null;
  public statusComments: string = null;
  public sentencePid: number = null;
  public sentenceStartDate: Date = null;
  public sentenceYears: number = null;
  public sentenceMonths: number = null;
  public sentenceDays: number = null;
  public laborDays: number = null;
}
