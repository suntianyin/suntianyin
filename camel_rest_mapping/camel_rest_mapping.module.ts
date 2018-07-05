import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TableComponent } from './table/table.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Camel_rest_mappingService } from 'app/behavior/camel_rest_mapping/camel_rest_mapping.service';

const routes: Routes = [
  { path: 'table', component: TableComponent }
];

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TableComponent],
  providers: [Camel_rest_mappingService]
})
export class Camel_rest_mappingModule { }
