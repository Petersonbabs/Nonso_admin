"use client";
import { useState } from "react";
import { ProductProps } from "@/contexts/ProductsContext"; // Adjust the path to where ProductProps is defined
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useProductContext } from "@/contexts/ProductsContext";
import { Loader } from "lucide-react";

const AddProductForm = () => {
  const [formData, setFormData] = useState<Omit<ProductProps, "_id">>({
    name: "",
    price: "",
    description: "",
    firstImage: null as unknown as File,
    secondImage: null as unknown as File,
    category: "",
  });
  const {addProduct, loading} = useProductContext()

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
    if (!formData.name || !formData.price || !formData.category || !formData.firstImage) {
      toast.error("Please fill in all required fields and upload an image.");
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
    console.log(data);
    
    addProduct(data)
    setFormData({
        name: "",
        price: "",
        description: "",
        firstImage: null as any,
        secondImage: null as any,
        category: "",
      });
    
  };

  return (
    <div className=" ">
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
          <Input
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Category"
            required
          />
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
          <Label>First Image</Label>
          <Input
            name="firstImage"
            type="file"
            onChange={handleFileChange}
            required
          />
        </div>

        <div>
          <Label>Second Image (optional)</Label>
          <Input
            name="secondImage"
            type="file"
            onChange={handleFileChange}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {
            loading?
            <Loader className="animate-spin"/> :
            <span>Add Product</span>
          }
        </Button>
      </form>
    </div>
  );
};

export default AddProductForm;
