import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {AppComponent} from '../../app.component';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../toitsu-auth/auth.service';
import {ToitsuNavitemComponent} from './toitsu-navitem.component';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class ToitsuNavService {

  constructor(private router: Router, private translate: TranslateService, private authService: AuthService) {
  }

  subsystemModel: any[];
  model: any[];
  layoutModel: any[];

  private menuSource = new Subject<string>();
  private resetSource = new Subject();

  menuSource$ = this.menuSource.asObservable();
  resetSource$ = this.resetSource.asObservable();

  navItems: ToitsuNavitemComponent[] = [];

  onMenuStateChange(key: string) {
    this.menuSource.next(key);
  }
  
  reset() {
    this.resetSource.next(undefined);
  }
  
  initializeSubsystemModel() {
    this.subsystemModel = [
      {
        routerLink: ['/inm'],
        tooltip: this.translate.instant('subsystem.inm'),
        icon: 'fa fa-building-o',
        class: 'p-button-success',
        subsystemIcon: true,
        needPermission: true,
        permission: this.authService.hasPermission('inm')
      },
      {
        routerLink: ['/med'],
        tooltip: this.translate.instant('subsystem.med'),
        icon: 'fa fa-medkit',
        class: 'p-button-danger',
        subsystemIcon: true,
        needPermission: true,
        permission: this.authService.hasPermission('med')
      },
      {
        routerLink: ['/sa'],
        tooltip: this.translate.instant('subsystem.sa'),
        icon: 'fa fa-cogs',
        class: 'p-button-secondary',
        subsystemIcon: true,
        needPermission: true,
        permission: this.authService.hasPermission('sa')
      }
    ];
  }

  initializeModel() {
    this.model = [
      {
        label: this.translate.instant('inm.group.secretariat'), icon: 'fa fa-desktop',
        subsystem: 'inm', needPermission: true, permission: this.authService.hasAnyPermission(['inm_inmate_index']),
        items: [
          {
            label: this.translate.instant('inm.inmate'), routerLink: ['/inm/inmate/list'],
            subsystem: 'inm', needPermission: true, permission: this.authService.hasPermission('inm_inmate_index')
          },
          {
            label: this.translate.instant('inm.subgroup.discipline'), mid: true,
            subsystem: 'inm', needPermission: false,
            items: [
              {
                label: this.translate.instant('inm.disciplineReport'), routerLink: ['/inm/disciplinereport/list'],
                subsystem: 'inm', needPermission: false
              },
              {
                label: this.translate.instant('inm.disciplineCouncil'), routerLink: ['/inm/disciplinecouncil/list'],
                subsystem: 'inm', needPermission: false
              },
              {
                label: this.translate.instant('inm.discipline'), routerLink: ['/inm/discipline/list'],
                subsystem: 'inm', needPermission: false
              },
            ]
          },
          {
            label: this.translate.instant('inm.appeal'), routerLink: ['/inm/appeal/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.transport'), routerLink: ['/inm/transport/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('secretary.printout'), routerLink: ['/inm/printout/secretary'],
            subsystem: 'inm', needPermission: false
          }
        ]
      },
      {
        label: this.translate.instant('inm.group.vacation'), icon: 'glyphicon glyphicon-road',
        subsystem: 'inm', needPermission: true, permission: this.authService.hasAnyPermission([]),
        items: [
          {
            label: this.translate.instant('inm.vacationApplication'), routerLink: ['/inm/vacationapplication/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.vacationMotion'), routerLink: ['/inm/vacationapplication/motion/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.vacationCouncil'), routerLink: ['/inm/vacationcouncil/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.vacation'), routerLink: ['/inm/vacation/list'],
            subsystem: 'inm', needPermission: false
          }
        ]
      },
      {
        label: this.translate.instant('inm.group.transfer'), icon: 'fa fa-car',
        subsystem: 'inm', needPermission: true, permission: this.authService.hasAnyPermission([]),
        items: [
          {
            label: this.translate.instant('inm.courtSummons'), routerLink: ['/inm/courtsummons/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.transfer'), routerLink: ['/inm/transfer/list'],
            subsystem: 'inm', needPermission: true, permission: this.authService.hasPermission('inm_transfer_index')
          },
          {
            label: this.translate.instant('inm.transfer.inProgress'), routerLink: ['/inm/transfer/inprogress'],
            subsystem: 'inm', needPermission: true, permission: this.authService.hasPermission('inm_transfer_update')
          },
          {
            label: this.translate.instant('transfer.printout'), routerLink: ['/inm/printout/transfer'],
            subsystem: 'inm', needPermission: false
          }
        ]
      },
      {
        label: this.translate.instant('inm.group.labor'), icon: 'fa fa-wrench',
        subsystem: 'inm', needPermission: true, permission: this.authService.hasAnyPermission(['inm_inmatelabor_index', 'inm_laborday_index', 'inm_laborprotocol_index']),
        items: [
          {
            label: this.translate.instant('inm.inmateLaborApplication'), routerLink: ['/inm/inmatelaborapplication/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.placementProtocol'), routerLink: ['/inm/placementprotocol/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.inmateLabor'), routerLink: ['/inm/inmatelabor/list'],
            subsystem: 'inm', needPermission: true, permission: this.authService.hasPermission('inm_inmatelabor_index')
          },
          {
            label: this.translate.instant('inm.laborDay'), routerLink: ['/inm/laborday/list'],
            subsystem: 'inm', needPermission: true, permission: this.authService.hasPermission('inm_laborday_index')
          },
          {
            label: this.translate.instant('inm.laborDay.add'), mid: true,
            subsystem: 'inm', needPermission: true, permission: this.authService.hasPermission('inm_laborday_create'),
            items: [
              {
                label: this.translate.instant('inm.laborDay.add.normal'), routerLink: ['/inm/laborday/addnormal'],
                subsystem: 'inm', needPermission: true, permission: this.authService.hasPermission('inm_laborday_create')
              },
              {
                label: this.translate.instant('inm.laborDay.add.special'), routerLink: ['/inm/laborday/addspecial'],
                subsystem: 'inm', needPermission: true, permission: this.authService.hasPermission('inm_laborday_create')
              },
            ]
          },
          {
            label: this.translate.instant('inm.laborProtocol'), routerLink: ['/inm/laborprotocol/list'],
            subsystem: 'inm', needPermission: true, permission: this.authService.hasPermission('inm_laborprotocol_index')
          },
          {
            label: this.translate.instant('labor.printout'), routerLink: ['/inm/printout/labor'],
            subsystem: 'inm', needPermission: false
          }
        ]
      },
      {
        label: this.translate.instant('inm.group.warden'), icon: 'fa fa-key',
        subsystem: 'inm', needPermission: true, permission: this.authService.hasAnyPermission(['inm_visitor_index']),
        items: [
          {
            label: this.translate.instant('inm.area'), routerLink: ['/inm/area/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.subgroup.inmateArea'), mid: true,
            subsystem: 'inm', needPermission: false,
            items: [
              {
                label: this.translate.instant('inm.inmateArea.manage'), routerLink: ['/inm/inmatearea/manage'],
                subsystem: 'inm', needPermission: false
              },
              {
                label: this.translate.instant('inm.inmateArea.history'), routerLink: ['/inm/inmatearea/history'],
                subsystem: 'inm', needPermission: false
              },
              {
                label: this.translate.instant('inm.inmateArea.catalog'), routerLink: ['/inm/inmatearea/catalog'],
                subsystem: 'inm', needPermission: false
              },
            ]
          },
          {
            label: this.translate.instant('inm.visit'), routerLink: ['/inm/visit/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.visit.lawyerAdd'), routerLink: ['/inm/visit/lawyeradd'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.visitor'), routerLink: ['/inm/visitor/list'],
            subsystem: 'inm', needPermission: true, permission: this.authService.hasPermission('inm_visitor_index')
          },
          {
            label: this.translate.instant('inm.eventRecord'), routerLink: ['/inm/eventrecord/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.postLetter'), routerLink: ['/inm/postletter/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.gateMovement'), routerLink: ['/inm/gatemovement/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.vehicle'), routerLink: ['/inm/vehicle/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.visitProgram'), routerLink: ['/inm/visitprogram/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('warden.printout'), routerLink: ['/inm/printout/warden'],
            subsystem: 'inm', needPermission: false
          }
        ]
      },
      {
        label: this.translate.instant('inm.group.service'), icon: 'fa fa-life-ring',
        subsystem: 'inm', needPermission: true, permission: this.authService.hasAnyPermission(['inm_visitor_index']),
        items: [
          {
            label: this.translate.instant('inm.doctor.psychologist'), 
            routerLink: ['/inm/doctorsession/psychologist/list'], subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.doctor.socialworker'),
            routerLink: ['/inm/doctorsession/socialworker/list'], subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.doctor.sociologist'),
            routerLink: ['/inm/doctorsession/sociologist/list'], subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.doctor.criminologist'),
            routerLink: ['/inm/doctorsession/criminologist/list'], subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('med.hearingApplication'), routerLink: ['/inm/hearingapplication/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.visitApplication'), routerLink: ['/inm/visitapplication/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.educationNeed'), routerLink: ['/inm/educationneed/list'],
            subsystem: 'inm', needPermission: false
          },
          {
            label: this.translate.instant('inm.program'), subsystem: 'inm', needPermission: false, mid: true,
            items: [
              {
                label: this.translate.instant('inm.programShortName'), routerLink: ['/inm/program/list'],
                subsystem: 'inm', needPermission: false
              },
              {
                label: this.translate.instant('inm.programApplication'), routerLink: ['/inm/programapplication/list'],
                subsystem: 'inm', needPermission: false
              },
              {
                label: this.translate.instant('inm.programProtocol'), routerLink: ['/inm/programprotocol/list'],
                subsystem: 'inm', needPermission: false
              },
              {
                label: this.translate.instant('inm.programConduct'), routerLink: ['/inm/program/conduct/list'],
                subsystem: 'inm', needPermission: false
              }
            ]
          }
        ]
      },
      // ---------------------------------------------------------------------------------------------------------------
      {
        label: this.translate.instant('med.group.medicalDepartment'), icon: 'fa fa-hospital-o',
        subsystem: 'med', needPermission: true, permission: this.authService.hasAnyPermission([]),
        items: [
          {
            label: this.translate.instant('med.medicine'), routerLink: ['/med/medicine/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('med.prescription'), routerLink: ['/med/prescription/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('med.treatment'), routerLink: ['/med/treatment/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('med.medicalFolder'), routerLink: ['/med/medicalfolder/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('inm.doctorSession.doctor'), routerLink: ['/med/doctorsession/doctor/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('med.hearingApplication'), routerLink: ['/med/hearingapplication/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('med.hearing'), routerLink: ['/med/hearing/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('med.disease'), routerLink: ['/med/disease/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('med.examination'), routerLink: ['/med/examination/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('med.referral'), routerLink: ['/med/referral/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('med.vaccination'), routerLink: ['/med/vaccination/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('med.bloodSampling'), routerLink: ['/med/bloodsampling/list'],
            subsystem: 'med', needPermission: false
          }
        ]
      },
      {
        label: this.translate.instant('medical.printout'), icon: 'fa fa-print', routerLink: ['/med/printout/medical'],
        subsystem: 'med', needPermission: false
      },
      {
        label: this.translate.instant('med.group.params'), icon: 'fa fa-cogs',
        subsystem: 'med', needPermission: true, permission: this.authService.hasAnyPermission([]),
        items: [
          {
            label: this.translate.instant('med.shift'), routerLink: ['/med/shift/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('med.vaccine'), routerLink: ['/med/vaccine/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('med.diseaseType'), routerLink: ['/med/diseasetype/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('med.hearingType'), routerLink: ['/med/hearingtype/list'],
            subsystem: 'med', needPermission: false
          },
          {
            label: this.translate.instant('med.examinationType'), routerLink: ['/med/examinationtype/list'],
            subsystem: 'med', needPermission: false
          }
        ]
      },
      // ---------------------------------------------------------------------------------------------------------------
      {
        label: this.translate.instant('sa.user'), icon: 'fa fa-users', externalLink: [environment.kcmUrl],
        subsystem: 'sa', needPermission: false
      },
      {
        label: this.translate.instant('sa.scheduledJob'), icon: 'fa fa-repeat', routerLink: ['/sa/scheduledjob'],
        subsystem: 'sa', needPermission: false
      },
      {
        label: this.translate.instant('sa.appLog'), icon: 'fa fa-bug', routerLink: ['/sa/applog/list'],
        subsystem: 'sa', needPermission: true, permission: this.authService.hasPermission('sa_applog')
      },
      {
        label: this.translate.instant('sa.template'), icon: 'fa fa-fw fa-file-code-o',
        routerLink: ['/sa/template/list'], subsystem: 'sa', needPermission: false
      },
      {
        label: this.translate.instant('sa.group.notifications'), icon: 'fa fa-bell-o', subsystem: 'sa', needPermission: false,
        items: [
          {
            label: this.translate.instant('sa.notification'), routerLink: ['/sa/notification/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.notificationType'), routerLink: ['/sa/notificationtype/list'],
            subsystem: 'sa', needPermission: false
          }
        ]
      },
      {
        label: this.translate.instant('sa.group.params'), icon: 'fa fa-cogs',
        subsystem: 'sa', needPermission: true, permission: this.authService.hasAnyPermission([]),
        items: [
          {
            label: this.translate.instant('sa.classification'), routerLink: ['/sa/classification/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.doctor'), routerLink: ['/sa/doctor/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.country'), routerLink: ['/sa/country/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.courthouse'), routerLink: ['/sa/courthouse/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.vacationType'), routerLink: ['/sa/vacationtype/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.visitType'), routerLink: ['/sa/visittype/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.areaType'), routerLink: ['/sa/areatype/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.gateMovementType'), routerLink: ['/sa/gatemovementtype/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.sessionType'), routerLink: ['/sa/sessiontype/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.programType'), routerLink: ['/sa/programtype/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.policeDepartment'), routerLink: ['/sa/policedepartment/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.hospital'), routerLink: ['/sa/hospital/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.director'), routerLink: ['/sa/director/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.detentionCenter'), routerLink: ['/sa/detentioncenter/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.genParameterType'), routerLink: ['/sa/genparametertype/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.genParameter'), routerLink: ['/sa/genparameter/list'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.dcConfig'), routerLink: ['/sa/dcconfig'],
            subsystem: 'sa', needPermission: false
          },
          {
            label: this.translate.instant('sa.lexicography'), routerLink: ['/sa/lexicography/list'],
            subsystem: 'sa', needPermission: false
          }
        ]
      }
    ];

    // this.model.push(...this.layoutModel);
  }

  initializeLayoutModel(app: AppComponent) {
    this.layoutModel = [
      {
        label: this.translate.instant('global.display'), icon: 'fa fa-paint-brush', subsystem: 'sa',
        items: [
          {
            label: 'Themes', icon: 'fa fa-paint-brush', subsystem: 'sa',
            items: [
              {
                label: 'Solid',
                icon: 'fa fa-paint-brush', subsystem: 'sa',
                items: [
                  {
                    label: 'Blue', icon: 'fa fa-paint-brush', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('blue', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('blue', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('blue', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Cyan', icon: 'fa fa-paint-brush', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('cyan', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('cyan', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('cyan', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Green', icon: 'fa fa-paint-brush', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('green', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('green', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('green', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Yellow', icon: 'fa fa-paint-brush', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('yellow', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('yellow', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('yellow', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Purple', icon: 'fa fa-paint-brush', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('purple', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('purple', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('purple', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Pink', icon: 'fa fa-paint-brush', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('pink', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('pink', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('pink', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Blue Grey', icon: 'fa fa-paint-brush', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('bluegrey', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('bluegrey', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('bluegrey', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Teal', icon: 'fa fa-paint-brush', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('teal', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('teal', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('teal', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Orange', icon: 'fa fa-paint-brush', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('orange', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('orange', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('orange', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Grey', icon: 'fa fa-paint-brush', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('grey', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('grey', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('grey', 'gradient')
                      }
                    ]
                  }
                ]
              },
              {
                label: 'Special',
                icon: 'fa fa-paint-brush', subsystem: 'sa',
                items: [
                  {
                    label: 'Cappuccino', icon: 'fa fa-picture-o', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('cappuccino', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('cappuccino', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('cappuccino', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Montreal', icon: 'fa fa-picture-o', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('montreal', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('montreal', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('montreal', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Hollywood', icon: 'fa fa-picture-o', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('hollywood', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('hollywood', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('hollywood', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Peak', icon: 'fa fa-picture-o', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('peak', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('peak', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('peak', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Alive', icon: 'fa fa-certificate', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('alive', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('alive', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('alive', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Emerald', icon: 'fa fa-certificate', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('emerald', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('emerald', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('emerald', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Ash', icon: 'fa fa-certificate', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('ash', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('ash', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('ash', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Noir', icon: 'fa fa-certificate', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('noir', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('noir', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('noir', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Mantle', icon: 'fa fa-certificate', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('mantle', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('mantle', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('mantle', 'gradient')
                      }
                    ]
                  },
                  {
                    label: 'Predawn', icon: 'fa fa-certificate', subsystem: 'sa',
                    items: [
                      {
                        label: 'Light', icon: 'fa fa-square-o', subsystem: 'sa',
                        command: (event) => app.changeTheme('predawn', 'light')
                      },
                      {
                        label: 'Dark', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('predawn', 'dark')
                      },
                      {
                        label: 'Gradient', icon: 'fa fa-square', subsystem: 'sa',
                        command: (event) => app.changeTheme('predawn', 'gradient')
                      }
                    ]
                  },
                ]
              }
            ]
          },
          {
            label: 'Menu Modes', icon: 'fa fa-bars', subsystem: 'sa',
            items: [
              {
                label: 'Static Menu',
                icon: 'fa fa-bars',
                subsystem: 'sa',
                command: () => app.changeLayoutMode('static')
              },
              {
                label: 'Overlay Menu',
                icon: 'fa fa-bars',
                subsystem: 'sa',
                command: () => app.changeLayoutMode('overlay')
              },
              {label: 'Slim Menu', icon: 'fa fa-bars', subsystem: 'sa', command: () => app.changeLayoutMode('slim')},
              {
                label: 'Horizontal Menu',
                icon: 'fa fa-bars',
                subsystem: 'sa',
                command: () => app.changeLayoutMode('horizontal')
              }
            ]
          }
        ]
      }
    ];
  }

  setActiveMenu() {
    for (let navItem of this.navItems) {
      if (navItem.item.routerLink) {
        navItem.updateActiveStateFromRoute();
      } else {
        navItem.updateActiveStateForNonFinalItem();
      }
    }
  }

  belongsToSubsystem(modelItem) {
    if (!modelItem) {
      return false;
    }

    const itemSubsystem = modelItem.subsystem;
    const currentUrl = this.router.url;

    return currentUrl.endsWith('/' + itemSubsystem) || currentUrl.includes('/' + itemSubsystem + '/');
    // πχ endsWith /inm ή includes /inm/
  }
}
