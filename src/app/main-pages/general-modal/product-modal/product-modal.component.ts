import { Component, Input, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../../products/products.service';
import { from } from 'rxjs';
import { concatMap, toArray } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbWindowService } from '@nebular/theme';
import { GeneralDialogComponent } from '../../general-dialog/general-dialog.component';


@Component({
  selector: 'app-product-modal',
  templateUrl: 'product-modal.component.html',
  styleUrls: ['product-modal.component.scss'],
})
export class ProductModalComponent implements OnInit {

  allData: string;
  loading = false;
  orderDetails;
  statuses;
  selectedStatus;
  firstForm;
  orderId;

  @ViewChild('contentTemplate') contentTemplate: TemplateRef<any>;
  @ViewChild('disabledEsc', { read: TemplateRef }) disabledEscTemplate: TemplateRef<HTMLElement>;
  checkResponse: any;

  constructor(private dialogService: NbDialogService, private fb: FormBuilder, private activeModal: NgbActiveModal, private productService: ProductsService) {
  }

  ngOnInit() {

    console.log(this.allData);

    this.loading = true;

    // this.firstForm = this.fb.group({
    //     name: ['', Validators.required],
    //     productRefId: ['', Validators.required],
    //     costPrice: ['', Validators.required]
    //   });

    this.productService.getAProduct(this.allData[0]).subscribe((response: any) => {
      console.log(response);

      this.checkResponse = response;

      this.loading = false;

      this.firstForm = this.fb.group({
        name: [response[0].name, Validators.required],
        productRefId: [ {value: response[0].productRefId, disabled: true}, Validators.required],
        costPrice: [response[0].costPrice, Validators.required]
      });

      // this.getAllItems(response[0].itemizeds).then((mappedItems)=>{
      //   console.log(mappedItems);
      //   if(mappedItems!=undefined || mappedItems[0]!=undefined)
      //   {
      //     this.orderDetails = { 
      //       otherData: response[0],
      //       itemData: mappedItems
      //     };
      //     this.loading = false;
      //   }

      // });

    });
  }


  closeModal() {
    this.activeModal.close();
  }

  onFirstSubmit() {
    this.loading = true
    const data = {
      name: this.firstForm.get('name').value,
      costPrice: this.firstForm.get('costPrice').value
    };
    this.productService.updateProduct(data,this.checkResponse[0].id).subscribe((response)=>{
      console.log(response);
      this.loading=false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'This product has been successfully updated!',
        },
        hasBackdrop: false
      });
      this.closeModal();
    },error=>{
      console.log(error);
      this.loading=false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'There was an error updating this product!',
        },
        hasBackdrop: false
      });
      this.closeModal();

    });
  }

  delete() {
    this.loading = true

    this.productService.deleteProduct(this.checkResponse[0].id).subscribe((response)=>{
      console.log(response);
      this.loading=false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'This product has been successfully deleted!',
        },
        hasBackdrop: false
      });
      this.closeModal();
    },error=>{
      console.log(error);
      this.loading=false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'There was an error deleting this product!',
        },
        hasBackdrop: false
      });
      this.closeModal();

    });    
  }


}
