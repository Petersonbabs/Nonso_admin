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
        __v: 0
}

interface OrderContextType {
    getAllOrders: () => void
    loadingOrder: string
    handleOrder: ( action:string, orderId:string) => void
    // getSingleProduct: (productId: string) => void
    getProductsByCategory: (categoryName: string) => void
    addProduct: (data: FormData) => void
    editProduct: (data: FormData, productId: string) => void
    deleteProduct: (productId: string) => void
    products: OrderProps[]
    loading: boolean
    deleting: string
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
    const [products, setProducts] = useState<OrderProps[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingOrder, setLoadingOrder] = useState<string>('')
    const [deleting, setDeleting] = useState('')

    // getAllProducts
    const getAllOrders = async () => {
        setLoading(true)
        try {
            const response = await axios(`${baseUrl}/all/product`)
            const data = await response.data
            if (response.status == 200) {
                setProducts(data)
            }

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }
    }


    // Get single product
    const handleOrder =async ( action:string, orderId:string) => {
        setLoading(true)
        setLoadingOrder(orderId)
        try {
            const response = await axios.post(`${baseUrl}/${action}/order/${adminId}/${orderId}`)
            console.log(response);
            const data = response.data
            if(response.status == 200){
                toast.success(data.message)
            }
            // getAllOrders()
            
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
            setLoadingOrder('')
        }
    }



    // get products by category
    const getProductsByCategory = async (categoryName: string) => {
        setLoading(true)
        try {
            const response = await axios(`${baseUrl}/product/category/${categoryName}`)
            const data = await response.data
            console.log(data);
            if (response.status == 200) {
                setProducts(data.products)
            }

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }
    }


    // Add new product
    const addProduct = async (data: FormData) => {
        setLoading(true)
        try {
            const response = await axios.post(`${baseUrl}/product/${adminId}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            if (response.status === 200) {
                toast.success(response.data.message)
                // getAllProducts()
            }

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }

    }

    // Edit new product
    const editProduct = async (data: FormData, productId: string) => {
        setLoading(true)
        try {
            const response = await axios.put(`${baseUrl}/product/${adminId}/${productId}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            
            
            if (response.status === 200) {
                toast.success('Product updated successfully!')
                // getAllProducts()
            }

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }


    }


    // Edit new product
    const deleteProduct = async (productId: string) => {
        setDeleting(productId)
        try {
            const response = await axios.delete(`${baseUrl}/product/${adminId}/${productId}`)
            console.log(response);
            
            
            if (response.status === 200) {
                toast.success(response.data.message)
                // getAllProducts()
            }
            
        } catch (error) {
            console.log(error);
            
        } finally {
            setDeleting('')
        }
    }


    const value = {
        // getAllProducts,
        // getSingleProduct,
        handleOrder,
        getAllOrders,
        getProductsByCategory,
        addProduct,
        editProduct,
        deleteProduct,
        products,
        loading,
        loadingOrder,
        deleting
    }

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>

}

