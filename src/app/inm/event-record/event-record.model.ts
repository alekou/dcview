import {EventParticipant} from '../event-participant/event-participant.model';

export class EventRecord {

  // Τα ονόματα των πεδίων, *ακριβώς* όπως αυτά δηλώθηκαν στο EventRecordDto
  public id: number = null;
  public dcId: number = null;
  public code: number = null;
  public eventTypePid: number = null;
  public eventPlacePid: number = null;
  public description: string = null;
  public eventStartDate: Date = null;
  public eventEndDate: Date = null;
  public hasDisciplinaryControl: boolean = false;
  public daProtocolNo: string = null;
  public daProtocolDate: Date = null;
  public comments: string = null;

  public victimParticipants: EventParticipant[] = [];
  public culpritParticipants: EventParticipant[] = [];
}
