import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { OrdersComponent } from './orders.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTablesModule } from 'angular-datatables';

import { OrdersService } from './orders.service'

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    DataTablesModule
  ],
  declarations: [
    OrdersComponent,
    CreateOrderComponent
  ],
  providers: [
    OrdersService
  ]
})
export class OrdersModule { }
