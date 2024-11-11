import { ReactNode, createContext, useContext, useState } from "react";
import axios from 'axios'
import { toast } from "sonner";
import { useAuthContext } from "./AuthContext";
import { ProductProps } from "./ProductsContext";

export interface ItemProps {
    productId: {
        _id: string,
        name: string,
        description: string,
        price: number,
        category: string,
        firstImage: string,
        firstImageOriginalName: string,
        secondImage: string,
        secondImageOriginalName: string,
    },
    name: string,
    quantity: number,
    price: number,
    _id: string
}

export interface OrderProps {
    _id: string,
        name: string,
        email: string,
        phone: string,
        address: string,
        city: string,
        state: string,
        country: string,
        orderedBy: string,
        items: ItemProps[],
        total: number,
        status: string,
        code: string,
        payment: boolean,
        Date: ReactNode,
}

interface OrderContextType {
    getAllOrders: (status: string) => void;
    getPendingOrders: () => void;
    getDispatchedOrders: () => void;
    getDeliveredOrders: () => void;
    loadingOrder: string;
    loadingDelivered: boolean;
    loading: boolean;
    orders: OrderProps[];
    pendingOrders: OrderProps[];
    deliveredOrders: OrderProps[];
    dispatchedOrders: OrderProps[];
    handleOrder: ( action:string, orderId:string) => void;
}

const OrderContext = createContext<OrderContextType | null>(null)
export const useOrderContext = () => {
    const context = useContext(OrderContext)
    if (!context) {
        throw new Error('Order context must be in a context provider!')
    }
    return context as OrderContextType
}

export default function OrderProvider({ children }: { children: ReactNode }) {
    const { adminId } = useAuthContext()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const [orders, setOrders] = useState<OrderProps[]>([])
    const [pendingOrders, setPendingOrders] = useState<OrderProps[]>([])
    const [dispatchedOrders, setDispatchedOrders] = useState<OrderProps[]>([])
    const [deliveredOrders, setDeliveredOrders] = useState<OrderProps[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingDelivered, setLoadingDelivered] = useState(false)
    const [loadingOrder, setLoadingOrder] = useState<string>('')


    // getAll
    const getAllOrders = async (status: string) => {
        setLoading(true)
        try {
            const response = await axios(`${baseUrl}/${status}/order/672b0999ae6838dfb57f387b`)
            const data = await response.data
            if (response.status == 200) {
                setOrders(data.order)
                
            }
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }
    }

    const getPendingOrders = async () => {
        setLoading(true)
        try {
            const response = await axios(`${baseUrl}/pending/order/672b0999ae6838dfb57f387b`)
            const data = await response.data
            if (response.status == 200) {
                setPendingOrders(data.order)
            }
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }
    }
    
    const getDispatchedOrders = async () => {
        setLoading(true)
        try {
            const response = await axios(`${baseUrl}/dispatched/order/672b0999ae6838dfb57f387b`)
            const data = await response.data
            
            if (response.status == 200) {
                setDispatchedOrders(data.order)
            }
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }
    }
    
    const getDeliveredOrders = async () => {
        setLoading(true)
        setLoadingDelivered(true)
        try {
            const response = await axios(`${baseUrl}/delivered/order/672b0999ae6838dfb57f387b`)
            const data = await response.data
            console.log(data);
            
            if (response.status == 200) {
                setDeliveredOrders(data.order)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
            setLoadingDelivered(false)
        }
    }


    // Get single product
    const handleOrder =async ( action:string, orderId:string) => {
        setLoadingOrder(orderId)
        try {
            const response = await axios.post(`${baseUrl}/${action}/order/${adminId}/${orderId}`)
            const data = response.data
            if(response.status == 200){
                toast.success(data.message)
            }
            getAllOrders('pending')
            
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingOrder('')
        }
    }



    const value = {
        handleOrder,
        getAllOrders,
        getPendingOrders,
        getDispatchedOrders,
        getDeliveredOrders,
        orders,
        pendingOrders,
        dispatchedOrders,
        deliveredOrders,
        loading,
        loadingDelivered,
        loadingOrder,
    }

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>

}

