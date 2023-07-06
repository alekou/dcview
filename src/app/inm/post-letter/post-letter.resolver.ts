import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {PostLetterService} from './post-letter.service';

@Injectable({providedIn: 'root'})
export class PostLetterResolver implements Resolve<any> {

  constructor(private postLetterService: PostLetterService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.postLetterService.getPostLetter(route.paramMap.get('id'));
  }
}
