import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { MainPagesComponent } from "./main-pages.component";
import { OrdersComponent } from './orders/orders.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { ProductsComponent } from './products/products.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';
import { CustomersComponent } from './customers/customers.component';
import { AuthGuard } from '../auth-guard.service';

const routes: Routes = [{
  path: '',
  component: MainPagesComponent,
  children: [{
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ["administrator","authenticated"] }
  },
  {
    path: 'create-order',
    component: CreateOrderComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ["administrator"] }
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ["administrator"] }
  },
  {
    path: 'create-product',
    component: CreateProductComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ["administrator"] }
  },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ["administrator"] }
  },
  {
    path: 'create-customer',
    component: CreateCustomerComponent, 
    canActivate: [AuthGuard],
    data: { expectedRole: ["administrator"] }
  },
  {
    path: 'main-dashboard',
    component: MainDashboardComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ["administrator"] }
  },
  // {
  //   path: '',
  //   redirectTo: 'orders'
  // //  pathMatch: 'full',
  // }, 
  //  {
  //   path: '',
  //   redirectTo: 'main-dashboard',
  //   pathMatch: 'full',
  // }, 
  {
    path: '#',
    redirectTo: 'orders',
    // component: NotFoundComponent,
  },
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: 'orders',
    // component: NotFoundComponent,
  }

],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPagesRoutingModule {
}
