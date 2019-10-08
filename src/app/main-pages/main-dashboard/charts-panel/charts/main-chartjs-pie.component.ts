import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { AppSettings } from '../../../../AppConstants'
import { OrdersService } from '../../../orders/orders.service';

@Component({
  selector: 'ngx-main-chartjs-pie',
  template: `
    <chart type="pie" [data]="data" [options]="options"></chart>
  `,
})
export class MainChartjsPieComponent implements OnDestroy, OnInit {
  data: any;
  options: any;
  themeSubscription: any;
  loading: boolean;

  constructor(private theme: NbThemeService, private orderService: OrdersService) {
  }

  ngOnInit() {

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;

      let pending = 0;
      let processing = 0;
      // let loadingtruck = 0;
      let enroute = 0;
      let arrived = 0;
      let delivered = 0;
      let cancelled = 0;      

      this.loading = true;
      
      this.orderService.getAllOrders().subscribe((response: any)=>{
        // const outData = response.map((eachOrder)=>{
        //   const formData = { referenceId: eachOrder.referenceId,
        //     customerEmail: eachOrder.user.email,
        //     orderDate: eachOrder.createdAt,
        //     expectedDeliveryDate: eachOrder.expectedDeliveryDate,
        //     status: eachOrder.status
        //   }
        //   return formData
        // });  
        console.log(response);

        const mappedResult = response.map(element => {
            const orderData = {
              orderId: element.id,
              status : element.status,
              itemsTotalPrice : element.itemizeds.map((obj)=>{ return obj.quantity*obj.salesPrice}).reduce((x, y) => x + y),
              itemsTotalQuantity: element.itemizeds.map((obj)=>{ return obj.quantity}).reduce((x, y) => x + y),
            }
            return orderData;
        });

        mappedResult.forEach(element => {
          if(element.status==="pending") {
            pending++;
          }
          else if(element.status==="processing") {
            processing++;
          }
          // else if(element.status==="loadingtruck") {
          //   loadingtruck++;
          // }
          else if(element.status==="enroute") {
            enroute++;
          }
          else if(element.status==="arrived") {
            arrived++;
          }
          else if(element.status==="delivered") {
            delivered++;
          }
          else if(element.status==="cancelled") {
            cancelled++;
          }          
        });

        
      console.log(pending, processing, enroute, arrived, delivered, cancelled);


      this.data = {
        labels: AppSettings.allStatuses.map((status)=> { return status.title }),
        datasets: [{
          data: [pending, processing, enroute, arrived, delivered, cancelled],
          backgroundColor: [colors.primaryLight, colors.infoLight, colors.successLight, /* '#00ffff', */'#00dccc', '#444', '#FF0000'],
        }],
      };

      this.options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
      };

        this.loading = false;
      });

    });

  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
