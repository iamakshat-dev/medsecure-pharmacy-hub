import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Medicine {
  id: number;
  name: string;
  batch: string;
  stock: number;
  price: number;
  expiry: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const initialMedicines: Medicine[] = [
  { id: 1, name: 'Paracetamol 500mg', batch: 'BAT-2026-001', stock: 2400, price: 3.50, expiry: '2027-06-15', status: 'In Stock' },
  { id: 2, name: 'Amoxicillin 250mg', batch: 'BAT-2026-002', stock: 12, price: 8.75, expiry: '2026-12-01', status: 'Low Stock' },
  { id: 3, name: 'Ibuprofen 400mg', batch: 'BAT-2026-003', stock: 1800, price: 4.20, expiry: '2027-03-20', status: 'In Stock' },
  { id: 4, name: 'Cetirizine 10mg', batch: 'BAT-2026-004', stock: 0, price: 2.90, expiry: '2026-09-10', status: 'Out of Stock' },
  { id: 5, name: 'Metformin 500mg', batch: 'BAT-2026-005', stock: 950, price: 6.40, expiry: '2027-08-25', status: 'In Stock' },
  { id: 6, name: 'Omeprazole 20mg', batch: 'BAT-2026-006', stock: 45, price: 5.60, expiry: '2026-11-30', status: 'Low Stock' },
];

const statusStyles: Record<string, string> = {
  'In Stock': 'bg-secondary/10 text-secondary border-secondary/20',
  'Low Stock': 'bg-destructive/10 text-destructive border-destructive/20',
  'Out of Stock': 'bg-muted text-muted-foreground border-border',
};

export default function Inventory() {
  const [medicines, setMedicines] = useState(initialMedicines);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', batch: '', stock: '', price: '', expiry: '' });
  const { ref, isVisible } = useScrollAnimation();

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.batch.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    const stock = parseInt(newMed.stock);
    const med: Medicine = {
      id: Date.now(),
      name: newMed.name,
      batch: newMed.batch,
      stock,
      price: parseFloat(newMed.price),
      expiry: newMed.expiry,
      status: stock === 0 ? 'Out of Stock' : stock < 50 ? 'Low Stock' : 'In Stock',
    };
    setMedicines([med, ...medicines]);
    setNewMed({ name: '', batch: '', stock: '', price: '', expiry: '' });
    setShowAdd(false);
  };

  const handleDelete = (id: number) => {
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>Inventory</h1>
          <p className="text-sm text-muted-foreground">Manage your medicine stock</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gradient-primary text-primary-foreground border-0 hover-scale">
          <Plus className="mr-2 h-4 w-4" />
          Add Medicine
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search medicines or batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div
        ref={ref}
        className={`overflow-hidden rounded-2xl border border-border bg-card shadow-card ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Medicine</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Batch</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Expiry</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((med, i) => (
                <tr
                  key={med.id}
                  className={`group border-b border-border transition-colors hover:bg-accent/30 ${
                    isVisible ? 'animate-slide-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${0.05 * (i + 1)}s` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-card-foreground">{med.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{med.batch}</td>
                  <td className="px-6 py-4 text-sm font-medium text-card-foreground">{med.stock.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">${med.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{med.expiry}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`${statusStyles[med.status]} ${med.status === 'Low Stock' ? 'animate-pulse-soft' : ''}`}>
                      {med.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-primary transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(med.id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medicine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Medicine Name</Label>
              <Input value={newMed.name} onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} placeholder="e.g. Paracetamol 500mg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Batch Number</Label>
                <Input value={newMed.batch} onChange={(e) => setNewMed({ ...newMed, batch: e.target.value })} placeholder="BAT-2026-XXX" />
              </div>
              <div className="space-y-2">
                <Label>Stock Qty</Label>
                <Input type="number" value={newMed.stock} onChange={(e) => setNewMed({ ...newMed, stock: e.target.value })} placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input type="number" step="0.01" value={newMed.price} onChange={(e) => setNewMed({ ...newMed, price: e.target.value })} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input type="date" value={newMed.expiry} onChange={(e) => setNewMed({ ...newMed, expiry: e.target.value })} />
              </div>
            </div>
            <Button onClick={handleAdd} disabled={!newMed.name || !newMed.batch} className="w-full gradient-primary text-primary-foreground border-0">
              Add to Inventory
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
