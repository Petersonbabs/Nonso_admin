"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TableHeader } from "@/components/ui/table"; // Assume ShadCN has custom table components
import { Button } from "@/components/ui/button";
import { ChevronDown, Edit, Loader2, Plus, Trash } from "lucide-react"; // Icons for edit and delete actions
import { useProductContext } from "@/contexts/ProductsContext";
import AddProductForm from "./components/forms/AddProduct";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EditProductForm from "./components/forms/EditProductForm";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectLabel, SelectValue } from "@radix-ui/react-select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


const AllProducts = () => {
    const { getAllProducts, products, loading, deleting, deleteProduct, getProductsByCategory, addCategory, loadingCategory, getAllCategories, categories } = useProductContext()
    const [newCategory, setNewCategory] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    // Fetch products from an API with pagination
    useEffect(() => {
        getAllCategories()
    }, [])
    useEffect(() => {
        getAllProducts();
    }, [currentPage]);

    useEffect(() => {
        if (products) {
            setTotalPages(Math.ceil(products.length / itemsPerPage));
        }
    }, [products]);
    const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



    const handleCategoryCall = (category: string) => {
        if (category == 'all') {
            getAllProducts()
            return
        }
        getProductsByCategory(category)
    }


    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex mb-4 justify-between">
                <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
                <Dialog>
                    <DialogTrigger>
                        <Button>Add new product</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg mx-auto h-[90vh]">
                        <DialogTitle>Add new product</DialogTitle>
                        <AddProductForm />
                    </DialogContent>
                </Dialog>
            </div>

            <section className="my-4 text-black flex gap-2 items-center">
                <Popover>
                    <PopoverTrigger className="bg-black text-white p-1">
                        <Plus />
                    </PopoverTrigger>
                    <PopoverContent className="ml-4">
                        <form className="flex gap-2" onSubmit={(e) => {
                            e.preventDefault()
                            addCategory(newCategory)
                        }}>
                            <Input placeholder="New category name" onChange={(e) => {
                                setNewCategory(e.target.value)
                            }} />
                            <Button>
                                {
                                    loadingCategory ?
                                        <Loader2 className="animate-spin" /> :
                                        <span>Add</span>
                                }
                            </Button>
                        </form>
                    </PopoverContent>
                </Popover>

                <Select onValueChange={handleCategoryCall}>
                    <SelectTrigger className="w-[180px] bg-black text-white">
                        <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="all">All Categories</SelectItem>
                            {
                                categories.map(category => (
                                    <SelectItem value={category}>{category}</SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </section>


            {
                loading ?
                    <div className="h-[50vh] m-auto flex justify-center items-center">
                        <Loader2 className="size-20 animate-spin font-semibold" />
                    </div>
                    :
                    <>
                        {
                            paginatedProducts.length === 0 ?
                                <section className="text-gray-500 h-[50vh] text-lg border flex items-center justify-center">
                                    <h1>No result.</h1>
                                </section>
                                :
                                <Table className="w-full border border-gray-200">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="font-semibold">Product Name</TableHead>
                                            <TableHead className="font-semibold">Price</TableHead>
                                            <TableHead className="font-semibold">Category</TableHead>
                                            <TableHead className="font-semibold text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedProducts.slice().reverse().map((product) => (
                                            <TableRow key={product._id} className="hover:bg-gray-100 text-gray-700">
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger className="flex items-center text-[#f4533e]">
                                                            <span>₦{Number(product?.price["1.4"]).toLocaleString()}</span>
                                                            <ChevronDown className="size-4 text-[#f4533e]"/>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem className="flex items-center p-0 border">
                                                                <span className="bg-black text-white p-1">1.4 ltr</span>
                                                                <span>₦{Number(product?.price["1.4"]).toLocaleString()}</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center p-0 border">
                                                                <span className="bg-black text-white p-1">2 ltrs</span>
                                                                <span>₦{Number(product?.price[2]).toLocaleString()}</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center p-0 border">
                                                                <span className="bg-black text-white p-1">4 ltrs</span>
                                                                <span>₦{Number(product?.price[4]).toLocaleString()}</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center p-0 border">
                                                                <span className="bg-black text-white p-1">8 ltrs</span>
                                                                <span>₦{Number(product?.price[8]).toLocaleString()}</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                                <TableCell>{product.category}</TableCell>
                                                <TableCell className="flex justify-center space-x-4">
                                                    <Dialog >
                                                        <DialogTrigger>
                                                            <Edit className="w-4 h-4" />
                                                        </DialogTrigger>
                                                        <DialogContent className="h-[90vh] ">
                                                            <DialogTitle>Edit Product</DialogTitle>
                                                            <EditProductForm product={product} />
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Button onClick={() => deleteProduct(product._id)} variant="outline" size="sm">
                                                        {
                                                            deleting == product._id ?
                                                                <Loader2 className="animate-spin" /> :
                                                                <Trash className="w-4 h-4 text-red-500" />
                                                        }
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
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
                                </Table>
                        }
                    </>
            }


        </div>
    );
};

export default AllProducts;
