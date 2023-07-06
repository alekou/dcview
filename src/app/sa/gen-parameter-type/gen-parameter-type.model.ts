import {GenParameter} from '../gen-parameter/gen-parameter.model';
export class GenParameterType {
  public id: number = null;
  public category: string = null;
  public description: string = null;
  public isEditable: boolean = false;
  public isHierarchical: boolean = false;
  public isBigList: boolean = false;
  
  public genParameters: GenParameter[] = [];
}
