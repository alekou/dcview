export class LaborCatalog  {
  public inmate: InmateMini = new InmateMini();
  public lastInmateRecordCode: string = null;
  public lastInmateRecordStatus: string = null;
  public lastInmateRecordStatusLabel: string = null;
  public lastInmateRecordEntryDate: Date = null;
  public lastInmateRecordExitDate: Date = null;
  public lastInmateRecordDetails: string = null;
  public inmateAbsenceDescription: string = null;
  public lastActiveInmateAreaFullDescription: string = null;
  public lastInmateLaborProfessionName: string = null;
  public lastInmateLaborStartDate: Date = null;
  public lastInmateLaborEndDate: Date = null;
  public lastInmateLaborDetails: string = null;
  public bookNo: number = null;
  public beneficialCalculation: string = null;

}

class InmateMini {
  public id: number = null;
  public code: string = null;
  public firstName: string = null;
  public lastName: string = null;
  public fatherName: string = null;
  public motherName: string = null;
  public fullName: string = null;
}
