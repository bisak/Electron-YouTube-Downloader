import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoInfoFetchSpinnerComponent } from './video-info-fetch-spinner.component';

describe('VideoInfoFetchSpinnerComponent', () => {
  let component: VideoInfoFetchSpinnerComponent;
  let fixture: ComponentFixture<VideoInfoFetchSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoInfoFetchSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoInfoFetchSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
