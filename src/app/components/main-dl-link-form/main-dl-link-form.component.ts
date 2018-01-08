import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { MzToastService } from 'ng2-materialize';

@Component({
  selector: 'app-main-dl-link-form',
  templateUrl: './main-dl-link-form.component.html',
  styleUrls: ['./main-dl-link-form.component.scss']
})
export class MainDlLinkFormComponent implements OnInit {

  link = '';
  isValid = false;

  constructor (private electronService: ElectronService,
               private changeDetectorRef: ChangeDetectorRef,
               private toast: MzToastService) {
  }

  ngOnInit () {
    this.listenForValidationResponse();
  }

  valueChange (newValue) {
    this.link = newValue;
    this.electronService.ipcRenderer.send('link:validate', this.link);
  }

  linkSubmit (event) {
    if (this.isLinkValid()) {
      this.electronService.ipcRenderer.send('link:submit', this.link);
    } else {
      this.toast.show('Please provide a valid URL', 1500);
    }
    return false;
  }

  listenForValidationResponse () {
    this.electronService.ipcRenderer.on('link:validation_result', (ev, isValid) => {
      this.isValid = isValid;
      this.changeDetectorRef.detectChanges();
    });
  }

  isLinkValid () {
    return this.isValid && this.link.length;
  }
}

