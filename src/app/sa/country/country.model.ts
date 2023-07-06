import {City} from '../city/city.model';

export class Country {
  public id: number = null;
  public isActive: boolean = true;
  public countryNameGreek: string = null;
  public countryNameLatin: string = null;
  public nationalityNameGreek: number = null;
  public nationalityNameLatin: number = null;
  public isGreece: boolean = false;
  public twoDigitCode: number = null;
  public threeDigitCode: number = null;
  public crCode: number = null;
  public comments: string = null;
  public cities: City[] = [];
}
