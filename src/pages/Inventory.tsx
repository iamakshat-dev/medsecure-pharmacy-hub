import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Package, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';

import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createInventoryItem, deleteInventoryItem, getInventory, type InventoryItem, updateInventoryItem } from '@/services/api';

type InventoryFormState = {
  name: string;
  batch: string;
  stock: string;
  price: string;
  expiry: string;
};

const initialFormState: InventoryFormState = {
  name: '',
  batch: '',
  stock: '',
  price: '',
  expiry: '',
};

export default function Inventory() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editMed, setEditMed] = useState<InventoryItem | null>(null);
  const [newMed, setNewMed] = useState<InventoryFormState>(initialFormState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicines = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getInventory();
      setMedicines(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMedicines();
  }, []);

  const filtered = useMemo(
    () =>
      medicines.filter((medicine) => {
        const query = search.toLowerCase();
        return (
          medicine.name.toLowerCase().includes(query) ||
          medicine.batch.toLowerCase().includes(query) ||
          medicine.current_owner_name.toLowerCase().includes(query)
        );
      }),
    [medicines, search],
  );

  const getStockStatus = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 50) return 'Low Stock';
    return 'In Stock';
  };

  const handleAdd = async () => {
    try {
      await createInventoryItem({
        name: newMed.name,
        batch: newMed.batch,
        stock: Number(newMed.stock),
        price: Number(newMed.price),
        expiry: newMed.expiry,
      });

      setShowAdd(false);
      setNewMed(initialFormState);
      await fetchMedicines();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to add medicine');
    }
  };

  const handleDelete = async (batchId: string) => {
    try {
      await deleteInventoryItem(batchId);
      await fetchMedicines();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete medicine');
    }
  };

  const handleUpdate = async () => {
    if (!editMed) return;

    try {
      await updateInventoryItem(editMed.batch, {
        name: editMed.name,
        batch: editMed.batch,
        stock: Number(editMed.stock),
        price: Number(editMed.price),
        expiry: editMed.expiry || '',
      });

      setShowEdit(false);
      setEditMed(null);
      await fetchMedicines();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update medicine');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-sm text-muted-foreground">Manage your medicine stock</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Medicine
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search medicines, batch, or current owner..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10"
          />
        </div>

        <div className="rounded-2xl border border-white/8 bg-card/70 px-4 py-3 text-sm text-muted-foreground">
          {loading ? 'Refreshing inventory...' : `${filtered.length} visible batches`}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-400/15 bg-rose-400/8 px-4 py-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left">Medicine</th>
                <th className="p-4 text-left">Batch</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Expiry</th>
                <th className="p-4 text-left">Current Owner</th>
                <th className="p-4 text-left">Trust</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((medicine) => {
                const stockStatus = getStockStatus(medicine.stock);
                return (
                  <tr key={medicine.id} className="border-b hover:bg-accent/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium text-card-foreground">{medicine.name}</p>
                          <p className="text-xs text-muted-foreground">Medicine ID #{medicine.medicine_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-card-foreground">{medicine.batch || 'N/A'}</td>
                    <td className="p-4 text-sm text-card-foreground">{medicine.stock ?? 0}</td>
                    <td className="p-4 text-sm text-card-foreground">
                      ${Number.isFinite(Number(medicine.price)) ? Number(medicine.price).toFixed(2) : '0.00'}
                    </td>
                    <td className="p-4 text-sm text-card-foreground">
                      {medicine.expiry?.split('T')[0] || 'N/A'}
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-card-foreground">
                        {medicine.current_owner_name || 'Unassigned'}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {medicine.current_owner_role || 'No active owner'}
                      </p>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={medicine.verification_status || 'Unverified'} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={stockStatus} />
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/authentication?batch=${encodeURIComponent(medicine.batch)}`)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          title="Verify batch"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditMed(medicine);
                            setShowEdit(true);
                          }}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => void handleDelete(medicine.batch)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-sm text-muted-foreground">
                    No inventory batches matched your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medicine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Name" value={newMed.name} onChange={(event) => setNewMed({ ...newMed, name: event.target.value })} />
            <Input placeholder="Batch" value={newMed.batch} onChange={(event) => setNewMed({ ...newMed, batch: event.target.value })} />
            <Input type="number" placeholder="Stock" value={newMed.stock} onChange={(event) => setNewMed({ ...newMed, stock: event.target.value })} />
            <Input type="number" placeholder="Price" value={newMed.price} onChange={(event) => setNewMed({ ...newMed, price: event.target.value })} />
            <Input type="date" value={newMed.expiry} onChange={(event) => setNewMed({ ...newMed, expiry: event.target.value })} />
            <Button onClick={() => void handleAdd()} className="w-full">Add</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Medicine</DialogTitle>
          </DialogHeader>

          {editMed && (
            <div className="space-y-4">
              <Input value={editMed.name} onChange={(event) => setEditMed({ ...editMed, name: event.target.value })} />
              <Input value={editMed.batch} disabled />
              <Input type="number" value={editMed.stock} onChange={(event) => setEditMed({ ...editMed, stock: Number(event.target.value) })} />
              <Input type="number" value={editMed.price} onChange={(event) => setEditMed({ ...editMed, price: Number(event.target.value) })} />
              <Input type="date" value={editMed.expiry?.split('T')[0] || ''} onChange={(event) => setEditMed({ ...editMed, expiry: event.target.value })} />
              <Button onClick={() => void handleUpdate()} className="w-full">Update</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
