import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDlLinkFormComponent } from './main-dl-link-form.component';

describe('MainDlLinkFormComponent', () => {
  let component: MainDlLinkFormComponent;
  let fixture: ComponentFixture<MainDlLinkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainDlLinkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainDlLinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
