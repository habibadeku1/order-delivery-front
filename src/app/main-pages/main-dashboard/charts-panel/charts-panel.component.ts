import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { OrdersChartComponent } from './charts/orders-chart.component';
import { ProfitChartComponent } from './charts/profit-chart.component';
import { OrdersChart } from '../../../@core/data/orders-chart';
import { ProfitChart } from '../../../@core/data/profit-chart';
import { OrderProfitChartSummary, OrdersProfitChartData } from '../../../@core/data/orders-profit-chart';
import { OrdersService } from '../../orders/orders.service';

@Component({
  selector: 'ngx-ecommerce-charts',
  styleUrls: ['./charts-panel.component.scss'],
  templateUrl: './charts-panel.component.html',
})
export class ECommerceChartsPanelComponent implements OnDestroy, OnInit {

  private alive = true;

  chartPanelSummary: OrderProfitChartSummary[];
  period: string = 'week';
  ordersChartData: OrdersChart;
  profitChartData: ProfitChart;

  @ViewChild('ordersChart') ordersChart: OrdersChartComponent;
  @ViewChild('profitChart') profitChart: ProfitChartComponent;

  constructor(private ordersProfitChartService: OrdersProfitChartData, private orderService: OrdersService) {
    // this.ordersProfitChartService.getOrderProfitChartSummary()
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe((summary) => {
    //     this.chartPanelSummary = summary;
    //   });

    this.getOrdersChartData(this.period);
    this.getProfitChartData(this.period);
  }

  ngOnInit() {
    this.orderService.mapAllOrders().then((data) => {
      data.subscribe((mappedResult) => {
        // const mappedResult = response.map(element => {
        //   const orderData = {
        //     itemsTotalPrice: element.itemizeds.map((obj) => { return obj.quantity * obj.salesPrice }).reduce((x, y) => x + y),
        //     itemsTotalQuantity: element.itemizeds.map((obj) => { return obj.quantity }).reduce((x, y) => x + y),
        //   }
        //   return orderData;
        // });  
        console.log(mappedResult);
        
        const formSummary = [
          { title: "Total Orders", value: mappedResult.length },
          { title: "Total Products", value: mappedResult.map((obj)=>{ return obj.itemsTotalQuantity}).reduce((x, y) => x + y) },
          { title: "Orders Value", value: mappedResult.map((obj)=>{ return obj.itemsTotalPrice}).reduce((x, y) => x + y) }
        ];
        this.chartPanelSummary = formSummary;
      });
    });
  }

  setPeriodAndGetChartData(value: string): void {
    if (this.period !== value) {
      this.period = value;
    }

    this.getOrdersChartData(value);
    this.getProfitChartData(value);
  }

  changeTab(selectedTab) {
    if (selectedTab.tabTitle === 'Profit') {
      this.profitChart.resizeChart();
    } else {
      this.ordersChart.resizeChart();
    }
  }

  getOrdersChartData(period: string) {
    this.ordersProfitChartService.getOrdersChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(ordersChartData => {
        this.ordersChartData = ordersChartData;
      });
  }

  getProfitChartData(period: string) {
    this.ordersProfitChartService.getProfitChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(profitChartData => {
        this.profitChartData = profitChartData;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
