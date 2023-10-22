"use client";

import { Button } from "@/components/ui/button";
import { input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import Link from "next/link";
import { TagsInput } from "react-tag-input-component";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import React, { useState } from "react";
import { Download } from "lucide-react";

type PresetType = {
  productType: string;
  attributes: string[];
};

export default function Component() {
  const [selected, setSelected] = useState([
    "sleek",
    "black",
    "39mm case",
    "stainless",
    "luxury",
    "alligator leather strap",
  ]);
  const [productType, setProductType] = useState("watch");
  const [preset, setPreset] = useState("Sleek black watch");
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  const presets: Record<string, PresetType> = {
    "Sleek black watch": {
      productType: "Watch",
      attributes: [
        "sleek",
        "black",
        "39mm case",
        "stainless",
        "luxury",
        "alligator leather strap",
      ],
    },
    "Flashy headphones": {
      productType: "Headphones",
      attributes: [
        "white",
        "headphones",
        "gold accent",
        "round ear cups",
        "leather cushions",
      ],
    },
    "Diamond necklace": {
      productType: "Necklace",
      attributes: ["diamond", "gold", "accent", "chain necklace"],
    },
    Custom: {
      productType: "",
      attributes: [],
    },
  };

  const handlePresetChange = (selectedPreset: keyof typeof presets) => {
    if (presets[selectedPreset]) {
      setPreset(selectedPreset);
      setProductType(presets[selectedPreset].productType);
      setSelected(presets[selectedPreset].attributes);
    }
  };

  const [images, setImages] = useState<string[]>([]); // New state to hold the image URLs

  const handleSubmit = async () => {
    try {
      setIsLoadingImages(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/generate-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attributes: selected,
            product: productType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      setImages(data["upscaled-images"]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoadingImages(false); // Set loading to false when done (either on success or failure)
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white dark:bg-zinc-900">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-cloud-moon"
          >
            <path d="M13 16a3 3 0 1 1 0 6H7a5 5 0 1 1 4.9-6Z" />
            <path d="M10.1 9A6 6 0 0 1 16 4a4.24 4.24 0 0 0 6 6 6 6 0 0 1-3 5.197" />
          </svg>

          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Dream AI
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button size="icon" variant="ghost">
            {/* <svg
              className=" h-5 w-5 text-zinc-500 dark:text-zinc-400"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsb3VkLW1vb24iPjxwYXRoIGQ9Ik0xMyAxNmEzIDMgMCAxIDEgMCA2SDdhNSA1IDAgMSAxIDQuOS02WiIvPjxwYXRoIGQ9Ik0xMC4xIDlBNiA2IDAgMCAxIDE2IDRhNC4yNCA0LjI0IDAgMCAwIDYgNiA2IDYgMCAwIDEtMyA1LjE5NyIvPjwvc3ZnPg=="
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg> */}
            <span className="sr-only">View </span>
          </Button>
        </div>
      </nav>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 overflow-auto">
          <nav className="flex flex-col gap-4 p-4">
            <h2 className="text-lg font-semibold text-zinc-500 dark:text-zinc-400">
              Preset
            </h2>
            <Select
              onValueChange={(presetValue) => handlePresetChange(presetValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder={preset} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(presets).map((presetName) => (
                  <SelectItem key={presetName} value={presetName}>
                    {presetName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <h2 className="text-lg font-semibold text-zinc-500 dark:text-zinc-400">
              Product Type
            </h2>
            <input
              value={productType} // Reflect the productType value
              onChange={(e) => setProductType(e.target.value)} // Allow user to modify the input
              placeholder="Enter Product Type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0"
            />

            <div>
              <h2 className="text-lg font-semibold text-zinc-500 dark:text-zinc-400">
                Product Attributes
              </h2>
              <div className="product-label-box">
                <TagsInput
                  value={selected}
                  onChange={setSelected}
                  name="tags"
                  placeHolder="Attributes"
                  className="mb-4 mt-4"
                />
                <Button className="mt-4 w-full" onClick={handleSubmit}>
                  Generate
                </Button>{" "}
                {/* Added onClick handler */}
              </div>
            </div>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-4">
          {" "}
          {/* Add this section to display the images */}
          {isLoadingImages ? (
            <div className="grid grid-cols-2 gap-4">
              <Skeleton height={400} className="my-2" count={2} />
              <Skeleton height={400} className="my-2" count={2} />
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {images.map((image, index) => (
                <div key={index} className="flex flex-col items-start">
                  <img
                    src={image}
                    alt={`Upscaled ${index + 1}`}
                    className="rounded-lg mb-2"
                  />
                  <a
                    href={image}
                    target="_blank"
                    download={`Upscaled_${index + 1}.png`}
                    className="flex items-center justify-between px-4 py-2 bg-white text-black rounded-lg border border-gray-800"
                  >
                    <span className="text-sm mr-2">Download</span> {/* Added a span around the text and added mr-2 for right margin */}
                    <Download className="w-4 h-5" /> {/* Adjusted the size using w-5 and h-5 */}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p></p>
          )}
        </main>
      </div>
      <footer className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Made with ❤️ by Dan, Sydney, & Abdullah</p>

      </footer>
    </div>
  );
}
