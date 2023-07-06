export class Appeal {

  // Τα ονόματα των πεδίων, *ακριβώς* όπως αυτά δηλώθηκαν στο AppealDto
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public creationDate: Date = null;
  public serialNo: number = null;
  public protocolNo: string = null;
  public appealTypePid: number = null;
  public courthouseId: number = null;
  public judgmentId: number = null;
  public judgmentText: string = null;
  public comments: string = null;
  
  public dcName: string = null;
}
