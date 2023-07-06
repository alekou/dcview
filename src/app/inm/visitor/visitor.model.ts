import {InmateRelation} from '../inmate-relation/inmate-relation.model';
import {InmateLawyer} from '../inmate-lawyer/inmate-lawyer.model';
import {VisitBan} from '../visit-ban/visit-ban.model';

export class Visitor {
  public id: number = null;
  public lastName: string = null;
  public firstName: string = null;
  public fatherName: string = null;
  public motherName: string = null;
  public birthDate: Date = null;
  public birthCountryId: number = null;
  public nationalityId: number = null;
  public homeCountryId: number = null;
  public homeCityId: number = null;
  public homeArea: string = null;
  public address: string = null;
  public postalCode: string = null;
  public phone: string = null;
  public visitorCategoryPid: number = null;
  public adt: string = null;
  public adtDate: Date = null;
  public adtAuthority: string = null;
  public passportNo: string = null;
  public driverLicense: string = null;
  public residencePermit: string = null;
  public afm: string = null;
  public amka: string = null;
  public isLawyer: boolean = false;
  public lawyerAm: string = null;
  public lawyerClubPid: number = null;
  public comments: string = null;
  
  public inmateRelations: InmateRelation[] = [];
  public inmateLawyers: InmateLawyer[] = [];
  public visitBans: VisitBan[] = [];

  public relationKind: string = null;
  public relationKindLabel: string = null;
}
