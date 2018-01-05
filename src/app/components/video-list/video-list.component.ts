import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {

  videosInfo = [];

  constructor (private electronService: ElectronService,
               private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit () {
    this.listenForVideoInfo();
  }

  listenForVideoInfo () {
    this.electronService.ipcRenderer.on('link:video_info_success', (event, videosInfo) => {
      this.videosInfo = [videosInfo];
      this.changeDetectorRef.detectChanges();
      // TODO remove array creation
    });
  }

  downloadVideo (videoToDownloadInfo) {
    this.electronService.ipcRenderer.send('video:download_single', videoToDownloadInfo);
  }

}
