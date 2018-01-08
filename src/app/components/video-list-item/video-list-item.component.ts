import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { MzToastService } from 'ng2-materialize';

@Component({
  selector: 'app-video-list-item',
  templateUrl: './video-list-item.component.html',
  styleUrls: ['./video-list-item.component.scss']
})
export class VideoListItemComponent implements OnInit, OnDestroy {

  @Input() videoInfo;
  isDownloadBtnDisabled = false;
  percentDownloaded = 0;
  downloadStarted = false;

  constructor (private electronService: ElectronService,
               private changeDetectorRef: ChangeDetectorRef,
               private toast: MzToastService) {
  }

  ngOnInit () {
  }

  ngOnDestroy () {
    console.log('destroyed');
  }

  openChannelInBrowser () {
    this.electronService.shell.openExternal(this.videoInfo.author.channel_url);
  }

  openVideoInBrowser () {
    this.electronService.shell.openExternal(this.videoInfo.video_url);
  }

  outputDownloadVideoEvent () {
    this.isDownloadBtnDisabled = true;
    this.changeDetectorRef.detectChanges(); // Why the hell

    this.downloadVideo(this.videoInfo);
    this.listenForCompletion();
    this.listenForProgress();
  }

  listenForCompletion () {
    let listener = this.electronService.ipcRenderer.on('video:download_success', (event, data) => {
      this.changeDetectorRef.detectChanges();
    });
  }

  listenForProgress () {
    this.electronService.ipcRenderer.on('video:download_progress', (event, data) => {
      this.downloadStarted = true;
      console.log('download progress');
      this.percentDownloaded = data.percentDownloaded;
      this.changeDetectorRef.detectChanges();
    });
  }

  downloadVideo (videoToDownloadInfo) {
    this.electronService.ipcRenderer.send('video:download_single', videoToDownloadInfo);
  }

}
