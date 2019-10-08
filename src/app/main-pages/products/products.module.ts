import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ProductsComponent } from './products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTablesModule } from 'angular-datatables';

import { ProductsService } from './products.service'

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    DataTablesModule
  ],
  declarations: [
    ProductsComponent,
    CreateProductComponent
  ],
  providers: [
    ProductsService
  ]
})
export class ProductsModule { }
