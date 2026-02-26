import { useReveal } from "@/hooks/use-reveal"
import { useState } from "react"

const socketOptions = ["AM4", "AM5", "LGA1200", "LGA1700", "LGA1851"]

const cpuOptions = [
  { value: "", label: "Выберите процессор", price: 0, socket: "" },
  // AM4
  { value: "r3-3100",    label: "AMD Ryzen 3 3100",         price: 7000,  socket: "AM4" },
  { value: "r5-3600",    label: "AMD Ryzen 5 3600",         price: 9500,  socket: "AM4" },
  { value: "r5-5600",    label: "AMD Ryzen 5 5600",         price: 12000, socket: "AM4" },
  { value: "r5-5600x",   label: "AMD Ryzen 5 5600X",        price: 14000, socket: "AM4" },
  { value: "r7-5700x",   label: "AMD Ryzen 7 5700X",        price: 18000, socket: "AM4" },
  { value: "r7-5800x",   label: "AMD Ryzen 7 5800X",        price: 22000, socket: "AM4" },
  { value: "r9-5900x",   label: "AMD Ryzen 9 5900X",        price: 28000, socket: "AM4" },
  { value: "r9-5950x",   label: "AMD Ryzen 9 5950X",        price: 38000, socket: "AM4" },
  // AM5
  { value: "r5-7600",    label: "AMD Ryzen 5 7600",         price: 18000, socket: "AM5" },
  { value: "r5-7600x",   label: "AMD Ryzen 5 7600X",        price: 22000, socket: "AM5" },
  { value: "r7-7700",    label: "AMD Ryzen 7 7700",         price: 25000, socket: "AM5" },
  { value: "r7-7700x",   label: "AMD Ryzen 7 7700X",        price: 30000, socket: "AM5" },
  { value: "r7-7800x3d", label: "AMD Ryzen 7 7800X3D",      price: 38000, socket: "AM5" },
  { value: "r9-7900x",   label: "AMD Ryzen 9 7900X",        price: 42000, socket: "AM5" },
  { value: "r9-7950x",   label: "AMD Ryzen 9 7950X",        price: 68000, socket: "AM5" },
  { value: "r9-9900x",   label: "AMD Ryzen 9 9900X",        price: 55000, socket: "AM5" },
  { value: "r9-9950x",   label: "AMD Ryzen 9 9950X",        price: 80000, socket: "AM5" },
  // LGA1200
  { value: "i3-10100f",  label: "Intel Core i3-10100F",     price: 6000,  socket: "LGA1200" },
  { value: "i5-10400f",  label: "Intel Core i5-10400F",     price: 9000,  socket: "LGA1200" },
  { value: "i5-10600k",  label: "Intel Core i5-10600K",     price: 12000, socket: "LGA1200" },
  { value: "i7-10700f",  label: "Intel Core i7-10700F",     price: 15000, socket: "LGA1200" },
  { value: "i7-10700k",  label: "Intel Core i7-10700K",     price: 18000, socket: "LGA1200" },
  { value: "i9-10900k",  label: "Intel Core i9-10900K",     price: 24000, socket: "LGA1200" },
  { value: "i3-11100",   label: "Intel Core i3-11100",      price: 7000,  socket: "LGA1200" },
  { value: "i5-11400f",  label: "Intel Core i5-11400F",     price: 10000, socket: "LGA1200" },
  { value: "i7-11700f",  label: "Intel Core i7-11700F",     price: 16000, socket: "LGA1200" },
  // LGA1700
  { value: "i3-12100f",  label: "Intel Core i3-12100F",     price: 9000,  socket: "LGA1700" },
  { value: "i5-12400f",  label: "Intel Core i5-12400F",     price: 13000, socket: "LGA1700" },
  { value: "i5-12600k",  label: "Intel Core i5-12600K",     price: 16000, socket: "LGA1700" },
  { value: "i5-13400f",  label: "Intel Core i5-13400F",     price: 18000, socket: "LGA1700" },
  { value: "i5-13600k",  label: "Intel Core i5-13600K",     price: 22000, socket: "LGA1700" },
  { value: "i7-12700f",  label: "Intel Core i7-12700F",     price: 20000, socket: "LGA1700" },
  { value: "i7-13700f",  label: "Intel Core i7-13700F",     price: 28000, socket: "LGA1700" },
  { value: "i7-13700k",  label: "Intel Core i7-13700K",     price: 34000, socket: "LGA1700" },
  { value: "i9-12900k",  label: "Intel Core i9-12900K",     price: 38000, socket: "LGA1700" },
  { value: "i9-13900k",  label: "Intel Core i9-13900K",     price: 50000, socket: "LGA1700" },
  // LGA1851
  { value: "i5-14400f",  label: "Intel Core i5-14400F",     price: 20000, socket: "LGA1851" },
  { value: "i5-14600k",  label: "Intel Core i5-14600K",     price: 26000, socket: "LGA1851" },
  { value: "i7-14700f",  label: "Intel Core i7-14700F",     price: 32000, socket: "LGA1851" },
  { value: "i7-14700k",  label: "Intel Core i7-14700K",     price: 40000, socket: "LGA1851" },
  { value: "i9-14900k",  label: "Intel Core i9-14900K",     price: 56000, socket: "LGA1851" },
  { value: "i5-arrow",   label: "Intel Core Ultra 5 245K",  price: 30000, socket: "LGA1851" },
  { value: "i7-arrow",   label: "Intel Core Ultra 7 265K",  price: 42000, socket: "LGA1851" },
  { value: "i9-arrow",   label: "Intel Core Ultra 9 285K",  price: 62000, socket: "LGA1851" },
]

const mbOptions = [
  { value: "", label: "Выберите материнскую плату", price: 0, socket: "" },
  // ── AM4 · Mini-ITX ──────────────────────────────────────────────────────────
  { value: "am4-itx-b450i",   label: "ASUS ROG STRIX B450-I GAMING (Mini-ITX)",     price: 11000, socket: "AM4" },
  { value: "am4-itx-b550i",   label: "ASUS ROG STRIX B550-I GAMING (Mini-ITX)",     price: 16000, socket: "AM4" },
  { value: "am4-itx-x570i",   label: "ASUS ROG CROSSHAIR VIII Impact (Mini-ITX)",   price: 28000, socket: "AM4" },
  { value: "am4-itx-b550i-g", label: "Gigabyte B550I AORUS PRO AX (Mini-ITX)",      price: 15000, socket: "AM4" },
  { value: "am4-itx-a520i",   label: "ASRock A520M-ITX/ac (Mini-ITX)",              price: 7500,  socket: "AM4" },
  // ── AM4 · mATX ──────────────────────────────────────────────────────────────
  { value: "am4-matx-b450m-ds3h",  label: "Gigabyte B450M DS3H (mATX)",             price: 7500,  socket: "AM4" },
  { value: "am4-matx-b450m-pro",   label: "ASUS PRIME B450M-A II (mATX)",           price: 8500,  socket: "AM4" },
  { value: "am4-matx-b550m-pro",   label: "MSI PRO B550M-P GEN3 (mATX)",            price: 9500,  socket: "AM4" },
  { value: "am4-matx-b550m-aorus", label: "Gigabyte B550M AORUS PRO (mATX)",        price: 12000, socket: "AM4" },
  { value: "am4-matx-b550m-tuf",   label: "ASUS TUF GAMING B550M-PLUS (mATX)",      price: 13000, socket: "AM4" },
  { value: "am4-matx-x570m",       label: "ASUS ROG STRIX X570-I GAMING (mATX)",    price: 20000, socket: "AM4" },
  // ── AM4 · ATX ───────────────────────────────────────────────────────────────
  { value: "am4-atx-b550-tomahawk",label: "MSI MAG B550 TOMAHAWK (ATX)",            price: 14000, socket: "AM4" },
  { value: "am4-atx-b550-wifi",    label: "ASUS TUF GAMING B550-PLUS WiFi (ATX)",   price: 15000, socket: "AM4" },
  { value: "am4-atx-x570-pro",     label: "ASUS PRIME X570-PRO (ATX)",              price: 18000, socket: "AM4" },
  { value: "am4-atx-x570-elite",   label: "Gigabyte X570 AORUS ELITE (ATX)",        price: 22000, socket: "AM4" },
  { value: "am4-atx-x570-rog",     label: "ASUS ROG CROSSHAIR VIII HERO (ATX)",     price: 35000, socket: "AM4" },
  // ── AM5 · Mini-ITX ──────────────────────────────────────────────────────────
  { value: "am5-itx-b650i-rog",    label: "ASUS ROG STRIX B650E-I (Mini-ITX)",      price: 22000, socket: "AM5" },
  { value: "am5-itx-b650i-gigab",  label: "Gigabyte B650I AORUS Ultra (Mini-ITX)",  price: 20000, socket: "AM5" },
  { value: "am5-itx-x670i",        label: "ASRock X670E-ITX/TB4 (Mini-ITX)",        price: 30000, socket: "AM5" },
  // ── AM5 · mATX ──────────────────────────────────────────────────────────────
  { value: "am5-matx-b650m-k",     label: "ASUS PRIME B650M-K (mATX)",              price: 12000, socket: "AM5" },
  { value: "am5-matx-b650m-plus",  label: "MSI PRO B650M-A WiFi (mATX)",            price: 14000, socket: "AM5" },
  { value: "am5-matx-b650m-tuf",   label: "ASUS TUF GAMING B650M-PLUS WiFi (mATX)", price: 16000, socket: "AM5" },
  { value: "am5-matx-b650m-aorus", label: "Gigabyte B650M AORUS ELITE AX (mATX)",   price: 17000, socket: "AM5" },
  { value: "am5-matx-x670m",       label: "MSI MEG X670E UNIFY-X (mATX)",           price: 38000, socket: "AM5" },
  // ── AM5 · ATX ───────────────────────────────────────────────────────────────
  { value: "am5-atx-b650-gaming",  label: "Gigabyte B650 GAMING X AX (ATX)",        price: 16500, socket: "AM5" },
  { value: "am5-atx-b650e-aorus",  label: "Gigabyte B650E AORUS PRO AX (ATX)",      price: 22000, socket: "AM5" },
  { value: "am5-atx-b650-tuf",     label: "ASUS TUF GAMING B650-PLUS WiFi (ATX)",   price: 19000, socket: "AM5" },
  { value: "am5-atx-x670-pro",     label: "ASUS ROG STRIX X670E-F GAMING (ATX)",    price: 36000, socket: "AM5" },
  { value: "am5-atx-x670e-aorus",  label: "Gigabyte X670E AORUS MASTER (ATX)",      price: 45000, socket: "AM5" },
  { value: "am5-atx-x870e-rog",    label: "ASUS ROG CROSSHAIR X870E HERO (ATX)",    price: 60000, socket: "AM5" },
  { value: "am5-atx-x870e-apex",   label: "ASUS ROG MAXIMUS X870E APEX (ATX)",      price: 85000, socket: "AM5" },
  // ── LGA1200 · Mini-ITX ──────────────────────────────────────────────────────
  { value: "1200-itx-z490i",       label: "ASUS ROG STRIX Z490-I GAMING (Mini-ITX)",price: 18000, socket: "LGA1200" },
  { value: "1200-itx-b460i",       label: "ASRock B460M-ITX/ac (Mini-ITX)",         price: 8000,  socket: "LGA1200" },
  // ── LGA1200 · mATX ──────────────────────────────────────────────────────────
  { value: "1200-matx-h410m",      label: "Gigabyte H410M DS2V (mATX)",              price: 6000,  socket: "LGA1200" },
  { value: "1200-matx-b460m",      label: "Gigabyte B460M DS3H (mATX)",              price: 7500,  socket: "LGA1200" },
  { value: "1200-matx-b560m-pro",  label: "MSI PRO B560M-P (mATX)",                 price: 9000,  socket: "LGA1200" },
  { value: "1200-matx-h510m",      label: "ASUS PRIME H510M-K (mATX)",              price: 7000,  socket: "LGA1200" },
  { value: "1200-matx-b560m-tuf",  label: "ASUS TUF GAMING B560M-PLUS (mATX)",      price: 12000, socket: "LGA1200" },
  // ── LGA1200 · ATX ───────────────────────────────────────────────────────────
  { value: "1200-atx-z490-tuf",    label: "ASUS TUF GAMING Z490-PLUS (ATX)",        price: 14000, socket: "LGA1200" },
  { value: "1200-atx-z590-aorus",  label: "Gigabyte Z590 AORUS ELITE (ATX)",        price: 18000, socket: "LGA1200" },
  { value: "1200-atx-z590-rog",    label: "ASUS ROG STRIX Z590-F GAMING WiFi (ATX)",price: 28000, socket: "LGA1200" },
  // ── LGA1700 · Mini-ITX ──────────────────────────────────────────────────────
  { value: "1700-itx-z690i",       label: "ASUS ROG STRIX Z690-I GAMING WiFi (Mini-ITX)", price: 28000, socket: "LGA1700" },
  { value: "1700-itx-z790i",       label: "ASUS ROG STRIX Z790-I GAMING WiFi (Mini-ITX)", price: 32000, socket: "LGA1700" },
  { value: "1700-itx-b660i",       label: "MSI MAG B660I SHADOW WiFi (Mini-ITX)",   price: 12000, socket: "LGA1700" },
  // ── LGA1700 · mATX ──────────────────────────────────────────────────────────
  { value: "1700-matx-b660m-pro",  label: "MSI PRO B660M-A DDR4 (mATX)",            price: 9500,  socket: "LGA1700" },
  { value: "1700-matx-b760m-pro",  label: "MSI PRO B760M-P (mATX)",                 price: 11500, socket: "LGA1700" },
  { value: "1700-matx-b760m-asus", label: "ASUS PRIME B760M-A DDR5 (mATX)",         price: 13000, socket: "LGA1700" },
  { value: "1700-matx-b760m-tuf",  label: "ASUS TUF GAMING B760M-PLUS WiFi (mATX)", price: 15000, socket: "LGA1700" },
  { value: "1700-matx-b760m-gigab",label: "Gigabyte B760M AORUS Elite AX (mATX)",   price: 14000, socket: "LGA1700" },
  { value: "1700-matx-z790m",      label: "ASUS ROG MAXIMUS Z790 APEX (mATX)",      price: 55000, socket: "LGA1700" },
  // ── LGA1700 · ATX ───────────────────────────────────────────────────────────
  { value: "1700-atx-b760-gaming", label: "MSI MAG B760 TOMAHAWK WiFi (ATX)",       price: 17000, socket: "LGA1700" },
  { value: "1700-atx-z690-aorus",  label: "Gigabyte Z690 AORUS PRO (ATX)",          price: 24000, socket: "LGA1700" },
  { value: "1700-atx-z790-tomahawk",label: "MSI MAG Z790 TOMAHAWK WiFi (ATX)",      price: 28000, socket: "LGA1700" },
  { value: "1700-atx-z790-rog",    label: "ASUS ROG STRIX Z790-F GAMING WiFi (ATX)",price: 38000, socket: "LGA1700" },
  { value: "1700-atx-z790-apex",   label: "ASUS ROG MAXIMUS Z790 HERO (ATX)",       price: 65000, socket: "LGA1700" },
  // ── LGA1851 · Mini-ITX ──────────────────────────────────────────────────────
  { value: "1851-itx-z890i",       label: "ASUS ROG STRIX Z890-I GAMING WiFi (Mini-ITX)", price: 35000, socket: "LGA1851" },
  // ── LGA1851 · mATX ──────────────────────────────────────────────────────────
  { value: "1851-matx-z890m-pro",  label: "MSI PRO Z890-P WiFi (mATX)",             price: 20000, socket: "LGA1851" },
  { value: "1851-matx-z890m-asus", label: "ASUS PRIME Z890M-PLUS WiFi (mATX)",      price: 22000, socket: "LGA1851" },
  { value: "1851-matx-z890m-tuf",  label: "ASUS TUF GAMING Z890M-PLUS WiFi (mATX)", price: 26000, socket: "LGA1851" },
  // ── LGA1851 · ATX ───────────────────────────────────────────────────────────
  { value: "1851-atx-z890-tomahawk",label: "MSI MAG Z890 TOMAHAWK WiFi (ATX)",      price: 28000, socket: "LGA1851" },
  { value: "1851-atx-z890-asus",   label: "ASUS PRIME Z890-P WiFi (ATX)",           price: 24000, socket: "LGA1851" },
  { value: "1851-atx-z890-tuf",    label: "ASUS TUF GAMING Z890-PLUS WiFi (ATX)",   price: 32000, socket: "LGA1851" },
  { value: "1851-atx-z890-aorus",  label: "Gigabyte Z890 AORUS MASTER (ATX)",       price: 45000, socket: "LGA1851" },
  { value: "1851-atx-z890-rog",    label: "ASUS ROG STRIX Z890-F GAMING WiFi (ATX)",price: 50000, socket: "LGA1851" },
  { value: "1851-atx-z890-apex",   label: "ASUS ROG MAXIMUS Z890 APEX (ATX)",       price: 75000, socket: "LGA1851" },
]

const gpuOptions = [
  { value: "", label: "Выберите видеокарту", price: 0 },
  // RTX 20 серия
  { value: "rtx2060",      label: "NVIDIA RTX 2060 6GB",             price: 18000 },
  { value: "rtx2060s",     label: "NVIDIA RTX 2060 Super 8GB",       price: 22000 },
  { value: "rtx2070",      label: "NVIDIA RTX 2070 8GB",             price: 24000 },
  { value: "rtx2070s",     label: "NVIDIA RTX 2070 Super 8GB",       price: 28000 },
  { value: "rtx2080",      label: "NVIDIA RTX 2080 8GB",             price: 30000 },
  { value: "rtx2080s",     label: "NVIDIA RTX 2080 Super 8GB",       price: 34000 },
  { value: "rtx2080ti",    label: "NVIDIA RTX 2080 Ti 11GB",         price: 38000 },
  // RTX 30 серия
  { value: "rtx3050",      label: "NVIDIA RTX 3050 8GB",             price: 22000 },
  { value: "rtx3060",      label: "NVIDIA RTX 3060 12GB",            price: 28000 },
  { value: "rtx3060ti",    label: "NVIDIA RTX 3060 Ti 8GB",          price: 34000 },
  { value: "rtx3070",      label: "NVIDIA RTX 3070 8GB",             price: 40000 },
  { value: "rtx3070ti",    label: "NVIDIA RTX 3070 Ti 8GB",          price: 46000 },
  { value: "rtx3080",      label: "NVIDIA RTX 3080 10GB",            price: 55000 },
  { value: "rtx3080ti",    label: "NVIDIA RTX 3080 Ti 12GB",         price: 65000 },
  { value: "rtx3090",      label: "NVIDIA RTX 3090 24GB",            price: 75000 },
  { value: "rtx3090ti",    label: "NVIDIA RTX 3090 Ti 24GB",         price: 90000 },
  // RTX 40 серия
  { value: "rtx4050",      label: "NVIDIA RTX 4050 6GB",             price: 30000 },
  { value: "rtx4060",      label: "NVIDIA RTX 4060 8GB",             price: 38000 },
  { value: "rtx4060ti",    label: "NVIDIA RTX 4060 Ti 8GB",          price: 46000 },
  { value: "rtx4060ti16",  label: "NVIDIA RTX 4060 Ti 16GB",         price: 54000 },
  { value: "rtx4070",      label: "NVIDIA RTX 4070 12GB",            price: 58000 },
  { value: "rtx4070s",     label: "NVIDIA RTX 4070 Super 12GB",      price: 65000 },
  { value: "rtx4070ti",    label: "NVIDIA RTX 4070 Ti 12GB",         price: 75000 },
  { value: "rtx4070tis",   label: "NVIDIA RTX 4070 Ti Super 16GB",   price: 85000 },
  { value: "rtx4080",      label: "NVIDIA RTX 4080 16GB",            price: 100000 },
  { value: "rtx4080s",     label: "NVIDIA RTX 4080 Super 16GB",      price: 110000 },
  { value: "rtx4090",      label: "NVIDIA RTX 4090 24GB",            price: 175000 },
  // RTX 50 серия
  { value: "rtx5070",      label: "NVIDIA RTX 5070 12GB",            price: 80000 },
  { value: "rtx5070ti",    label: "NVIDIA RTX 5070 Ti 16GB",         price: 100000 },
  { value: "rtx5080",      label: "NVIDIA RTX 5080 16GB",            price: 135000 },
  { value: "rtx5090",      label: "NVIDIA RTX 5090 32GB",            price: 280000 },
  // RX 5xxx серия
  { value: "rx5500xt",     label: "AMD RX 5500 XT 8GB",              price: 12000 },
  { value: "rx5600xt",     label: "AMD RX 5600 XT 6GB",              price: 15000 },
  { value: "rx5700",       label: "AMD RX 5700 8GB",                 price: 18000 },
  { value: "rx5700xt",     label: "AMD RX 5700 XT 8GB",              price: 22000 },
  // RX 6xxx серия
  { value: "rx6500xt",     label: "AMD RX 6500 XT 4GB",              price: 10000 },
  { value: "rx6600",       label: "AMD RX 6600 8GB",                 price: 18000 },
  { value: "rx6600xt",     label: "AMD RX 6600 XT 8GB",              price: 22000 },
  { value: "rx6650xt",     label: "AMD RX 6650 XT 8GB",              price: 25000 },
  { value: "rx6700",       label: "AMD RX 6700 10GB",                price: 28000 },
  { value: "rx6700xt",     label: "AMD RX 6700 XT 12GB",             price: 32000 },
  { value: "rx6750xt",     label: "AMD RX 6750 XT 12GB",             price: 36000 },
  { value: "rx6800",       label: "AMD RX 6800 16GB",                price: 42000 },
  { value: "rx6800xt",     label: "AMD RX 6800 XT 16GB",             price: 50000 },
  { value: "rx6900xt",     label: "AMD RX 6900 XT 16GB",             price: 58000 },
  { value: "rx6950xt",     label: "AMD RX 6950 XT 16GB",             price: 65000 },
  // RX 7xxx серия
  { value: "rx7600",       label: "AMD RX 7600 8GB",                 price: 28000 },
  { value: "rx7600xt",     label: "AMD RX 7600 XT 16GB",             price: 34000 },
  { value: "rx7700xt",     label: "AMD RX 7700 XT 12GB",             price: 40000 },
  { value: "rx7800xt",     label: "AMD RX 7800 XT 16GB",             price: 50000 },
  { value: "rx7900gre",    label: "AMD RX 7900 GRE 16GB",            price: 55000 },
  { value: "rx7900xt",     label: "AMD RX 7900 XT 20GB",             price: 70000 },
  { value: "rx7900xtx",    label: "AMD RX 7900 XTX 24GB",            price: 85000 },
  // RX 9xxx серия
  { value: "rx9070",       label: "AMD RX 9070 16GB",                price: 60000 },
  { value: "rx9070xt",     label: "AMD RX 9070 XT 16GB",             price: 72000 },
]

const ramOptions = [
  { value: "", label: "Выберите оперативную память", price: 0 },
  // ── DDR4 · 8 ГБ ─────────────────────────────────────────────────────────────
  { value: "ddr4-8-kingston-2666",   label: "8 ГБ DDR4-2666 Kingston ValueRAM",          price: 2500 },
  { value: "ddr4-8-crucial-3200",    label: "8 ГБ DDR4-3200 Crucial Basics",             price: 2800 },
  { value: "ddr4-8-corsair-3200",    label: "8 ГБ DDR4-3200 Corsair Vengeance LPX",      price: 3200 },
  { value: "ddr4-8-gskill-3200",     label: "8 ГБ DDR4-3200 G.Skill Aegis",             price: 3000 },
  { value: "ddr4-8-samsung-3200",    label: "8 ГБ DDR4-3200 Samsung (OEM)",              price: 2600 },
  // ── DDR4 · 16 ГБ ────────────────────────────────────────────────────────────
  { value: "ddr4-16-kingston-3200",  label: "16 ГБ DDR4-3200 Kingston Fury Beast",       price: 4500 },
  { value: "ddr4-16-corsair-3200",   label: "16 ГБ DDR4-3200 Corsair Vengeance LPX",     price: 5000 },
  { value: "ddr4-16-gskill-3600",    label: "16 ГБ DDR4-3600 G.Skill Ripjaws V",         price: 5500 },
  { value: "ddr4-16-gskill-3600-trident","label": "16 ГБ DDR4-3600 G.Skill Trident Z RGB", price: 6500 },
  { value: "ddr4-16-crucial-3200",   label: "16 ГБ DDR4-3200 Crucial Ballistix",         price: 4800 },
  { value: "ddr4-16-teamgroup-4000", label: "16 ГБ DDR4-4000 TeamGroup T-Force Delta",   price: 7000 },
  { value: "ddr4-16-samsung-3200",   label: "16 ГБ DDR4-3200 Samsung (OEM)",             price: 4200 },
  // ── DDR4 · 32 ГБ ────────────────────────────────────────────────────────────
  { value: "ddr4-32-kingston-3200",  label: "32 ГБ DDR4-3200 Kingston Fury Beast (2×16)",price: 8500 },
  { value: "ddr4-32-corsair-3200",   label: "32 ГБ DDR4-3200 Corsair Vengeance LPX (2×16)",price: 9500 },
  { value: "ddr4-32-gskill-3600",    label: "32 ГБ DDR4-3600 G.Skill Ripjaws V (2×16)", price: 10500 },
  { value: "ddr4-32-gskill-3600-tz", label: "32 ГБ DDR4-3600 G.Skill Trident Z RGB (2×16)",price: 12500 },
  { value: "ddr4-32-crucial-3200",   label: "32 ГБ DDR4-3200 Crucial Ballistix (2×16)",  price: 9000 },
  { value: "ddr4-32-corsair-4000",   label: "32 ГБ DDR4-4000 Corsair Dominator Platinum (2×16)",price: 16000 },
  // ── DDR4 · 64 ГБ ────────────────────────────────────────────────────────────
  { value: "ddr4-64-kingston-3200",  label: "64 ГБ DDR4-3200 Kingston Fury Beast (4×16)",price: 17000 },
  { value: "ddr4-64-corsair-3200",   label: "64 ГБ DDR4-3200 Corsair Vengeance LPX (4×16)",price: 19000 },
  { value: "ddr4-64-gskill-3600",    label: "64 ГБ DDR4-3600 G.Skill Trident Z RGB (4×16)",price: 24000 },
  { value: "ddr4-64-teamgroup",      label: "64 ГБ DDR4-3600 TeamGroup T-Force Vulcan (4×16)",price: 18000 },
  // ── DDR5 · 16 ГБ ────────────────────────────────────────────────────────────
  { value: "ddr5-16-kingston-4800",  label: "16 ГБ DDR5-4800 Kingston Fury Beast",       price: 5500 },
  { value: "ddr5-16-crucial-4800",   label: "16 ГБ DDR5-4800 Crucial Pro",               price: 5200 },
  { value: "ddr5-16-corsair-5200",   label: "16 ГБ DDR5-5200 Corsair Vengeance",         price: 6500 },
  { value: "ddr5-16-gskill-5600",    label: "16 ГБ DDR5-5600 G.Skill Ripjaws S5",        price: 7000 },
  // ── DDR5 · 32 ГБ ────────────────────────────────────────────────────────────
  { value: "ddr5-32-kingston-4800",  label: "32 ГБ DDR5-4800 Kingston Fury Beast (2×16)",price: 10500 },
  { value: "ddr5-32-crucial-5200",   label: "32 ГБ DDR5-5200 Crucial Pro (2×16)",        price: 11500 },
  { value: "ddr5-32-corsair-5600",   label: "32 ГБ DDR5-5600 Corsair Vengeance (2×16)",  price: 13000 },
  { value: "ddr5-32-gskill-5600",    label: "32 ГБ DDR5-5600 G.Skill Ripjaws S5 (2×16)", price: 12000 },
  { value: "ddr5-32-gskill-6000",    label: "32 ГБ DDR5-6000 G.Skill Trident Z5 RGB (2×16)",price: 16000 },
  { value: "ddr5-32-teamgroup-6400", label: "32 ГБ DDR5-6400 TeamGroup T-Force Delta (2×16)",price: 18000 },
  { value: "ddr5-32-adata-6000",     label: "32 ГБ DDR5-6000 ADATA XPG Lancer (2×16)",  price: 14000 },
  // ── DDR5 · 48 ГБ ────────────────────────────────────────────────────────────
  { value: "ddr5-48-corsair-6400",   label: "48 ГБ DDR5-6400 Corsair Dominator Titan (2×24)",price: 22000 },
  { value: "ddr5-48-gskill-6800",    label: "48 ГБ DDR5-6800 G.Skill Trident Z5 (2×24)", price: 25000 },
  // ── DDR5 · 64 ГБ ────────────────────────────────────────────────────────────
  { value: "ddr5-64-kingston-4800",  label: "64 ГБ DDR5-4800 Kingston Fury Beast (2×32)",price: 20000 },
  { value: "ddr5-64-corsair-5600",   label: "64 ГБ DDR5-5600 Corsair Vengeance (2×32)",  price: 24000 },
  { value: "ddr5-64-gskill-6000",    label: "64 ГБ DDR5-6000 G.Skill Trident Z5 (2×32)", price: 30000 },
  { value: "ddr5-64-gskill-6400",    label: "64 ГБ DDR5-6400 G.Skill Trident Z5 RGB (4×16)",price: 35000 },
  { value: "ddr5-64-corsair-6000",   label: "64 ГБ DDR5-6000 Corsair Dominator Platinum (4×16)",price: 40000 },
  // ── DDR5 · 96 ГБ ────────────────────────────────────────────────────────────
  { value: "ddr5-96-corsair-5600",   label: "96 ГБ DDR5-5600 Corsair Vengeance (2×48)", price: 38000 },
  { value: "ddr5-96-gskill-6000",    label: "96 ГБ DDR5-6000 G.Skill Trident Z5 (2×48)",price: 45000 },
  // ── DDR5 · 128 ГБ ───────────────────────────────────────────────────────────
  { value: "ddr5-128-kingston-4800", label: "128 ГБ DDR5-4800 Kingston Fury Beast (4×32)",price: 40000 },
  { value: "ddr5-128-corsair-5600",  label: "128 ГБ DDR5-5600 Corsair Vengeance (4×32)", price: 50000 },
  { value: "ddr5-128-gskill-6000",   label: "128 ГБ DDR5-6000 G.Skill Trident Z5 (4×32)",price: 60000 },
]

const storageOptions = [
  { value: "", label: "Выберите накопитель", price: 0 },
  // Samsung
  { value: "sam870-500",   label: "Samsung 870 EVO 500GB SATA",          price: 9500 },
  { value: "sam870-1t",    label: "Samsung 870 EVO 1TB SATA",             price: 13500 },
  { value: "sam870-2t",    label: "Samsung 870 EVO 2TB SATA",             price: 21000 },
  { value: "sam970-500",   label: "Samsung 970 EVO Plus 500GB NVMe",      price: 10500 },
  { value: "sam970-1t",    label: "Samsung 970 EVO Plus 1TB NVMe",        price: 14500 },
  { value: "sam980-1t",    label: "Samsung 980 1TB NVMe",                 price: 12500 },
  { value: "sam980p-500",  label: "Samsung 980 PRO 500GB NVMe PCIe4",     price: 11500 },
  { value: "sam980p-1t",   label: "Samsung 980 PRO 1TB NVMe PCIe4",       price: 16000 },
  { value: "sam980p-2t",   label: "Samsung 980 PRO 2TB NVMe PCIe4",       price: 26000 },
  { value: "sam990p-1t",   label: "Samsung 990 PRO 1TB NVMe PCIe4",       price: 15000 },
  { value: "sam990p-2t",   label: "Samsung 990 PRO 2TB NVMe PCIe4",       price: 24000 },
  { value: "sam990p-4t",   label: "Samsung 990 PRO 4TB NVMe PCIe4",       price: 42000 },
  // WD
  { value: "wd-blue-500",  label: "WD Blue SN580 500GB NVMe PCIe4",       price: 9000 },
  { value: "wd-blue-1t",   label: "WD Blue SN580 1TB NVMe PCIe4",         price: 12000 },
  { value: "wd-blue-2t",   label: "WD Blue SN580 2TB NVMe PCIe4",         price: 18000 },
  { value: "wd-black-1t",  label: "WD Black SN850X 1TB NVMe PCIe4",       price: 17000 },
  { value: "wd-black-2t",  label: "WD Black SN850X 2TB NVMe PCIe4",       price: 28000 },
  { value: "wd-black-4t",  label: "WD Black SN850X 4TB NVMe PCIe4",       price: 50000 },
  { value: "wd-red-500",   label: "WD Red SA500 500GB SATA",               price: 9500 },
  { value: "wd-red-1t",    label: "WD Red SA500 1TB SATA",                 price: 13000 },
  // Seagate
  { value: "sg-b-500",     label: "Seagate BarraCuda 510 500GB NVMe",      price: 9000 },
  { value: "sg-b-1t",      label: "Seagate BarraCuda 510 1TB NVMe",        price: 12000 },
  { value: "sg-f-1t",      label: "Seagate FireCuda 530 1TB NVMe PCIe4",   price: 16000 },
  { value: "sg-f-2t",      label: "Seagate FireCuda 530 2TB NVMe PCIe4",   price: 26000 },
  { value: "sg-f-4t",      label: "Seagate FireCuda 530 4TB NVMe PCIe4",   price: 46000 },
  // Kingston
  { value: "kn-a2000-500", label: "Kingston A2000 500GB NVMe",             price: 8500 },
  { value: "kn-a2000-1t",  label: "Kingston A2000 1TB NVMe",               price: 11500 },
  { value: "kn-kc3000-1t", label: "Kingston KC3000 1TB NVMe PCIe4",        price: 14000 },
  { value: "kn-kc3000-2t", label: "Kingston KC3000 2TB NVMe PCIe4",        price: 22000 },
  { value: "kn-nv2-500",   label: "Kingston NV2 500GB NVMe PCIe4",         price: 8000 },
  { value: "kn-nv2-1t",    label: "Kingston NV2 1TB NVMe PCIe4",           price: 10500 },
  { value: "kn-nv2-2t",    label: "Kingston NV2 2TB NVMe PCIe4",           price: 15000 },
  // Crucial
  { value: "cr-p3-500",    label: "Crucial P3 500GB NVMe PCIe3",           price: 8000 },
  { value: "cr-p3-1t",     label: "Crucial P3 1TB NVMe PCIe3",             price: 10500 },
  { value: "cr-p3-2t",     label: "Crucial P3 2TB NVMe PCIe3",             price: 15000 },
  { value: "cr-p5p-500",   label: "Crucial P5 Plus 500GB NVMe PCIe4",      price: 9500 },
  { value: "cr-p5p-1t",    label: "Crucial P5 Plus 1TB NVMe PCIe4",        price: 13000 },
  { value: "cr-p5p-2t",    label: "Crucial P5 Plus 2TB NVMe PCIe4",        price: 20000 },
  { value: "cr-mx500-500", label: "Crucial MX500 500GB SATA",               price: 8500 },
  { value: "cr-mx500-1t",  label: "Crucial MX500 1TB SATA",                 price: 12000 },
  // Patriot
  { value: "pt-vp4100-1t", label: "Patriot Viper VP4300 Lite 1TB NVMe PCIe4", price: 12000 },
  { value: "pt-vp4100-2t", label: "Patriot Viper VP4300 Lite 2TB NVMe PCIe4", price: 19000 },
  // ADATA
  { value: "ad-s70-1t",    label: "ADATA XPG S70 Blade 1TB NVMe PCIe4",   price: 13000 },
  { value: "ad-s70-2t",    label: "ADATA XPG S70 Blade 2TB NVMe PCIe4",   price: 21000 },
  { value: "ad-sx8-500",   label: "ADATA XPG SX8200 Pro 512GB NVMe",      price: 9500 },
  { value: "ad-sx8-1t",    label: "ADATA XPG SX8200 Pro 1TB NVMe",        price: 13000 },
]

const psuOptions = [
  { value: "", label: "Выберите блок питания", price: 0 },
  // Deepcool — 80+ Bronze
  { value: "dp-pq450d",    label: "Deepcool PQ450D 450W 80+ Bronze",        price: 3500 },
  { value: "dp-pq550d",    label: "Deepcool PQ550D 550W 80+ Bronze",        price: 4500 },
  { value: "dp-pq650d",    label: "Deepcool PQ650D 650W 80+ Bronze",        price: 5500 },
  // Deepcool — 80+ Gold
  { value: "dp-pq550m",    label: "Deepcool PQ550M 550W 80+ Gold",          price: 5500 },
  { value: "dp-pq650m",    label: "Deepcool PQ650M 650W 80+ Gold",          price: 7000 },
  { value: "dp-pq750m",    label: "Deepcool PQ750M 750W 80+ Gold",          price: 8500 },
  { value: "dp-pq850m",    label: "Deepcool PQ850M 850W 80+ Gold",          price: 10500 },
  { value: "dp-pq1000m",   label: "Deepcool PQ1000M 1000W 80+ Gold",        price: 13000 },
  // Seasonic — 80+ Bronze
  { value: "ss-s12-500",   label: "Seasonic S12III 500W 80+ Bronze",        price: 4500 },
  { value: "ss-s12-600",   label: "Seasonic S12III 600W 80+ Bronze",        price: 5500 },
  { value: "ss-s12-700",   label: "Seasonic S12III 700W 80+ Bronze",        price: 6500 },
  // Seasonic — 80+ Gold
  { value: "ss-gx-550",    label: "Seasonic Focus GX-550 550W 80+ Gold",    price: 7500 },
  { value: "ss-gx-650",    label: "Seasonic Focus GX-650 650W 80+ Gold",    price: 8500 },
  { value: "ss-gx-750",    label: "Seasonic Focus GX-750 750W 80+ Gold",    price: 10000 },
  { value: "ss-gx-850",    label: "Seasonic Focus GX-850 850W 80+ Gold",    price: 12000 },
  { value: "ss-gx-1000",   label: "Seasonic Focus GX-1000 1000W 80+ Gold",  price: 15000 },
  // Seasonic — 80+ Platinum / Titanium
  { value: "ss-px-650",    label: "Seasonic Prime PX-650 650W 80+ Platinum", price: 13000 },
  { value: "ss-px-850",    label: "Seasonic Prime PX-850 850W 80+ Platinum", price: 16000 },
  { value: "ss-tx-1000",   label: "Seasonic Prime TX-1000 1000W 80+ Titanium",price: 22000 },
  // be quiet! — 80+ Bronze / Gold
  { value: "bq-sys500",    label: "be quiet! System Power 10 500W 80+ Bronze", price: 4000 },
  { value: "bq-sys700",    label: "be quiet! System Power 10 700W 80+ Bronze", price: 5500 },
  { value: "bq-pp12-550",  label: "be quiet! Pure Power 12 M 550W 80+ Gold",   price: 7500 },
  { value: "bq-pp12-750",  label: "be quiet! Pure Power 12 M 750W 80+ Gold",   price: 10500 },
  { value: "bq-pp12-850",  label: "be quiet! Pure Power 12 M 850W 80+ Gold",   price: 12500 },
  { value: "bq-st12-650",  label: "be quiet! Straight Power 12 650W 80+ Gold", price: 11000 },
  { value: "bq-st12-850",  label: "be quiet! Straight Power 12 850W 80+ Gold", price: 14000 },
  { value: "bq-st12-1000", label: "be quiet! Straight Power 12 1000W 80+ Platinum", price: 18000 },
  { value: "bq-dk-850",    label: "be quiet! Dark Power 13 850W 80+ Titanium", price: 22000 },
  { value: "bq-dk-1000",   label: "be quiet! Dark Power 13 1000W 80+ Titanium", price: 26000 },
  // Corsair — 80+ Bronze / Gold / Platinum
  { value: "cs-cv550",     label: "Corsair CV550 550W 80+ Bronze",            price: 4500 },
  { value: "cs-cv650",     label: "Corsair CV650 650W 80+ Bronze",            price: 5500 },
  { value: "cs-rm550",     label: "Corsair RM550 550W 80+ Gold",              price: 7500 },
  { value: "cs-rm650",     label: "Corsair RM650 650W 80+ Gold",              price: 9000 },
  { value: "cs-rm750",     label: "Corsair RM750 750W 80+ Gold",              price: 11000 },
  { value: "cs-rm850",     label: "Corsair RM850x 850W 80+ Gold",             price: 14000 },
  { value: "cs-rm1000",    label: "Corsair RM1000x 1000W 80+ Gold",           price: 17000 },
  { value: "cs-hx850",     label: "Corsair HX850 850W 80+ Platinum",          price: 17000 },
  { value: "cs-hx1000",    label: "Corsair HX1000 1000W 80+ Platinum",        price: 21000 },
  { value: "cs-ax1600ti",  label: "Corsair AX1600i 1600W 80+ Titanium",       price: 50000 },
  // MSI — 80+ Bronze / Gold / Platinum
  { value: "msi-a550",     label: "MSI MAG A550BN 550W 80+ Bronze",           price: 4000 },
  { value: "msi-a650",     label: "MSI MAG A650BN 650W 80+ Bronze",           price: 5000 },
  { value: "msi-a750",     label: "MSI MAG A750GL PCIE5 750W 80+ Gold",       price: 9000 },
  { value: "msi-a850",     label: "MSI MAG A850GL PCIE5 850W 80+ Gold",       price: 11000 },
  { value: "msi-a1000",    label: "MSI MEG Ai1000P 1000W 80+ Platinum",       price: 19000 },
  // ASUS — 80+ Bronze / Gold / Platinum
  { value: "as-prime-550", label: "ASUS PRIME 550W 80+ Gold",                 price: 6500 },
  { value: "as-prime-750", label: "ASUS PRIME 750W 80+ Gold",                 price: 9500 },
  { value: "as-tuf-650",   label: "ASUS TUF Gaming 650W 80+ Bronze",          price: 7000 },
  { value: "as-tuf-850",   label: "ASUS TUF Gaming 850W 80+ Gold",            price: 12000 },
  { value: "as-rog-850",   label: "ASUS ROG STRIX 850W 80+ Gold",             price: 15000 },
  { value: "as-rog-1000",  label: "ASUS ROG STRIX 1000W 80+ Gold",            price: 20000 },
  { value: "as-rog-1000p", label: "ASUS ROG THOR 1000W 80+ Platinum",         price: 25000 },
  // FSP — 80+ Bronze / Gold
  { value: "fsp-h550",     label: "FSP Hydro PRO 550W 80+ Bronze",            price: 3800 },
  { value: "fsp-h650",     label: "FSP Hydro PRO 650W 80+ Bronze",            price: 5000 },
  { value: "fsp-au650",    label: "FSP Aurum GS 650W 80+ Gold",               price: 7000 },
  { value: "fsp-au850",    label: "FSP Aurum GS 850W 80+ Gold",               price: 10000 },
]

const caseOptions = [
  { value: "", label: "Выберите корпус", price: 0 },
  // ─── Mini-ITX ───────────────────────────────────────────────────────────────
  { value: "itx-ncase-m1",      label: "NCASE M1 v6.1 (Mini-ITX)",                   price: 22000 },
  { value: "itx-fractal-terra", label: "Fractal Design Terra (Mini-ITX)",             price: 18000 },
  { value: "itx-sliger-sm560",  label: "Sliger SM560 (Mini-ITX)",                     price: 20000 },
  { value: "itx-cooler-qube",   label: "Cooler Master Q300L V2 (Mini-ITX/mATX)",     price: 6000  },
  { value: "itx-lian-tu150",    label: "Lian Li TU150 (Mini-ITX)",                   price: 12000 },
  { value: "itx-dan-a4",        label: "DAN Cases A4-SFX (Mini-ITX)",                price: 28000 },
  { value: "itx-phanteks-s",    label: "Phanteks Enthoo Evolv Shift XT (Mini-ITX)",  price: 14000 },
  { value: "itx-silverstone-rz", label: "SilverStone Raven Z (Mini-ITX)",            price: 8000  },
  { value: "itx-fractal-node",  label: "Fractal Design Node 202 (Mini-ITX)",         price: 9000  },
  { value: "itx-asus-ap201",    label: "ASUS Prime AP201 (Mini-ITX/mATX)",           price: 7500  },
  // ─── mATX ───────────────────────────────────────────────────────────────────
  { value: "matx-deepcool-40",  label: "Deepcool MATREXX 40 (mATX)",                 price: 3500  },
  { value: "matx-deepcool-55",  label: "Deepcool CK500 (mATX/ATX)",                  price: 5500  },
  { value: "matx-fractal-pop",  label: "Fractal Design Pop Mini Air (mATX)",          price: 8000  },
  { value: "matx-bequiet-400",  label: "be quiet! Pure Base 500 (mATX/ATX)",         price: 8500  },
  { value: "matx-cooler-q300p", label: "Cooler Master Q300P (mATX)",                 price: 5500  },
  { value: "matx-phanteks-p200",label: "Phanteks P200A (mATX)",                      price: 7000  },
  { value: "matx-nzxt-h510i",   label: "NZXT H510i (mATX/ATX)",                     price: 12000 },
  { value: "matx-silverstone-g","label": "SilverStone SGPC08 (mATX)", price: 4500  },
  { value: "matx-thermaltake-s1","label": "Thermaltake S100 (mATX)", price: 4000  },
  { value: "matx-corsair-275q", label: "Corsair 275Q (mATX)",                        price: 9000  },
  { value: "matx-lian-p8",      label: "Lian Li LANCOOL 205M (mATX)",                price: 8000  },
  { value: "matx-asus-prime-a", label: "ASUS Prime A300 (mATX)",                     price: 6000  },
  { value: "matx-msi-mag-pano", label: "MSI MAG PANO M100R (mATX)",                  price: 9500  },
  // ─── ATX ────────────────────────────────────────────────────────────────────
  { value: "atx-deepcool-cc560",label: "Deepcool CC560 (ATX)",                       price: 5500  },
  { value: "atx-deepcool-ch510",label: "Deepcool CH510 (ATX)",                       price: 6000  },
  { value: "atx-deepcool-ch560",label: "Deepcool CH560 (ATX, mesh)",                 price: 8500  },
  { value: "atx-bequiet-500dx", label: "be quiet! Pure Base 500DX (ATX)",            price: 9500  },
  { value: "atx-bequiet-600",   label: "be quiet! Pure Base 600 (ATX)",              price: 12000 },
  { value: "atx-bequiet-600dx", label: "be quiet! Pure Base 600 DX (ATX)",           price: 14000 },
  { value: "atx-bequiet-dark",  label: "be quiet! Dark Base 700 (ATX)",              price: 18000 },
  { value: "atx-bequiet-dark900","label": "be quiet! Dark Base 900 PRO (E-ATX)", price: 28000 },
  { value: "atx-fractal-pop",   label: "Fractal Design Pop Air (ATX)",               price: 10500 },
  { value: "atx-fractal-north", label: "Fractal Design North (ATX)",                 price: 15000 },
  { value: "atx-fractal-meshify","label": "Fractal Design Meshify 2 (ATX)", price: 17000 },
  { value: "atx-fractal-torrent","label": "Fractal Design Torrent (ATX)", price: 20000 },
  { value: "atx-nzxt-h5-flow",  label: "NZXT H5 Flow (ATX)",                        price: 11000 },
  { value: "atx-nzxt-h7-flow",  label: "NZXT H7 Flow (ATX)",                        price: 16000 },
  { value: "atx-nzxt-h9-flow",  label: "NZXT H9 Flow (ATX/E-ATX)",                  price: 22000 },
  { value: "atx-corsair-4000d", label: "Corsair 4000D Airflow (ATX)",                price: 10000 },
  { value: "atx-corsair-5000d", label: "Corsair 5000D Airflow (ATX)",                price: 14000 },
  { value: "atx-corsair-7000x", label: "Corsair 7000X RGB (E-ATX)",                  price: 25000 },
  { value: "atx-lian-205",      label: "Lian Li LANCOOL 205 (ATX)",                  price: 8000  },
  { value: "atx-lian-215",      label: "Lian Li LANCOOL 215 (ATX)",                  price: 10000 },
  { value: "atx-lian-216",      label: "Lian Li LANCOOL 216 (ATX)",                  price: 12000 },
  { value: "atx-lian-o11d",     label: "Lian Li O11 Dynamic EVO (ATX/E-ATX)",        price: 18000 },
  { value: "atx-lian-o11xl",    label: "Lian Li O11 Dynamic XL (E-ATX)",             price: 25000 },
  { value: "atx-phanteks-p500a",label: "Phanteks Enthoo Pro 2 (ATX/E-ATX)",          price: 22000 },
  { value: "atx-phanteks-p400a",label: "Phanteks Eclipse P400A (ATX)",               price: 9000  },
  { value: "atx-cooler-h500",   label: "Cooler Master HAF 500 (ATX)",                price: 12000 },
  { value: "atx-cooler-td500",  label: "Cooler Master TD500 Mesh V2 (ATX)",          price: 9000  },
  { value: "atx-thermaltake-v200","label": "Thermaltake V200 TG (ATX)", price: 7000  },
  { value: "atx-asus-tuf-gt501","label": "ASUS TUF Gaming GT501 (E-ATX)", price: 20000 },
  { value: "atx-asus-prime-ap201a","label": "ASUS Prime AP201 (ATX)", price: 7000  },
  { value: "atx-msi-mag-forge", label: "MSI MAG FORGE 111R (ATX)",                   price: 6500  },
  { value: "atx-msi-mag-gungnir","label": "MSI MAG GUNGNIR 300R (ATX)", price: 9000  },
  { value: "atx-silverstone-rv05","label": "SilverStone Raven RV05 (ATX)", price: 12000 },
  { value: "atx-silverstone-ps15","label": "SilverStone Precision PS15 (ATX)", price: 6000  },
  { value: "atx-antec-df700",   label: "Antec Dark Fleet DF700 FLUX (ATX)",          price: 8000  },
  { value: "atx-antec-p120",    label: "Antec P120 Crystal (ATX)",                   price: 9000  },
  { value: "atx-inwin-216",     label: "In Win 216 (ATX)",                            price: 13000 },
]

const coolerOptions = [
  { value: "", label: "Выберите охлаждение", price: 0 },
  { value: "box", label: "Боксовый кулер (в комплекте с CPU)", price: 0 },
  { value: "dc1", label: "Deepcool AG400 (башня, 120мм)", price: 3000 },
  { value: "be1", label: "be quiet! Pure Rock 2 (башня, 120мм)", price: 4500 },
  { value: "dc2", label: "Deepcool AG620 (двойная башня, 2×120мм)", price: 5500 },
  { value: "aio240", label: "Deepcool LT240 (СЖО 240мм)", price: 8500 },
]

export function ConfiguratorSection({ scrollToSection }: { scrollToSection: (i: number) => void }) {
  const { ref, isVisible } = useReveal(0.2)
  const [socket, setSocket] = useState("")
  const [cpu, setCpu] = useState("")
  const [gpu, setGpu] = useState("")
  const [ram, setRam] = useState("")
  const [storage, setStorage] = useState("")
  const [mb, setMb] = useState("")
  const [psu, setPsu] = useState("")
  const [caseVal, setCaseVal] = useState("")
  const [cooler, setCooler] = useState("")

  const assemblyPrice = 5000

  const filteredCpuOptions = socket
    ? cpuOptions.filter((o) => !o.socket || o.socket === socket)
    : cpuOptions

  const filteredMbOptions = socket
    ? mbOptions.filter((o) => !o.socket || o.socket === socket)
    : mbOptions

  const selectedCpu = cpuOptions.find((o) => o.value === cpu)
  const selectedMb = mbOptions.find((o) => o.value === mb)
  const socketMismatch =
    selectedCpu?.socket && selectedMb?.socket &&
    selectedCpu.socket !== selectedMb.socket

  const total =
    assemblyPrice +
    (cpuOptions.find((o) => o.value === cpu)?.price ?? 0) +
    (gpuOptions.find((o) => o.value === gpu)?.price ?? 0) +
    (ramOptions.find((o) => o.value === ram)?.price ?? 0) +
    (storageOptions.find((o) => o.value === storage)?.price ?? 0) +
    (mbOptions.find((o) => o.value === mb)?.price ?? 0) +
    (psuOptions.find((o) => o.value === psu)?.price ?? 0) +
    (caseOptions.find((o) => o.value === caseVal)?.price ?? 0) +
    (coolerOptions.find((o) => o.value === cooler)?.price ?? 0)

  const hasSelection = cpu || gpu || ram || storage || mb || psu || caseVal || cooler

  const selectClass =
    "w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 font-sans text-sm text-foreground backdrop-blur-sm transition-all duration-200 focus:border-foreground/50 focus:outline-none hover:border-foreground/35 appearance-none cursor-pointer"

  const breakdown = [
    { label: "Сборка и тестирование", price: assemblyPrice },
    cpu && { label: cpuOptions.find((o) => o.value === cpu)?.label, price: cpuOptions.find((o) => o.value === cpu)?.price },
    mb && { label: mbOptions.find((o) => o.value === mb)?.label, price: mbOptions.find((o) => o.value === mb)?.price },
    gpu && { label: gpuOptions.find((o) => o.value === gpu)?.label, price: gpuOptions.find((o) => o.value === gpu)?.price },
    ram && { label: ramOptions.find((o) => o.value === ram)?.label, price: ramOptions.find((o) => o.value === ram)?.price },
    storage && { label: storageOptions.find((o) => o.value === storage)?.label, price: storageOptions.find((o) => o.value === storage)?.price },
    psu && { label: psuOptions.find((o) => o.value === psu)?.label, price: psuOptions.find((o) => o.value === psu)?.price },
    caseVal && { label: caseOptions.find((o) => o.value === caseVal)?.label, price: caseOptions.find((o) => o.value === caseVal)?.price },
    cooler && cooler !== "box" && { label: coolerOptions.find((o) => o.value === cooler)?.label, price: coolerOptions.find((o) => o.value === cooler)?.price },
  ].filter(Boolean) as { label: string | undefined; price: number | undefined }[]

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start flex-col justify-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div
          className={`mb-6 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
          }`}
        >
          <p className="mb-2 font-mono text-xs text-foreground/60">/ Конфигуратор</p>
          <h2 className="font-sans text-4xl font-light leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Собери свой ПК
            <br />
            онлайн
          </h2>
        </div>

        <div
          className={`grid gap-4 md:grid-cols-2 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[55vh] pr-1 scrollbar-thin">
            {/* Сокет */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs text-foreground/50">Сокет</label>
              <select
                className={selectClass}
                value={socket}
                onChange={(e) => {
                  setSocket(e.target.value)
                  setCpu("")
                  setMb("")
                }}
              >
                <option value="" style={{ background: "#1a1a2e", color: "#fff" }}>Все сокеты</option>
                {socketOptions.map((s) => (
                  <option key={s} value={s} style={{ background: "#1a1a2e", color: "#fff" }}>{s}</option>
                ))}
              </select>
            </div>

            {[
              { label: "Процессор", options: filteredCpuOptions, val: cpu, set: setCpu },
              { label: "Материнская плата", options: filteredMbOptions, val: mb, set: setMb },
              { label: "Видеокарта", options: gpuOptions, val: gpu, set: setGpu },
              { label: "Оперативная память", options: ramOptions, val: ram, set: setRam },
              { label: "Накопитель", options: storageOptions, val: storage, set: setStorage },
              { label: "Блок питания", options: psuOptions, val: psu, set: setPsu },
              { label: "Корпус", options: caseOptions, val: caseVal, set: setCaseVal },
              { label: "Охлаждение CPU", options: coolerOptions, val: cooler, set: setCooler },
            ].map(({ label, options, val, set }) => (
              <div key={label} className="flex flex-col gap-1">
                <label className="font-mono text-xs text-foreground/50">{label}</label>
                <select className={selectClass} value={val} onChange={(e) => set(e.target.value)}>
                  {options.map((o) => (
                    <option key={o.value} value={o.value} style={{ background: "#1a1a2e", color: "#fff" }}>
                      {o.label}{o.price > 0 ? ` — ${o.price.toLocaleString("ru")} ₽` : ""}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-1 flex-col justify-between rounded-xl border border-foreground/15 bg-foreground/5 p-5 backdrop-blur-sm">
              <div>
                <p className="mb-3 font-mono text-xs text-foreground/50">Итоговая стоимость</p>
                <div className="flex items-end gap-2">
                  <span className="font-sans text-5xl font-light text-foreground">
                    {total.toLocaleString("ru")}
                  </span>
                  <span className="mb-2 font-sans text-2xl text-foreground/60">₽</span>
                </div>
                <p className="mt-1 font-mono text-xs text-foreground/40">
                  Включает сборку, тестирование и гарантию
                </p>
              </div>

              <div className="mt-4 space-y-1.5 border-t border-foreground/10 pt-3 max-h-[22vh] overflow-y-auto">
                {breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-mono text-xs text-foreground/50 truncate mr-2">{item.label}</span>
                    <span className="font-mono text-xs text-foreground/70 shrink-0">
                      {(item.price ?? 0).toLocaleString("ru")} ₽
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {socketMismatch && (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3">
                <span className="mt-0.5 text-red-400 shrink-0">⚠</span>
                <p className="font-mono text-xs text-red-400">
                  Несовместимые сокеты: процессор {selectedCpu?.socket} не подходит к плате {selectedMb?.socket}
                </p>
              </div>
            )}

            <button
              onClick={() => scrollToSection(6)}
              className="w-full rounded-lg border border-foreground/30 bg-foreground/10 px-6 py-3 font-sans text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-200 hover:bg-foreground/20 hover:border-foreground/50 disabled:opacity-40"
              disabled={!hasSelection || !!socketMismatch}
            >
              Оформить заказ →
            </button>

            <p className="font-mono text-xs text-foreground/40 text-center">
              Комплектующие заказываем с DNS или маркетплейсов. Финальная цена уточняется при заказе.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}