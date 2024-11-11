"use client";
import { useState, useEffect } from "react";
import { ProductProps } from "@/contexts/ProductsContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useProductContext } from "@/contexts/ProductsContext";
import { Loader } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditProductFormProps {
    product: ProductProps;
}

const EditProductForm = ({ product }: EditProductFormProps) => {
    const [formData, setFormData] = useState<Omit<ProductProps, "_id">>({
        name: "",
        price: "",
        description: "",
        firstImage: null as unknown as File,
        secondImage: null as unknown as File,
        category: "",
    });
    const { editProduct, loading, categories } = useProductContext();

    // Load initial data from the passed product prop
    useEffect(() => {
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            firstImage: null as unknown as File, // Assume the current images are already on the server
            secondImage: null as unknown as File,
            category: product.category,
        });
    }, [product]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Form data validation
        if (!formData.name || !formData.price || !formData.category) {
            toast.error("Please fill in all required fields.");
            return;
        }

        // Create a FormData object to handle file uploads
        const data = new FormData();
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("description", formData.description);
        data.append("category", formData.category);
        if (formData.firstImage) data.append("firstImage", formData.firstImage);
        if (formData.secondImage) data.append("secondImage", formData.secondImage);

        editProduct(data, product._id);
    };

    return (
        <div>
            <Dialog>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Product Name"
                            required
                        />
                    </div>

                    <div>
                        <Label>Price</Label>
                        <Input
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Price"
                            type="number"
                            required
                        />
                    </div>

                    <div>
                        <Label>Category</Label>
                        <Select
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, category: value }))
                            }
                            value={formData.category}>
                            <SelectTrigger className="text-black">
                                <SelectValue placeholder="Choose category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {/* <SelectItem value="s">Select category</SelectItem> */}
                                    {
                                        categories.map(category => (
                                            <SelectItem value={category}>{category}</SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Product Description"
                        />
                    </div>

                    <div>
                        <Label>First Image (Upload new to replace current)</Label>
                        <Input
                            name="firstImage"
                            type="file"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div>
                        <Label>Second Image (Upload new to replace current)</Label>
                        <Input
                            name="secondImage"
                            type="file"
                            onChange={handleFileChange}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {
                            loading ? <Loader className="animate-spin" /> : <span>Update Product</span>
                        }
                    </Button>
                </form>
            </Dialog>
        </div>
    );
};

export default EditProductForm;
