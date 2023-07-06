import {Injectable} from '@angular/core';
import {addDays, addHours, addMonths, differenceInCalendarDays, differenceInHours, format, fromUnixTime, parse} from 'date-fns';

@Injectable({providedIn: 'root'})
export class DateService {
  
  private dateFormat = 'dd/MM/yyyy';
  private dateTimeFormat = 'dd/MM/yyyy HH:mm';
  
  constructor() {}
  
  // -------------------------------------------------------------------------------------------------------------------
  
  getCurrentDateString() {
    return format(new Date(), this.dateFormat);
  }
  
  getCurrentDateTimeString() {
    return format(new Date(), this.dateTimeFormat);
  }
  
  getCurrentDateStringForExport() {
    return format(new Date(), 'dd_MM_yyyy_HH_mm_ss');
  }
  
  // -------------------------------------------------------------------------------------------------------------------
  
  unixSecondsToDate(seconds) {
    if (!seconds) {
      return null;
    }
    else {
      return fromUnixTime(seconds);
    }
  }
  
  dateInFuture(theDate) {
    let now = new Date();
    return theDate > now;
  }
  
  // -------------------------------------------------------------------------------------------------------------------
  
  private determineDateFormat(dateString) {
    if (dateString.indexOf(':') !== -1) {
      return this.dateTimeFormat;
    }
    else {
      return this.dateFormat;
    }
  }
  
  // -------------------------------------------------------------------------------------------------------------------
  
  addMonths(dateString, months) {
    if (!dateString || !months) {
      return dateString;
    }
    
    let formatToUse = this.determineDateFormat(dateString);
    
    let date = parse(dateString, formatToUse, new Date());
    let newDate = addMonths(date, months);
    return format(newDate, formatToUse);
  }
  
  addDays(dateString, days) {
    if (!dateString || !days) {
      return dateString;
    }
    
    let formatToUse = this.determineDateFormat(dateString);
    
    let date = parse(dateString, formatToUse, new Date());
    let newDate = addDays(date, days);
    return format(newDate, formatToUse);
  }
  
  addHours(dateString, hours) {
    if (!dateString || !hours) {
      return dateString;
    }
    
    let formatToUse = this.determineDateFormat(dateString);
    
    let date = parse(dateString, formatToUse, new Date());
    let newDate = addHours(date, hours);
    return format(newDate, formatToUse);
  }
  
  // -------------------------------------------------------------------------------------------------------------------
  
  getDatesDifferenceInDays(firstDateString, secondDateString) {
    if (!firstDateString || !secondDateString) {
      return 0;
    }
    
    let firstFormatToUse = this.determineDateFormat(firstDateString);
    let secondFormatToUse = this.determineDateFormat(secondDateString);
    
    let firstDate = parse(firstDateString, firstFormatToUse, new Date());
    let secondDate = parse(secondDateString, secondFormatToUse, new Date());
    
    return Math.abs(differenceInCalendarDays(firstDate, secondDate));
  }
  
  getDatesDifferenceInHours(firstDateString, secondDateString) {
    if (!firstDateString || !secondDateString) {
      return 0;
    }
    
    let firstFormatToUse = this.determineDateFormat(firstDateString);
    let secondFormatToUse = this.determineDateFormat(secondDateString);
    
    let firstDate = parse(firstDateString, firstFormatToUse, new Date());
    let secondDate = parse(secondDateString, secondFormatToUse, new Date());
    
    return Math.abs(differenceInHours(firstDate, secondDate));
  }
  
  // -------------------------------------------------------------------------------------------------------------------
}
