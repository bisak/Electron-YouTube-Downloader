import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { HelperService } from '../../services/helper.service';

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
  videoLength = '';

  constructor (private electronService: ElectronService,
               private changeDetectorRef: ChangeDetectorRef,
               private helperService: HelperService) {
  }

  ngOnInit () {
    console.log(this.videoInfo);
    this.videoLength = this.helperService.toHHMMSS(this.videoInfo.length_seconds);
  }

  ngOnDestroy () {
    this.electronService.ipcRenderer.removeAllListeners('video:download_success');
    this.electronService.ipcRenderer.removeAllListeners('video:download_progress');
    this.electronService.ipcRenderer.removeAllListeners('video:download_start');
  }


  openChannelInBrowser () {
    this.electronService.shell.openExternal(this.videoInfo.author.channel_url);
  }

  openVideoInBrowser () {
    this.electronService.shell.openExternal(this.videoInfo.video_url);
  }

  outputDownloadVideoEvent () {
    this.electronService.ipcRenderer.send('video:download_single', this.videoInfo);
    this.electronService.ipcRenderer.on('video:download_success', this.videoDownloadSuccessHandler.bind(this));
    this.electronService.ipcRenderer.on('video:download_progress', this.videoDownloadProgressHandler.bind(this));
    this.electronService.ipcRenderer.on('video:download_start', this.videoDownloadStartHandler.bind(this));
  }

  videoDownloadSuccessHandler (event, data) {
    this.changeDetectorRef.detectChanges();
  }

  videoDownloadProgressHandler (event, data) {
    this.downloadStarted = true;
    this.percentDownloaded = data.percentDownloaded;
    this.changeDetectorRef.detectChanges();
  }

  videoDownloadStartHandler (event, data) {
    this.isDownloadBtnDisabled = true;
    this.changeDetectorRef.detectChanges();
  }

}
