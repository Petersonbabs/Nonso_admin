"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Overview } from "./components/Overview"
import { RecentSales } from "./components/RecentSales"

import { Bike, CalendarDays, CookingPot, Loader, ShoppingBasket } from "lucide-react"
import { useEffect } from "react"
import { useProductContext } from "@/contexts/ProductsContext"
import { useOrderContext } from "@/contexts/OrdersContext"



export default function DashboardPage() {
  const { getAllProducts, products, loading } = useProductContext()
  const { getAllOrders, orders, pendingOrders, dispatchedOrders, deliveredOrders, getPendingOrders, getDispatchedOrders, getDeliveredOrders } = useOrderContext()
  useEffect(() => {
    getAllProducts()
    getPendingOrders()
    getDispatchedOrders()
    getDeliveredOrders()
  }, [])


  return (
    <>

      <div className=" flex-col md:flex ">


        {/* DETAILS */}
        <div className="flex-1 space-y-4 p-8 pt-6">
          {/* HEADING & CALEDAR */}

          <div className="flex items-center justify-between space-y-2 flex-wrap gap-4">
            <div className='flex gap-4 items-center'>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-2 ">
              <div className="flex gap-2 items-center p-2 shadow rounded">
                <CalendarDays />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Pending Orders */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pending Orders
                    </CardTitle>
                    <ShoppingBasket opacity={.5} size={16} className="text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        loading ?
                          <Loader className="animate-spin my-2" /> :
                          <span>{pendingOrders.length}</span>
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      last 30 days
                    </p>
                  </CardContent>
                </Card>

                {/* Pending Orders */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Dispatched Orders
                    </CardTitle>
                    <Bike opacity={.5} size={16} className="text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        loading ?
                          <Loader className="animate-spin my-2" /> :
                          <span>{dispatchedOrders.length}</span>
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      last 30 days
                    </p>
                  </CardContent>
                </Card>



                {/* Products Sold */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Delivered Orders
                    </CardTitle>
                    <CookingPot opacity={.5} size={16} className="text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        loading ?
                          <Loader className="animate-spin my-2" /> :
                          <span>{deliveredOrders.length}</span>
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      last 30 days
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:bg-gray-50 cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Products in store</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent >
                    <div className="text-2xl font-bold">
                      {
                        loading ?
                          <Loader className="animate-spin my-2" /> :
                          <span>{products.length}</span>
                      }
                    </div>
                  </CardContent>
                </Card>
                <Card className="hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Now
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div >
                <Card className="col-span-4 hidden">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      You have had {deliveredOrders.length} successful orders so far.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}