import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppSettings } from '../../AppConstants'
import { Subject } from 'rxjs';
import { ProductsService } from './products.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductModalComponent } from '../general-modal/product-modal/product-modal.component';
import { DataTableDirective } from 'angular-datatables';


class Product {
  productRefId: string;
  name: string;
  costPrice: number;
  createdAt: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-products',
  styleUrls: ['./products.component.scss'],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {

  @ViewChild(DataTableDirective, {}) dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  products: Product[] = [];
  dtTrigger = new Subject();
  loading: boolean;

  constructor(private http: HttpClient, private productService: ProductsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.initTable();
  }

  initTable() {
    this.loading = true;
    this.dtOptions = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 5,
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
          self.rowClickHandler(data);
        });
        return row;
      }
    };
    this.productService.getAllProducts().subscribe((response: any) => {
      console.log(response);
      const outData = response.map((eachProduct) => {
        const formData = {
          name: eachProduct.name,
          costPrice: eachProduct.costPrice,
          productRefId: eachProduct.productRefId,
          createdAt: eachProduct.createdAt
        }
        return formData
      });
      this.products = outData;
      this.dtTrigger.next();
      this.loading = false;
    });
  }

  rowClickHandler(data) {
    console.log(data);
    const activeModal = this.modalService.open(ProductModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Test Large Modal';
    activeModal.componentInstance.allData = data;
  }

  refresh() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    this.initTable();
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
