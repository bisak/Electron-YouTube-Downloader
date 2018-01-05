import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { MzToastService } from 'ng2-materialize';

@Component({
  selector: 'app-video-list-item',
  templateUrl: './video-list-item.component.html',
  styleUrls: ['./video-list-item.component.scss']
})
export class VideoListItemComponent implements OnInit {

  @Input() videoInfo;
  @Output() downloadVideo = new EventEmitter<any>();
  isDownloadBtnDisabled = false;

  constructor (private electronService: ElectronService,
               private changeDetectorRef: ChangeDetectorRef,
               private toast: MzToastService) {
  }

  ngOnInit () {
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
    this.downloadVideo.emit(this.videoInfo);
    this.listenForCompletion();
  }

  listenForCompletion () {
    this.electronService.ipcRenderer.on('video:download_success', (event, data) => {
      this.toast.show('Video should have downloaded somewhere', 1000, 'green');
      this.changeDetectorRef.detectChanges();
    });
  }

}
