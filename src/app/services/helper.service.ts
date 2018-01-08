import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {

  constructor () {
  }

  toHHMMSS (secs) {
    const secsNum = Number(secs);
    const hours = Math.floor(secsNum / 3600) % 24;
    const minutes = Math.floor(secsNum / 60) % 60;
    const seconds = secsNum % 60;
    return [hours, minutes, seconds]
      .map(v => v < 10 ? '0' + v : v)
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  }
}

