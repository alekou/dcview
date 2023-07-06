export class PostLetter {
  public id: number = null;
  public dcId: number = null;
  public type: string = null;
  public reCode: string = null;
  public receiveDate: Date = null;
  public inmateId: number = null;
  public employeeId: number = null;
  public courierCode: string = null;
  public isPackage: boolean = false;
  public amountOfMoney: number = null;
  public received: boolean = false;
  public notReceiveDate: Date = null;
  public notReceiveReason: string = null;
  public returned: boolean = false;
  public returnDate: Date = null;
  public comments: string = null;
  public senderFirstName: string = null;
  public senderLastName: string = null;
  public senderCity: string = null;
  public senderAddress: string = null;
  public senderPostalCode: string = null;
  public senderPhone: string = null;
}
