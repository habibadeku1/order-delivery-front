import { environment } from '../environments/environment';
export class AppSettings {
    public static baseApIURL = `${environment.baseUrl}`;

    public static allStatuses = [
        { _id: 1, name: 'pending', title: 'Pending' },
        { _id: 2, name: 'processing', title: 'Processing' },
        // { _id: 3, name: 'loadingtruck', title: 'Loading Truck' },
        { _id: 3, name: 'enroute', title: 'En-route' },
        { _id: 4, name: 'arrived', title: 'Arrived' },
        { _id: 5, name: 'delivered', title: 'Delivered' },
        { _id: 6, name: 'cancelled', title: 'Cancelled' },
    ];

    public static smsApi = {
        "username" : "hybridfeedshq@gmail.com",
        "key" : "6e80a6f102ff3f285370603c7beb1b09b5c3f6d6",
        "sendUrl" : "http://api.ebulksms.com:8080/sendsms.json"
    }

}