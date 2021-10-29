import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Order } from '../order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  ordersUrl = "http://localhost:1010/api";

  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    const url = `${this.ordersUrl}/orders`;
    return this.http.get<Order[]>(url);
  }

  addOrder(order: Order): Observable<Order> {
    const url = `${this.ordersUrl}/add`;
    return this.http.post<Order>(url, order);
  }

  deleteOrder(id: number): Observable<Order> {
    const url = `${this.ordersUrl}/delete/${id}`;
    return this.http.delete<Order>(url);
  }

  updateOrder(order: Order): Observable<Order> {
    const url = `${this.ordersUrl}/update/${order.id}`;
    return this.http.put<Order>(url, order)
  }

  public getTotalDiscountedBill(): Observable<any> {
    const url = `${this.ordersUrl}/orders/discountedTotalBill`;
    return this.http.get(url);
  }
  public getTotalRegularBill(): Observable<any> {
    const url = `${this.ordersUrl}/orders/regularTotalBill`;
    return this.http.get(url);
  }

  public getClerk(): Observable<any> {
    const url = `${this.ordersUrl}/orders/clerk`;
    return this.http.get(url);
  }
}
