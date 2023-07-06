import {Grammar} from './grammar/grammar.model';

export class Report {
  public id: number = null;
  public templateId: number = null;
  public inmateId: number = null;
  public title: string = null;
  public entity: string = null;
  public entityId: number = null;
  public protocolNo: string = null;
  public protocolDate: Date = null;
  public username: string = null;
  public applicant: string = null;
  public creationDate: Date = null;
  public comments: string = null;
  public content: string = null;
  public isWithoutContent: boolean = false;
  public canEdit: boolean = true;
  public grammarList: Grammar[] = [];
}
