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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormPrice {
  "1.4": number;
  2: number;
  4: number;
  8: number;
}


const AddProductForm = () => {
  const [formData, setFormData] = useState<Omit<ProductProps, "_id"> & { price: FormPrice }>({
    name: "",
    price: {
      1.4: 0,
      2: 0,
      4: 0,
      8: 0,
    },
    description: "",
    firstImage: null as unknown as File,
    secondImage: null as unknown as File,
    category: "",
  });

  const { addProduct, loading, categories } = useProductContext()

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   if (name.startsWith("price.")) {
  //     const priceKey = name.split(".")[1];
  //     setFormData((prev) => ({
  //       ...prev,
  //       price: {
  //         ...prev.price,
  //         [priceKey]: parseFloat(value) || 0,
  //       },
  //     }));
  //   } else {
  //     setFormData((prev) => ({ ...prev, [name]: value }));
  //   }
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("price.")) {
      const priceKey = name.replace("price.", "");
      setFormData((prev) => ({
        ...prev,
        price: {
          ...prev.price,
          [priceKey]: parseFloat(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

    const isPriceValid = Object.values(formData.price).every((p) => p > 0);
    if (!isPriceValid) {
      toast.error("Please enter valid prices for all fields.");
      return;
    }

    // Create a FormData object to handle file uploads
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price[1.4]", formData.price["1.4"].toString());
    data.append("price[2]", formData.price[2].toString());
    data.append("price[4]", formData.price[4].toString());
    data.append("price[8]", formData.price[8].toString());
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.firstImage) data.append("firstImage", formData.firstImage);
    if (formData.secondImage) data.append("secondImage", formData.secondImage);
    console.log(data);

    addProduct(data)
    setFormData({
      name: "",
      price: {
        1.4: 0,
        2: 0,
        4: 0,
        8: 0,
      },
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
          <h2>Prices</h2>
          <div className="flex my-2 items-center h-[35px] border">
            <Label className="bg-black text-white h-full flex items-center justify-center p-2">1.4 ltr</Label>
            <Input
              className="flex-1 h-full"
              name="price.1.4"
              value={formData.price[1.4] === 0 ? undefined : formData.price[1.4]}
              onChange={handleInputChange}
              placeholder="Price for 1.4 litre"
              type="number"
              required
            />
          </div>
          <div className="flex my-2 items-center h-[35px] border">
            <Label className="bg-black text-white h-full flex items-center justify-center p-2">2 ltrs</Label>
            <Input
              className="flex-1 h-full"
              name="price.2"
              value={formData.price[2] === 0 ? undefined : formData.price[2]}
              onChange={handleInputChange}
              placeholder="Price for 2 litres"
              type="number"
              required
            />
          </div>
          <div className="flex my-2 items-center h-[35px] border">
            <Label className="bg-black text-white h-full flex items-center justify-center p-2">4 ltrs</Label>
            <Input
              className="flex-1 h-full"
              name="price.4"
              value={formData.price[4] === 0 ? undefined : formData.price[4]}
              onChange={handleInputChange}
              placeholder="Price for 4 litres"
              type="number"
              required
            />
          </div>
          <div className="flex my-2 items-center h-[35px] border">
            <Label className="bg-black text-white h-full flex items-center justify-center p-2">8 ltrs</Label>
            <Input
              className="flex-1 h-full"
              name="price.8"
              value={formData.price[8] === 0 ? undefined : formData.price[8]}
              onChange={handleInputChange}
              placeholder="Price for 8 litres"
              type="number"
              required
            />
          </div>
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
            loading ?
              <Loader className="animate-spin" /> :
              <span>Add Product</span>
          }
        </Button>
      </form>
    </div>
  );
};

export default AddProductForm;
