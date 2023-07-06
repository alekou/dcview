export class LaborProtocol {
  public id: number = null;
  public dcId: number = null;
  public protocolNo: string = null;
  public protocolDate: Date = null;
  public startDate: Date = null;
  public endDate: Date = null;
  public type: string = null;
  public professionCategoryPid: number = null;
  public comments: string = null;
  public approved: boolean = false;
  public approvalDate: Date = null;
  
  public laborDayIds: number[] = [];
  public groupedLaborDays: GroupedLaborDay[] = [];
}

class GroupedLaborDay {
  public id: number = null;
  public inmateFullName: string = null;
  public inmateLaborStartDate: string = null;
  public inmateLaborActualEndDate: string = null;
  public professionName: string = null;
  public workDays: number = null;
  public factor: number = null;
  public factorString: string = null;
  public beneficialCalculation: string = null;
}
