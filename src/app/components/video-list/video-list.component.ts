import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {

  videosInfo = [];

  constructor(private electronService: ElectronService,
              private changeDetectorRef: ChangeDetectorRef,
              private communicationService: CommunicationService) {
  }

  ngOnInit() {
    this.listenForVideoInfo();
  }

  listenForVideoInfo() {
    this.electronService.ipcRenderer.on('link:video_info_success', (event, videosInfo) => {
      this.videosInfo = [videosInfo];
      this.communicationService.videoInfoFetchEnd();
      this.changeDetectorRef.detectChanges();
      // TODO remove array creation
    });
  }

}
