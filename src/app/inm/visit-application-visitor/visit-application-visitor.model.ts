import {Visitor} from '../visitor/visitor.model';
export class VisitApplicationVisitor {
  public id: number = null;
  public visitApplicationId: number = null;
  public visitorId: number = null;

  public statedRelationKind: string = null;
  public statedOtherRelationKindPid: number = null;
  public visitor: Visitor = null;
}
