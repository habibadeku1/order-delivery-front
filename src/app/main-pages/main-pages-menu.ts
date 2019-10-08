import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [

  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/main-pages/main-dashboard',
    home: true,
  },
  {
    title: 'Orders',
    icon: 'nb-e-commerce',
    // link: '/main-pages/orders',
    // home: true,
    children: [
      {
        title: 'Order List',
        link: '/main-pages/orders',
      },
      {
        title: 'Create Order',
        link: '/main-pages/create-order',
      },
    ]
  },
  {
    title: 'Products',
    icon: 'nb-compose',
    children: [
      {
        title: 'Product List',
        link: '/main-pages/products',
      },
      {
        title: 'Create Product',
        link: '/main-pages/create-product',
      },
    ]
  },
  {
    title: 'Customers',
    icon: 'nb-person',
    children: [
      {
        title: 'Customer List',
        link: '/main-pages/customers',
      },
      {
        title: 'Create Customer',
        link: '/main-pages/create-customer',
      },
    ]
  },
];

export const MENU_ITEMS_CUSTOMER: NbMenuItem[] = [

  {
    title: 'Orders',
    icon: 'nb-e-commerce',
    link: '/main-pages/orders',
    home: true,
  },
  // {
  //   title: 'Orders',
  //   icon: 'nb-e-commerce',
  //   // link: '/main-pages/orders',
  //   // home: true,
  //   children: [
  //     {
  //       title: 'Order List',
  //       link: '/main-pages/orders',
  //     },
  //     {
  //       title: 'Create Order',
  //       link: '/main-pages/create-order',
  //     },
  //   ]
  // },
];
