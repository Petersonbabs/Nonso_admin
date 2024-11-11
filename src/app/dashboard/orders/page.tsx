"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TableHeader } from "@/components/ui/table"; // Assume ShadCN has custom table components
import { Button } from "@/components/ui/button";
import { Bike, Edit, Eye, Loader2, PackageOpen, ThumbsUp, Trash, Truck } from "lucide-react"; // Icons for edit and delete actions
import { useProductContext } from "@/contexts/ProductsContext";
import { useOrderContext } from "@/contexts/OrdersContext";
import OrdersData from "@/data/orders.json"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import OrderDetailsPage from "./components/OrderDetails";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";


const AllOrdersPage = () => {
    // const { getAllProducts, products, deleting, deleteProduct, getProductsByCategory } = useProductContext()
    const { handleOrder, loadingOrder, loading, getAllOrders, orders } = useOrderContext()
    const router = useRouter()
    const query = useSearchParams()
    const params = new URLSearchParams(query)
    const status = query.get('status') || 'pending'


    const [selectedStatus, setSelectedStatus] = useState<string>(status)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;


    useEffect(() => {
        getAllOrders(selectedStatus.toLowerCase())
    }, [selectedStatus])

    useEffect(() => {
        setTotalPages(Math.ceil(orders?.length / itemsPerPage));
    }, [orders]);
    const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    const handleChangeStatus = (value: string) => {
        setSelectedStatus(value);
        params.set('status', value);
        router.push(`/dashboard/orders?${params.toString()}`);
    }



    return (
        <Suspense>
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-4 justify-between">
                <h1 className="text-3xl font-bold mb-6 text-black">Manage Orders</h1>
                <p className="text-black">You have {orders.length} {selectedStatus} orders.</p>
                <Select onValueChange={(value) => { handleChangeStatus(value) }}>
                    <SelectTrigger className="text-black">{selectedStatus}</SelectTrigger>
                    <SelectContent>
                        {
                            ['Pending', "Dispatched", "Delivered"].map(status => (
                                <SelectItem value={status} key={status}>{status}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>

            {
                loading ?
                    <div className="h-[50vh] m-auto flex justify-center items-center">
                        <Loader2 className="size-20 animate-spin font-semibold" />
                    </div>
                    :
                    <>
                        {
                            paginatedOrders.length === 0 ?
                                <section className="text-gray-500 h-[50vh] text-lg border flex items-center justify-center">
                                    <h1>No result.</h1>
                                </section>
                                :
                                <section className="w-full border border-gray-200 px-2 rounded">
                                    <section className="grid gap-2 py-4  text-gray-800">
                                        {paginatedOrders?.slice().reverse().map(order => (
                                            <div className="flex items-center  relative flex-wrap p-2 w-auto shadow justify-between border-b pb-2" key={order._id}>
                                                <span className={`absolute text-[12px] px-2 top-0 left-0 z-10 h-4 w-4 rounded-br  ${order.status == "pending" ? "bg-orange-500" : order.status == "dispatched" ? "bg-blue-600" : "bg-green-500"} text-white`}></span>
                                                <div className="flex gap-2 items-center">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={order.items[0].productId.firstImage} alt="Avatar" />
                                                        <AvatarFallback>OM</AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1 ">
                                                        <p className="text-sm font-medium leading-none">{order.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {order.orderedBy.slice(0, 10)}...
                                                        </p>
                                                        <h3>₦{Number(order.items[0].price).toLocaleString()}</h3>
                                                    </div>
                                                </div>
                                                <div className=" flex flex-col h-full gap-1 justify-center link-text items-center" >
                                                    <Dialog>
                                                        <DialogTrigger className="text-sm bg-black text-white flex justify-center items-center gap-2 px-2 h-full w-full flex-1 rounded-tl-lg">
                                                            <Eye className="size-4" />
                                                            <span>view</span>
                                                        </DialogTrigger>
                                                        <DialogContent >
                                                            <DialogTitle>Order Details</DialogTitle>
                                                            <OrderDetailsPage order={order} />
                                                        </DialogContent>
                                                    </Dialog>
                                                    <button disabled={order.status == 'delivered'} className={`text-sm ${order.status == "pending" ? "bg-blue-500" : order.status == "delivered" ? "bg-green-300" : "bg-green-500"} text-white flex justify-center items-center gap-2 px-2 flex-1 w-24 rounded-bl-lg link-text`} onClick={(e) => {
                                                        const text = (e.currentTarget as HTMLButtonElement).textContent?.toLowerCase();
                                                        if (text) {
                                                            handleOrder(text, order._id);
                                                        }
                                                    }}>
                                                        {
                                                            loadingOrder == order._id ?
                                                                <Loader2 className="animate-spin" /> :
                                                                <>
                                                                    {
                                                                        order.status == "pending" ?
                                                                            <Bike className="size-4" /> :
                                                                            order.status == "delivered" ?
                                                                                <ThumbsUp /> :
                                                                                <PackageOpen className="size-4" />
                                                                    }
                                                                    {
                                                                        order.status == "pending" ?
                                                                            <span>Dispatch</span> :
                                                                            order.status == "delivered" ?
                                                                                <span>Delivered</span> :
                                                                                <span>Deliver</span>
                                                                    }
                                                                </>
                                                        }
                                                    </button>
                                                    <button></button>
                                                </div>
                                            </div>
                                        ))}
                                    </section>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-right">
                                                <div className="flex justify-end items-center space-x-2">
                                                    <Button
                                                        disabled={currentPage === 1}
                                                        onClick={() => setCurrentPage((prev) => prev - 1)}
                                                    >
                                                        Previous
                                                    </Button>
                                                    <span>Page {currentPage} of {totalPages}</span>
                                                    <Button
                                                        disabled={currentPage === totalPages}
                                                        onClick={() => setCurrentPage((prev) => prev + 1)}
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </section>
                        }
                    </>
            }
        </div>
        </Suspense>
    );
};

export default AllOrdersPage;
