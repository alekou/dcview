export class Transfer {
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public inmateRecordId: number = null;
  public transferTypeId: number = null;
  public transferAppInmateId: number = null;
  public expected: boolean = false;
  public expectedInmateId: number = null;
  public expectedInmateName: string = null;
  // --------------------------------------------------------------------------------------
  public toDcId: number = null;
  public toBeReturned: boolean = false;
  // --------------------------------------------------------------------------------------
  public courtSummonsId: number = null;
  public toCourthouseId: number = null;
  public orderNo: string = null;
  public orderDate: Date = null;
  public courtDate: Date = null;
  // --------------------------------------------------------------------------------------
  public referralId: number = null;
  public toHospitalId: number = null;
  public toHospitalDeptId: number = null;
  public disease: string = null;
  public regularHospitalTransfer: boolean = false;
  public hospitalExitDate: Date = null;
  // --------------------------------------------------------------------------------------
  public toPoliceDeptId: number = null;
  // --------------------------------------------------------------------------------------
  public protocolNo: string = null;
  public protocolDate: Date = null;
  public commandNo: string = null;
  public commandDate: Date = null;
  public authority: string = null;
  public moveDate: Date = null;
  public means: string = null;
  public plateNo: string = null;
  public reason: string = null;
  public destination: string = null;
  public cityId: number = null;
  public comments: string = null;
  public result: string = null;
  public escortName: string = null;
  public escortStatus: string = null;
  public escortService: string = null;
  // --------------------------------------------------------------------------------------
  public exited: boolean = false;
  public exitDate: Date = null;
  public received: number = 0;
  public receiveDate: Date = null;
  public returned: boolean = false;
  public returnDate: Date = null;
  public cancelled: boolean = false;
  public cancelDate: Date = null;
  public cancelComments: string = null;
}
