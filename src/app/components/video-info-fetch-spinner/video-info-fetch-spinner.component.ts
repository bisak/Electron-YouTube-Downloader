import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-video-info-fetch-spinner',
  templateUrl: './video-info-fetch-spinner.component.html',
  styleUrls: ['./video-info-fetch-spinner.component.scss']
})
export class VideoInfoFetchSpinnerComponent implements OnInit {

  isShown = false;

  constructor(private communicationService: CommunicationService,
              private changeDetectorRef: ChangeDetectorRef) {

    this.communicationService.videoInfoFetchStart$.subscribe(() => {
      this.isShown = true;
    });

    this.communicationService.videoInfoFetchEnd$.subscribe(() => {
      this.isShown = false;
      this.changeDetectorRef.detectChanges();
    });

  }

  ngOnInit() {
  }

}
