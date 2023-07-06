import {Routes} from '@angular/router';
export const saRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {path: 'applog', loadChildren: () => import('./app-log/app-log.module').then(m => m.AppLogModule)},
  {path: 'classification', loadChildren: () => import('./classification/classification.module').then(m => m.ClassificationModule)},
  {path: 'doctor', loadChildren: () => import('./doctor/doctor.module').then(m => m.DoctorModule)},
  {path: 'country', loadChildren: () => import('./country/country.module').then(m => m.CountryModule)},
  {path: 'courthouse', loadChildren: () => import('./courthouse/courthouse.module').then(m => m.CourthouseModule)},
  {path: 'vacationtype', loadChildren: () => import('./vacation-type/vacation-type.module').then(m => m.VacationTypeModule)},
  {path: 'visittype', loadChildren: () => import('./visit-type/visit-type.module').then(m => m.VisitTypeModule)},
  {path: 'areatype', loadChildren: () => import('./area-type/area-type.module').then(m => m.AreaTypeModule)},
  {path: 'gatemovementtype', loadChildren: () => import('./gate-movement-type/gate-movement-type.module').then(m => m.GateMovementTypeModule)},
  {path: 'sessiontype', loadChildren: () => import('./session-type/session-type.module').then(m => m.SessionTypeModule)},
  {path: 'programtype', loadChildren: () => import('./program-type/program-type.module').then(m => m.ProgramTypeModule)},
  {path: 'policedepartment', loadChildren: () => import('./police-department/police-department.module').then(m => m.PoliceDepartmentModule)},
  {path: 'hospital', loadChildren: () => import('./hospital/hospital.module').then(m => m.HospitalModule)},
  {path: 'director', loadChildren: () => import('./director/director.module').then(m => m.DirectorModule)},
  {path: 'detentioncenter', loadChildren: () => import('./detention-center/detention-center.module').then(m => m.DetentionCenterModule)},
  {path: 'genparametertype', loadChildren: () => import('./gen-parameter-type/gen-parameter-type.module').then(m => m.GenParameterTypeModule)},
  {path: 'genparameter', loadChildren: () => import('./gen-parameter/gen-parameter.module').then(m => m.GenParameterModule)},
  {path: 'template', loadChildren: () => import('./template/template.module').then(m => m.TemplateModule)},
  {path: 'report', loadChildren: () => import('./report/report.module').then(m => m.ReportModule)},
  {path: 'notificationtype', loadChildren: () => import('./notification-type/notification-type.module').then(m => m.NotificationTypeModule)},
  {path: 'notification', loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule)},
  {path: 'scheduledjob', loadChildren: () => import('./scheduled-job/scheduled-job.module').then(m => m.ScheduledJobModule)},
  {path: 'lexicography', loadChildren: () => import('./lexicography/lexicography.module').then(m => m.LexicographyModule)},
  {path: 'dcconfig', loadChildren: () => import('./dc-config/dc-config.module').then(m => m.DcConfigModule)}
  // -------------------------------------------------------------------------------------------------------------------
];
