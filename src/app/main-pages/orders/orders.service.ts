import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { forkJoin, of } from 'rxjs';

import { AppSettings } from '../../AppConstants';
import { resolve } from 'dns';

@Injectable()
export class OrdersService
{
    output: any;
    token: string;
    constructor(private http: HttpClient) { 
        this.token = localStorage.getItem("app_token");
    }

    public getAllOrders() {
        return this.http.get(`${AppSettings.baseApIURL}orders`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          })
    }

    public getSomeOrders(userId) {
      return this.http.get(`${AppSettings.baseApIURL}orders?userId_eq=${userId}`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
    }

    async mapAllOrders(data?) {
        const allOrders = this.http.get(`${AppSettings.baseApIURL}orders`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).toPromise();

        await allOrders.then((response: any)=>{
            const mappedResult = response.map(element => {
                const orderData = {
                  orderId: element.id,
                  status : element.status,
                  itemsTotalPrice : element.itemizeds.map((obj)=>{ return obj.quantity*obj.salesPrice}).reduce((x, y) => x + y),
                  itemsTotalQuantity: element.itemizeds.map((obj)=>{ return obj.quantity}).reduce((x, y) => x + y),
                }
                return orderData;
            });
            this.output = mappedResult;            
        }).catch((error)=>console.log(error));
        console.log(this.output);
        return of(this.output);
    }


    public getAnOrder(id) {
        return this.http.get(`${AppSettings.baseApIURL}orders?referenceId_eq=${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          });
    }

    public getAProduct(id) {
        return this.http.get(`${AppSettings.baseApIURL}products?id_eq=${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).toPromise();
    }

    public productAndUserList(): Observable<any[]> {
        const productsUrl = this.http.get(`${AppSettings.baseApIURL}products`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          });
        const usersUrl = this.http.get(`${AppSettings.baseApIURL}users`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          });
        return forkJoin([productsUrl,usersUrl]);
    } 

    public itemizedPost(items): Observable<any[]> {
        const buildPosts = items.map((eachItem)=>{
            console.log(eachItem);
            return this.http.post(`${AppSettings.baseApIURL}itemizeds`,eachItem, {
                headers: {
                  Authorization: `Bearer ${this.token}`
                }
              });
        });
        return forkJoin(buildPosts);
    }

    public orderPost(data) {
        return this.http.post(`${AppSettings.baseApIURL}orders`,data, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          });        
    }

    public updateStatus(data,id) {
        return this.http.put(`${AppSettings.baseApIURL}orders/${id}`,data, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          });        
    }

}