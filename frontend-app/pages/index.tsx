"use client"

import { Button } from "@/components/ui/button"
import { input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import Link from "next/link"
import { TagsInput } from "react-tag-input-component"
import React, { useState } from "react"

type PresetType = {
  productType: string;
  attributes: string[];
}


export default function Component() {
  const [selected, setSelected] = useState([""]);
  const [productType, setProductType] = useState("");
  const [preset, setPreset] = useState("");

  const presets: Record<string, PresetType> = {
    "Sleek black watch": {
      productType: "Watch",
      attributes: ["sleek", "black", "39mm case", "stainless", "luxury", "alligator leather strap"],
    },
    "Flashy headphones": {
      productType: "Headphones",
      attributes: ["white", "headphones", "gold accent", "round ear cups", "leather cushions"],
    },
    "Diamond necklace": {
      productType: "Necklace",
      attributes: ["diamond", "gold", "accent", "chain necklace"],
    },
    "Custom": {
      productType: "",
      attributes: [],
    },
}

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
      const response = await fetch('https://localhost:8000/api/v1/generate-image', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attributes: selected,
          product: productType,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setImages(data['upscaled-images']);
    } catch (error) {
      console.error('Error:', error);
    }
  };



  return (
    <div className="flex flex-col h-screen w-screen bg-white dark:bg-zinc-900">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center space-x-4">
          <svg
            className=" h-8 w-8 text-zinc-900 dark:text-zinc-50"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Dream AI</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button size="icon" variant="ghost">
            <svg
              className=" h-5 w-5 text-zinc-500 dark:text-zinc-400"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="sr-only">View </span>
          </Button>
        </div>
      </nav>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 overflow-auto">
        <nav className="flex flex-col gap-4 p-4"><h2 className="text-lg font-semibold text-zinc-500 dark:text-zinc-400">Preset</h2>
        <Select>
    <SelectTrigger>
        <SelectValue placeholder={preset} />
    </SelectTrigger>
    <SelectContent>
        {Object.keys(presets).map((presetName) => (
            <SelectItem
                key={presetName}
                value={presetName}
                onClick={() => handlePresetChange(presetName)}
            >
                {presetName}
            </SelectItem>
        ))}
    </SelectContent>
</Select>
  
    <h2 className="text-lg font-semibold text-zinc-500 dark:text-zinc-400">Product Type</h2>
    <input
      value={productType} // Reflect the productType value
      onChange={(e) => setProductType(e.target.value)} // Allow user to modify the input
      placeholder="Enter Product Type"
      className="border border-zinc-500 rounded p-2 w-full text-zinc-500 dark:text-zinc-400 dark:border-zinc-400 bg-white dark:bg-gray-800"
    />

    <div> 
      <h2 className="text-lg font-semibold text-zinc-500 dark:text-zinc-400">Product Attributes</h2>
      <div> 
        <TagsInput 
          value={selected} 
          onChange={setSelected}
          name="tags"
          placeHolder="Enter Product Attributes"
          className="mb-4 mt-4" 
        />
        <Button className="mt-4 w-full" onClick={handleSubmit}>Generate</Button> {/* Added onClick handler */}
      </div> 
    </div>
    </nav>

        </aside>
        <main className="flex-1 overflow-auto p-4">
          {/* Add this section to display the images */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Upscaled ${index + 1}`}
                  className="rounded-lg"
                />
              ))}
            </div>
          )}
        </main>
      </div>
      <footer className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Made with ❤️ by Dan, Sydney, & Abdullah.</p>
        
      </footer>
    </div>
  )
}
