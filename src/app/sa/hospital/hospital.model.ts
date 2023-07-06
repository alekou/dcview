import {HospitalDepartment} from '../hospital-department/hospital-department.model';

export class Hospital {

  // Τα ονόματα των πεδίων, *ακριβώς* όπως αυτά δηλώθηκαν στο HospitalDto
  public id: number = null;
  public isActive: boolean = true;
  public name: string = null;
  public cityPid: number = null;
  public address: string = null;
  public telephone: string = null;
  
  public hospitalDepartments: HospitalDepartment[] = [];
}
