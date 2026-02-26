import { useReveal } from "@/hooks/use-reveal"
import { useState, useMemo } from "react"
import Icon from "@/components/ui/icon"

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
interface Part {
  value: string
  label: string
  price: number
  socket?: string
  brand?: string
  memory?: number
  freq?: number
  watt?: number
}

// ──────────────────────────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────────────────────────
const socketOptions = ["AM4", "AM5", "LGA1200", "LGA1700", "LGA1851"]

const cpuOptionsDefault: Part[] = [
  // AM4
  { value: "r3-3100",    label: "AMD Ryzen 3 3100",         price: 6500,  socket: "AM4", brand: "AMD" },
  { value: "r5-3600",    label: "AMD Ryzen 5 3600",         price: 8500,  socket: "AM4", brand: "AMD" },
  { value: "r5-5600",    label: "AMD Ryzen 5 5600",         price: 11500, socket: "AM4", brand: "AMD" },
  { value: "r5-5600x",   label: "AMD Ryzen 5 5600X",        price: 13500, socket: "AM4", brand: "AMD" },
  { value: "r7-5700x",   label: "AMD Ryzen 7 5700X",        price: 16500, socket: "AM4", brand: "AMD" },
  { value: "r7-5800x",   label: "AMD Ryzen 7 5800X",        price: 21000, socket: "AM4", brand: "AMD" },
  { value: "r9-5900x",   label: "AMD Ryzen 9 5900X",        price: 25500, socket: "AM4", brand: "AMD" },
  { value: "r9-5950x",   label: "AMD Ryzen 9 5950X",        price: 36000, socket: "AM4", brand: "AMD" },
  // AM5
  { value: "r5-7600",    label: "AMD Ryzen 5 7600",         price: 16500, socket: "AM5", brand: "AMD" },
  { value: "r5-7600x",   label: "AMD Ryzen 5 7600X",        price: 20000, socket: "AM5", brand: "AMD" },
  { value: "r7-7700",    label: "AMD Ryzen 7 7700",         price: 23500, socket: "AM5", brand: "AMD" },
  { value: "r7-7700x",   label: "AMD Ryzen 7 7700X",        price: 28000, socket: "AM5", brand: "AMD" },
  { value: "r7-7800x3d", label: "AMD Ryzen 7 7800X3D",      price: 36500, socket: "AM5", brand: "AMD" },
  { value: "r9-7900x",   label: "AMD Ryzen 9 7900X",        price: 40000, socket: "AM5", brand: "AMD" },
  { value: "r9-7950x",   label: "AMD Ryzen 9 7950X",        price: 65000, socket: "AM5", brand: "AMD" },
  { value: "r9-9900x",   label: "AMD Ryzen 9 9900X",        price: 52000, socket: "AM5", brand: "AMD" },
  { value: "r9-9950x",   label: "AMD Ryzen 9 9950X",        price: 76000, socket: "AM5", brand: "AMD" },
  // LGA1200
  { value: "i3-10100f",  label: "Intel Core i3-10100F",     price: 5500,  socket: "LGA1200", brand: "Intel" },
  { value: "i5-10400f",  label: "Intel Core i5-10400F",     price: 8500,  socket: "LGA1200", brand: "Intel" },
  { value: "i5-10600k",  label: "Intel Core i5-10600K",     price: 11500, socket: "LGA1200", brand: "Intel" },
  { value: "i7-10700f",  label: "Intel Core i7-10700F",     price: 14000, socket: "LGA1200", brand: "Intel" },
  { value: "i7-10700k",  label: "Intel Core i7-10700K",     price: 17500, socket: "LGA1200", brand: "Intel" },
  { value: "i9-10900k",  label: "Intel Core i9-10900K",     price: 23000, socket: "LGA1200", brand: "Intel" },
  { value: "i5-11400f",  label: "Intel Core i5-11400F",     price: 9500,  socket: "LGA1200", brand: "Intel" },
  { value: "i7-11700f",  label: "Intel Core i7-11700F",     price: 15500, socket: "LGA1200", brand: "Intel" },
  // LGA1700
  { value: "i3-12100f",  label: "Intel Core i3-12100F",     price: 8500,  socket: "LGA1700", brand: "Intel" },
  { value: "i5-12400f",  label: "Intel Core i5-12400F",     price: 12500, socket: "LGA1700", brand: "Intel" },
  { value: "i5-12600k",  label: "Intel Core i5-12600K",     price: 15500, socket: "LGA1700", brand: "Intel" },
  { value: "i5-13400f",  label: "Intel Core i5-13400F",     price: 17500, socket: "LGA1700", brand: "Intel" },
  { value: "i5-13600k",  label: "Intel Core i5-13600K",     price: 21500, socket: "LGA1700", brand: "Intel" },
  { value: "i7-12700f",  label: "Intel Core i7-12700F",     price: 19500, socket: "LGA1700", brand: "Intel" },
  { value: "i7-13700f",  label: "Intel Core i7-13700F",     price: 26500, socket: "LGA1700", brand: "Intel" },
  { value: "i7-13700k",  label: "Intel Core i7-13700K",     price: 33000, socket: "LGA1700", brand: "Intel" },
  { value: "i9-12900k",  label: "Intel Core i9-12900K",     price: 37000, socket: "LGA1700", brand: "Intel" },
  { value: "i9-13900k",  label: "Intel Core i9-13900K",     price: 48000, socket: "LGA1700", brand: "Intel" },
  // LGA1851
  { value: "i5-14400f",  label: "Intel Core i5-14400F",     price: 19500, socket: "LGA1851", brand: "Intel" },
  { value: "i5-14600k",  label: "Intel Core i5-14600K",     price: 25000, socket: "LGA1851", brand: "Intel" },
  { value: "i7-14700f",  label: "Intel Core i7-14700F",     price: 31000, socket: "LGA1851", brand: "Intel" },
  { value: "i7-14700k",  label: "Intel Core i7-14700K",     price: 38500, socket: "LGA1851", brand: "Intel" },
  { value: "i9-14900k",  label: "Intel Core i9-14900K",     price: 54000, socket: "LGA1851", brand: "Intel" },
  { value: "i5-arrow",   label: "Intel Core Ultra 5 245K",  price: 29000, socket: "LGA1851", brand: "Intel" },
  { value: "i7-arrow",   label: "Intel Core Ultra 7 265K",  price: 40000, socket: "LGA1851", brand: "Intel" },
  { value: "i9-arrow",   label: "Intel Core Ultra 9 285K",  price: 60000, socket: "LGA1851", brand: "Intel" },
]

const mbOptionsDefault: Part[] = [
  // AM4
  { value: "am4-matx-b450m-ds3h",  label: "Gigabyte B450M DS3H (mATX)",             price: 7000,  socket: "AM4", brand: "Gigabyte" },
  { value: "am4-matx-b450m-pro",   label: "ASUS PRIME B450M-A II (mATX)",           price: 8000,  socket: "AM4", brand: "ASUS" },
  { value: "am4-matx-b550m-pro",   label: "MSI PRO B550M-P GEN3 (mATX)",            price: 9000,  socket: "AM4", brand: "MSI" },
  { value: "am4-atx-b550-tomahawk",label: "MSI MAG B550 TOMAHAWK (ATX)",            price: 13500, socket: "AM4", brand: "MSI" },
  { value: "am4-atx-x570-pro",     label: "ASUS PRIME X570-PRO (ATX)",              price: 17500, socket: "AM4", brand: "ASUS" },
  { value: "am4-atx-x570-elite",   label: "Gigabyte X570 AORUS ELITE (ATX)",        price: 21500, socket: "AM4", brand: "Gigabyte" },
  { value: "am4-itx-b550i",        label: "ASUS ROG STRIX B550-I GAMING (Mini-ITX)",price: 15500, socket: "AM4", brand: "ASUS" },
  // AM5
  { value: "am5-matx-b650m-k",     label: "ASUS PRIME B650M-K (mATX)",              price: 11500, socket: "AM5", brand: "ASUS" },
  { value: "am5-matx-b650m-plus",  label: "MSI PRO B650M-A WiFi (mATX)",            price: 13500, socket: "AM5", brand: "MSI" },
  { value: "am5-atx-b650-gaming",  label: "Gigabyte B650 GAMING X AX (ATX)",        price: 16000, socket: "AM5", brand: "Gigabyte" },
  { value: "am5-atx-b650e-aorus",  label: "Gigabyte B650E AORUS PRO AX (ATX)",      price: 21500, socket: "AM5", brand: "Gigabyte" },
  { value: "am5-atx-x670-pro",     label: "ASUS ROG STRIX X670E-F GAMING (ATX)",    price: 35000, socket: "AM5", brand: "ASUS" },
  { value: "am5-atx-x670e-aorus",  label: "Gigabyte X670E AORUS MASTER (ATX)",      price: 44000, socket: "AM5", brand: "Gigabyte" },
  // LGA1200
  { value: "1200-matx-h410m",      label: "Gigabyte H410M DS2V (mATX)",              price: 5500,  socket: "LGA1200", brand: "Gigabyte" },
  { value: "1200-matx-b460m",      label: "Gigabyte B460M DS3H (mATX)",              price: 7000,  socket: "LGA1200", brand: "Gigabyte" },
  { value: "1200-matx-b560m-pro",  label: "MSI PRO B560M-P (mATX)",                 price: 8500,  socket: "LGA1200", brand: "MSI" },
  { value: "1200-atx-z490-tuf",    label: "ASUS TUF GAMING Z490-PLUS (ATX)",        price: 13500, socket: "LGA1200", brand: "ASUS" },
  { value: "1200-atx-z590-aorus",  label: "Gigabyte Z590 AORUS ELITE (ATX)",        price: 17500, socket: "LGA1200", brand: "Gigabyte" },
  // LGA1700
  { value: "1700-matx-b660m-pro",  label: "MSI PRO B660M-A DDR4 (mATX)",            price: 9000,  socket: "LGA1700", brand: "MSI" },
  { value: "1700-matx-b760m-pro",  label: "MSI PRO B760M-P (mATX)",                 price: 11000, socket: "LGA1700", brand: "MSI" },
  { value: "1700-matx-b760m-asus", label: "ASUS PRIME B760M-A DDR5 (mATX)",         price: 12500, socket: "LGA1700", brand: "ASUS" },
  { value: "1700-atx-b760-gaming", label: "MSI MAG B760 TOMAHAWK WiFi (ATX)",       price: 16500, socket: "LGA1700", brand: "MSI" },
  { value: "1700-atx-z790-tomahawk",label: "MSI MAG Z790 TOMAHAWK WiFi (ATX)",      price: 27000, socket: "LGA1700", brand: "MSI" },
  { value: "1700-atx-z790-rog",    label: "ASUS ROG STRIX Z790-F GAMING WiFi (ATX)",price: 37000, socket: "LGA1700", brand: "ASUS" },
  // LGA1851
  { value: "1851-matx-z890m-pro",  label: "MSI PRO Z890-P WiFi (mATX)",             price: 19500, socket: "LGA1851", brand: "MSI" },
  { value: "1851-atx-z890-tomahawk",label: "MSI MAG Z890 TOMAHAWK WiFi (ATX)",      price: 27500, socket: "LGA1851", brand: "MSI" },
  { value: "1851-atx-z890-tuf",    label: "ASUS TUF GAMING Z890-PLUS WiFi (ATX)",   price: 31000, socket: "LGA1851", brand: "ASUS" },
  { value: "1851-atx-z890-aorus",  label: "Gigabyte Z890 AORUS MASTER (ATX)",       price: 44000, socket: "LGA1851", brand: "Gigabyte" },
]

const gpuOptionsDefault: Part[] = [
  // RTX 30 серия
  { value: "rtx3050",      label: "NVIDIA RTX 3050 8GB",             price: 19500,  brand: "NVIDIA", memory: 8 },
  { value: "rtx3060",      label: "NVIDIA RTX 3060 12GB",            price: 26000,  brand: "NVIDIA", memory: 12 },
  { value: "rtx3060ti",    label: "NVIDIA RTX 3060 Ti 8GB",          price: 30000,  brand: "NVIDIA", memory: 8 },
  { value: "rtx3070",      label: "NVIDIA RTX 3070 8GB",             price: 36000,  brand: "NVIDIA", memory: 8 },
  { value: "rtx3070ti",    label: "NVIDIA RTX 3070 Ti 8GB",          price: 42000,  brand: "NVIDIA", memory: 8 },
  { value: "rtx3080",      label: "NVIDIA RTX 3080 10GB",            price: 52000,  brand: "NVIDIA", memory: 10 },
  { value: "rtx3090",      label: "NVIDIA RTX 3090 24GB",            price: 72000,  brand: "NVIDIA", memory: 24 },
  // RTX 40 серия
  { value: "rtx4060",      label: "NVIDIA RTX 4060 8GB",             price: 34000,  brand: "NVIDIA", memory: 8 },
  { value: "rtx4060ti",    label: "NVIDIA RTX 4060 Ti 8GB",          price: 42000,  brand: "NVIDIA", memory: 8 },
  { value: "rtx4060ti16",  label: "NVIDIA RTX 4060 Ti 16GB",         price: 50000,  brand: "NVIDIA", memory: 16 },
  { value: "rtx4070",      label: "NVIDIA RTX 4070 12GB",            price: 56000,  brand: "NVIDIA", memory: 12 },
  { value: "rtx4070s",     label: "NVIDIA RTX 4070 Super 12GB",      price: 63000,  brand: "NVIDIA", memory: 12 },
  { value: "rtx4070ti",    label: "NVIDIA RTX 4070 Ti 12GB",         price: 72000,  brand: "NVIDIA", memory: 12 },
  { value: "rtx4070tis",   label: "NVIDIA RTX 4070 Ti Super 16GB",   price: 82000,  brand: "NVIDIA", memory: 16 },
  { value: "rtx4080",      label: "NVIDIA RTX 4080 16GB",            price: 97000,  brand: "NVIDIA", memory: 16 },
  { value: "rtx4090",      label: "NVIDIA RTX 4090 24GB",            price: 170000, brand: "NVIDIA", memory: 24 },
  // RTX 50 серия
  { value: "rtx5070",      label: "NVIDIA RTX 5070 12GB",            price: 78000,  brand: "NVIDIA", memory: 12 },
  { value: "rtx5070ti",    label: "NVIDIA RTX 5070 Ti 16GB",         price: 98000,  brand: "NVIDIA", memory: 16 },
  { value: "rtx5080",      label: "NVIDIA RTX 5080 16GB",            price: 130000, brand: "NVIDIA", memory: 16 },
  { value: "rtx5090",      label: "NVIDIA RTX 5090 32GB",            price: 275000, brand: "NVIDIA", memory: 32 },
  // RX 6xxx
  { value: "rx6600",       label: "AMD RX 6600 8GB",                 price: 16500,  brand: "AMD", memory: 8 },
  { value: "rx6600xt",     label: "AMD RX 6600 XT 8GB",              price: 20000,  brand: "AMD", memory: 8 },
  { value: "rx6700xt",     label: "AMD RX 6700 XT 12GB",             price: 29500,  brand: "AMD", memory: 12 },
  { value: "rx6800xt",     label: "AMD RX 6800 XT 16GB",             price: 47500,  brand: "AMD", memory: 16 },
  { value: "rx6900xt",     label: "AMD RX 6900 XT 16GB",             price: 55000,  brand: "AMD", memory: 16 },
  // RX 7xxx
  { value: "rx7600",       label: "AMD RX 7600 8GB",                 price: 25500,  brand: "AMD", memory: 8 },
  { value: "rx7700xt",     label: "AMD RX 7700 XT 12GB",             price: 37500,  brand: "AMD", memory: 12 },
  { value: "rx7800xt",     label: "AMD RX 7800 XT 16GB",             price: 46500,  brand: "AMD", memory: 16 },
  { value: "rx7900gre",    label: "AMD RX 7900 GRE 16GB",            price: 52000,  brand: "AMD", memory: 16 },
  { value: "rx7900xt",     label: "AMD RX 7900 XT 20GB",             price: 67000,  brand: "AMD", memory: 20 },
  { value: "rx7900xtx",    label: "AMD RX 7900 XTX 24GB",            price: 82000,  brand: "AMD", memory: 24 },
  { value: "rx9070",       label: "AMD RX 9070 16GB",                price: 62000,  brand: "AMD", memory: 16 },
  { value: "rx9070xt",     label: "AMD RX 9070 XT 16GB",             price: 70000,  brand: "AMD", memory: 16 },
]

const ramOptionsDefault: Part[] = [
  // DDR4
  { value: "ddr4-8-kingston",    label: "8 ГБ DDR4-3200 Kingston Fury Beast",       price: 2200,  brand: "Kingston", memory: 8,  freq: 3200 },
  { value: "ddr4-8-corsair",     label: "8 ГБ DDR4-3200 Corsair Vengeance LPX",    price: 2500,  brand: "Corsair",  memory: 8,  freq: 3200 },
  { value: "ddr4-16-kingston",   label: "16 ГБ DDR4-3200 Kingston Fury Beast",      price: 4000,  brand: "Kingston", memory: 16, freq: 3200 },
  { value: "ddr4-16-corsair",    label: "16 ГБ DDR4-3200 Corsair Vengeance LPX",   price: 4500,  brand: "Corsair",  memory: 16, freq: 3200 },
  { value: "ddr4-16-gskill",     label: "16 ГБ DDR4-3600 G.Skill Ripjaws V",       price: 5000,  brand: "G.Skill",  memory: 16, freq: 3600 },
  { value: "ddr4-32-kingston",   label: "32 ГБ DDR4-3200 Kingston Fury Beast 2×16",price: 7800,  brand: "Kingston", memory: 32, freq: 3200 },
  { value: "ddr4-32-corsair",    label: "32 ГБ DDR4-3200 Corsair Vengeance 2×16",  price: 8800,  brand: "Corsair",  memory: 32, freq: 3200 },
  { value: "ddr4-32-gskill",     label: "32 ГБ DDR4-3600 G.Skill Ripjaws V 2×16", price: 9500,  brand: "G.Skill",  memory: 32, freq: 3600 },
  { value: "ddr4-64-kingston",   label: "64 ГБ DDR4-3200 Kingston Fury Beast 4×16",price: 15500, brand: "Kingston", memory: 64, freq: 3200 },
  // DDR5
  { value: "ddr5-16-kingston",   label: "16 ГБ DDR5-4800 Kingston Fury Beast",      price: 5000,  brand: "Kingston", memory: 16, freq: 4800 },
  { value: "ddr5-16-corsair",    label: "16 ГБ DDR5-5200 Corsair Vengeance",        price: 6000,  brand: "Corsair",  memory: 16, freq: 5200 },
  { value: "ddr5-32-kingston",   label: "32 ГБ DDR5-4800 Kingston Fury Beast 2×16",price: 9500,  brand: "Kingston", memory: 32, freq: 4800 },
  { value: "ddr5-32-corsair",    label: "32 ГБ DDR5-5600 Corsair Vengeance 2×16",  price: 11500, brand: "Corsair",  memory: 32, freq: 5600 },
  { value: "ddr5-32-gskill",     label: "32 ГБ DDR5-5600 G.Skill Ripjaws S5 2×16", price: 11000, brand: "G.Skill",  memory: 32, freq: 5600 },
  { value: "ddr5-32-gskill-tz",  label: "32 ГБ DDR5-6000 G.Skill Trident Z5 2×16", price: 14500, brand: "G.Skill",  memory: 32, freq: 6000 },
  { value: "ddr5-64-kingston",   label: "64 ГБ DDR5-4800 Kingston Fury Beast 2×32",price: 19000, brand: "Kingston", memory: 64, freq: 4800 },
  { value: "ddr5-64-gskill",     label: "64 ГБ DDR5-6000 G.Skill Trident Z5 2×32", price: 28000, brand: "G.Skill",  memory: 64, freq: 6000 },
  { value: "ddr5-96-gskill",     label: "96 ГБ DDR5-6000 G.Skill Trident Z5 2×48", price: 42000, brand: "G.Skill",  memory: 96, freq: 6000 },
]

const storageOptionsDefault: Part[] = [
  // Samsung
  { value: "sam870-500",   label: "Samsung 870 EVO 500GB SATA",          price: 5500,  brand: "Samsung", memory: 500 },
  { value: "sam870-1t",    label: "Samsung 870 EVO 1TB SATA",             price: 8500,  brand: "Samsung", memory: 1000 },
  { value: "sam870-2t",    label: "Samsung 870 EVO 2TB SATA",             price: 16500, brand: "Samsung", memory: 2000 },
  { value: "sam980p-1t",   label: "Samsung 980 PRO 1TB NVMe PCIe4",       price: 9500,  brand: "Samsung", memory: 1000 },
  { value: "sam980p-2t",   label: "Samsung 980 PRO 2TB NVMe PCIe4",       price: 17500, brand: "Samsung", memory: 2000 },
  { value: "sam990p-1t",   label: "Samsung 990 PRO 1TB NVMe PCIe4",       price: 9000,  brand: "Samsung", memory: 1000 },
  { value: "sam990p-2t",   label: "Samsung 990 PRO 2TB NVMe PCIe4",       price: 16000, brand: "Samsung", memory: 2000 },
  { value: "sam990p-4t",   label: "Samsung 990 PRO 4TB NVMe PCIe4",       price: 32000, brand: "Samsung", memory: 4000 },
  // WD
  { value: "wd-blue-1t",   label: "WD Blue SN580 1TB NVMe PCIe4",         price: 7500,  brand: "WD", memory: 1000 },
  { value: "wd-blue-2t",   label: "WD Blue SN580 2TB NVMe PCIe4",         price: 12500, brand: "WD", memory: 2000 },
  { value: "wd-black-1t",  label: "WD Black SN850X 1TB NVMe PCIe4",       price: 12500, brand: "WD", memory: 1000 },
  { value: "wd-black-2t",  label: "WD Black SN850X 2TB NVMe PCIe4",       price: 22000, brand: "WD", memory: 2000 },
  // Kingston
  { value: "kn-nv2-500",   label: "Kingston NV2 500GB NVMe PCIe4",         price: 3500,  brand: "Kingston", memory: 500 },
  { value: "kn-nv2-1t",    label: "Kingston NV2 1TB NVMe PCIe4",           price: 6000,  brand: "Kingston", memory: 1000 },
  { value: "kn-nv2-2t",    label: "Kingston NV2 2TB NVMe PCIe4",           price: 10000, brand: "Kingston", memory: 2000 },
  { value: "kn-kc3000-1t", label: "Kingston KC3000 1TB NVMe PCIe4",        price: 9000,  brand: "Kingston", memory: 1000 },
  // Crucial
  { value: "cr-p3-1t",     label: "Crucial P3 1TB NVMe PCIe3",             price: 5500,  brand: "Crucial", memory: 1000 },
  { value: "cr-p3-2t",     label: "Crucial P3 2TB NVMe PCIe3",             price: 9500,  brand: "Crucial", memory: 2000 },
  { value: "cr-p5p-1t",    label: "Crucial P5 Plus 1TB NVMe PCIe4",        price: 8000,  brand: "Crucial", memory: 1000 },
  { value: "cr-mx500-500", label: "Crucial MX500 500GB SATA",               price: 4500,  brand: "Crucial", memory: 500 },
  { value: "cr-mx500-1t",  label: "Crucial MX500 1TB SATA",                 price: 7000,  brand: "Crucial", memory: 1000 },
  // Seagate
  { value: "sg-f-1t",      label: "Seagate FireCuda 530 1TB NVMe PCIe4",   price: 10000, brand: "Seagate", memory: 1000 },
  { value: "sg-f-2t",      label: "Seagate FireCuda 530 2TB NVMe PCIe4",   price: 18000, brand: "Seagate", memory: 2000 },
  // ADATA
  { value: "ad-s70-1t",    label: "ADATA XPG S70 Blade 1TB NVMe PCIe4",   price: 8500,  brand: "ADATA", memory: 1000 },
  { value: "ad-s70-2t",    label: "ADATA XPG S70 Blade 2TB NVMe PCIe4",   price: 15000, brand: "ADATA", memory: 2000 },
]

const psuOptionsDefault: Part[] = [
  { value: "dp-pq550d",    label: "Deepcool PQ550D 550W 80+ Bronze",        price: 3500,  brand: "Deepcool", watt: 550 },
  { value: "dp-pq650d",    label: "Deepcool PQ650D 650W 80+ Bronze",        price: 4500,  brand: "Deepcool", watt: 650 },
  { value: "dp-pq650m",    label: "Deepcool PQ650M 650W 80+ Gold",          price: 6500,  brand: "Deepcool", watt: 650 },
  { value: "dp-pq750m",    label: "Deepcool PQ750M 750W 80+ Gold",          price: 8000,  brand: "Deepcool", watt: 750 },
  { value: "dp-pq850m",    label: "Deepcool PQ850M 850W 80+ Gold",          price: 9500,  brand: "Deepcool", watt: 850 },
  { value: "ss-s12-500",   label: "Seasonic S12III 500W 80+ Bronze",        price: 4000,  brand: "Seasonic", watt: 500 },
  { value: "ss-gx-650",    label: "Seasonic Focus GX-650 650W 80+ Gold",    price: 8000,  brand: "Seasonic", watt: 650 },
  { value: "ss-gx-750",    label: "Seasonic Focus GX-750 750W 80+ Gold",    price: 9500,  brand: "Seasonic", watt: 750 },
  { value: "ss-gx-850",    label: "Seasonic Focus GX-850 850W 80+ Gold",    price: 11500, brand: "Seasonic", watt: 850 },
  { value: "bq-sys500",    label: "be quiet! System Power 10 500W Bronze",  price: 3800,  brand: "be quiet!", watt: 500 },
  { value: "bq-pp12-550",  label: "be quiet! Pure Power 12M 550W 80+ Gold", price: 7000,  brand: "be quiet!", watt: 550 },
  { value: "bq-pp12-750",  label: "be quiet! Pure Power 12M 750W 80+ Gold", price: 9800,  brand: "be quiet!", watt: 750 },
  { value: "bq-pp12-850",  label: "be quiet! Pure Power 12M 850W 80+ Gold", price: 11800, brand: "be quiet!", watt: 850 },
  { value: "cs-rm550",     label: "Corsair RM550 550W 80+ Gold",             price: 7000,  brand: "Corsair", watt: 550 },
  { value: "cs-rm650",     label: "Corsair RM650 650W 80+ Gold",             price: 8500,  brand: "Corsair", watt: 650 },
  { value: "cs-rm750",     label: "Corsair RM750 750W 80+ Gold",             price: 10500, brand: "Corsair", watt: 750 },
  { value: "cs-rm850",     label: "Corsair RM850x 850W 80+ Gold",            price: 13500, brand: "Corsair", watt: 850 },
  { value: "cs-rm1000",    label: "Corsair RM1000x 1000W 80+ Gold",          price: 16500, brand: "Corsair", watt: 1000 },
  { value: "msi-a650",     label: "MSI MAG A650BN 650W 80+ Bronze",          price: 4800,  brand: "MSI", watt: 650 },
  { value: "msi-a750",     label: "MSI MAG A750GL 750W 80+ Gold",            price: 8500,  brand: "MSI", watt: 750 },
  { value: "as-tuf-650",   label: "ASUS TUF Gaming 650W 80+ Bronze",         price: 6500,  brand: "ASUS", watt: 650 },
  { value: "as-tuf-850",   label: "ASUS TUF Gaming 850W 80+ Gold",           price: 11500, brand: "ASUS", watt: 850 },
]

const caseOptionsDefault: Part[] = [
  { value: "matx-deepcool-40",  label: "Deepcool MATREXX 40 (mATX)",                 price: 3200,  brand: "Deepcool" },
  { value: "atx-deepcool-cc560",label: "Deepcool CC560 (ATX)",                       price: 5000,  brand: "Deepcool" },
  { value: "atx-deepcool-ch510",label: "Deepcool CH510 (ATX)",                       price: 5500,  brand: "Deepcool" },
  { value: "atx-deepcool-ch560",label: "Deepcool CH560 Mesh (ATX)",                  price: 8000,  brand: "Deepcool" },
  { value: "atx-bequiet-500dx", label: "be quiet! Pure Base 500DX (ATX)",            price: 9000,  brand: "be quiet!" },
  { value: "atx-bequiet-600dx", label: "be quiet! Pure Base 600DX (ATX)",            price: 13500, brand: "be quiet!" },
  { value: "atx-bequiet-dark",  label: "be quiet! Dark Base 700 (ATX)",              price: 17500, brand: "be quiet!" },
  { value: "atx-fractal-pop",   label: "Fractal Design Pop Air (ATX)",               price: 10000, brand: "Fractal" },
  { value: "atx-fractal-north", label: "Fractal Design North (ATX)",                 price: 14500, brand: "Fractal" },
  { value: "atx-fractal-meshify",label:"Fractal Design Meshify 2 (ATX)",             price: 16500, brand: "Fractal" },
  { value: "atx-nzxt-h5-flow",  label: "NZXT H5 Flow (ATX)",                        price: 10500, brand: "NZXT" },
  { value: "atx-nzxt-h7-flow",  label: "NZXT H7 Flow (ATX)",                        price: 15500, brand: "NZXT" },
  { value: "atx-corsair-4000d", label: "Corsair 4000D Airflow (ATX)",                price: 9500,  brand: "Corsair" },
  { value: "atx-corsair-5000d", label: "Corsair 5000D Airflow (ATX)",                price: 13500, brand: "Corsair" },
  { value: "atx-lian-205",      label: "Lian Li LANCOOL 205 (ATX)",                  price: 7500,  brand: "Lian Li" },
  { value: "atx-lian-216",      label: "Lian Li LANCOOL 216 (ATX)",                  price: 11500, brand: "Lian Li" },
  { value: "atx-lian-o11d",     label: "Lian Li O11 Dynamic EVO (ATX/E-ATX)",        price: 17500, brand: "Lian Li" },
  { value: "atx-phanteks-p400a",label: "Phanteks Eclipse P400A (ATX)",               price: 8500,  brand: "Phanteks" },
  { value: "atx-cooler-td500",  label: "Cooler Master TD500 Mesh V2 (ATX)",          price: 8500,  brand: "Cooler Master" },
  { value: "atx-msi-mag-forge", label: "MSI MAG FORGE 111R (ATX)",                   price: 6000,  brand: "MSI" },
]

const coolerOptionsDefault: Part[] = [
  { value: "box",    label: "Боксовый кулер (в комплекте с CPU)", price: 0,    brand: "Боксовый" },
  { value: "dc1",    label: "Deepcool AG400 (башня 120мм)",        price: 2800, brand: "Deepcool" },
  { value: "be1",    label: "be quiet! Pure Rock 2 (башня 120мм)", price: 4200, brand: "be quiet!" },
  { value: "dc2",    label: "Deepcool AG620 (двойная башня 2×120мм)",price: 5200, brand: "Deepcool" },
  { value: "aio240", label: "Deepcool LT240 (СЖО 240мм)",          price: 8000, brand: "Deepcool" },
  { value: "aio360", label: "Deepcool LT360 (СЖО 360мм)",          price: 12000, brand: "Deepcool" },
]

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
type CategoryKey = "cpu" | "mb" | "gpu" | "ram" | "storage" | "psu" | "case" | "cooler"

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  cpu: "Процессор",
  mb: "Материнская плата",
  gpu: "Видеокарта",
  ram: "Оперативная память",
  storage: "Накопитель",
  psu: "Блок питания",
  case: "Корпус",
  cooler: "Охлаждение CPU",
}

interface FilterState {
  brand: string
  memory: string
  freq: string
  watt: string
  priceMin: string
  priceMax: string
}

const emptyFilter = (): FilterState => ({
  brand: "", memory: "", freq: "", watt: "", priceMin: "", priceMax: "",
})

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────
export function ConfiguratorSection({ scrollToSection }: { scrollToSection: (i: number) => void }) {
  const { ref, isVisible } = useReveal(0.2)

  // Selection state
  const [socket, setSocket] = useState("")
  const [selections, setSelections] = useState<Record<CategoryKey, string>>({
    cpu: "", mb: "", gpu: "", ram: "", storage: "", psu: "", case: "", cooler: "",
  })

  // Parts state (editable)
  const [cpuOptions, setCpuOptions] = useState<Part[]>(cpuOptionsDefault)
  const [mbOptions, setMbOptions] = useState<Part[]>(mbOptionsDefault)
  const [gpuOptions, setGpuOptions] = useState<Part[]>(gpuOptionsDefault)
  const [ramOptions, setRamOptions] = useState<Part[]>(ramOptionsDefault)
  const [storageOptions, setStorageOptions] = useState<Part[]>(storageOptionsDefault)
  const [psuOptions, setPsuOptions] = useState<Part[]>(psuOptionsDefault)
  const [caseOptions, setCaseOptions] = useState<Part[]>(caseOptionsDefault)
  const [coolerOptions, setCoolerOptions] = useState<Part[]>(coolerOptionsDefault)

  const allParts: Record<CategoryKey, { options: Part[]; set: (p: Part[]) => void }> = {
    cpu:     { options: cpuOptions,     set: setCpuOptions },
    mb:      { options: mbOptions,      set: setMbOptions },
    gpu:     { options: gpuOptions,     set: setGpuOptions },
    ram:     { options: ramOptions,     set: setRamOptions },
    storage: { options: storageOptions, set: setStorageOptions },
    psu:     { options: psuOptions,     set: setPsuOptions },
    case:    { options: caseOptions,    set: setCaseOptions },
    cooler:  { options: coolerOptions,  set: setCoolerOptions },
  }

  // UI state
  const [activeTab, setActiveTab] = useState<"build" | "manage">("build")
  const [manageCategory, setManageCategory] = useState<CategoryKey>("cpu")
  const [filters, setFilters] = useState<FilterState>(emptyFilter())
  const [editingPart, setEditingPart] = useState<{ cat: CategoryKey; value: string } | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [addForm, setAddForm] = useState<{ cat: CategoryKey } | null>(null)
  const [addLabel, setAddLabel] = useState("")
  const [addPrice, setAddPrice] = useState("")

  const assemblyPrice = 5000

  // Filtered options for build tab
  const filteredCpu = socket ? cpuOptions.filter(o => o.socket === socket) : cpuOptions
  const filteredMb  = socket ? mbOptions.filter(o => o.socket === socket)  : mbOptions

  // Current category options for manage tab
  const { options: catOptions, set: setCatOptions } = allParts[manageCategory]

  const filteredManageOptions = useMemo(() => {
    return catOptions.filter(o => {
      if (filters.brand && o.brand !== filters.brand) return false
      if (filters.memory && o.memory !== Number(filters.memory)) return false
      if (filters.freq && o.freq !== Number(filters.freq)) return false
      if (filters.watt && o.watt !== Number(filters.watt)) return false
      if (filters.priceMin && o.price < Number(filters.priceMin)) return false
      if (filters.priceMax && o.price > Number(filters.priceMax)) return false
      return true
    })
  }, [catOptions, filters])

  const brands = useMemo(() => uniq(catOptions.map(o => o.brand).filter(Boolean) as string[]).sort(), [catOptions])
  const memories = useMemo(() => uniq(catOptions.map(o => o.memory).filter(Boolean) as number[]).sort((a,b)=>a-b), [catOptions])
  const freqs = useMemo(() => uniq(catOptions.map(o => o.freq).filter(Boolean) as number[]).sort((a,b)=>a-b), [catOptions])
  const watts = useMemo(() => uniq(catOptions.map(o => o.watt).filter(Boolean) as number[]).sort((a,b)=>a-b), [catOptions])

  const hasMemFilter = ["ram","storage","gpu"].includes(manageCategory)
  const hasFreqFilter = manageCategory === "ram"
  const hasWattFilter = manageCategory === "psu"

  // Totals
  const getPrice = (cat: CategoryKey) => {
    const opts = allParts[cat].options
    return opts.find(o => o.value === selections[cat])?.price ?? 0
  }
  const total = assemblyPrice + (Object.keys(selections) as CategoryKey[]).reduce((s, k) => s + getPrice(k), 0)

  const breakdown = [
    { label: "Сборка и тестирование", price: assemblyPrice },
    ...(Object.keys(selections) as CategoryKey[]).flatMap(k => {
      const v = selections[k]
      if (!v) return []
      const part = allParts[k].options.find(o => o.value === v)
      if (!part || part.price === 0) return []
      return [{ label: part.label, price: part.price }]
    }),
  ]

  const selectedCpu = filteredCpu.find(o => o.value === selections.cpu)
  const selectedMb  = filteredMb.find(o => o.value === selections.mb)
  const socketMismatch = selectedCpu?.socket && selectedMb?.socket && selectedCpu.socket !== selectedMb.socket

  // Handlers
  const startEdit = (cat: CategoryKey, part: Part) => {
    setEditingPart({ cat, value: part.value })
    setEditLabel(part.label)
    setEditPrice(String(part.price))
  }

  const saveEdit = () => {
    if (!editingPart) return
    const { cat, value } = editingPart
    const { options, set } = allParts[cat]
    set(options.map(o => o.value === value ? { ...o, label: editLabel, price: Number(editPrice) || 0 } : o))
    setEditingPart(null)
  }

  const deletePart = (cat: CategoryKey, value: string) => {
    const { options, set } = allParts[cat]
    set(options.filter(o => o.value !== value))
    if (selections[cat] === value) setSelections(s => ({ ...s, [cat]: "" }))
  }

  const saveAdd = () => {
    if (!addForm || !addLabel.trim()) return
    const { options, set } = allParts[addForm.cat]
    const newVal = `custom-${Date.now()}`
    set([...options, { value: newVal, label: addLabel.trim(), price: Number(addPrice) || 0, brand: "Другое" }])
    setAddLabel("")
    setAddPrice("")
    setAddForm(null)
  }

  const selectClass = "w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2.5 font-sans text-sm text-foreground backdrop-blur-sm transition-all duration-200 focus:border-foreground/50 focus:outline-none hover:border-foreground/35 appearance-none cursor-pointer"

  const inputClass = "w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 font-sans text-sm text-foreground placeholder-foreground/30 focus:border-foreground/50 focus:outline-none"

  const filterInputClass = "rounded-md border border-foreground/15 bg-foreground/5 px-2 py-1.5 font-mono text-xs text-foreground placeholder-foreground/30 focus:border-foreground/40 focus:outline-none w-full"

  return (
    <section
      ref={ref}
      className="flex w-screen shrink-0 snap-start flex-col justify-start px-4 pt-16 pb-8 md:px-12 md:pt-12 lg:px-16 overflow-y-auto h-screen"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div
          className={`mb-5 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}
        >
          <p className="mb-1 font-mono text-xs text-foreground/60">/ Конфигуратор</p>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <h2 className="font-sans text-3xl font-light leading-[1.05] tracking-tight text-foreground md:text-5xl">
              Собери свой ПК онлайн
            </h2>
            {/* Tabs */}
            <div className="flex rounded-lg border border-foreground/20 overflow-hidden">
              <button
                onClick={() => setActiveTab("build")}
                className={`px-4 py-2 font-mono text-xs transition-colors ${activeTab === "build" ? "bg-foreground/15 text-foreground" : "text-foreground/50 hover:text-foreground/80"}`}
              >
                Сборка
              </button>
              <button
                onClick={() => setActiveTab("manage")}
                className={`px-4 py-2 font-mono text-xs transition-colors border-l border-foreground/20 ${activeTab === "manage" ? "bg-foreground/15 text-foreground" : "text-foreground/50 hover:text-foreground/80"}`}
              >
                Управление
              </button>
            </div>
          </div>
        </div>

        {/* ── BUILD TAB ───────────────────────────────────────────────────── */}
        {activeTab === "build" && (
          <div
            className={`grid gap-4 md:grid-cols-[1fr_320px] transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
            style={{ transitionDelay: "150ms" }}
          >
            {/* Left: selectors */}
            <div className="flex flex-col gap-2">
              {/* Socket */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs text-foreground/50">Сокет (платформа)</label>
                <select
                  className={selectClass}
                  value={socket}
                  onChange={e => { setSocket(e.target.value); setSelections(s => ({ ...s, cpu: "", mb: "" })) }}
                  style={{ background: "#0d0d1a" }}
                >
                  <option value="" style={{ background: "#0d0d1a" }}>Все платформы</option>
                  {socketOptions.map(s => (
                    <option key={s} value={s} style={{ background: "#0d0d1a" }}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Component selects */}
              {([
                { key: "cpu" as CategoryKey,     label: "Процессор",         opts: filteredCpu },
                { key: "mb" as CategoryKey,      label: "Материнская плата", opts: filteredMb },
                { key: "gpu" as CategoryKey,     label: "Видеокарта",        opts: gpuOptions },
                { key: "ram" as CategoryKey,     label: "Оперативная память",opts: ramOptions },
                { key: "storage" as CategoryKey, label: "Накопитель",        opts: storageOptions },
                { key: "psu" as CategoryKey,     label: "Блок питания",      opts: psuOptions },
                { key: "case" as CategoryKey,    label: "Корпус",            opts: caseOptions },
                { key: "cooler" as CategoryKey,  label: "Охлаждение CPU",    opts: coolerOptions },
              ] as const).map(({ key, label, opts }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="font-mono text-xs text-foreground/50">{label}</label>
                  <select
                    className={selectClass}
                    value={selections[key]}
                    onChange={e => setSelections(s => ({ ...s, [key]: e.target.value }))}
                    style={{ background: "#0d0d1a" }}
                  >
                    <option value="" style={{ background: "#0d0d1a" }}>Выберите {label.toLowerCase()}</option>
                    {opts.map(o => (
                      <option key={o.value} value={o.value} style={{ background: "#0d0d1a" }}>
                        {o.label}{o.price > 0 ? ` — ${o.price.toLocaleString("ru")} ₽` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Right: summary */}
            <div className="flex flex-col gap-3 sticky top-0">
              <div className="flex flex-col rounded-xl border border-foreground/15 bg-foreground/5 p-4 backdrop-blur-sm">
                <p className="mb-1 font-mono text-xs text-foreground/50">Итоговая стоимость</p>
                <div className="flex items-end gap-2 mb-1">
                  <span className="font-sans text-4xl font-light text-foreground">{total.toLocaleString("ru")}</span>
                  <span className="mb-1 font-sans text-xl text-foreground/60">₽</span>
                </div>
                <p className="font-mono text-[10px] text-foreground/40 mb-3">Включает сборку, тестирование и гарантию</p>

                <div className="space-y-1.5 border-t border-foreground/10 pt-2 max-h-[30vh] overflow-y-auto">
                  {breakdown.map((item, i) => (
                    <div key={i} className="flex justify-between gap-2">
                      <span className="font-mono text-[10px] text-foreground/50 truncate">{item.label}</span>
                      <span className="font-mono text-[10px] text-foreground/70 shrink-0">{item.price.toLocaleString("ru")} ₽</span>
                    </div>
                  ))}
                </div>
              </div>

              {socketMismatch && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2.5">
                  <span className="text-red-400 shrink-0 text-sm">⚠</span>
                  <p className="font-mono text-[10px] text-red-400">
                    Несовместимые сокеты: CPU {selectedCpu?.socket} ≠ MB {selectedMb?.socket}
                  </p>
                </div>
              )}

              <button
                onClick={() => scrollToSection(6)}
                className="w-full rounded-xl bg-foreground px-6 py-3 font-sans text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                Оформить заказ
              </button>
            </div>
          </div>
        )}

        {/* ── MANAGE TAB ──────────────────────────────────────────────────── */}
        {activeTab === "manage" && (
          <div className={`transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`} style={{ transitionDelay: "150ms" }}>
            {/* Category selector */}
            <div className="mb-4 flex flex-wrap gap-2">
              {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map(k => (
                <button
                  key={k}
                  onClick={() => { setManageCategory(k); setFilters(emptyFilter()); setEditingPart(null); setAddForm(null) }}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-colors ${manageCategory === k ? "bg-foreground/20 text-foreground border border-foreground/40" : "border border-foreground/15 text-foreground/50 hover:text-foreground/80 hover:border-foreground/30"}`}
                >
                  {CATEGORY_LABELS[k]}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6 rounded-xl border border-foreground/10 bg-foreground/3 p-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Производитель</label>
                <select className={filterInputClass} value={filters.brand} onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))} style={{ background: "#0d0d1a" }}>
                  <option value="" style={{ background: "#0d0d1a" }}>Все</option>
                  {brands.map(b => <option key={b} value={b} style={{ background: "#0d0d1a" }}>{b}</option>)}
                </select>
              </div>
              {hasMemFilter && (
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Память (ГБ)</label>
                  <select className={filterInputClass} value={filters.memory} onChange={e => setFilters(f => ({ ...f, memory: e.target.value }))} style={{ background: "#0d0d1a" }}>
                    <option value="" style={{ background: "#0d0d1a" }}>Любая</option>
                    {memories.map(m => <option key={m} value={m} style={{ background: "#0d0d1a" }}>{manageCategory === "storage" ? m >= 1000 ? `${m/1000} ТБ` : `${m} ГБ` : `${m} ГБ`}</option>)}
                  </select>
                </div>
              )}
              {hasFreqFilter && (
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Частота МГц</label>
                  <select className={filterInputClass} value={filters.freq} onChange={e => setFilters(f => ({ ...f, freq: e.target.value }))} style={{ background: "#0d0d1a" }}>
                    <option value="" style={{ background: "#0d0d1a" }}>Любая</option>
                    {freqs.map(f => <option key={f} value={f} style={{ background: "#0d0d1a" }}>{f} МГц</option>)}
                  </select>
                </div>
              )}
              {hasWattFilter && (
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Мощность</label>
                  <select className={filterInputClass} value={filters.watt} onChange={e => setFilters(f => ({ ...f, watt: e.target.value }))} style={{ background: "#0d0d1a" }}>
                    <option value="" style={{ background: "#0d0d1a" }}>Любая</option>
                    {watts.map(w => <option key={w} value={w} style={{ background: "#0d0d1a" }}>{w}W</option>)}
                  </select>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Цена от ₽</label>
                <input type="number" className={filterInputClass} placeholder="0" value={filters.priceMin} onChange={e => setFilters(f => ({ ...f, priceMin: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Цена до ₽</label>
                <input type="number" className={filterInputClass} placeholder="∞" value={filters.priceMax} onChange={e => setFilters(f => ({ ...f, priceMax: e.target.value }))} />
              </div>
              <div className="flex items-end">
                <button onClick={() => setFilters(emptyFilter())} className="w-full rounded-md border border-foreground/15 px-2 py-1.5 font-mono text-[10px] text-foreground/50 hover:text-foreground/80 hover:border-foreground/30 transition-colors">
                  Сбросить
                </button>
              </div>
            </div>

            {/* Parts list */}
            <div className="rounded-xl border border-foreground/15 bg-foreground/5 overflow-hidden max-h-[45vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-foreground/10 backdrop-blur-sm">
                  <tr>
                    <th className="px-3 py-2 text-left font-mono text-[10px] text-foreground/50 uppercase tracking-wider">Название</th>
                    <th className="px-3 py-2 text-right font-mono text-[10px] text-foreground/50 uppercase tracking-wider w-28">Цена, ₽</th>
                    <th className="px-3 py-2 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredManageOptions.map(part => (
                    <tr key={part.value} className="border-t border-foreground/8 hover:bg-foreground/5 transition-colors">
                      {editingPart?.cat === manageCategory && editingPart.value === part.value ? (
                        <>
                          <td className="px-3 py-1.5">
                            <input className={inputClass} value={editLabel} onChange={e => setEditLabel(e.target.value)} />
                          </td>
                          <td className="px-3 py-1.5">
                            <input type="number" className={`${inputClass} text-right`} value={editPrice} onChange={e => setEditPrice(e.target.value)} />
                          </td>
                          <td className="px-3 py-1.5 flex gap-1 justify-end">
                            <button onClick={saveEdit} className="rounded px-2 py-1 bg-foreground/20 text-foreground font-mono text-[10px] hover:bg-foreground/30 transition-colors">OK</button>
                            <button onClick={() => setEditingPart(null)} className="rounded px-2 py-1 border border-foreground/20 text-foreground/50 font-mono text-[10px] hover:text-foreground/80 transition-colors">✕</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-2 font-sans text-xs text-foreground/80 truncate max-w-[350px]">{part.label}</td>
                          <td className="px-3 py-2 text-right font-mono text-xs text-foreground/70">{part.price.toLocaleString("ru")}</td>
                          <td className="px-3 py-2">
                            <div className="flex gap-1 justify-end">
                              <button onClick={() => startEdit(manageCategory, part)} className="p-1 text-foreground/40 hover:text-foreground/80 transition-colors" title="Редактировать">
                                <Icon name="Pencil" size={12} />
                              </button>
                              <button onClick={() => deletePart(manageCategory, part.value)} className="p-1 text-foreground/40 hover:text-red-400 transition-colors" title="Удалить">
                                <Icon name="Trash2" size={12} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {filteredManageOptions.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-3 py-6 text-center font-mono text-xs text-foreground/30">Нет позиций по фильтру</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add new part */}
            <div className="mt-3">
              {addForm?.cat === manageCategory ? (
                <div className="flex gap-2 items-end flex-wrap rounded-xl border border-foreground/15 bg-foreground/5 p-3">
                  <div className="flex-1 min-w-[180px] flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Название</label>
                    <input className={inputClass} placeholder="Название компонента" value={addLabel} onChange={e => setAddLabel(e.target.value)} />
                  </div>
                  <div className="w-32 flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Цена, ₽</label>
                    <input type="number" className={inputClass} placeholder="0" value={addPrice} onChange={e => setAddPrice(e.target.value)} />
                  </div>
                  <button onClick={saveAdd} className="h-9 px-4 rounded-lg bg-foreground text-background font-mono text-xs hover:opacity-80 transition-opacity">Добавить</button>
                  <button onClick={() => setAddForm(null)} className="h-9 px-3 rounded-lg border border-foreground/20 text-foreground/50 font-mono text-xs hover:text-foreground/80 transition-colors">Отмена</button>
                </div>
              ) : (
                <button
                  onClick={() => { setAddForm({ cat: manageCategory }); setAddLabel(""); setAddPrice("") }}
                  className="flex items-center gap-2 rounded-xl border border-dashed border-foreground/20 px-4 py-2.5 font-mono text-xs text-foreground/50 hover:text-foreground/80 hover:border-foreground/35 transition-colors w-full justify-center"
                >
                  <Icon name="Plus" size={12} />
                  Добавить позицию в «{CATEGORY_LABELS[manageCategory]}»
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
