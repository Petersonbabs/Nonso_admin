import { ReactNode, createContext, useContext, useState } from "react";
import axios from 'axios'
import { toast } from "sonner";
import { useAuthContext } from "./AuthContext";
import { useRouter } from "next/navigation";

export interface ProductProps {
    _id: string;
    name: string;
    price: {
        1.4: number,
        2:number,
        4:number,
        8:number,
    };
    description: string;
    firstImage: File;
    secondImage: File;
    category: string;
}

interface ProductContextType {
    getAllProducts: () => void
    getAllCategories: () => void
    getSingleProduct: (productId: string) => void
    getProductsByCategory: (categoryName: string) => void
    categories: string[];
    addCategory: (name: string) => void
    addProduct: (data: FormData) => void
    editProduct: (data: FormData, productId: string) => void
    deleteProduct: (productId: string) => void
    products: ProductProps[]
    loading: boolean
    loadingCategory: boolean
    deleting: string
}

const ProductContext = createContext<ProductContextType | null>(null)
export const useProductContext = () => {
    const context = useContext(ProductContext)
    if (!context) {
        throw new Error('Product context must be in a context provider!')
    }
    return context as ProductContextType
}

export default function ProductProvider({ children }: { children: ReactNode }) {
    const { adminId } = useAuthContext()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const [products, setProducts] = useState<ProductProps[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingCategory, setLoadingCategory] = useState(false)
    const [deleting, setDeleting] = useState('')

    // getAllProducts
    const getAllProducts = async () => {
        
        
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
    const getSingleProduct = async (productId: string) => {


    }

    const getAllCategories = async () => {
        setLoading(true);
        try {
            const response = await axios(`${baseUrl}/category`)
            const { allCategory } = await response.data
            setCategories(allCategory.map((item: any) => item.name));

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const addCategory = async (name: string) => {
        setLoadingCategory(true)
        try {
            const response = await axios.post(`${baseUrl}/category/${adminId}`, { name })
            if (response.status === 200) {
                toast.success(response.data.message)
                // getAllCategories()
            }

        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message)
        } finally {
            setLoadingCategory(false)
        }
    }

    // get products by category
    const getProductsByCategory = async (categoryName: string) => {
        setLoading(true)
        try {
            const response = await axios(`${baseUrl}/product/category/${categoryName}`)
            const data = await response.data
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
            console.log(response);
            
            if (response.status === 200) {
                toast.success(response.data.message)
                getAllProducts()
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
                getAllProducts()
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
                getAllProducts()
            }

        } catch (error) {
            console.log(error);

        } finally {
            setDeleting('')
        }
    }


    const value = {
        getAllProducts,
        getSingleProduct,
        getProductsByCategory,
        addCategory,
        getAllCategories,
        categories,
        addProduct,
        editProduct,
        deleteProduct,
        products,
        loading,
        loadingCategory,
        deleting
    }

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>

}



