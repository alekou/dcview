import {Routes} from '@angular/router';
export const medRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {path: 'medicine', loadChildren: () => import('./medicine/medicine.module').then(m => m.MedicineModule)},
  {path: 'prescription', loadChildren: () => import('./prescription/prescription.module').then(m => m.PrescriptionModule)},
  {path: 'treatment', loadChildren: () => import('./treatment/treatment.module').then(m => m.TreatmentModule)},
  {path: 'medicalfolder', loadChildren: () => import('./medical-folder/medical-folder.module').then(m => m.MedicalFolderModule)},
  {path: 'doctorsession', loadChildren: () => import('./doctor-session/doctor-session.module').then(m => m.DoctorSessionModule)},
  {path: 'hearingapplication', loadChildren: () => import('./hearing-application/hearing-application.module').then(m => m.MedHearingApplicationModule)},
  {path: 'hearing', loadChildren: () => import('./hearing/hearing.module').then(m => m.HearingModule)},
  {path: 'disease', loadChildren: () => import('./disease/disease.module').then(m => m.DiseaseModule)},
  {path: 'examination', loadChildren: () => import('./examination/examination.module').then(m => m.ExaminationModule)},
  {path: 'referral', loadChildren: () => import('./referral/referral.module').then(m => m.ReferralModule)},
  {path: 'vaccination', loadChildren: () => import('./vaccination/vaccination.module').then(m => m.VaccinationModule)},
  {path: 'bloodsampling', loadChildren: () => import('./blood-sampling/blood-sampling.module').then(m => m.BloodSamplingModule)},
  // -------------------------------------------------------------------------------------------------------------------
  {path: 'shift', loadChildren: () => import('./shift/shift.module').then(m => m.ShiftModule)},
  {path: 'vaccine', loadChildren: () => import('./vaccine/vaccine.module').then(m => m.VaccineModule)},
  {path: 'diseasetype', loadChildren: () => import('./disease-type/disease-type.module').then(m => m.DiseaseTypeModule)},
  {path: 'hearingtype', loadChildren: () => import('./hearing-type/hearing-type.module').then(m => m.HearingTypeModule)},
  {path: 'examinationtype', loadChildren: () => import('./examination-type/examination-type.module').then(m => m.ExaminationTypeModule)},
  // -------------------------------------------------------------------------------------------------------------------
  {path: 'report', loadChildren: () => import('./report/report.module').then(m => m.ReportModule)},
  {path: 'printout', loadChildren: () => import('../sa/printout/printout.module').then(m => m.PrintoutModule)}
  // -------------------------------------------------------------------------------------------------------------------
];
