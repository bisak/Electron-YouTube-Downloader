import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CommunicationService {

  // Observable string sources
  private videoInfoFetchStartSource = new Subject<string>();
  private videoInfoFetchEndSource = new Subject<string>();

  // Observable string streams
  videoInfoFetchStart$ = this.videoInfoFetchStartSource.asObservable();
  videoInfoFetchEnd$ = this.videoInfoFetchEndSource.asObservable();

  // Service message commands
  videoInfoFetchStart() {
    this.videoInfoFetchStartSource.next();
  }

  videoInfoFetchEnd() {
    this.videoInfoFetchEndSource.next();
  }
}
