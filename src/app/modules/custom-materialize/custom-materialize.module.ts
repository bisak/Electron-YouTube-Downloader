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
  MzSpinnerModule, MzSelectModule
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
    MzSpinnerModule,
    MzSelectModule
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
    MzSpinnerModule,
    MzSelectModule
  ]
})
export class CustomMaterializeModule {
}
