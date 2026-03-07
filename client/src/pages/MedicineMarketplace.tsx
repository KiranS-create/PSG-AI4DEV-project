import { useState } from "react";
import { Card, Input, Button, Badge } from "@/components/ui";
import { Search, Pill, Package, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const DUMMY_MEDICINES = [
  { id: 1, name: "Amoxicillin 500mg", type: "Antibiotic", stock: 1250, price: "$12.99" },
  { id: 2, name: "Lisinopril 250mg", type: "Antibiotic", stock: 840, price: "$8.50" },
  { id: 3, name: "Atorvastatin 10mg", type: "Cardiovascular", stock: 2100, price: "$15.00" },
  { id: 4, name: "Metformin 20mg", type: "Cardiovascular", stock: 500, price: "$11.20" },
  { id: 5, name: "Omeprazole 500mg", type: "Antidiabetic", stock: 3200, price: "$6.99" },
  { id: 6, name: "Albuterol 20mg", type: "Gastrointestinal", stock: 150, price: "$18.50" },
];

export default function MedicineMarketplace() {
  const [search, setSearch] = useState("");

  const filtered = DUMMY_MEDICINES.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-card to-background p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        {/* Unsplash image via descriptive comment for marketing aesthetic if needed, but per instructions staying minimal/clinical, avoiding raw stock photos in productivity apps */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Pill className="w-64 h-64 text-primary" />
        </div>
        <div className="relative z-10 w-full md:w-2/3">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Pharmacy Procurement</h1>
          <p className="text-muted-foreground mb-6">Search integrated pharmaceutical networks for inventory and pricing.</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              className="pl-12 h-14 text-lg bg-black/40 border-white/10 rounded-2xl w-full max-w-xl"
              placeholder="Search by medication name, generic, or class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((med, i) => (
          <motion.div
            key={med.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-6 hover:border-primary/30 transition-all group flex flex-col h-full bg-black/20">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Pill className="w-6 h-6" />
                </div>
                <div className="text-xl font-bold text-white">{med.price}</div>
              </div>
              <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">{med.name}</h3>
              <div className="text-sm text-muted-foreground mb-6">{med.type}</div>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className={med.stock < 500 ? "text-warning" : "text-success"}>
                    {med.stock} in stock
                  </span>
                </div>
                <Button size="sm" className="gap-2 bg-white/5 text-foreground hover:bg-primary hover:text-primary-foreground border-0">
                  <ShoppingCart className="w-4 h-4" />
                  Order
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <Pill className="w-16 h-16 text-muted-foreground opacity-20 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">No medications found</h3>
            <p className="text-muted-foreground">Try adjusting your search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
