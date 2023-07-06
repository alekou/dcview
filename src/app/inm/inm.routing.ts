import {Routes} from '@angular/router';

export const inmRoutes: Routes = [
  // -------------------------------------------------------------------------------------------------------------------
  {path: 'inmate', loadChildren: () => import('./inmate/inmate.module').then(m => m.InmateModule)},
  {path: 'discipline', loadChildren: () => import('./discipline/discipline.module').then(m => m.DisciplineModule)},
  {path: 'disciplinereport', loadChildren: () => import('./discipline-report/discipline-report.module').then(m => m.DisciplineReportModule)},
  {path: 'disciplinecouncil', loadChildren: () => import('./discipline-council/discipline-council.module').then(m => m.DisciplineCouncilModule)},
  {path: 'appeal', loadChildren: () => import('./appeal/appeal.module').then(m => m.AppealModule)},
  {path: 'transport', loadChildren: () => import('./transport/transport.module').then(m => m.TransportModule)},
  // -------------------------------------------------------------------------------------------------------------------
  {path: 'vacationapplication', loadChildren: () => import('./vacation-application/vacation-application.module').then(m => m.VacationApplicationModule)},
  {path: 'vacationcouncil', loadChildren: () => import('./vacation-council/vacation-council.module').then(m => m.VacationCouncilModule)},
  {path: 'vacation', loadChildren: () => import('./vacation/vacation.module').then(m => m.VacationModule)},
  // -------------------------------------------------------------------------------------------------------------------
  {path: 'courtsummons', loadChildren: () => import('./court-summons/court-summons.module').then(m => m.CourtSummonsModule)},
  {path: 'transfer', loadChildren: () => import('./transfer/transfer.module').then(m => m.TransferModule)},
  // -------------------------------------------------------------------------------------------------------------------
  {path: 'inmatelaborapplication', loadChildren: () => import('./inmate-labor-application/inmate-labor-application.module').then(m => m.InmateLaborApplicationModule)},
  {path: 'placementprotocol', loadChildren: () => import('./placement-protocol/placement-protocol.module').then(m => m.PlacementProtocolModule)},
  {path: 'inmatelabor', loadChildren: () => import('./inmate-labor/inmate-labor.module').then(m => m.InmateLaborModule)},
  {path: 'laborday', loadChildren: () => import('./labor-day/labor-day.module').then(m => m.LaborDayModule)},
  {path: 'laborprotocol', loadChildren: () => import('./labor-protocol/labor-protocol.module').then(m => m.LaborProtocolModule)},
  // -------------------------------------------------------------------------------------------------------------------
  {path: 'area', loadChildren: () => import('./area/area.module').then(m => m.AreaModule)},
  {path: 'inmatearea', loadChildren: () => import('./inmate-area/inmate-area.module').then(m => m.InmateAreaModule)},
  {path: 'visit', loadChildren: () => import('./visit/visit.module').then(m => m.VisitModule)},
  {path: 'visitor', loadChildren: () => import('./visitor/visitor.module').then(m => m.VisitorModule)},
  {path: 'eventrecord', loadChildren: () => import('./event-record/event-record.module').then(m => m.EventRecordModule)},
  {path: 'postletter', loadChildren: () => import('./post-letter/post-letter.module').then(m => m.PostLetterModule)},
  {path: 'gatemovement', loadChildren: () => import('./gate-movement/gate-movement.module').then(m => m.GateMovementModule)},
  {path: 'vehicle', loadChildren: () => import('./vehicle/vehicle.module').then(m => m.VehicleModule)},
  {path: 'visitprogram', loadChildren: () => import('./visit-program/visit-program.module').then(m => m.VisitProgramModule)},
  // -------------------------------------------------------------------------------------------------------------------
  {path: 'doctorsession', loadChildren: () => import('./doctor-session/doctor-session.module').then(m => m.DoctorSessionModule)},
  {path: 'hearingapplication', loadChildren: () => import('./hearing-application/hearing-application.module').then(m => m.InmHearingApplicationModule)},
  {path: 'visitapplication', loadChildren: () => import('./visit-application/visit-application.module').then(m => m.VisitApplicationModule)},
  {path: 'educationneed', loadChildren: () => import('./education-need/education-need.module').then(m => m.EducationNeedModule)},
  {path: 'program', loadChildren: () => import('./program/program.module').then(m => m.ProgramModule)},
  {path: 'programapplication', loadChildren: () => import('./program-application/program-application.module').then(m => m.ProgramApplicationModule)},
  {path: 'programprotocol', loadChildren: () => import('./program-protocol/program-protocol.module').then(m => m.ProgramProtocolModule)},
  // -------------------------------------------------------------------------------------------------------------------
  {path: 'report', loadChildren: () => import('./report/report.module').then(m => m.ReportModule)},
  {path: 'printout', loadChildren: () => import('../sa/printout/printout.module').then(m => m.PrintoutModule)}
  // -------------------------------------------------------------------------------------------------------------------
];
