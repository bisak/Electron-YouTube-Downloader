import { NgModule } from '@angular/core';
import {
  MzButtonModule,
  MzNavbarModule,
  MzInputModule,
  MzIconMdiModule,
  MzToastModule,
  MzProgressModule,
  MzCardModule,
  MzIconModule
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
    MzIconModule
  ],
  exports: [
    MzButtonModule,
    MzNavbarModule,
    MzInputModule,
    MzIconMdiModule,
    MzToastModule,
    MzProgressModule,
    MzCardModule,
    MzIconModule
  ]
})
export class CustomMaterializeModule {
}
