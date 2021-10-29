import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Order } from 'src/app/order';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {

  orders: Order[] = [];

  subscription: Subscription = new Subscription;

  currentOrderAdd: Order = {
    id: 0,
    orderName: '',
    price: 0,
    isDiscountPercentage: 0
  }

  currentOrderUpdate: Order = {
    id: 0,
    orderName: '',
    price: 0,
    isDiscountPercentage: 0
  }

  clerk = { name: "" };
  discountedBill = { totalBill: 0 };
  regularBill = { totalBill: 0 };

  isEdit: boolean = false;

  successMessage!: string;
  errorMessage!: string;

  constructor(private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.getOrders();
    this.getClerk();
    this.getRegularBill();
    this.getDiscountedBill();
  }

  getOrders(): void {
    this.subscription = this.orderService.getOrders()
      .pipe(catchError((error) => {
        this.successMessage = "";
        this.errorMessage = "Unable to load details. Something went wrong.";
        return throwError(error);
      }))
      .subscribe(orders => this.orders = orders);
  }

  getClerk(): void {
    this.subscription = this.orderService.getClerk().subscribe((data) => {
      this.clerk = data
      this.errorMessage = "";
    });
  }

  getDiscountedBill(): void {
    this.subscription = this.orderService.getTotalDiscountedBill().subscribe(data => this.discountedBill = data);
  }

  getRegularBill(): void {
    this.subscription = this.orderService.getTotalRegularBill().subscribe(data => this.regularBill = data);
  }

  onCheckAdd(event: any) {
    if (event.target.checked) {
      this.currentOrderAdd.isDiscountPercentage = 5;
    } else {
      this.currentOrderAdd.isDiscountPercentage = 0;
    }
  }

  onCheckUpdate(event: any) {
    if (event.target.checked) {
      this.currentOrderUpdate.isDiscountPercentage = 5;
    } else {
      this.currentOrderUpdate.isDiscountPercentage = 0;
    }
  }

  onAdd(orderName: any, price: any, isDiscountPercentage: any) {
    this.currentOrderAdd = {
      id: 0,
      orderName: '',
      price: 0,
      isDiscountPercentage: 0,
    };

    this.subscription = this.orderService.addOrder({ orderName, price, isDiscountPercentage } as Order)
      .pipe(catchError((error) => {
        this.successMessage = "";
        this.errorMessage = "Unable to add order. Something went wrong.";
        return throwError(error);
      }))
      .subscribe((order) => {
        this.orders.push(order);
        this.errorMessage = "";
        this.successMessage = "Order is successfully added.";
        this.getOrders();
        this.getRegularBill();
        this.getDiscountedBill();
      });
  }

  onEdit(order: Order) {
    this.currentOrderUpdate = order;
    this.isEdit = true
  }

  onUpdate() {
    const data = this.currentOrderUpdate
    this.subscription = this.orderService.updateOrder(data)
      .pipe(catchError((error) => {
        this.successMessage = "";
        this.errorMessage = "Unable to update order. Something went wrong.";
        return throwError(error);
      }))
      .subscribe(() => {
        this.errorMessage = "";
        this.successMessage = "Order is successfully updated.";
        this.getOrders();
        this.getRegularBill();
        this.getDiscountedBill();
        this.isEdit = false;
      });

  }

  onCancel() {
    this.isEdit = !this.isEdit
  }

  onDelete(order: Order) {
    this.orders = this.orders.filter(h => h !== order);
    this.subscription = this.orderService.deleteOrder(order.id)
      .pipe(catchError((error) => {
        this.successMessage = "";
        this.errorMessage = "Unable to delete order. Something went wrong.";
        return throwError(error);
      }))
      .subscribe(() => {
        this.errorMessage = "";
        this.successMessage = "Order is successfully deleted.";
        this.getOrders();
        this.getRegularBill();
        this.getDiscountedBill();
      });
  }

  onRemoveAlert() {
    this.successMessage = "";
    this.errorMessage = "";
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}


