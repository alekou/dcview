
import {VisitVisitor} from '../visit-visitor/visit-visitor.model';

export class Visit {
  public id: number = null;
  public dcId: number = null;
  public inmateId: number = null;
  public inmateAreaId: number = null;
  public inmateAreaFullDescription: string = null;
  public visitTypeId: number = null;
  public visitApplicationId: number = null;
  public visitDate: Date = null;
  public comments: string = null;

  public visitVisitors: VisitVisitor[] = [];
}
