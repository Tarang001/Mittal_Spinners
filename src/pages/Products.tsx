import { PublicLayout } from "@/components/Layout";
import ProductCard from "@/components/ProductCard";

const PRODUCT_IMAGE_MAP: Record<string, string> = {
  "Combed Cotton Yarn": "https://5.imimg.com/data5/UW/MN/MY-3474667/combed-cotton-yarn.jpg",
  "Carded Cotton Yarn": "https://5.imimg.com/data5/OA/CP/MY-198030/carded-cotton-yarns-500x500.jpg",
  "Polyester Blend": "https://5.imimg.com/data5/LW/YD/MY-16992/polyester-viscose-blended-yarn.jpg",
  "Open-End Yarn": "https://5.imimg.com/data5/TI/WH/US/SELLER-54848766/open-end-yarn-500x500.jpg",
  "Mélange Yarn": "https://saanikaindustries.com/wp-content/uploads/2022/11/Melange-Yarn-1024x1024.webp",
  "Compact Yarn": "https://5.imimg.com/data5/BK/AG/MY-10499989/cotton-100-25-compact-yarn.jpg",
  "Slub Yarn": "https://3.imimg.com/data3/RL/KR/MY-7973967/cotton-slub-yarn-500x500.jpg",
  "Core-Spun Yarn": "https://www.roundbarnfiber.com/uploads/1/2/7/7/12776064/20190903-152705_orig.jpg",
};

const products = [
  { name: "Combed Cotton Yarn", image: PRODUCT_IMAGE_MAP["Combed Cotton Yarn"], desc: "Premium ring-spun combed cotton — 20s to 60s counts." },
  { name: "Carded Cotton Yarn", image: PRODUCT_IMAGE_MAP["Carded Cotton Yarn"], desc: "Reliable everyday yarn for weaving and knitting." },
  { name: "Polyester Blend", image: PRODUCT_IMAGE_MAP["Polyester Blend"], desc: "PC and CVC blends engineered for durability." },
  { name: "Open-End Yarn", image: PRODUCT_IMAGE_MAP["Open-End Yarn"], desc: "Rotor-spun yarn for denim and home textiles." },
  { name: "Mélange Yarn", image: PRODUCT_IMAGE_MAP["Mélange Yarn"], desc: "Pre-dyed fiber blends with consistent shade quality." },
  { name: "Compact Yarn", image: PRODUCT_IMAGE_MAP["Compact Yarn"], desc: "Low-hairiness compact yarn for premium fabrics." },
  { name: "Slub Yarn", image: PRODUCT_IMAGE_MAP["Slub Yarn"], desc: "Designer slub yarn for fashion fabrics." },
  { name: "Core-Spun Yarn", image: PRODUCT_IMAGE_MAP["Core-Spun Yarn"], desc: "Strength-enhanced yarn for sewing threads." },
];

const Products = () => (
  <PublicLayout>
    <section className="container py-16">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Catalogue</p>
      <h1 className="mt-1 text-4xl font-semibold">Yarn Products</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Explore our complete range of cotton, blended and specialty yarns. Custom counts, blends and volumes available on request.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => <ProductCard key={p.name} {...p} />)}
      </div>
    </section>
  </PublicLayout>
);

export default Products;
