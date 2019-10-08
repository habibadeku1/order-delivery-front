import { NgModule } from '@angular/core';

import { MainPagesComponent } from "./main-pages.component";
import { MainDashboardModule } from './main-dashboard/main-dashboard.module';
import { OrdersModule } from './orders/orders.module';
import { MainPagesRoutingModule } from './main-pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';

const PAGES_COMPONENTS = [
  MainPagesComponent,
];

@NgModule({
  imports: [
    MainPagesRoutingModule,
    ThemeModule,
    MiscellaneousModule,
    MainDashboardModule,
    OrdersModule,
    ProductsModule,
    CustomersModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class MainPagesModule {
}
