import { useReveal } from "@/hooks/use-reveal"
import { useState, useMemo } from "react"
import Icon from "@/components/ui/icon"

const SEND_CONFIG_URL = "https://functions.poehali.dev/86675a14-a4c9-40d6-8d10-cb2be1369846"

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
  ramType?: "DDR4" | "DDR5"
  tdp?: number
  url?: string
}

// ──────────────────────────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────────────────────────
const socketOptions = ["AM4", "AM5", "LGA1200", "LGA1700", "LGA1851"]

const cpuOptionsDefault: Part[] = [
  // AM4
  { value: "r3-3100",    label: "AMD Ryzen 3 3100",         price: 6500,  socket: "AM4", brand: "AMD",   tdp: 65,  url: "https://www.amd.com/ru/products/processors/desktops/ryzen/3000-series/amd-ryzen-3-3100.html" },
  { value: "r5-3600",    label: "AMD Ryzen 5 3600",         price: 8500,  socket: "AM4", brand: "AMD",   tdp: 65,  url: "https://www.amd.com/ru/products/processors/desktops/ryzen/3000-series/amd-ryzen-5-3600.html" },
  { value: "r5-5600",    label: "AMD Ryzen 5 5600",         price: 11500, socket: "AM4", brand: "AMD",   tdp: 65,  url: "https://www.amd.com/ru/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600.html" },
  { value: "r5-5600x",   label: "AMD Ryzen 5 5600X",        price: 13500, socket: "AM4", brand: "AMD",   tdp: 95,  url: "https://www.amd.com/ru/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600x.html" },
  { value: "r7-5700x",   label: "AMD Ryzen 7 5700X",        price: 16500, socket: "AM4", brand: "AMD",   tdp: 105, url: "https://www.amd.com/ru/products/processors/desktops/ryzen/5000-series/amd-ryzen-7-5700x.html" },
  { value: "r7-5800x",   label: "AMD Ryzen 7 5800X",        price: 21000, socket: "AM4", brand: "AMD",   tdp: 105, url: "https://www.amd.com/ru/products/processors/desktops/ryzen/5000-series/amd-ryzen-7-5800x.html" },
  { value: "r9-5900x",   label: "AMD Ryzen 9 5900X",        price: 25500, socket: "AM4", brand: "AMD",   tdp: 105, url: "https://www.amd.com/ru/products/processors/desktops/ryzen/5000-series/amd-ryzen-9-5900x.html" },
  { value: "r9-5950x",   label: "AMD Ryzen 9 5950X",        price: 36000, socket: "AM4", brand: "AMD",   tdp: 105, url: "https://www.amd.com/ru/products/processors/desktops/ryzen/5000-series/amd-ryzen-9-5950x.html" },
  // AM5
  { value: "r5-7600",    label: "AMD Ryzen 5 7600",         price: 16500, socket: "AM5", brand: "AMD",   tdp: 65,  url: "https://www.amd.com/ru/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7600.html" },
  { value: "r5-7600x",   label: "AMD Ryzen 5 7600X",        price: 20000, socket: "AM5", brand: "AMD",   tdp: 105, url: "https://www.amd.com/ru/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7600x.html" },
  { value: "r7-7700",    label: "AMD Ryzen 7 7700",         price: 23500, socket: "AM5", brand: "AMD",   tdp: 65,  url: "https://www.amd.com/ru/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7700.html" },
  { value: "r7-7700x",   label: "AMD Ryzen 7 7700X",        price: 28000, socket: "AM5", brand: "AMD",   tdp: 105, url: "https://www.amd.com/ru/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7700x.html" },
  { value: "r7-7800x3d", label: "AMD Ryzen 7 7800X3D",      price: 36500, socket: "AM5", brand: "AMD",   tdp: 120, url: "https://www.amd.com/ru/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7800x3d.html" },
  { value: "r9-7900x",   label: "AMD Ryzen 9 7900X",        price: 40000, socket: "AM5", brand: "AMD",   tdp: 170, url: "https://www.amd.com/ru/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7900x.html" },
  { value: "r9-7950x",   label: "AMD Ryzen 9 7950X",        price: 65000, socket: "AM5", brand: "AMD",   tdp: 170, url: "https://www.amd.com/ru/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7950x.html" },
  { value: "r9-9900x",   label: "AMD Ryzen 9 9900X",        price: 52000, socket: "AM5", brand: "AMD",   tdp: 120, url: "https://www.amd.com/ru/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9900x.html" },
  { value: "r9-9950x",   label: "AMD Ryzen 9 9950X",        price: 76000, socket: "AM5", brand: "AMD",   tdp: 170, url: "https://www.amd.com/ru/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x.html" },
  // LGA1200
  { value: "i3-10100f",  label: "Intel Core i3-10100F",     price: 5500,  socket: "LGA1200", brand: "Intel", tdp: 65,  url: "https://ark.intel.com/content/www/ru/ru/ark/products/212071/intel-core-i3-10100f-processor-6m-cache-up-to-4-30-ghz.html" },
  { value: "i5-10400f",  label: "Intel Core i5-10400F",     price: 8500,  socket: "LGA1200", brand: "Intel", tdp: 65,  url: "https://ark.intel.com/content/www/ru/ru/ark/products/212068/intel-core-i5-10400f-processor-12m-cache-up-to-4-30-ghz.html" },
  { value: "i5-10600k",  label: "Intel Core i5-10600K",     price: 11500, socket: "LGA1200", brand: "Intel", tdp: 125, url: "https://ark.intel.com/content/www/ru/ru/ark/products/199311/intel-core-i5-10600k-processor-12m-cache-up-to-4-80-ghz.html" },
  { value: "i7-10700f",  label: "Intel Core i7-10700F",     price: 14000, socket: "LGA1200", brand: "Intel", tdp: 65,  url: "https://ark.intel.com/content/www/ru/ru/ark/products/212065/intel-core-i7-10700f-processor-16m-cache-up-to-4-80-ghz.html" },
  { value: "i7-10700k",  label: "Intel Core i7-10700K",     price: 17500, socket: "LGA1200", brand: "Intel", tdp: 125, url: "https://ark.intel.com/content/www/ru/ru/ark/products/199325/intel-core-i7-10700k-processor-16m-cache-up-to-5-10-ghz.html" },
  { value: "i9-10900k",  label: "Intel Core i9-10900K",     price: 23000, socket: "LGA1200", brand: "Intel", tdp: 125, url: "https://ark.intel.com/content/www/ru/ru/ark/products/199332/intel-core-i9-10900k-processor-20m-cache-up-to-5-30-ghz.html" },
  { value: "i5-11400f",  label: "Intel Core i5-11400F",     price: 9500,  socket: "LGA1200", brand: "Intel", tdp: 65,  url: "https://ark.intel.com/content/www/ru/ru/ark/products/212060/intel-core-i5-11400f-processor-12m-cache-up-to-4-40-ghz.html" },
  { value: "i7-11700f",  label: "Intel Core i7-11700F",     price: 15500, socket: "LGA1200", brand: "Intel", tdp: 65,  url: "https://ark.intel.com/content/www/ru/ru/ark/products/212047/intel-core-i7-11700f-processor-16m-cache-up-to-4-90-ghz.html" },
  // LGA1700
  { value: "i3-12100f",  label: "Intel Core i3-12100F",     price: 8500,  socket: "LGA1700", brand: "Intel", tdp: 65,  url: "https://ark.intel.com/content/www/ru/ru/ark/products/223374/intel-core-i3-12100f-processor-12m-cache-up-to-4-30-ghz.html" },
  { value: "i5-12400f",  label: "Intel Core i5-12400F",     price: 12500, socket: "LGA1700", brand: "Intel", tdp: 65,  url: "https://ark.intel.com/content/www/ru/ru/ark/products/134591/intel-core-i5-12400f-processor-18m-cache-up-to-4-40-ghz.html" },
  { value: "i5-12600k",  label: "Intel Core i5-12600K",     price: 15500, socket: "LGA1700", brand: "Intel", tdp: 125, url: "https://ark.intel.com/content/www/ru/ru/ark/products/134589/intel-core-i5-12600k-processor-20m-cache-up-to-4-90-ghz.html" },
  { value: "i5-13400f",  label: "Intel Core i5-13400F",     price: 17500, socket: "LGA1700", brand: "Intel", tdp: 65,  url: "https://ark.intel.com/content/www/ru/ru/ark/products/230491/intel-core-i5-13400f-processor-20m-cache-up-to-4-60-ghz.html" },
  { value: "i5-13600k",  label: "Intel Core i5-13600K",     price: 21500, socket: "LGA1700", brand: "Intel", tdp: 125, url: "https://ark.intel.com/content/www/ru/ru/ark/products/230493/intel-core-i5-13600k-processor-24m-cache-up-to-5-10-ghz.html" },
  { value: "i7-12700f",  label: "Intel Core i7-12700F",     price: 19500, socket: "LGA1700", brand: "Intel", tdp: 65,  url: "https://ark.intel.com/content/www/ru/ru/ark/products/134591/intel-core-i7-12700f-processor-25m-cache-up-to-4-90-ghz.html" },
  { value: "i7-13700f",  label: "Intel Core i7-13700F",     price: 26500, socket: "LGA1700", brand: "Intel", tdp: 65,  url: "https://ark.intel.com/content/www/ru/ru/ark/products/230495/intel-core-i7-13700f-processor-30m-cache-up-to-5-20-ghz.html" },
  { value: "i7-13700k",  label: "Intel Core i7-13700K",     price: 33000, socket: "LGA1700", brand: "Intel", tdp: 125, url: "https://ark.intel.com/content/www/ru/ru/ark/products/230500/intel-core-i7-13700k-processor-30m-cache-up-to-5-40-ghz.html" },
  { value: "i9-12900k",  label: "Intel Core i9-12900K",     price: 37000, socket: "LGA1700", brand: "Intel", tdp: 125, url: "https://ark.intel.com/content/www/ru/ru/ark/products/134599/intel-core-i9-12900k-processor-30m-cache-up-to-5-20-ghz.html" },
  { value: "i9-13900k",  label: "Intel Core i9-13900K",     price: 48000, socket: "LGA1700", brand: "Intel", tdp: 125, url: "https://ark.intel.com/content/www/ru/ru/ark/products/230496/intel-core-i9-13900k-processor-36m-cache-up-to-5-80-ghz.html" },
  // LGA1851
  { value: "i5-14400f",  label: "Intel Core i5-14400F",     price: 19500, socket: "LGA1851", brand: "Intel", tdp: 65,  url: "https://ark.intel.com/content/www/ru/ru/ark/products/236789/intel-core-i5-14400f-processor-20m-cache-up-to-4-70-ghz.html" },
  { value: "i5-14600k",  label: "Intel Core i5-14600K",     price: 25000, socket: "LGA1851", brand: "Intel", tdp: 125, url: "https://ark.intel.com/content/www/ru/ru/ark/products/236787/intel-core-i5-14600k-processor-24m-cache-up-to-5-30-ghz.html" },
  { value: "i7-14700f",  label: "Intel Core i7-14700F",     price: 31000, socket: "LGA1851", brand: "Intel", tdp: 65,  url: "https://ark.intel.com/content/www/ru/ru/ark/products/236790/intel-core-i7-14700f-processor-33m-cache-up-to-5-30-ghz.html" },
  { value: "i7-14700k",  label: "Intel Core i7-14700K",     price: 38500, socket: "LGA1851", brand: "Intel", tdp: 125, url: "https://ark.intel.com/content/www/ru/ru/ark/products/236784/intel-core-i7-14700k-processor-33m-cache-up-to-5-60-ghz.html" },
  { value: "i9-14900k",  label: "Intel Core i9-14900K",     price: 54000, socket: "LGA1851", brand: "Intel", tdp: 125, url: "https://ark.intel.com/content/www/ru/ru/ark/products/236773/intel-core-i9-14900k-processor-36m-cache-up-to-6-00-ghz.html" },
  { value: "i5-arrow",   label: "Intel Core Ultra 5 245K",  price: 29000, socket: "LGA1851", brand: "Intel", tdp: 125, url: "https://ark.intel.com/content/www/ru/ru/ark/products/241894/intel-core-ultra-5-245k-processor-24m-cache-up-to-5-20-ghz.html" },
  { value: "i7-arrow",   label: "Intel Core Ultra 7 265K",  price: 40000, socket: "LGA1851", brand: "Intel", tdp: 125, url: "https://ark.intel.com/content/www/ru/ru/ark/products/241888/intel-core-ultra-7-265k-processor-30m-cache-up-to-5-50-ghz.html" },
  { value: "i9-arrow",   label: "Intel Core Ultra 9 285K",  price: 60000, socket: "LGA1851", brand: "Intel", tdp: 125, url: "https://ark.intel.com/content/www/ru/ru/ark/products/241875/intel-core-ultra-9-285k-processor-36m-cache-up-to-5-70-ghz.html" },
]

const mbOptionsDefault: Part[] = [
  // ══════════════════════════════════════════════════════
  // AM4 — DDR4
  // ══════════════════════════════════════════════════════
  // X570 (High-end)
  { value: "am4-asus-crosshair-viii-formula",   label: "ASUS ROG Crosshair VIII Formula",       price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-crosshair-viii-hero",      label: "ASUS ROG Crosshair VIII Hero",          price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-crosshair-viii-dark-hero", label: "ASUS ROG Crosshair VIII Dark Hero",     price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-crosshair-viii-extreme",   label: "ASUS ROG Crosshair VIII Extreme",       price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-rog-strix-x570-e",         label: "ASUS ROG Strix X570-E Gaming",          price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-rog-strix-x570-f",         label: "ASUS ROG Strix X570-F Gaming",          price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-rog-strix-x570-i",         label: "ASUS ROG Strix X570-I Gaming",          price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-prime-x570-p",             label: "ASUS Prime X570-P",                     price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-prime-x570-pro",           label: "ASUS Prime X570-Pro",                   price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-tuf-x570-plus",            label: "ASUS TUF Gaming X570-Plus",             price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-msi-meg-x570-godlike",          label: "MSI MEG X570 Godlike",                  price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-msi-meg-x570-ace",              label: "MSI MEG X570 Ace",                      price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-msi-meg-x570-unify",            label: "MSI MEG X570 Unify",                    price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-msi-mpg-x570-gaming-pro-carbon",label: "MSI MPG X570 Gaming Pro Carbon",        price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-msi-mpg-x570-edge",             label: "MSI MPG X570 Edge",                     price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-msi-mag-x570-tomahawk",         label: "MSI MAG X570 Tomahawk",                 price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-gb-x570-aorus-extreme",         label: "Gigabyte X570 Aorus Extreme",           price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-gb-x570-aorus-master",          label: "Gigabyte X570 Aorus Master",            price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-gb-x570-aorus-ultra",           label: "Gigabyte X570 Aorus Ultra",             price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-gb-x570-aorus-pro",             label: "Gigabyte X570 Aorus Pro",               price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-gb-x570-aorus-elite",           label: "Gigabyte X570 Aorus Elite",             price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-gb-x570-gaming-x",              label: "Gigabyte X570 Gaming X",                price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-asrock-x570-taichi",            label: "ASRock X570 Taichi",                    price: 0, socket: "AM4", brand: "ASRock",   ramType: "DDR4" },
  { value: "am4-asrock-x570-phantom-x",         label: "ASRock X570 Phantom Gaming X",          price: 0, socket: "AM4", brand: "ASRock",   ramType: "DDR4" },
  { value: "am4-asrock-x570-steel-legend",      label: "ASRock X570 Steel Legend",              price: 0, socket: "AM4", brand: "ASRock",   ramType: "DDR4" },
  { value: "am4-asrock-x570-pro4",              label: "ASRock X570 Pro4",                      price: 0, socket: "AM4", brand: "ASRock",   ramType: "DDR4" },
  // B550 (Middle)
  { value: "am4-asus-rog-strix-b550-f",         label: "ASUS ROG Strix B550-F Gaming",          price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-rog-strix-b550-e",         label: "ASUS ROG Strix B550-E Gaming",          price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-rog-strix-b550-a",         label: "ASUS ROG Strix B550-A Gaming",          price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-rog-strix-b550-i",         label: "ASUS ROG Strix B550-I Gaming",          price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-tuf-b550-plus",            label: "ASUS TUF Gaming B550-Plus",             price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-tuf-b550-pro",             label: "ASUS TUF Gaming B550-Pro",              price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-prime-b550-plus",          label: "ASUS Prime B550-Plus",                  price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-msi-mag-b550-tomahawk",         label: "MSI MAG B550 Tomahawk",                 price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-msi-mag-b550m-mortar",          label: "MSI MAG B550M Mortar WiFi",             price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-msi-mpg-b550-gaming-plus",      label: "MSI MPG B550 Gaming Plus",              price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-msi-mpg-b550-gaming-edge",      label: "MSI MPG B550 Gaming Edge",              price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-gb-b550-aorus-master",          label: "Gigabyte B550 Aorus Master",            price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-gb-b550-aorus-pro",             label: "Gigabyte B550 Aorus Pro",               price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-gb-b550-aorus-elite",           label: "Gigabyte B550 Aorus Elite AX",          price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-gb-b550m-ds3h",                 label: "Gigabyte B550M DS3H",                   price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-asrock-b550-steel-legend",      label: "ASRock B550 Steel Legend",              price: 0, socket: "AM4", brand: "ASRock",   ramType: "DDR4" },
  { value: "am4-asrock-b550-extreme4",          label: "ASRock B550 Extreme4",                  price: 0, socket: "AM4", brand: "ASRock",   ramType: "DDR4" },
  { value: "am4-asrock-b550-phantom-4",         label: "ASRock B550 Phantom Gaming 4",          price: 0, socket: "AM4", brand: "ASRock",   ramType: "DDR4" },
  { value: "am4-asrock-b550-pro4",              label: "ASRock B550 Pro4",                      price: 0, socket: "AM4", brand: "ASRock",   ramType: "DDR4" },
  // B450 (Budget/popular)
  { value: "am4-msi-b450-tomahawk-max",         label: "MSI B450 Tomahawk Max",                 price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-msi-b450m-mortar-max",          label: "MSI B450M Mortar Max",                  price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-msi-b450-gaming-plus-max",      label: "MSI B450 Gaming Plus Max",              price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-msi-b450-a-pro",                label: "MSI B450-A Pro",                        price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-asus-rog-strix-b450-f",         label: "ASUS ROG Strix B450-F Gaming",          price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-rog-strix-b450-i",         label: "ASUS ROG Strix B450-I Gaming",          price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-tuf-b450-pro",             label: "ASUS TUF B450-Pro Gaming",              price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-tuf-b450-plus",            label: "ASUS TUF B450-Plus Gaming",             price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-prime-b450m-a",            label: "ASUS Prime B450M-A",                    price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-prime-b450m-k",            label: "ASUS Prime B450M-K",                    price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-gb-b450-aorus-elite",           label: "Gigabyte B450 Aorus Elite",             price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-gb-b450-aorus-pro",             label: "Gigabyte B450 Aorus Pro",               price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-gb-b450m-ds3h",                 label: "Gigabyte B450M DS3H",                   price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-gb-b450-gaming-x",              label: "Gigabyte B450 Gaming X",                price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-asrock-b450-steel-legend",      label: "ASRock B450 Steel Legend",              price: 0, socket: "AM4", brand: "ASRock",   ramType: "DDR4" },
  { value: "am4-asrock-b450m-pro4",             label: "ASRock B450M Pro4",                     price: 0, socket: "AM4", brand: "ASRock",   ramType: "DDR4" },
  { value: "am4-asrock-b450-fatal1ty",          label: "ASRock Fatal1ty B450 Gaming",           price: 0, socket: "AM4", brand: "ASRock",   ramType: "DDR4" },
  // A520 / A320 (Budget)
  { value: "am4-asus-prime-a520m-k",            label: "ASUS Prime A520M-K",                    price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-prime-a520m-a",            label: "ASUS Prime A520M-A",                    price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-tuf-a520m-plus",           label: "ASUS TUF Gaming A520M-Plus",            price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-gb-a520m-s2h",                  label: "Gigabyte A520M S2H",                    price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-gb-a520m-ds3h",                 label: "Gigabyte A520M DS3H",                   price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-gb-a320m-s2h",                  label: "Gigabyte GA-A320M-S2H",                 price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-msi-a520m-a-pro",               label: "MSI A520M-A Pro",                       price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-msi-mag-a520m-vector",          label: "MSI MAG A520M Vector WiFi",             price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-asrock-a520m-hvs",              label: "ASRock A520M-HVS",                      price: 0, socket: "AM4", brand: "ASRock",   ramType: "DDR4" },
  { value: "am4-asrock-a520m-pro4",             label: "ASRock A520M Pro4",                     price: 0, socket: "AM4", brand: "ASRock",   ramType: "DDR4" },
  { value: "am4-asrock-a320m-hdv",              label: "ASRock A320M-HDV",                      price: 0, socket: "AM4", brand: "ASRock",   ramType: "DDR4" },
  // X470 / X370 / B350 (Enthusiast legacy)
  { value: "am4-asus-crosshair-vi-hero",        label: "ASUS ROG Crosshair VI Hero (X370)",     price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-crosshair-vii-hero",       label: "ASUS ROG Crosshair VII Hero (X470)",    price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-prime-x470-pro",           label: "ASUS Prime X470-Pro",                   price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-asus-rog-strix-b350-f",         label: "ASUS ROG Strix B350-F Gaming",          price: 0, socket: "AM4", brand: "ASUS",     ramType: "DDR4" },
  { value: "am4-msi-x470-gaming-m7",            label: "MSI X470 Gaming M7 AC",                 price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-msi-x370-xpower-titanium",      label: "MSI X370 XPower Gaming Titanium",       price: 0, socket: "AM4", brand: "MSI",      ramType: "DDR4" },
  { value: "am4-gb-x470-aorus-gaming-7",        label: "Gigabyte X470 Aorus Gaming 7",          price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },
  { value: "am4-gb-ab350-gaming-3",             label: "Gigabyte GA-AB350-Gaming 3",             price: 0, socket: "AM4", brand: "Gigabyte", ramType: "DDR4" },

  // ══════════════════════════════════════════════════════
  // AM5 — DDR5
  // ══════════════════════════════════════════════════════
  // X870E / X870 (Flagship)
  { value: "am5-asus-crosshair-x870e-extreme",  label: "ASUS ROG Crosshair X870E Extreme",      price: 0, socket: "AM5", brand: "ASUS",     ramType: "DDR5" },
  { value: "am5-asus-crosshair-x870e-hero",     label: "ASUS ROG Crosshair X870E Hero",         price: 0, socket: "AM5", brand: "ASUS",     ramType: "DDR5" },
  { value: "am5-asus-crosshair-x870e-glacial",  label: "ASUS ROG Crosshair X870E Glacial",      price: 0, socket: "AM5", brand: "ASUS",     ramType: "DDR5" },
  { value: "am5-asus-proart-x870e-creator",     label: "ASUS ProArt X870E-Creator WiFi",        price: 0, socket: "AM5", brand: "ASUS",     ramType: "DDR5" },
  { value: "am5-asus-rog-strix-x870-a",         label: "ASUS ROG Strix X870-A Gaming WiFi",     price: 0, socket: "AM5", brand: "ASUS",     ramType: "DDR5" },
  { value: "am5-asus-prime-x670-p",             label: "ASUS Prime X670-P",                     price: 0, socket: "AM5", brand: "ASUS",     ramType: "DDR5" },
  { value: "am5-msi-meg-x670e-godlike",         label: "MSI MEG X670E Godlike",                 price: 0, socket: "AM5", brand: "MSI",      ramType: "DDR5" },
  { value: "am5-msi-meg-x670e-ace",             label: "MSI MEG X670E Ace",                     price: 0, socket: "AM5", brand: "MSI",      ramType: "DDR5" },
  { value: "am5-msi-mpg-x870e-carbon",          label: "MSI MPG X870E Carbon WiFi",             price: 0, socket: "AM5", brand: "MSI",      ramType: "DDR5" },
  { value: "am5-msi-mag-x870e-tomahawk",        label: "MSI MAG X870E Tomahawk WiFi",           price: 0, socket: "AM5", brand: "MSI",      ramType: "DDR5" },
  { value: "am5-msi-mag-x870-tomahawk",         label: "MSI MAG X870 Tomahawk WiFi",            price: 0, socket: "AM5", brand: "MSI",      ramType: "DDR5" },
  { value: "am5-gb-x870e-aorus-xtreme",         label: "Gigabyte X870E AORUS Xtreme",           price: 0, socket: "AM5", brand: "Gigabyte", ramType: "DDR5" },
  { value: "am5-gb-x870e-aorus-master",         label: "Gigabyte X870E AORUS Master",           price: 0, socket: "AM5", brand: "Gigabyte", ramType: "DDR5" },
  { value: "am5-gb-x870e-aorus-pro-x3d",        label: "Gigabyte X870E AORUS Pro X3D",          price: 0, socket: "AM5", brand: "Gigabyte", ramType: "DDR5" },
  { value: "am5-gb-x870e-aero-x",               label: "Gigabyte X870E Aero X",                 price: 0, socket: "AM5", brand: "Gigabyte", ramType: "DDR5" },
  { value: "am5-gb-x870-gaming-x-wifi7",        label: "Gigabyte X870 Gaming X WiFi7",          price: 0, socket: "AM5", brand: "Gigabyte", ramType: "DDR5" },
  { value: "am5-asrock-x870e-taichi",           label: "ASRock X870E Taichi",                   price: 0, socket: "AM5", brand: "ASRock",   ramType: "DDR5" },
  { value: "am5-asrock-x870e-taichi-lite",      label: "ASRock X870E Taichi Lite",              price: 0, socket: "AM5", brand: "ASRock",   ramType: "DDR5" },
  { value: "am5-asrock-x670e-steel-legend",     label: "ASRock X670E Steel Legend",             price: 0, socket: "AM5", brand: "ASRock",   ramType: "DDR5" },
  { value: "am5-asrock-x670e-pro-rs",           label: "ASRock X670E Pro RS",                   price: 0, socket: "AM5", brand: "ASRock",   ramType: "DDR5" },
  { value: "am5-asrock-x870-steel-legend",      label: "ASRock X870 Steel Legend WiFi",         price: 0, socket: "AM5", brand: "ASRock",   ramType: "DDR5" },
  { value: "am5-asrock-b650e-itx",              label: "ASRock B650E Phantom Gaming-ITX/ax",    price: 0, socket: "AM5", brand: "ASRock",   ramType: "DDR5" },
  { value: "am5-nzxt-n9-x870e",                 label: "NZXT N9 X870E",                         price: 0, socket: "AM5", brand: "NZXT",     ramType: "DDR5" },
  // B850 / B650 / B840 (Middle)
  { value: "am5-asus-tuf-b850-plus",            label: "ASUS TUF Gaming B850-Plus WiFi",        price: 0, socket: "AM5", brand: "ASUS",     ramType: "DDR5" },
  { value: "am5-asus-prime-b650m-a",            label: "ASUS Prime B650M-A",                    price: 0, socket: "AM5", brand: "ASUS",     ramType: "DDR5" },
  { value: "am5-asus-proart-b850-creator",      label: "ASUS ProArt B850-Creator WiFi Neo",     price: 0, socket: "AM5", brand: "ASUS",     ramType: "DDR5" },
  { value: "am5-asus-rog-strix-b650e-f",        label: "ASUS ROG Strix B650E-F Gaming WiFi",    price: 0, socket: "AM5", brand: "ASUS",     ramType: "DDR5" },
  { value: "am5-msi-mag-b850-tomahawk-max",     label: "MSI MAG B850 Tomahawk MAX",             price: 0, socket: "AM5", brand: "MSI",      ramType: "DDR5" },
  { value: "am5-msi-pro-b850m-a",               label: "MSI PRO B850M-A WiFi",                  price: 0, socket: "AM5", brand: "MSI",      ramType: "DDR5" },
  { value: "am5-msi-b650-gaming-plus",          label: "MSI B650 Gaming Plus",                  price: 0, socket: "AM5", brand: "MSI",      ramType: "DDR5" },
  { value: "am5-msi-mpg-b650e-carbon",          label: "MSI MPG B650E Carbon WiFi",             price: 0, socket: "AM5", brand: "MSI",      ramType: "DDR5" },
  { value: "am5-gb-b850-aorus-elite",           label: "Gigabyte B850 AORUS Elite WiFi7",       price: 0, socket: "AM5", brand: "Gigabyte", ramType: "DDR5" },
  { value: "am5-gb-b650-eagle-ax",              label: "Gigabyte B650 Eagle AX",                price: 0, socket: "AM5", brand: "Gigabyte", ramType: "DDR5" },
  { value: "am5-gb-b840-gaming-x",              label: "Gigabyte B840 Gaming X",                price: 0, socket: "AM5", brand: "Gigabyte", ramType: "DDR5" },
  { value: "am5-gb-b650e-aorus-stealth-ice",    label: "Gigabyte B650E AORUS Stealth Ice",      price: 0, socket: "AM5", brand: "Gigabyte", ramType: "DDR5" },
  { value: "am5-asrock-b850m-pro-rs",           label: "ASRock B850M Pro RS WiFi",              price: 0, socket: "AM5", brand: "ASRock",   ramType: "DDR5" },
  { value: "am5-asrock-b650m-hdv",              label: "ASRock B650M-HDV/M.2",                  price: 0, socket: "AM5", brand: "ASRock",   ramType: "DDR5" },
  // A620 (Budget AM5)
  { value: "am5-asus-tuf-a620m-plus",           label: "ASUS TUF Gaming A620M-Plus",            price: 0, socket: "AM5", brand: "ASUS",     ramType: "DDR5" },
  { value: "am5-asus-prime-a620m-k",            label: "ASUS Prime A620M-K",                    price: 0, socket: "AM5", brand: "ASUS",     ramType: "DDR5" },
  { value: "am5-gb-a620m-s2h",                  label: "Gigabyte A620M S2H",                    price: 0, socket: "AM5", brand: "Gigabyte", ramType: "DDR5" },
  { value: "am5-gb-a620m-gaming-x",             label: "Gigabyte A620M Gaming X",               price: 0, socket: "AM5", brand: "Gigabyte", ramType: "DDR5" },
  { value: "am5-msi-pro-a620m-e",               label: "MSI PRO A620M-E",                       price: 0, socket: "AM5", brand: "MSI",      ramType: "DDR5" },
  { value: "am5-asrock-a620m-hdv",              label: "ASRock A620M-HDV/M.2+",                 price: 0, socket: "AM5", brand: "ASRock",   ramType: "DDR5" },

  // ══════════════════════════════════════════════════════
  // LGA1200 — DDR4
  // ══════════════════════════════════════════════════════
  { value: "1200-asus-rog-maximus-xiii",         label: "ASUS ROG Maximus XIII Hero (Z590)",     price: 0, socket: "LGA1200", brand: "ASUS",     ramType: "DDR4" },
  { value: "1200-asus-strix-z590-e",             label: "ASUS ROG Strix Z590-E Gaming",          price: 0, socket: "LGA1200", brand: "ASUS",     ramType: "DDR4" },
  { value: "1200-asus-tuf-b560-plus",            label: "ASUS TUF Gaming B560-Plus WiFi",        price: 0, socket: "LGA1200", brand: "ASUS",     ramType: "DDR4" },
  { value: "1200-asus-prime-h510m-k",            label: "ASUS Prime H510M-K",                    price: 0, socket: "LGA1200", brand: "ASUS",     ramType: "DDR4" },
  { value: "1200-msi-meg-z590-ace",              label: "MSI MEG Z590 Ace",                      price: 0, socket: "LGA1200", brand: "MSI",      ramType: "DDR4" },
  { value: "1200-msi-mag-b560-torpedo",          label: "MSI MAG B560 Torpedo",                  price: 0, socket: "LGA1200", brand: "MSI",      ramType: "DDR4" },
  { value: "1200-msi-mortar-b460m",              label: "MSI MAG B460M Mortar",                  price: 0, socket: "LGA1200", brand: "MSI",      ramType: "DDR4" },
  { value: "1200-msi-pro-h410m",                 label: "MSI PRO H410M-B",                       price: 0, socket: "LGA1200", brand: "MSI",      ramType: "DDR4" },
  { value: "1200-gb-z590-aorus-master",          label: "Gigabyte Z590 Aorus Master",            price: 0, socket: "LGA1200", brand: "Gigabyte", ramType: "DDR4" },
  { value: "1200-gb-b560m-ds3h",                 label: "Gigabyte B560M DS3H",                   price: 0, socket: "LGA1200", brand: "Gigabyte", ramType: "DDR4" },
  { value: "1200-gb-h470-vision-g",              label: "Gigabyte H470 Vision G",                price: 0, socket: "LGA1200", brand: "Gigabyte", ramType: "DDR4" },
  { value: "1200-asrock-z590-taichi",            label: "ASRock Z590 Taichi",                    price: 0, socket: "LGA1200", brand: "ASRock",   ramType: "DDR4" },
  { value: "1200-asrock-b560-steel-legend",      label: "ASRock B560 Steel Legend",              price: 0, socket: "LGA1200", brand: "ASRock",   ramType: "DDR4" },
  { value: "1200-asrock-h510m-hdv",              label: "ASRock H510M-HDV",                      price: 0, socket: "LGA1200", brand: "ASRock",   ramType: "DDR4" },

  // ══════════════════════════════════════════════════════
  // LGA1700 — DDR4 / DDR5
  // ══════════════════════════════════════════════════════
  // Z790 / Z690 (High-end)
  { value: "1700-asus-rog-maximus-z790",         label: "ASUS ROG Maximus Z790 Hero",            price: 0, socket: "LGA1700", brand: "ASUS",     ramType: "DDR5" },
  { value: "1700-asus-rog-strix-z790-e",         label: "ASUS ROG Strix Z790-E Gaming WiFi",     price: 0, socket: "LGA1700", brand: "ASUS",     ramType: "DDR5" },
  { value: "1700-asus-rog-strix-z790-f",         label: "ASUS ROG Strix Z790-F Gaming WiFi",     price: 0, socket: "LGA1700", brand: "ASUS",     ramType: "DDR5" },
  { value: "1700-asus-tuf-z790-plus",            label: "ASUS TUF Gaming Z790-Plus WiFi",        price: 0, socket: "LGA1700", brand: "ASUS",     ramType: "DDR5" },
  { value: "1700-asus-prime-z790-a",             label: "ASUS Prime Z790-A WiFi",                price: 0, socket: "LGA1700", brand: "ASUS",     ramType: "DDR5" },
  { value: "1700-msi-meg-z790-godlike",          label: "MSI MEG Z790 Godlike",                  price: 0, socket: "LGA1700", brand: "MSI",      ramType: "DDR5" },
  { value: "1700-msi-meg-z790-ace",              label: "MSI MEG Z790 Ace",                      price: 0, socket: "LGA1700", brand: "MSI",      ramType: "DDR5" },
  { value: "1700-msi-mpg-z790-carbon",           label: "MSI MPG Z790 Carbon WiFi",              price: 0, socket: "LGA1700", brand: "MSI",      ramType: "DDR5" },
  { value: "1700-msi-mpg-z790-edge",             label: "MSI MPG Z790 Edge WiFi",                price: 0, socket: "LGA1700", brand: "MSI",      ramType: "DDR5" },
  { value: "1700-msi-mag-z790-tomahawk",         label: "MSI MAG Z790 Tomahawk WiFi",            price: 0, socket: "LGA1700", brand: "MSI",      ramType: "DDR5" },
  { value: "1700-msi-pro-z790-p",                label: "MSI PRO Z790-P WiFi",                   price: 0, socket: "LGA1700", brand: "MSI",      ramType: "DDR5" },
  { value: "1700-gb-z790-aorus-xtreme",          label: "Gigabyte Z790 Aorus Xtreme",            price: 0, socket: "LGA1700", brand: "Gigabyte", ramType: "DDR5" },
  { value: "1700-gb-z790-aorus-master",          label: "Gigabyte Z790 Aorus Master",            price: 0, socket: "LGA1700", brand: "Gigabyte", ramType: "DDR5" },
  { value: "1700-gb-z790-aorus-elite",           label: "Gigabyte Z790 Aorus Elite AX",          price: 0, socket: "LGA1700", brand: "Gigabyte", ramType: "DDR5" },
  { value: "1700-gb-z790-gaming-x",              label: "Gigabyte Z790 Gaming X WiFi",           price: 0, socket: "LGA1700", brand: "Gigabyte", ramType: "DDR5" },
  { value: "1700-asrock-z790-taichi",            label: "ASRock Z790 Taichi",                    price: 0, socket: "LGA1700", brand: "ASRock",   ramType: "DDR5" },
  { value: "1700-asrock-z790-phantom",           label: "ASRock Z790 Phantom Gaming Riptide",    price: 0, socket: "LGA1700", brand: "ASRock",   ramType: "DDR5" },
  { value: "1700-asrock-z790-steel-legend",      label: "ASRock Z790 Steel Legend WiFi",         price: 0, socket: "LGA1700", brand: "ASRock",   ramType: "DDR5" },
  // B760 / B660 / H770 / H670 (Middle)
  { value: "1700-asus-rog-strix-b760-f",         label: "ASUS ROG Strix B760-F Gaming WiFi",     price: 0, socket: "LGA1700", brand: "ASUS",     ramType: "DDR5" },
  { value: "1700-asus-rog-strix-b760-i",         label: "ASUS ROG Strix B760-I Gaming WiFi",     price: 0, socket: "LGA1700", brand: "ASUS",     ramType: "DDR5" },
  { value: "1700-asus-tuf-b760-plus",            label: "ASUS TUF Gaming B760-Plus WiFi",        price: 0, socket: "LGA1700", brand: "ASUS",     ramType: "DDR4" },
  { value: "1700-asus-tuf-b760m",                label: "ASUS TUF Gaming B760M-Plus WiFi",       price: 0, socket: "LGA1700", brand: "ASUS",     ramType: "DDR4" },
  { value: "1700-asus-prime-b760m-a",            label: "ASUS Prime B760M-A WiFi",               price: 0, socket: "LGA1700", brand: "ASUS",     ramType: "DDR4" },
  { value: "1700-msi-mag-b760-tomahawk",         label: "MSI MAG B760 Tomahawk WiFi DDR5",       price: 0, socket: "LGA1700", brand: "MSI",      ramType: "DDR5" },
  { value: "1700-msi-mag-b760m-mortar",          label: "MSI MAG B760M Mortar WiFi",             price: 0, socket: "LGA1700", brand: "MSI",      ramType: "DDR5" },
  { value: "1700-msi-pro-b760-p",                label: "MSI PRO B760-P WiFi DDR4",              price: 0, socket: "LGA1700", brand: "MSI",      ramType: "DDR4" },
  { value: "1700-gb-b760-aorus-elite",           label: "Gigabyte B760 Aorus Elite AX DDR5",     price: 0, socket: "LGA1700", brand: "Gigabyte", ramType: "DDR5" },
  { value: "1700-gb-b760m-gaming-x",             label: "Gigabyte B760M Gaming X DDR4",          price: 0, socket: "LGA1700", brand: "Gigabyte", ramType: "DDR4" },
  { value: "1700-gb-b760m-ds3h",                 label: "Gigabyte B760M DS3H DDR4",              price: 0, socket: "LGA1700", brand: "Gigabyte", ramType: "DDR4" },
  { value: "1700-asrock-b760m-steel-legend",     label: "ASRock B760M Steel Legend WiFi",        price: 0, socket: "LGA1700", brand: "ASRock",   ramType: "DDR5" },
  { value: "1700-asrock-b760-pro-rs",            label: "ASRock B760 Pro RS",                    price: 0, socket: "LGA1700", brand: "ASRock",   ramType: "DDR4" },
  { value: "1700-asrock-b760m-hdv",              label: "ASRock B760M-HDV/M.2",                  price: 0, socket: "LGA1700", brand: "ASRock",   ramType: "DDR4" },
  // H610 (Budget)
  { value: "1700-asus-prime-h610m-k",            label: "ASUS Prime H610M-K",                    price: 0, socket: "LGA1700", brand: "ASUS",     ramType: "DDR4" },
  { value: "1700-asus-prime-h610m-e",            label: "ASUS Prime H610M-E",                    price: 0, socket: "LGA1700", brand: "ASUS",     ramType: "DDR4" },
  { value: "1700-msi-pro-h610m-b",               label: "MSI PRO H610M-B DDR4",                  price: 0, socket: "LGA1700", brand: "MSI",      ramType: "DDR4" },
  { value: "1700-gb-h610m-s2h",                  label: "Gigabyte H610M S2H DDR4",               price: 0, socket: "LGA1700", brand: "Gigabyte", ramType: "DDR4" },
  { value: "1700-gb-h610m-h",                    label: "Gigabyte H610M H",                      price: 0, socket: "LGA1700", brand: "Gigabyte", ramType: "DDR4" },
  { value: "1700-asrock-h610m-hvs",              label: "ASRock H610M-HVS",                      price: 0, socket: "LGA1700", brand: "ASRock",   ramType: "DDR4" },
  { value: "1700-asrock-h610m-hdv",              label: "ASRock H610M-HDV",                      price: 0, socket: "LGA1700", brand: "ASRock",   ramType: "DDR4" },

  // ══════════════════════════════════════════════════════
  // LGA1851 — DDR5
  // ══════════════════════════════════════════════════════
  // Z890 (Flagship)
  { value: "1851-asus-rog-maximus-z890-hero",    label: "ASUS ROG Maximus Z890 Hero",            price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-asus-rog-maximus-z890-apex",    label: "ASUS ROG Maximus Z890 Apex",            price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-asus-rog-maximus-z890-extreme", label: "ASUS ROG Maximus Z890 Extreme",         price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-asus-rog-strix-z890-e",         label: "ASUS ROG Strix Z890-E Gaming WiFi",     price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-asus-rog-strix-z890-f",         label: "ASUS ROG Strix Z890-F Gaming WiFi",     price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-asus-rog-strix-z890-h",         label: "ASUS ROG Strix Z890-H Gaming WiFi",     price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-asus-tuf-z890-plus",            label: "ASUS TUF Gaming Z890-PLUS WiFi",        price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-asus-prime-z890-p",             label: "ASUS Prime Z890-P WiFi",                price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-asus-proart-z890-creator",      label: "ASUS ProArt Z890-CREATOR WiFi",         price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-msi-meg-z890-godlike",          label: "MSI MEG Z890 Godlike",                  price: 0, socket: "LGA1851", brand: "MSI",      ramType: "DDR5" },
  { value: "1851-msi-meg-z890-ace",              label: "MSI MEG Z890 Ace",                      price: 0, socket: "LGA1851", brand: "MSI",      ramType: "DDR5" },
  { value: "1851-msi-mpg-z890-carbon",           label: "MSI MPG Z890 Carbon WiFi",              price: 0, socket: "LGA1851", brand: "MSI",      ramType: "DDR5" },
  { value: "1851-msi-mpg-z890-edge-ti",          label: "MSI MPG Z890 Edge TI WiFi",             price: 0, socket: "LGA1851", brand: "MSI",      ramType: "DDR5" },
  { value: "1851-msi-mag-z890-tomahawk",         label: "MSI MAG Z890 Tomahawk WiFi",            price: 0, socket: "LGA1851", brand: "MSI",      ramType: "DDR5" },
  { value: "1851-msi-pro-z890-p",                label: "MSI PRO Z890-P WiFi",                   price: 0, socket: "LGA1851", brand: "MSI",      ramType: "DDR5" },
  { value: "1851-gb-z890-aorus-xtreme",          label: "Gigabyte Z890 AORUS Xtreme WiFi7",      price: 0, socket: "LGA1851", brand: "Gigabyte", ramType: "DDR5" },
  { value: "1851-gb-z890-aorus-elite",           label: "Gigabyte Z890 AORUS Elite WiFi7",       price: 0, socket: "LGA1851", brand: "Gigabyte", ramType: "DDR5" },
  { value: "1851-gb-z890-aorus-pro-ice",         label: "Gigabyte Z890 AORUS Pro ICE",           price: 0, socket: "LGA1851", brand: "Gigabyte", ramType: "DDR5" },
  { value: "1851-gb-z890i-aorus-ultra",          label: "Gigabyte Z890I AORUS Ultra (Mini-ITX)", price: 0, socket: "LGA1851", brand: "Gigabyte", ramType: "DDR5" },
  { value: "1851-gb-z890-gaming-x",              label: "Gigabyte Z890 Gaming X WiFi7",          price: 0, socket: "LGA1851", brand: "Gigabyte", ramType: "DDR5" },
  { value: "1851-gb-z890-eagle",                 label: "Gigabyte Z890 Eagle WiFi7",             price: 0, socket: "LGA1851", brand: "Gigabyte", ramType: "DDR5" },
  { value: "1851-asrock-z890-taichi",            label: "ASRock Z890 Taichi",                    price: 0, socket: "LGA1851", brand: "ASRock",   ramType: "DDR5" },
  { value: "1851-asrock-z890-pro-a",             label: "ASRock Z890 Pro-A WiFi",                price: 0, socket: "LGA1851", brand: "ASRock",   ramType: "DDR5" },
  { value: "1851-asrock-z890-phantom",           label: "ASRock Z890 Phantom Gaming",            price: 0, socket: "LGA1851", brand: "ASRock",   ramType: "DDR5" },
  // B860 (Middle LGA1851)
  { value: "1851-asus-rog-strix-b860-g",         label: "ASUS ROG Strix B860-G Gaming WiFi",     price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-asus-rog-strix-b860-i",         label: "ASUS ROG Strix B860-I Gaming WiFi",     price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-asus-tuf-b860-plus",            label: "ASUS TUF Gaming B860-PLUS WiFi",        price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-asus-tuf-b860m-plus",           label: "ASUS TUF Gaming B860M-PLUS WiFi",       price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-asus-prime-b860m-a",            label: "ASUS Prime B860M-A WiFi",               price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-msi-mag-b860-tomahawk",         label: "MSI MAG B860 Tomahawk WiFi",            price: 0, socket: "LGA1851", brand: "MSI",      ramType: "DDR5" },
  { value: "1851-msi-pro-b850m-p",               label: "MSI PRO B850M-P WiFi",                  price: 0, socket: "LGA1851", brand: "MSI",      ramType: "DDR5" },
  { value: "1851-gb-b860m-aorus-elite",          label: "Gigabyte B860M AORUS Elite WiFi7",      price: 0, socket: "LGA1851", brand: "Gigabyte", ramType: "DDR5" },
  { value: "1851-gb-b860m-eagle-v2",             label: "Gigabyte B860M Eagle V2",               price: 0, socket: "LGA1851", brand: "Gigabyte", ramType: "DDR5" },
  // H810 (Budget LGA1851)
  { value: "1851-asus-prime-z890-ayw",           label: "ASUS Prime Z890-AYW Gaming WiFi",       price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-asus-prime-b860m-k",            label: "ASUS Prime B860M-K",                    price: 0, socket: "LGA1851", brand: "ASUS",     ramType: "DDR5" },
  { value: "1851-gb-h810m-h",                    label: "Gigabyte H810M H",                      price: 0, socket: "LGA1851", brand: "Gigabyte", ramType: "DDR5" },
  { value: "1851-gb-h810m-k",                    label: "Gigabyte H810M K",                      price: 0, socket: "LGA1851", brand: "Gigabyte", ramType: "DDR5" },
]

const gpuOptionsDefault: Part[] = [
  // RTX 30 серия
  { value: "rtx3050",      label: "NVIDIA RTX 3050 8GB",             price: 19500,  brand: "NVIDIA", memory: 8,  tdp: 130, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/30-series/rtx-3050/" },
  { value: "rtx3060",      label: "NVIDIA RTX 3060 12GB",            price: 26000,  brand: "NVIDIA", memory: 12, tdp: 170, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/30-series/rtx-3060-3060ti/" },
  { value: "rtx3060ti",    label: "NVIDIA RTX 3060 Ti 8GB",          price: 30000,  brand: "NVIDIA", memory: 8,  tdp: 200, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/30-series/rtx-3060-3060ti/" },
  { value: "rtx3070",      label: "NVIDIA RTX 3070 8GB",             price: 36000,  brand: "NVIDIA", memory: 8,  tdp: 220, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/30-series/rtx-3070-3070ti/" },
  { value: "rtx3070ti",    label: "NVIDIA RTX 3070 Ti 8GB",          price: 42000,  brand: "NVIDIA", memory: 8,  tdp: 290, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/30-series/rtx-3070-3070ti/" },
  { value: "rtx3080",      label: "NVIDIA RTX 3080 10GB",            price: 52000,  brand: "NVIDIA", memory: 10, tdp: 320, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/30-series/rtx-3080-3080ti/" },
  { value: "rtx3090",      label: "NVIDIA RTX 3090 24GB",            price: 72000,  brand: "NVIDIA", memory: 24, tdp: 350, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/30-series/rtx-3090-3090ti/" },
  // RTX 40 серия
  { value: "rtx4060",      label: "NVIDIA RTX 4060 8GB",             price: 34000,  brand: "NVIDIA", memory: 8,  tdp: 115, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/40-series/rtx-4060/" },
  { value: "rtx4060ti",    label: "NVIDIA RTX 4060 Ti 8GB",          price: 42000,  brand: "NVIDIA", memory: 8,  tdp: 160, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/40-series/rtx-4060ti/" },
  { value: "rtx4060ti16",  label: "NVIDIA RTX 4060 Ti 16GB",         price: 50000,  brand: "NVIDIA", memory: 16, tdp: 165, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/40-series/rtx-4060ti/" },
  { value: "rtx4070",      label: "NVIDIA RTX 4070 12GB",            price: 56000,  brand: "NVIDIA", memory: 12, tdp: 200, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/40-series/rtx-4070/" },
  { value: "rtx4070s",     label: "NVIDIA RTX 4070 Super 12GB",      price: 63000,  brand: "NVIDIA", memory: 12, tdp: 220, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/40-series/rtx-4070-super/" },
  { value: "rtx4070ti",    label: "NVIDIA RTX 4070 Ti 12GB",         price: 72000,  brand: "NVIDIA", memory: 12, tdp: 285, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/40-series/rtx-4070ti/" },
  { value: "rtx4070tis",   label: "NVIDIA RTX 4070 Ti Super 16GB",   price: 82000,  brand: "NVIDIA", memory: 16, tdp: 285, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/40-series/rtx-4070ti-super/" },
  { value: "rtx4080",      label: "NVIDIA RTX 4080 16GB",            price: 97000,  brand: "NVIDIA", memory: 16, tdp: 320, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/40-series/rtx-4080/" },
  { value: "rtx4090",      label: "NVIDIA RTX 4090 24GB",            price: 170000, brand: "NVIDIA", memory: 24, tdp: 450, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/40-series/rtx-4090/" },
  // RTX 50 серия
  { value: "rtx5070",      label: "NVIDIA RTX 5070 12GB",            price: 78000,  brand: "NVIDIA", memory: 12, tdp: 250, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/50-series/rtx-5070/" },
  { value: "rtx5070ti",    label: "NVIDIA RTX 5070 Ti 16GB",         price: 98000,  brand: "NVIDIA", memory: 16, tdp: 300, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/50-series/rtx-5070-ti/" },
  { value: "rtx5080",      label: "NVIDIA RTX 5080 16GB",            price: 130000, brand: "NVIDIA", memory: 16, tdp: 360, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/50-series/rtx-5080/" },
  { value: "rtx5090",      label: "NVIDIA RTX 5090 32GB",            price: 275000, brand: "NVIDIA", memory: 32, tdp: 575, url: "https://www.nvidia.com/ru-ru/geforce/graphics-cards/50-series/rtx-5090/" },
  // RX 6xxx
  { value: "rx6600",       label: "AMD RX 6600 8GB",                 price: 16500,  brand: "AMD", memory: 8,  tdp: 132, url: "https://www.amd.com/ru/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6600.html" },
  { value: "rx6600xt",     label: "AMD RX 6600 XT 8GB",              price: 20000,  brand: "AMD", memory: 8,  tdp: 160, url: "https://www.amd.com/ru/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6600-xt.html" },
  { value: "rx6700xt",     label: "AMD RX 6700 XT 12GB",             price: 29500,  brand: "AMD", memory: 12, tdp: 230, url: "https://www.amd.com/ru/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6700-xt.html" },
  { value: "rx6800xt",     label: "AMD RX 6800 XT 16GB",             price: 47500,  brand: "AMD", memory: 16, tdp: 300, url: "https://www.amd.com/ru/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6800-xt.html" },
  { value: "rx6900xt",     label: "AMD RX 6900 XT 16GB",             price: 55000,  brand: "AMD", memory: 16, tdp: 300, url: "https://www.amd.com/ru/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6900-xt.html" },
  // RX 7xxx
  { value: "rx7600",       label: "AMD RX 7600 8GB",                 price: 25500,  brand: "AMD", memory: 8,  tdp: 165, url: "https://www.amd.com/ru/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7600.html" },
  { value: "rx7700xt",     label: "AMD RX 7700 XT 12GB",             price: 37500,  brand: "AMD", memory: 12, tdp: 245, url: "https://www.amd.com/ru/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7700-xt.html" },
  { value: "rx7800xt",     label: "AMD RX 7800 XT 16GB",             price: 46500,  brand: "AMD", memory: 16, tdp: 263, url: "https://www.amd.com/ru/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7800-xt.html" },
  { value: "rx7900gre",    label: "AMD RX 7900 GRE 16GB",            price: 52000,  brand: "AMD", memory: 16, tdp: 260, url: "https://www.amd.com/ru/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7900-gre.html" },
  { value: "rx7900xt",     label: "AMD RX 7900 XT 20GB",             price: 67000,  brand: "AMD", memory: 20, tdp: 315, url: "https://www.amd.com/ru/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7900-xt.html" },
  { value: "rx7900xtx",    label: "AMD RX 7900 XTX 24GB",            price: 82000,  brand: "AMD", memory: 24, tdp: 355, url: "https://www.amd.com/ru/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7900-xtx.html" },
  { value: "rx9070",       label: "AMD RX 9070 16GB",                price: 62000,  brand: "AMD", memory: 16, tdp: 220, url: "https://www.amd.com/ru/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070.html" },
  { value: "rx9070xt",     label: "AMD RX 9070 XT 16GB",             price: 70000,  brand: "AMD", memory: 16, tdp: 304, url: "https://www.amd.com/ru/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070-xt.html" },
]

const ramOptionsDefault: Part[] = [
  // DDR4
  { value: "ddr4-8-kingston",    label: "8 ГБ DDR4-3200 Kingston Fury Beast",       price: 2200,  brand: "Kingston", memory: 8,  freq: 3200, ramType: "DDR4", url: "https://www.kingston.com/ru/memory/gaming/kingston-fury-beast-ddr4-memory" },
  { value: "ddr4-8-corsair",     label: "8 ГБ DDR4-3200 Corsair Vengeance LPX",    price: 2500,  brand: "Corsair",  memory: 8,  freq: 3200, ramType: "DDR4", url: "https://www.corsair.com/ru/ru/c/vengeance-lpx" },
  { value: "ddr4-16-kingston",   label: "16 ГБ DDR4-3200 Kingston Fury Beast",      price: 4000,  brand: "Kingston", memory: 16, freq: 3200, ramType: "DDR4", url: "https://www.kingston.com/ru/memory/gaming/kingston-fury-beast-ddr4-memory" },
  { value: "ddr4-16-corsair",    label: "16 ГБ DDR4-3200 Corsair Vengeance LPX",   price: 4500,  brand: "Corsair",  memory: 16, freq: 3200, ramType: "DDR4", url: "https://www.corsair.com/ru/ru/c/vengeance-lpx" },
  { value: "ddr4-16-gskill",     label: "16 ГБ DDR4-3600 G.Skill Ripjaws V",       price: 5000,  brand: "G.Skill",  memory: 16, freq: 3600, ramType: "DDR4", url: "https://www.gskill.com/series/166/Ripjaws-V" },
  { value: "ddr4-32-kingston",   label: "32 ГБ DDR4-3200 Kingston Fury Beast 2×16",price: 7800,  brand: "Kingston", memory: 32, freq: 3200, ramType: "DDR4", url: "https://www.kingston.com/ru/memory/gaming/kingston-fury-beast-ddr4-memory" },
  { value: "ddr4-32-corsair",    label: "32 ГБ DDR4-3200 Corsair Vengeance 2×16",  price: 8800,  brand: "Corsair",  memory: 32, freq: 3200, ramType: "DDR4", url: "https://www.corsair.com/ru/ru/c/vengeance-lpx" },
  { value: "ddr4-32-gskill",     label: "32 ГБ DDR4-3600 G.Skill Ripjaws V 2×16", price: 9500,  brand: "G.Skill",  memory: 32, freq: 3600, ramType: "DDR4", url: "https://www.gskill.com/series/166/Ripjaws-V" },
  { value: "ddr4-64-kingston",   label: "64 ГБ DDR4-3200 Kingston Fury Beast 4×16",price: 15500, brand: "Kingston", memory: 64, freq: 3200, ramType: "DDR4", url: "https://www.kingston.com/ru/memory/gaming/kingston-fury-beast-ddr4-memory" },
  // DDR5
  { value: "ddr5-16-kingston",   label: "16 ГБ DDR5-4800 Kingston Fury Beast",      price: 5000,  brand: "Kingston", memory: 16, freq: 4800, ramType: "DDR5", url: "https://www.kingston.com/ru/memory/gaming/kingston-fury-beast-ddr5-memory" },
  { value: "ddr5-16-corsair",    label: "16 ГБ DDR5-5200 Corsair Vengeance",        price: 6000,  brand: "Corsair",  memory: 16, freq: 5200, ramType: "DDR5", url: "https://www.corsair.com/ru/ru/c/vengeance-ddr5" },
  { value: "ddr5-32-kingston",   label: "32 ГБ DDR5-4800 Kingston Fury Beast 2×16",price: 9500,  brand: "Kingston", memory: 32, freq: 4800, ramType: "DDR5", url: "https://www.kingston.com/ru/memory/gaming/kingston-fury-beast-ddr5-memory" },
  { value: "ddr5-32-corsair",    label: "32 ГБ DDR5-5600 Corsair Vengeance 2×16",  price: 11500, brand: "Corsair",  memory: 32, freq: 5600, ramType: "DDR5", url: "https://www.corsair.com/ru/ru/c/vengeance-ddr5" },
  { value: "ddr5-32-gskill",     label: "32 ГБ DDR5-5600 G.Skill Ripjaws S5 2×16", price: 11000, brand: "G.Skill",  memory: 32, freq: 5600, ramType: "DDR5", url: "https://www.gskill.com/series/355/Ripjaws-S5" },
  { value: "ddr5-32-gskill-tz",  label: "32 ГБ DDR5-6000 G.Skill Trident Z5 2×16", price: 14500, brand: "G.Skill",  memory: 32, freq: 6000, ramType: "DDR5", url: "https://www.gskill.com/series/335/Trident-Z5" },
  { value: "ddr5-64-kingston",   label: "64 ГБ DDR5-4800 Kingston Fury Beast 2×32",price: 19000, brand: "Kingston", memory: 64, freq: 4800, ramType: "DDR5", url: "https://www.kingston.com/ru/memory/gaming/kingston-fury-beast-ddr5-memory" },
  { value: "ddr5-64-gskill",     label: "64 ГБ DDR5-6000 G.Skill Trident Z5 2×32", price: 28000, brand: "G.Skill",  memory: 64, freq: 6000, ramType: "DDR5", url: "https://www.gskill.com/series/335/Trident-Z5" },
  { value: "ddr5-96-gskill",     label: "96 ГБ DDR5-6000 G.Skill Trident Z5 2×48", price: 42000, brand: "G.Skill",  memory: 96, freq: 6000, ramType: "DDR5", url: "https://www.gskill.com/series/335/Trident-Z5" },
]

const storageOptionsDefault: Part[] = [
  // Samsung
  { value: "sam870-500",   label: "Samsung 870 EVO 500GB SATA",          price: 5500,  brand: "Samsung", memory: 500,  url: "https://www.samsung.com/ru/memory-storage/sata-ssd/870-evo-500gb-sata-3-2-5-ssd-mz-77e500bw/" },
  { value: "sam870-1t",    label: "Samsung 870 EVO 1TB SATA",             price: 8500,  brand: "Samsung", memory: 1000, url: "https://www.samsung.com/ru/memory-storage/sata-ssd/870-evo-1tb-sata-3-2-5-ssd-mz-77e1t0bw/" },
  { value: "sam870-2t",    label: "Samsung 870 EVO 2TB SATA",             price: 16500, brand: "Samsung", memory: 2000, url: "https://www.samsung.com/ru/memory-storage/sata-ssd/870-evo-2tb-sata-3-2-5-ssd-mz-77e2t0bw/" },
  { value: "sam980p-1t",   label: "Samsung 980 PRO 1TB NVMe PCIe4",       price: 9500,  brand: "Samsung", memory: 1000, url: "https://www.samsung.com/ru/memory-storage/nvme-ssd/980-pro-1tb-nvme-pcie-gen-4-gaming-ssd-mz-v8p1t0bw/" },
  { value: "sam980p-2t",   label: "Samsung 980 PRO 2TB NVMe PCIe4",       price: 17500, brand: "Samsung", memory: 2000, url: "https://www.samsung.com/ru/memory-storage/nvme-ssd/980-pro-2tb-nvme-pcie-gen-4-gaming-ssd-mz-v8p2t0bw/" },
  { value: "sam990p-1t",   label: "Samsung 990 PRO 1TB NVMe PCIe4",       price: 9000,  brand: "Samsung", memory: 1000, url: "https://www.samsung.com/ru/memory-storage/nvme-ssd/990-pro-1tb-nvme-pcie-gen-4-gaming-ssd-mz-v9p1t0bw/" },
  { value: "sam990p-2t",   label: "Samsung 990 PRO 2TB NVMe PCIe4",       price: 16000, brand: "Samsung", memory: 2000, url: "https://www.samsung.com/ru/memory-storage/nvme-ssd/990-pro-2tb-nvme-pcie-gen-4-gaming-ssd-mz-v9p2t0bw/" },
  { value: "sam990p-4t",   label: "Samsung 990 PRO 4TB NVMe PCIe4",       price: 32000, brand: "Samsung", memory: 4000, url: "https://www.samsung.com/ru/memory-storage/nvme-ssd/990-pro-with-heatsink-4tb-nvme-pcie-gen-4-gaming-ssd-mz-v9p4t0cw/" },
  // WD
  { value: "wd-blue-1t",   label: "WD Blue SN580 1TB NVMe PCIe4",         price: 7500,  brand: "WD", memory: 1000, url: "https://www.westerndigital.com/ru-ru/products/internal-drives/wd-blue-sn580-nvme-ssd" },
  { value: "wd-blue-2t",   label: "WD Blue SN580 2TB NVMe PCIe4",         price: 12500, brand: "WD", memory: 2000, url: "https://www.westerndigital.com/ru-ru/products/internal-drives/wd-blue-sn580-nvme-ssd" },
  { value: "wd-black-1t",  label: "WD Black SN850X 1TB NVMe PCIe4",       price: 12500, brand: "WD", memory: 1000, url: "https://www.westerndigital.com/ru-ru/products/internal-drives/wd-black-sn850x-nvme-ssd" },
  { value: "wd-black-2t",  label: "WD Black SN850X 2TB NVMe PCIe4",       price: 22000, brand: "WD", memory: 2000, url: "https://www.westerndigital.com/ru-ru/products/internal-drives/wd-black-sn850x-nvme-ssd" },
  // Kingston
  { value: "kn-nv2-500",   label: "Kingston NV2 500GB NVMe PCIe4",         price: 3500,  brand: "Kingston", memory: 500,  url: "https://www.kingston.com/ru/ssd/nv2-nvme-pcie-ssd" },
  { value: "kn-nv2-1t",    label: "Kingston NV2 1TB NVMe PCIe4",           price: 6000,  brand: "Kingston", memory: 1000, url: "https://www.kingston.com/ru/ssd/nv2-nvme-pcie-ssd" },
  { value: "kn-nv2-2t",    label: "Kingston NV2 2TB NVMe PCIe4",           price: 10000, brand: "Kingston", memory: 2000, url: "https://www.kingston.com/ru/ssd/nv2-nvme-pcie-ssd" },
  { value: "kn-kc3000-1t", label: "Kingston KC3000 1TB NVMe PCIe4",        price: 9000,  brand: "Kingston", memory: 1000, url: "https://www.kingston.com/ru/ssd/kc3000-nvme-m2-solid-state-drive" },
  // Crucial
  { value: "cr-p3-1t",     label: "Crucial P3 1TB NVMe PCIe3",             price: 5500,  brand: "Crucial", memory: 1000, url: "https://www.crucial.com/ssd/p3/ct1000p3ssd8" },
  { value: "cr-p3-2t",     label: "Crucial P3 2TB NVMe PCIe3",             price: 9500,  brand: "Crucial", memory: 2000, url: "https://www.crucial.com/ssd/p3/ct2000p3ssd8" },
  { value: "cr-p5p-1t",    label: "Crucial P5 Plus 1TB NVMe PCIe4",        price: 8000,  brand: "Crucial", memory: 1000, url: "https://www.crucial.com/ssd/p5-plus/ct1000p5pssd8" },
  { value: "cr-mx500-500", label: "Crucial MX500 500GB SATA",               price: 4500,  brand: "Crucial", memory: 500,  url: "https://www.crucial.com/ssd/mx500/CT500MX500SSD1" },
  { value: "cr-mx500-1t",  label: "Crucial MX500 1TB SATA",                 price: 7000,  brand: "Crucial", memory: 1000, url: "https://www.crucial.com/ssd/mx500/CT1000MX500SSD1" },
  // Seagate
  { value: "sg-f-1t",      label: "Seagate FireCuda 530 1TB NVMe PCIe4",   price: 10000, brand: "Seagate", memory: 1000, url: "https://www.seagate.com/ru/ru/products/gaming-drives/pc-gaming/firecuda-530-ssd/" },
  { value: "sg-f-2t",      label: "Seagate FireCuda 530 2TB NVMe PCIe4",   price: 18000, brand: "Seagate", memory: 2000, url: "https://www.seagate.com/ru/ru/products/gaming-drives/pc-gaming/firecuda-530-ssd/" },
  // ADATA
  { value: "ad-s70-1t",    label: "ADATA XPG S70 Blade 1TB NVMe PCIe4",   price: 8500,  brand: "ADATA", memory: 1000, url: "https://www.xpg.com/ru/xpg/693" },
  { value: "ad-s70-2t",    label: "ADATA XPG S70 Blade 2TB NVMe PCIe4",   price: 15000, brand: "ADATA", memory: 2000, url: "https://www.xpg.com/ru/xpg/693" },
]

const psuOptionsDefault: Part[] = [
  // DEEPCOOL PF серия (80+ Standard)
  { value: "dp-pf450",     label: "DEEPCOOL PF450 450W 80+",               price: 0, brand: "Deepcool", watt: 450,  url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/DEEPCOOL-PF450/2022/15200.shtml" },
  { value: "dp-pf500",     label: "DEEPCOOL PF500 500W 80+",               price: 0, brand: "Deepcool", watt: 500,  url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/DEEPCOOL-PF500/2022/15201.shtml" },
  { value: "dp-pf600",     label: "DEEPCOOL PF600 600W 80+",               price: 0, brand: "Deepcool", watt: 600,  url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/DEEPCOOL-PF600/2022/15202.shtml" },
  { value: "dp-pf650",     label: "DEEPCOOL PF650 650W 80+",               price: 0, brand: "Deepcool", watt: 650,  url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/DEEPCOOL-PF650/2022/15203.shtml" },
  { value: "dp-pf700",     label: "DEEPCOOL PF700 700W 80+",               price: 0, brand: "Deepcool", watt: 700,  url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/DEEPCOOL-PF700/2022/15204.shtml" },
  { value: "dp-pf750",     label: "DEEPCOOL PF750 750W 80+",               price: 0, brand: "Deepcool", watt: 750,  url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/DEEPCOOL-PF750/2022/15205.shtml" },
  // DEEPCOOL GamerStorm PQ серия (80+ Gold, модульные)
  { value: "dp-pq650g",    label: "DEEPCOOL GamerStorm PQ650G 650W 80+ Gold",   price: 0, brand: "Deepcool", watt: 650,  url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/GamerStorm-PQ650G/2023/17096.shtml" },
  { value: "dp-pq750g",    label: "DEEPCOOL GamerStorm PQ750G 750W 80+ Gold",   price: 0, brand: "Deepcool", watt: 750,  url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/GamerStorm-PQ750G/2023/17097.shtml" },
  { value: "dp-pq850g",    label: "DEEPCOOL GamerStorm PQ850G 850W 80+ Gold",   price: 0, brand: "Deepcool", watt: 850,  url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/GamerStorm-PQ850G/2023/17098.shtml" },
  { value: "dp-pq1000g",   label: "DEEPCOOL GamerStorm PQ1000G 1000W 80+ Gold", price: 0, brand: "Deepcool", watt: 1000, url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/GamerStorm-PQ1000G/2023/17099.shtml" },
  { value: "dp-pq1000g-wh",label: "DEEPCOOL GamerStorm PQ1000G WH 1000W 80+ Gold (белый)", price: 0, brand: "Deepcool", watt: 1000, url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/GamerStorm-PQ1000G/2023/17099.shtml" },
  { value: "dp-pq1200g",   label: "DEEPCOOL GamerStorm PQ1200G 1200W 80+ Gold", price: 0, brand: "Deepcool", watt: 1200, url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/GamerStorm-PQ1200G/2023/17100.shtml" },
  // DEEPCOOL GamerStorm PK серия (80+ Bronze, модульные)
  { value: "dp-pk750d",    label: "DEEPCOOL GamerStorm PK750D 750W 80+ Bronze",  price: 0, brand: "Deepcool", watt: 750,  url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/GamerStorm-PK750D/2022/16234.shtml" },
  // DEEPCOOL GamerStorm PN серия (80+ Gold, полностью модульные)
  { value: "dp-pn850m",    label: "DEEPCOOL GamerStorm PN850M 850W 80+ Gold",    price: 0, brand: "Deepcool", watt: 850,  url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/GamerStorm-PN850M/2023/17300.shtml" },
  { value: "dp-pn1000m",   label: "DEEPCOOL GamerStorm PN1000M 1000W 80+ Gold",  price: 0, brand: "Deepcool", watt: 1000, url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/GamerStorm-PN1000M/2023/17301.shtml" },
  { value: "dp-pn1200m",   label: "DEEPCOOL GamerStorm PN1200M 1200W 80+ Gold",  price: 0, brand: "Deepcool", watt: 1200, url: "https://www.deepcool.com/products/PowerSupplyUnits/psu/GamerStorm-PN1200M/2023/17302.shtml" },
  // Cougar GEC серия (80+ Gold)
  { value: "cougar-gec750",      label: "Cougar GEC 750 750W 80+ Gold",           price: 0, brand: "Cougar", watt: 750,  url: "https://www.cougar-world.com/products/psu/gec-750.html" },
  { value: "cougar-gec850",      label: "Cougar GEC 850 850W 80+ Gold",           price: 0, brand: "Cougar", watt: 850,  url: "https://www.cougar-world.com/products/psu/gec-850.html" },
  { value: "cougar-gec850-snow", label: "Cougar GEC 850 SNOW 850W 80+ Gold (белый)", price: 0, brand: "Cougar", watt: 850,  url: "https://www.cougar-world.com/products/psu/gec-850.html" },
  // Cougar GEX серия (80+ Gold, модульные)
  { value: "cougar-gex850",      label: "Cougar GEX850 850W 80+ Gold",            price: 0, brand: "Cougar", watt: 850,  url: "https://www.cougar-world.com/products/psu/gex-850.html" },
  { value: "cougar-gex850-snow", label: "Cougar GEX 850 SNOW 850W 80+ Gold (белый)", price: 0, brand: "Cougar", watt: 850, url: "https://www.cougar-world.com/products/psu/gex-850.html" },
  { value: "cougar-gexx2-1000",  label: "Cougar GEX X2 1000W 80+ Gold",          price: 0, brand: "Cougar", watt: 1000, url: "https://www.cougar-world.com/products/psu/gex-x2-1000.html" },
  // Cougar GES серия (80+ Gold, 12V-2x6)
  { value: "cougar-ges850",      label: "Cougar GES 850 850W 80+ Gold",           price: 0, brand: "Cougar", watt: 850,  url: "https://www.cougar-world.com/products/psu/ges-850.html" },
  // Cougar GR серия (80+ Gold, 12V-2x6)
  { value: "cougar-gr750",       label: "Cougar GR 750 750W 80+ Gold",            price: 0, brand: "Cougar", watt: 750,  url: "https://www.cougar-world.com/products/psu/gr-750.html" },
  { value: "cougar-gr850",       label: "Cougar GR 850 850W 80+ Gold",            price: 0, brand: "Cougar", watt: 850,  url: "https://www.cougar-world.com/products/psu/gr-850.html" },
  // Cougar Atlas серия (80+ Bronze)
  { value: "cougar-atlas750",    label: "Cougar Atlas 750 750W 80+ Bronze",       price: 0, brand: "Cougar", watt: 750,  url: "https://www.cougar-world.com/products/psu/atlas-750.html" },
  // Cougar GEC SNOW 750
  { value: "cougar-gec-snow750", label: "Cougar GEC SNOW 750 750W 80+ Gold (белый)", price: 0, brand: "Cougar", watt: 750, url: "https://www.cougar-world.com/products/psu/gec-750.html" },
  // Cougar STC серия (80+ Standard)
  { value: "cougar-stc600",      label: "Cougar STC 600 600W 80+",               price: 0, brand: "Cougar", watt: 600,  url: "https://www.cougar-world.com/products/psu/stc-600.html" },
  { value: "cougar-stc650",      label: "Cougar STC 650 650W 80+",               price: 0, brand: "Cougar", watt: 650,  url: "https://www.cougar-world.com/products/psu/stc-650.html" },
  // MSI MPG серия (80+ Gold, PCIe5 / 12VHPWR)
  { value: "msi-mpg-a850g",      label: "MSI MPG A850G PCIE5 850W 80+ Gold",     price: 0, brand: "MSI", watt: 850,  url: "https://www.msi.com/Power-Supply/MPG-A850G-PCIE5" },
  { value: "msi-mpg-a1000g",     label: "MSI MPG A1000G PCIE5 1000W 80+ Gold",   price: 0, brand: "MSI", watt: 1000, url: "https://www.msi.com/Power-Supply/MPG-A1000G-PCIE5" },
  // MSI MAG серия (80+ Bronze / Gold)
  { value: "msi-mag-a550bn",     label: "MSI MAG A550BN 550W 80+ Bronze",        price: 0, brand: "MSI", watt: 550,  url: "https://www.msi.com/Power-Supply/MAG-A550BN" },
  { value: "msi-mag-a650bn",     label: "MSI MAG A650BN 650W 80+ Bronze",        price: 0, brand: "MSI", watt: 650,  url: "https://www.msi.com/Power-Supply/MAG-A650BN" },
  { value: "msi-mag-a1000gl",    label: "MSI MAG A1000GL PCIE5 1000W 80+ Gold",  price: 0, brand: "MSI", watt: 1000, url: "https://www.msi.com/Power-Supply/MAG-A1000GL-PCIE5" },
  // MONTECH серия (80+ Gold)
  { value: "montech-titan850",   label: "MONTECH TITAN GOLD 850 850W 80+ Gold",  price: 0, brand: "Montech", watt: 850,  url: "https://www.montechpc.com/en/product-detail/titan-gold-850w/" },
  { value: "montech-gamma750",   label: "MONTECH GAMMA II 750 750W 80+ Gold",    price: 0, brand: "Montech", watt: 750,  url: "https://www.montechpc.com/en/product-detail/gamma-ii-750w/" },
  // Seasonic
  { value: "ss-s12-500",   label: "Seasonic S12III 500W 80+ Bronze",        price: 4000,  brand: "Seasonic", watt: 500,  url: "https://seasonic.com/s12iii" },
  { value: "ss-gx-650",    label: "Seasonic Focus GX-650 650W 80+ Gold",    price: 8000,  brand: "Seasonic", watt: 650,  url: "https://seasonic.com/focus-gx" },
  { value: "ss-gx-750",    label: "Seasonic Focus GX-750 750W 80+ Gold",    price: 9500,  brand: "Seasonic", watt: 750,  url: "https://seasonic.com/focus-gx" },
  { value: "ss-gx-850",    label: "Seasonic Focus GX-850 850W 80+ Gold",    price: 11500, brand: "Seasonic", watt: 850,  url: "https://seasonic.com/focus-gx" },
  // be quiet!
  { value: "bq-sys500",    label: "be quiet! System Power 10 500W Bronze",  price: 3800,  brand: "be quiet!", watt: 500,  url: "https://www.bequiet.com/ru/powersupply/system-power-10" },
  { value: "bq-pp12-550",  label: "be quiet! Pure Power 12M 550W 80+ Gold", price: 7000,  brand: "be quiet!", watt: 550,  url: "https://www.bequiet.com/ru/powersupply/pure-power-12-m" },
  { value: "bq-pp12-750",  label: "be quiet! Pure Power 12M 750W 80+ Gold", price: 9800,  brand: "be quiet!", watt: 750,  url: "https://www.bequiet.com/ru/powersupply/pure-power-12-m" },
  { value: "bq-pp12-850",  label: "be quiet! Pure Power 12M 850W 80+ Gold", price: 11800, brand: "be quiet!", watt: 850,  url: "https://www.bequiet.com/ru/powersupply/pure-power-12-m" },
  // Corsair
  { value: "cs-rm550",     label: "Corsair RM550 550W 80+ Gold",             price: 7000,  brand: "Corsair", watt: 550,  url: "https://www.corsair.com/ru/ru/p/psu/cp-9020194-eu/rm550-2019-550w-80-plus-gold-fully-modular-atx-psu-eu-cp-9020194-eu" },
  { value: "cs-rm650",     label: "Corsair RM650 650W 80+ Gold",             price: 8500,  brand: "Corsair", watt: 650,  url: "https://www.corsair.com/ru/ru/p/psu/cp-9020195-eu/rm650-2019-650w-80-plus-gold-fully-modular-atx-psu-eu-cp-9020195-eu" },
  { value: "cs-rm750",     label: "Corsair RM750 750W 80+ Gold",             price: 10500, brand: "Corsair", watt: 750,  url: "https://www.corsair.com/ru/ru/p/psu/cp-9020196-eu/rm750-2019-750w-80-plus-gold-fully-modular-atx-psu-eu-cp-9020196-eu" },
  { value: "cs-rm850",     label: "Corsair RM850x 850W 80+ Gold",            price: 13500, brand: "Corsair", watt: 850,  url: "https://www.corsair.com/ru/ru/p/psu/cp-9020200-eu/rmx-series-rm850x-2021-850-watt-80-plus-gold-fully-modular-atx-psu-eu-cp-9020200-eu" },
  { value: "cs-rm1000",    label: "Corsair RM1000x 1000W 80+ Gold",          price: 16500, brand: "Corsair", watt: 1000, url: "https://www.corsair.com/ru/ru/p/psu/cp-9020201-eu/rmx-series-rm1000x-2021-1000-watt-80-plus-gold-fully-modular-atx-psu-eu-cp-9020201-eu" },
  // ASUS
  { value: "as-tuf-650",   label: "ASUS TUF Gaming 650W 80+ Bronze",         price: 6500,  brand: "ASUS", watt: 650,  url: "https://www.asus.com/motherboards-components/psu/tuf-gaming/tuf-gaming-650b/" },
  { value: "as-tuf-850",   label: "ASUS TUF Gaming 850W 80+ Gold",           price: 11500, brand: "ASUS", watt: 850,  url: "https://www.asus.com/motherboards-components/psu/tuf-gaming/tuf-gaming-850g/" },
]

const caseOptionsDefault: Part[] = [
  { value: "matx-deepcool-40",  label: "Deepcool MATREXX 40 (mATX)",                 price: 3200,  brand: "Deepcool",      url: "https://www.deepcool.com/products/Cases/matxtower/MATREXX-40/2019/11955.shtml" },
  { value: "atx-deepcool-cc560",label: "Deepcool CC560 (ATX)",                       price: 5000,  brand: "Deepcool",      url: "https://www.deepcool.com/products/Cases/atxtower/CC560/2022/15900.shtml" },
  { value: "atx-deepcool-ch510",label: "Deepcool CH510 (ATX)",                       price: 5500,  brand: "Deepcool",      url: "https://www.deepcool.com/products/Cases/atxtower/CH510/2021/14250.shtml" },
  { value: "atx-deepcool-ch560",label: "Deepcool CH560 Mesh (ATX)",                  price: 8000,  brand: "Deepcool",      url: "https://www.deepcool.com/products/Cases/atxtower/CH560/2023/17500.shtml" },
  { value: "atx-bequiet-500dx", label: "be quiet! Pure Base 500DX (ATX)",            price: 9000,  brand: "be quiet!",     url: "https://www.bequiet.com/ru/case/pure-base-500dx" },
  { value: "atx-bequiet-600dx", label: "be quiet! Pure Base 600DX (ATX)",            price: 13500, brand: "be quiet!",     url: "https://www.bequiet.com/ru/case/pure-base-600" },
  { value: "atx-bequiet-dark",  label: "be quiet! Dark Base 700 (ATX)",              price: 17500, brand: "be quiet!",     url: "https://www.bequiet.com/ru/case/dark-base-700" },
  { value: "atx-fractal-pop",   label: "Fractal Design Pop Air (ATX)",               price: 10000, brand: "Fractal",       url: "https://www.fractal-design.com/products/cases/pop/pop-air/" },
  { value: "atx-fractal-north", label: "Fractal Design North (ATX)",                 price: 14500, brand: "Fractal",       url: "https://www.fractal-design.com/products/cases/north/" },
  { value: "atx-fractal-meshify",label:"Fractal Design Meshify 2 (ATX)",             price: 16500, brand: "Fractal",       url: "https://www.fractal-design.com/products/cases/meshify/meshify-2/" },
  { value: "atx-nzxt-h5-flow",  label: "NZXT H5 Flow (ATX)",                        price: 10500, brand: "NZXT",          url: "https://nzxt.com/product/h5-flow" },
  { value: "atx-nzxt-h7-flow",  label: "NZXT H7 Flow (ATX)",                        price: 15500, brand: "NZXT",          url: "https://nzxt.com/product/h7-flow" },
  { value: "atx-corsair-4000d", label: "Corsair 4000D Airflow (ATX)",                price: 9500,  brand: "Corsair",       url: "https://www.corsair.com/ru/ru/p/pc-cases/cc-9011200-ww/4000d-airflow-tempered-glass-mid-tower-atx-pc-case-black-cc-9011200-ww" },
  { value: "atx-corsair-5000d", label: "Corsair 5000D Airflow (ATX)",                price: 13500, brand: "Corsair",       url: "https://www.corsair.com/ru/ru/p/pc-cases/cc-9011209-ww/5000d-airflow-tempered-glass-mid-tower-atx-pc-case-black-cc-9011209-ww" },
  { value: "atx-lian-205",      label: "Lian Li LANCOOL 205 (ATX)",                  price: 7500,  brand: "Lian Li",       url: "https://lian-li.com/product/lancool-205/" },
  { value: "atx-lian-216",      label: "Lian Li LANCOOL 216 (ATX)",                  price: 11500, brand: "Lian Li",       url: "https://lian-li.com/product/lancool-216/" },
  { value: "atx-lian-o11d",     label: "Lian Li O11 Dynamic EVO (ATX/E-ATX)",        price: 17500, brand: "Lian Li",       url: "https://lian-li.com/product/o11-dynamic-evo/" },
  { value: "atx-phanteks-p400a",label: "Phanteks Eclipse P400A (ATX)",               price: 8500,  brand: "Phanteks",      url: "https://phanteks.com/Eclipse-P400A.html" },
  { value: "atx-cooler-td500",  label: "Cooler Master TD500 Mesh V2 (ATX)",          price: 8500,  brand: "Cooler Master",  url: "https://www.coolermaster.com/catalog/cases/mid-tower/masterbox-td500-mesh-v2/" },
  { value: "atx-msi-mag-forge", label: "MSI MAG FORGE 111R (ATX)",                   price: 6000,  brand: "MSI",           url: "https://ru.msi.com/PC-Case/MAG-FORGE-111R" },
]

const coolerOptionsDefault: Part[] = [
  { value: "box",    label: "Боксовый кулер (в комплекте с CPU)", price: 0,     brand: "Боксовый" },
  { value: "dc1",    label: "Deepcool AG400 (башня 120мм)",        price: 2800,  brand: "Deepcool",  url: "https://www.deepcool.com/products/Coolings/cpuaircoolers/AG400/2022/15800.shtml" },
  { value: "be1",    label: "be quiet! Pure Rock 2 (башня 120мм)", price: 4200,  brand: "be quiet!", url: "https://www.bequiet.com/ru/cpucooler/pure-rock-2" },
  { value: "dc2",    label: "Deepcool AG620 (двойная башня 2×120мм)",price: 5200, brand: "Deepcool",  url: "https://www.deepcool.com/products/Coolings/cpuaircoolers/AG620/2022/15801.shtml" },
  { value: "aio240", label: "Deepcool LT240 (СЖО 240мм)",          price: 8000,  brand: "Deepcool",  url: "https://www.deepcool.com/products/Coolings/cpuliquidcoolers/LT240/2022/16000.shtml" },
  { value: "aio360", label: "Deepcool LT360 (СЖО 360мм)",          price: 12000, brand: "Deepcool",  url: "https://www.deepcool.com/products/Coolings/cpuliquidcoolers/LT360/2022/16001.shtml" },
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

  // Modal for calculate + send
  const [showModal, setShowModal] = useState(false)
  const [sendName, setSendName] = useState("")
  const [sendPhone, setSendPhone] = useState("")
  const [sendState, setSendState] = useState<"idle" | "loading" | "done" | "error">("idle")

  const assemblyPrice = 5000

  // Filtered options for build tab
  const filteredCpu = socket ? cpuOptions.filter(o => o.socket === socket) : cpuOptions
  const filteredMb  = socket ? mbOptions.filter(o => o.socket === socket)  : mbOptions

  // RAM filtered by selected motherboard's DDR type
  const selectedMbForRam = mbOptions.find(o => o.value === selections.mb)
  const filteredRam = selectedMbForRam?.ramType
    ? ramOptions.filter(o => o.ramType === selectedMbForRam.ramType)
    : ramOptions

  // PSU recommendation based on CPU + GPU TDP
  const selectedCpuPart = cpuOptions.find(o => o.value === selections.cpu)
  const selectedGpuPart = gpuOptions.find(o => o.value === selections.gpu)
  const cpuTdp = selectedCpuPart?.tdp ?? 0
  const gpuTdp = selectedGpuPart?.tdp ?? 0
  // system overhead ~100W, 20% headroom
  const recommendedPsu = cpuTdp + gpuTdp > 0
    ? Math.ceil(((cpuTdp + gpuTdp + 100) * 1.2) / 50) * 50
    : 0
  const selectedPsuPart = psuOptions.find(o => o.value === selections.psu)
  const psuInsufficient = recommendedPsu > 0 && selectedPsuPart && (selectedPsuPart.watt ?? 0) < recommendedPsu

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

  const getConfigLabels = () => {
    const result: Record<string, string> = {}
    if (socket) result.socket = socket
    const cpuPart = cpuOptions.find(o => o.value === selections.cpu)
    const mbPart  = mbOptions.find(o => o.value === selections.mb)
    const gpuPart = gpuOptions.find(o => o.value === selections.gpu)
    const ramPart = ramOptions.find(o => o.value === selections.ram)
    const stPart  = storageOptions.find(o => o.value === selections.storage)
    const psuPart = psuOptions.find(o => o.value === selections.psu)
    const casePart= caseOptions.find(o => o.value === selections.case)
    const coolerPart = coolerOptions.find(o => o.value === selections.cooler)
    if (cpuPart)    result.cpu     = cpuPart.label
    if (mbPart)     result.mb      = mbPart.label
    if (gpuPart)    result.gpu     = gpuPart.label
    if (ramPart)    result.ram     = ramPart.label
    if (stPart)     result.storage = stPart.label
    if (psuPart)    result.psu     = psuPart.label
    if (casePart)   result.case    = casePart.label
    if (coolerPart) result.cooler  = coolerPart.label
    return result
  }

  const sendToTelegram = async () => {
    setSendState("loading")
    try {
      const resp = await fetch(SEND_CONFIG_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: getConfigLabels(), total, name: sendName, phone: sendPhone }),
      })
      const data = await resp.json()
      setSendState(data.ok ? "done" : "error")
    } catch {
      setSendState("error")
    }
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
                { key: "ram" as CategoryKey,     label: "Оперативная память",opts: filteredRam },
                { key: "storage" as CategoryKey, label: "Накопитель",        opts: storageOptions },
                { key: "psu" as CategoryKey,     label: "Блок питания",      opts: psuOptions },
                { key: "case" as CategoryKey,    label: "Корпус",            opts: caseOptions },
                { key: "cooler" as CategoryKey,  label: "Охлаждение CPU",    opts: coolerOptions },
              ] as const).map(({ key, label, opts }) => (
                <div key={key} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <label className="font-mono text-xs text-foreground/50">{label}</label>
                    {key === "ram" && selectedMbForRam?.ramType && (
                      <span className="rounded-full border border-foreground/20 px-2 py-0.5 font-mono text-[10px] text-foreground/60">
                        {selectedMbForRam.ramType} only
                      </span>
                    )}
                    {key === "psu" && recommendedPsu > 0 && (
                      <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${psuInsufficient ? "border-orange-500/50 text-orange-400" : "border-foreground/20 text-foreground/60"}`}>
                        от {recommendedPsu} Вт
                      </span>
                    )}
                  </div>
                  <select
                    className={selectClass}
                    value={selections[key]}
                    onChange={e => {
                      const val = e.target.value
                      if (key === "mb") {
                        const newMb = mbOptions.find(o => o.value === val)
                        const oldMb = mbOptions.find(o => o.value === selections.mb)
                        if (newMb?.ramType !== oldMb?.ramType) {
                          setSelections(s => ({ ...s, mb: val, ram: "" }))
                        } else {
                          setSelections(s => ({ ...s, mb: val }))
                        }
                      } else {
                        setSelections(s => ({ ...s, [key]: val }))
                      }
                    }}
                    style={{ background: "#0d0d1a" }}
                  >
                    <option value="" style={{ background: "#0d0d1a" }}>Выберите {label.toLowerCase()}</option>
                    {opts.map(o => (
                      <option key={o.value} value={o.value} style={{ background: "#0d0d1a" }}>
                        {o.label}{o.price > 0 ? ` — ${o.price.toLocaleString("ru")} ₽` : ""}
                      </option>
                    ))}
                  </select>
                  {(() => {
                    const selectedPart = opts.find(o => o.value === selections[key])
                    return selectedPart?.url ? (
                      <a
                        href={selectedPart.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-start font-mono text-[10px] text-foreground/50 hover:text-foreground/80 underline underline-offset-2 transition-colors"
                      >
                        Технические характеристики →
                      </a>
                    ) : null
                  })()}
                  {key === "psu" && psuInsufficient && (
                    <p className="flex items-center gap-1 font-mono text-[10px] text-orange-400">
                      <span>⚠</span> Выбранный БП может не справиться с нагрузкой. Рекомендуем от {recommendedPsu} Вт.
                    </p>
                  )}
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
                onClick={() => { setShowModal(true); setSendState("idle") }}
                className="w-full rounded-xl bg-foreground px-6 py-3 font-sans text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                Рассчитать стоимость
              </button>
            </div>
          </div>
        )}

        {/* ── MODAL ────────────────────────────────────────────────────────── */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={e => { if (e.target === e.currentTarget) { setShowModal(false); setSendState("idle") } }}
          >
            <div className="w-full max-w-md rounded-2xl border border-foreground/20 bg-[#0d0d1a] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-sans text-xl font-light text-foreground">Расчёт сборки</h3>
                <button onClick={() => { setShowModal(false); setSendState("idle") }} className="text-foreground/40 hover:text-foreground/70 transition-colors">
                  <Icon name="X" size={20} />
                </button>
              </div>

              {/* Breakdown */}
              <div className="mb-4 space-y-2 rounded-xl border border-foreground/10 bg-foreground/5 p-4 max-h-48 overflow-y-auto">
                {breakdown.length > 1 ? breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between gap-2">
                    <span className="font-mono text-xs text-foreground/60 truncate">{item.label}</span>
                    <span className="font-mono text-xs text-foreground/80 shrink-0">{item.price.toLocaleString("ru")} ₽</span>
                  </div>
                )) : (
                  <p className="font-mono text-xs text-foreground/40 text-center py-2">Выберите комплектующие</p>
                )}
              </div>

              <div className="flex items-end justify-between mb-5 px-1">
                <span className="font-mono text-xs text-foreground/50">Итого</span>
                <div className="flex items-end gap-1">
                  <span className="font-sans text-3xl font-light text-foreground">{total.toLocaleString("ru")}</span>
                  <span className="mb-0.5 font-sans text-base text-foreground/60">₽</span>
                </div>
              </div>

              {sendState === "done" ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <Icon name="CheckCircle" size={40} className="text-green-400" />
                  <p className="font-sans text-base text-foreground">Конфигурация отправлена!</p>
                  <p className="font-mono text-xs text-foreground/50 text-center">Мы свяжемся с вами в ближайшее время</p>
                </div>
              ) : (
                <>
                  <div className="mb-3 flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      value={sendName}
                      onChange={e => setSendName(e.target.value)}
                      className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2.5 font-sans text-sm text-foreground placeholder-foreground/30 focus:border-foreground/50 focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Телефон для связи"
                      value={sendPhone}
                      onChange={e => setSendPhone(e.target.value)}
                      className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2.5 font-sans text-sm text-foreground placeholder-foreground/30 focus:border-foreground/50 focus:outline-none"
                    />
                  </div>
                  {sendState === "error" && (
                    <p className="mb-2 font-mono text-xs text-red-400">Ошибка отправки. Попробуйте ещё раз.</p>
                  )}
                  <button
                    onClick={sendToTelegram}
                    disabled={sendState === "loading"}
                    className="w-full rounded-xl bg-foreground px-6 py-3 font-sans text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
                  >
                    {sendState === "loading" ? "Отправляем..." : "Отправить конфигурацию"}
                  </button>
                </>
              )}
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