export class EducationNeedFeedback {
  public id: number = null;
  public dcId: number = null;
  public educationNeedId: number = null;
  public userId: number = null;
  public submitDate: Date = null;
  public jobPosition: [{}];
  public participatedSchool: boolean = false;
  public participatedSchoolDetails: [{}];
  public participatedCourse: boolean = false;
  public participatedCourseDetails: [{}];
  public satisfactionDegreePid: number = null;
  public schoolEffectiveness: [{}];
  public problems: [{}];
  public suggestions: string = null;
  public repeatParticipation: boolean = false;
  public repeatParticipationDetails: string = null;

}
