import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppSettings } from '../../AppConstants'
import { OrdersService } from './orders.service';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralModalComponent } from '../general-modal/general-modal.component';
import * as _ from "lodash";
import { DataTableDirective } from 'angular-datatables';
import { NbAuthService } from '@nebular/auth';
import { AuthService } from '../../auth.service';



class Order {
  referenceId: string;
  customerEmail: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-orders',
  styleUrls: ['./orders.component.scss'],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnDestroy, OnInit {

  @ViewChild(DataTableDirective, {}) dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  orders: Order[] = [];
  allOrders;
  dtTrigger = new Subject();
  loading = false;
  userData: string;
  user: any;

  constructor(private myAuthService: AuthService, private authService: NbAuthService, private http: HttpClient, private orderService: OrdersService, private modalService: NgbModal) {
    this.userData = localStorage.getItem('user_type');
  }

  ngOnInit(): void {

    this.initTable();

    // this.http.get('data/data.json')
    //   .map(this.extractData)
    //   .subscribe(persons => {
    //     this.persons = persons;
    //     // Calling the DT trigger to manually render the table
    //     this.dtTrigger.next();
    //   });

    // const that = this;

    // this.orderService.getAllOrders().then((response: any)=>{
    //   console.log(response);
    //   this.allOrders = response;
    // });

    //   this.dtOptions = {
    //     pagingType: 'full_numbers',
    //     pageLength: 10,
    //     serverSide: true,
    //     processing: true,
    //     ajax: (dataTablesParameters: any, callback) => {
    //       console.log(dataTablesParameters);
    //       that.http.get(`${AppSettings.baseApIURL}orders/?referenceId_contains=${dataTablesParameters.search.value}&_limit=${dataTablesParameters.length}`, { params: {}, observe: 'response' })
    //       .subscribe((httpResp: HttpResponse<any>) => {
    //         console.log(httpResp);
    //         const outData = httpResp.body.map((eachOrder)=>{
    //           const formData = { referenceId: eachOrder.referenceId,
    //             customerEmail: eachOrder.user.email,
    //             orderDate: eachOrder.createdAt,
    //             expectedDeliveryDate: eachOrder.expectedDeliveryDate,
    //             status: eachOrder.status
    //           }
    //           return formData
    //         });

    //         that.orders = outData;

    //         callback({
    //           recordsTotal: this.allOrders.body.length,
    //           recordsFiltered: this.allOrders.body.length,
    //           data: []
    //         });
    //       });

    //     },
    //     columns: [{ data: 'referenceId' }, { data: 'customerEmail' }, { data: 'orderDate' }, { data: 'expectedDeliveryDate' }, { data: 'status' }]
    //   };

  }

  initTable() {
    this.loading = true;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      destroy: false,
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
          self.rowClickHandler(data);
        });
        return row;
      }
    };
    const checkType = localStorage.getItem('user_type');
    const checkUser = localStorage.getItem('user_id');

    if (checkType === 'authenticated') {
      this.orderService.getSomeOrders(checkUser).subscribe((response: any) => {
        const outData = response.map((eachOrder) => {
          const formData = {
            referenceId: eachOrder.referenceId,
            customerEmail: eachOrder.user.email,
            orderDate: eachOrder.createdAt,
            expectedDeliveryDate: eachOrder.expectedDeliveryDate,
            status: eachOrder.status
          }
          return formData
        });
        //console.log(outData);
        this.orders = outData;
        this.dtTrigger.next();
        this.loading = false;
      });
    }
    else if(checkType === 'administrator') {
      this.orderService.getAllOrders().subscribe((response: any) => {
        const outData = response.map((eachOrder) => {
          const formData = {
            referenceId: eachOrder.referenceId,
            customerEmail: eachOrder.user.email,
            orderDate: eachOrder.createdAt,
            expectedDeliveryDate: eachOrder.expectedDeliveryDate,
            status: eachOrder.status
          }
          return formData
        });
        //console.log(outData);
        this.orders = outData;
        this.dtTrigger.next();
        this.loading = false;
      });
    }
    else {
      this.authService.onTokenChange()
      .subscribe((token: any) => {
        if (token.isValid()) {
          this.user = token.getPayload(); 
          console.log(this.user)
            this.myAuthService.getUser(this.user.id).subscribe(async (user: any) => {
              console.log(user);
              localStorage.setItem('user_id', user.id);
              localStorage.setItem('user_type', user.role.type);
              const checkType = localStorage.getItem('user_type');
              const checkUser = localStorage.getItem('user_id');
              if (checkType === 'authenticated') {
                this.orderService.getSomeOrders(checkUser).subscribe((response: any) => {
                  const outData = response.map((eachOrder) => {
                    const formData = {
                      referenceId: eachOrder.referenceId,
                      customerEmail: eachOrder.user.email,
                      orderDate: eachOrder.createdAt,
                      expectedDeliveryDate: eachOrder.expectedDeliveryDate,
                      status: eachOrder.status
                    }
                    return formData
                  });
                  //console.log(outData);
                  this.orders = outData;
                  this.dtTrigger.next();
                  this.loading = false;
                });
              }
              else if(checkType === 'administrator') {
                this.orderService.getAllOrders().subscribe((response: any) => {
                  const outData = response.map((eachOrder) => {
                    const formData = {
                      referenceId: eachOrder.referenceId,
                      customerEmail: eachOrder.user.email,
                      orderDate: eachOrder.createdAt,
                      expectedDeliveryDate: eachOrder.expectedDeliveryDate,
                      status: eachOrder.status
                    }
                    return formData
                  });
                  //console.log(outData);
                  this.orders = outData;
                  this.dtTrigger.next();
                  this.loading = false;
                });
              }
            });
        }

      });
    }

  }

  rowClickHandler(data) {
    console.log(data);
    const activeModal = this.modalService.open(GeneralModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Test Large Modal';
    activeModal.componentInstance.dataId = data[0];
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
