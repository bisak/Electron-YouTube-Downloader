import { Component, OnInit } from '@angular/core';
import { MzToastService } from 'ng2-materialize';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor (private toastService: MzToastService,
               private electronService: ElectronService) {
  }

  ngOnInit () {
    this.electronService.ipcRenderer.on('error:generic', (event, data) => {
      this.toastService.show(data, 1750);
    });
  }

}
