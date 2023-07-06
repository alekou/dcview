export class DetentionCenter {
  
  // Τα ονόματα των πεδίων, *ακριβώς* όπως αυτά δηλώθηκαν στο DetentionCenterDto
  public id: number = null;
  public isActive: boolean = true;
  public code: string = null;
  public name: string = null;
  public type: string = null;
  public allowsTemporary: boolean;
  public cityId: number = null;
  public address: string = null;
  public postalCode: string = null;
  public phone: string = null;
  public capacity: number = null;
}
