import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppSettings } from '../../../AppConstants';
import RefGenerator from '../../../ref-generator-util';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { OrdersService } from '../orders.service';
import { GeneralDialogComponent } from '../../../main-pages/general-dialog/general-dialog.component';
import { NbDateService, NbDialogService, NbStepperComponent } from '@nebular/theme';
import { of } from 'rxjs';
// import { StepperComponent } from '../../../pages/extra-components/stepper/stepper.component';


@Component({
  selector: 'app-create-order',
  styleUrls: ['./create-order.component.scss'],
  templateUrl: './create-order.component.html',
})
export class CreateOrderComponent implements OnInit {

  @ViewChild('stepper') stepper: NbStepperComponent;
  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  productList: any;
  userList: any;
  items: FormArray;
  itemProduct: any;
  selectedProduct;
  loading = false;
  statuses;
  min: Date;
  itemizeds;
  stepOneDisabled = false;
  stepTwoDisabled = false;
  orderIsCompleted = false;
  orderRefId: string;

  constructor(private dialogService: NbDialogService, private fb: FormBuilder, private http: HttpClient, private orderService: OrdersService, protected dateService: NbDateService<Date>) {
    this.min = this.dateService.addDay(this.dateService.today(), 0);
  }

  ngOnInit() {

    this.statuses = AppSettings.allStatuses;
    this.loading = true;

    this.orderService.productAndUserList().subscribe((results) => {
      console.log(results);
      this.productList = results[0];
      this.userList = results[1];

      this.firstForm = this.fb.group({
        items: this.fb.array([this.createItem()])
      });

      this.secondForm = this.fb.group({
        referenceId: ['', Validators.required],
        expectedDeliveryDate: ['', Validators.required],
        status: ['', Validators.required],
        user: ['', Validators.required]
      });

      this.loading = false;

    });

    // this.http.get(`${AppSettings.baseApIURL}products`).subscribe((results: any)=> {
    //   console.log(results);
    //   this.productList = results;
    // });

    // this.http.get(`${AppSettings.baseApIURL}users`).subscribe((results: any)=> {
    //   console.log(results); 
    //   this.userList = results;    
    //  this.loading=false;
    // });

    // this.firstForm = this.fb.group({
    //   firstCtrl: ['', Validators.required],
    // });

    // this.secondForm = this.fb.group({
    //   secondCtrl: ['', Validators.required],
    // });

    // this.thirdForm = this.fb.group({
    //   thirdCtrl: ['', Validators.required],
    // });

  }

  createItem(): FormGroup {
    console.log(this.productList[0].name);
    return this.fb.group({
      product: [this.productList[0].name, Validators.required],
      salesPrice: ['', Validators.required],
      quantity: ['', Validators.required]
    });
  }

  addItem(): void {
    this.items = this.firstForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  removeItem(index) {
    this.items = this.firstForm.get('items') as FormArray;
    this.items.removeAt(index);
  }

  onFirstSubmit() {
    this.loading = true;
    this.orderService.itemizedPost(this.firstForm.get(['items']).value).subscribe((response) => {
      console.log(response);
      this.itemizeds = response;
      this.stepOneDisabled = true;
      this.loading = false;
      this.firstForm.markAsDirty();
    }, error => {
      console.log(error);
      this.loading = false;
    });
    this.checkFormTwo().subscribe(rsp=>console.log(rsp));
  }

  onSecondSubmit(dialog) {
    this.loading = true;
    this.orderRefId = `HY-${RefGenerator.generateRef().toUpperCase()}`;
    const orderData = {
      referenceId: this.orderRefId,
      expectedDeliveryDate: this.secondForm.get('expectedDeliveryDate').value,
      status: this.secondForm.get('status').value,
      user: this.secondForm.get('user').value,
      userId: this.secondForm.get('user').value.id,
      itemizeds: this.itemizeds
    }
    this.orderService.orderPost(orderData).subscribe((response) => {
      console.log(response);
      this.orderIsCompleted = true;
      this.loading = false;
      this.secondForm.markAsDirty();
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'This order was successfully completed!',
        },
        hasBackdrop: false
      });
    }, error => {
      console.log(error);
      this.loading = false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'There was a problem completing this order, please contact the system administrator!',
        },
        hasBackdrop: false
      });
    });
  }

  checkFormTwo() {
    if((this.secondForm.get('expectedDeliveryDate').value!=''||this.secondForm.get('expectedDeliveryDate').value!=null||this.secondForm.get('expectedDeliveryDate').value!=undefined)&&this.secondForm.get('status').value!=''&&this.secondForm.get('user').value!='')
    {
      return of(false);
    }
    else {
      return of(true);
    }    
  }

  resetForm() {
    this.firstForm.reset();
    this.secondForm.reset();
    this.stepper.reset();
  }

}
