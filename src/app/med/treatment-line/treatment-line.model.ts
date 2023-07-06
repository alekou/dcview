export class TreatmentLine {
  public id: number = null;
  public treatmentId: number = null;
  public medicineId: number = null;
  public medicineMeasurementUnit: number = null;
  public shiftId: number = null;
  public fromDate: Date = null;
  public toDate: Date = null;
  public usedQuantity: number = null;
  public used1: boolean = false;
  public used2: boolean = false;
  public used3: boolean = false;
  public used4: boolean = false;
  public used5: boolean = false;
  public comments: string = null;
  public forLife: boolean = false;
  public totalDays: number = null;
  public stepDays: number = null;
}
