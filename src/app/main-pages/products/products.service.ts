import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs';

import { AppSettings } from '../../AppConstants';

@Injectable()
export class ProductsService
{
    token: string;
    constructor(private http: HttpClient) { 
        this.token = localStorage.getItem("app_token");
    }

    public getAllProducts() {
        return this.http.get(`${AppSettings.baseApIURL}products`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });
    }

    public productPost(data) {
        return this.http.post(`${AppSettings.baseApIURL}products`,data, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });        
    }

    public getAProduct(id) {
        return this.http.get(`${AppSettings.baseApIURL}products?productRefId_eq=${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });
    }

    public updateProduct(data,id) {
        return this.http.put(`${AppSettings.baseApIURL}products/${id}`,data, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });        
    }

    public deleteProduct(id) {
        return this.http.delete(`${AppSettings.baseApIURL}products/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });        
    }

}