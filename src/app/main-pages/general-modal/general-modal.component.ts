import { Component, Input, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from '../orders/orders.service';
import { AppSettings } from '../../AppConstants';
import { from } from 'rxjs';
import { concatMap, toArray } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbWindowService } from '@nebular/theme';
import { GeneralDialogComponent } from '../general-dialog/general-dialog.component';


@Component({
  selector: 'app-general-modal',
  templateUrl: 'general-modal.component.html',
  styleUrls: ['general-modal.component.scss'],
})
export class GeneralModalComponent implements OnInit {

  dataId: string;
  loading = false;
  orderDetails;
  statuses;
  selectedStatus;
  firstForm;
  orderId;

  @ViewChild('contentTemplate') contentTemplate: TemplateRef<any>;
  @ViewChild('disabledEsc', { read: TemplateRef }) disabledEscTemplate: TemplateRef<HTMLElement>;
  userData: string;

  constructor(private windowService: NbWindowService, private dialogService: NbDialogService, private fb: FormBuilder, private activeModal: NgbActiveModal, private orderService: OrdersService) {
    this.userData = localStorage.getItem('user_type');  
   }

  ngOnInit() {
    this.statuses = AppSettings.allStatuses;
    this.loading = true;
    this.firstForm = this.fb.group({
      status: ['', Validators.required]
    });

    this.orderService.getAnOrder(this.dataId).subscribe((response: any)=>{
       this.orderId = response[0].id;
    this.getAllItems(response[0].itemizeds).then((mappedItems)=>{
      console.log(mappedItems);
      if(mappedItems!=undefined || mappedItems[0]!=undefined)
      {
        this.orderDetails = { 
          otherData: response[0],
          itemData: mappedItems
        };
        this.loading = false;
      }

    });

    });
  }

  async getAllItems(items) {
    const allData = [];
    for (let i = 0; i < items.length; i++) {
      await this.orderService.getAProduct(items[i].product).then((response_two: any) => {
        const data = {
          productName: response_two[0].name,
          item: items[i]
        }
        allData.push(data);
      });
    }
   return Promise.resolve(allData);

  }

  closeModal() {
    this.activeModal.close();
  }

  updateStatus() {
    this.loading=true
    console.log(this.firstForm.get('status').value)
    this.orderService.updateStatus({status: this.firstForm.get('status').value},this.orderId).subscribe((response)=>{
      console.log(response);
      this.loading=false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'The status of the order was successfully updated!',
        },
        hasBackdrop: false
      });
      this.closeModal();

    },error=>{
      console.log(error);
      this.loading=false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'There was an error updating the status of this order!',
        },
        hasBackdrop: false
      });
      this.closeModal();

    });
  }


}
