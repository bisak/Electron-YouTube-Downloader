import { NgModule } from '@angular/core';
import {
  MzButtonModule,
  MzNavbarModule,
  MzInputModule,
  MzIconMdiModule,
  MzToastModule,
  MzProgressModule,
  MzCardModule,
  MzIconModule,
  MzSpinnerModule
} from 'ng2-materialize';

@NgModule({
  imports: [
    MzButtonModule,
    MzNavbarModule,
    MzInputModule,
    MzIconMdiModule,
    MzToastModule,
    MzProgressModule,
    MzCardModule,
    MzIconModule,
    MzSpinnerModule
  ],
  exports: [
    MzButtonModule,
    MzNavbarModule,
    MzInputModule,
    MzIconMdiModule,
    MzToastModule,
    MzProgressModule,
    MzCardModule,
    MzIconModule,
    MzSpinnerModule
  ]
})
export class CustomMaterializeModule {
}
