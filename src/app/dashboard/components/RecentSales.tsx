"use client"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import OrdersData from "@/data/orders.json"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function RecentSales() {
  const router = useRouter()

  const viewAllOrders = ()=>{
    router.push('/dashboard/orders')
  }


  return (
    <div className="space-y-8">
      {
        OrdersData.splice(0, 5).map(order => (
          <div className="flex items-center flex-wrap w-auto justify-between border-b pb-2" key={order._id}>
            <div className="flex flex-wrap gap-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={order.items[0].productId.firstImage} alt="Avatar" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className="space-y-1 ">
                <p className="text-sm font-medium leading-none">{order.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.email}
                </p>
              </div>
            </div>
            <div className="-auto font-medium">₦{order.items[0].price.toLocaleString()}</div>
          </div>
        ))
      }
      <Button onClick={viewAllOrders} className="flex items-center w-full gap-8">
        <span>View all orders</span>
        <ArrowRight />
      </Button>
    </div>
  )
}