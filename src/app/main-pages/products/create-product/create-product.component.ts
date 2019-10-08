import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppSettings } from '../../../AppConstants';
import RefGenerator from '../../../ref-generator-util';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ProductsService } from '../products.service';
import { GeneralDialogComponent } from '../../general-dialog/general-dialog.component';
import { NbDateService, NbDialogService } from '@nebular/theme';


@Component({
  selector: 'app-create-product',
  styleUrls: ['./create-product.component.scss'],
  templateUrl: './create-product.component.html',
})
export class CreateProductComponent implements OnInit {

  firstForm: FormGroup;
  loading = false;

  constructor(private dialogService: NbDialogService, private fb: FormBuilder, private http: HttpClient, private productService: ProductsService, protected dateService: NbDateService<Date>) {
  }

  ngOnInit() {

    this.loading = true;

    this.firstForm = this.fb.group({
        name: ['', Validators.required],
        productRefId: ['', Validators.required],
        costPrice: ['', Validators.required]
      });

      this.loading = false;
  }

  onFirstSubmit() {
    this.loading = true;
    const productData = {
      productRefId: this.firstForm.get('productRefId').value,
      name: this.firstForm.get('name').value,
      costPrice: this.firstForm.get('costPrice').value
    }
    this.productService.productPost(productData).subscribe((response) => {
      this.loading = false;
      console.log(response);
      this.firstForm.reset();
      this.firstForm.markAsDirty();
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'This product was successfully created!',
        },
        hasBackdrop: false
      });
    }, error => {
      console.log(error);
      this.loading = false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'There was a problem creating this product, please contact the system administrator!',
        },
        hasBackdrop: false
      });
    });
  }

}
