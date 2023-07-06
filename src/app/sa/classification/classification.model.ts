export class Classification {

  // Τα ονόματα των πεδίων, *ακριβώς* όπως αυτά δηλώθηκαν στο ClassificationDto
  public id: number = null;
  public isActive: boolean = true;
  public description: string = null;
  public isClosingRecord: boolean = false;
  public isClosingFolder: boolean = false;
  public isCrime: boolean = false;
  public isTransfer: boolean = false;
  public isDeath: boolean = false;
  public isEscape: boolean = false;
  public isRelease: boolean = false;
  public elstatCode: string = null;
}
