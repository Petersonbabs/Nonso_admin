import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
interface UserProps {
    name?: string;
    email: string;
    password: string;
    remeberMe?: string;
    role?: string;
}

interface AuthContextType {
    login: (data: UserProps) => void
    loading: boolean
    adminId: string
}

const AuthContext = createContext<AuthContextType | null>(null)
export const useAuthContext = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('Auth context must be in a context provider!')
    }
    return context as AuthContextType
}

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(false)
    const [adminId, setAdminId] = useState<string>('')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const navigation = useRouter()
    console.log(adminId);
    

    useEffect(()=>{
        const id = localStorage.getItem('adminId')
        setAdminId(id as string)
    })
    
   
    // LOGIN
    const login = async (dataForm: UserProps) => {
        setLoading(true)
        console.log('logging in...');
        
        try {
            const response = await axios.post(`${baseUrl}/admin/login`, dataForm as AxiosRequestConfig)
            console.log(response);
            const data = (await response).data
            if((await response).status == 200){
                toast.success('Login successful')
                localStorage.setItem('adminId', data.findAdmin._id)
                setAdminId(data.findAdmin._id)
                navigation.push('/dashboard')
            }
        } catch (error: any) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    const value = {
        login,
        loading,
        adminId
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}

