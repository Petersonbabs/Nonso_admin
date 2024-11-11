"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderProps } from "@/contexts/OrdersContext";




export default function OrderDetailsPage({ order }: { order: OrderProps; }) {
    return (
        <div className="w-[90vw] max-w-[500px] mx-auto p-4">


            <Card>
                <CardHeader>
                    <CardTitle>Order #{order._id}</CardTitle>
                    <p>Date: {order.Date?.toLocaleString()}</p>
                    <p>Status: <span className={`status-${order.status.toLowerCase()}`}>{order.status}</span></p>
                </CardHeader>

                <CardContent>
                    <h3 className="font-semibold mb-4">Customer Information</h3>
                    <p>Name: {order.name}</p>
                    <p>Email: {order.orderedBy}</p>
                    <p>Address: {order.address}</p>

                    <h3 className="font-semibold mt-6 mb-4">Order Items</h3>
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item, index) => (
                                <TableRow key={item._id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>₦{order.items[index].price.toLocaleString()}</TableCell>
                                    <TableCell>₦{(order.total).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>

                <CardFooter className="text-right">
                    <h3 className="text-lg font-semibold">Total: ₦{order.total.toLocaleString()}</h3>
                </CardFooter>
            </Card>
        </div>
    );
}

