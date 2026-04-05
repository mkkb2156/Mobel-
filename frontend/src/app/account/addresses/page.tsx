'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  X,
  Home,
  Building,
} from 'lucide-react';

interface AddressData {
  id: string;
  label: string;
  name: string;
  phone: string;
  postal_code: string;
  city: string;
  district: string;
  address_line1: string;
  floor: string;
  has_elevator: boolean;
  is_default: boolean;
}

const initialAddresses: AddressData[] = [
  {
    id: 'addr-001',
    label: '住家',
    name: '林雅芳',
    phone: '0912-345-678',
    postal_code: '110',
    city: '台北市',
    district: '信義區',
    address_line1: '信義路五段7號12樓之1',
    floor: '12樓',
    has_elevator: true,
    is_default: true,
  },
  {
    id: 'addr-002',
    label: '辦公室',
    name: '林雅芳',
    phone: '02-2345-6789',
    postal_code: '104',
    city: '台北市',
    district: '中山區',
    address_line1: '南京東路二段168號5樓',
    floor: '5樓',
    has_elevator: true,
    is_default: false,
  },
];

const emptyForm: Omit<AddressData, 'id'> = {
  label: '',
  name: '',
  phone: '',
  postal_code: '',
  city: '',
  district: '',
  address_line1: '',
  floor: '',
  has_elevator: false,
  is_default: false,
};

function AddressForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData: Omit<AddressData, 'id'>;
  onSubmit: (data: Omit<AddressData, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initialData);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-lg font-semibold text-charcoal">
            {initialData.name ? '編輯地址' : '新增地址'}
          </h3>
          <button
            onClick={onCancel}
            className="text-walnut/60 hover:text-charcoal transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="label"
              label="標籤"
              placeholder="例如：住家、辦公室"
              value={form.label}
              onChange={(e) => updateField('label', e.target.value)}
              required
            />
            <Input
              id="name"
              label="收件人"
              placeholder="收件人姓名"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </div>

          <Input
            id="phone"
            label="電話"
            type="tel"
            placeholder="09XX-XXX-XXX"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              id="postal_code"
              label="郵遞區號"
              placeholder="110"
              value={form.postal_code}
              onChange={(e) => updateField('postal_code', e.target.value)}
              required
            />
            <Input
              id="city"
              label="縣市"
              placeholder="台北市"
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
              required
            />
            <Input
              id="district"
              label="區域"
              placeholder="信義區"
              value={form.district}
              onChange={(e) => updateField('district', e.target.value)}
              required
            />
          </div>

          <Input
            id="address_line1"
            label="地址"
            placeholder="街道、門牌號碼"
            value={form.address_line1}
            onChange={(e) => updateField('address_line1', e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="floor"
              label="樓層"
              placeholder="例如：3樓"
              value={form.floor}
              onChange={(e) => updateField('floor', e.target.value)}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-walnut">
                有無電梯
              </label>
              <div className="flex items-center gap-4 py-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="elevator"
                    checked={form.has_elevator}
                    onChange={() => updateField('has_elevator', true)}
                    className="accent-brass"
                  />
                  <span className="text-sm text-charcoal">有電梯</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="elevator"
                    checked={!form.has_elevator}
                    onChange={() => updateField('has_elevator', false)}
                    className="accent-brass"
                  />
                  <span className="text-sm text-charcoal">無電梯</span>
                </label>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => updateField('is_default', e.target.checked)}
              className="accent-brass"
            />
            <span className="text-sm text-walnut">設為預設地址</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit">儲存地址</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (data: Omit<AddressData, 'id'>) => {
    const newAddress: AddressData = {
      ...data,
      id: `addr-${Date.now()}`,
    };
    if (data.is_default) {
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, is_default: false })).concat(newAddress)
      );
    } else {
      setAddresses((prev) => [...prev, newAddress]);
    }
    setShowForm(false);
  };

  const handleEdit = (data: Omit<AddressData, 'id'>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === editingId) return { ...a, ...data };
        if (data.is_default) return { ...a, is_default: false };
        return a;
      })
    );
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const editingAddress = editingId
    ? addresses.find((a) => a.id === editingId)
    : null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-charcoal">
            地址管理
          </h2>
          <p className="mt-2 text-sm text-walnut/70">管理您的收貨地址</p>
        </div>
        {!showForm && !editingId && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="h-4 w-4" />
            新增地址
          </Button>
        )}
      </div>

      {/* Add Form */}
      {showForm && (
        <AddressForm
          initialData={emptyForm}
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Edit Form */}
      {editingId && editingAddress && (
        <AddressForm
          initialData={{
            label: editingAddress.label,
            name: editingAddress.name,
            phone: editingAddress.phone,
            postal_code: editingAddress.postal_code,
            city: editingAddress.city,
            district: editingAddress.district,
            address_line1: editingAddress.address_line1,
            floor: editingAddress.floor,
            has_elevator: editingAddress.has_elevator,
            is_default: editingAddress.is_default,
          }}
          onSubmit={handleEdit}
          onCancel={() => setEditingId(null)}
        />
      )}

      {/* Address Cards */}
      {addresses.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {address.label === '住家' ? (
                      <Home className="h-4 w-4 text-brass" />
                    ) : (
                      <Building className="h-4 w-4 text-brass" />
                    )}
                    <span className="text-sm font-semibold text-charcoal">
                      {address.label}
                    </span>
                    {address.is_default && (
                      <Badge variant="success">預設</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(address.id)}
                      className="text-walnut/40 hover:text-brass transition-colors"
                      aria-label="編輯"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-walnut/40 hover:text-error transition-colors"
                      aria-label="刪除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-sm text-walnut/80">
                  <p className="font-medium text-charcoal">{address.name}</p>
                  <p>{address.phone}</p>
                  <p>
                    {address.postal_code} {address.city}
                    {address.district}
                  </p>
                  <p>{address.address_line1}</p>
                  {address.floor && (
                    <p className="text-xs text-walnut/60">
                      {address.floor} / {address.has_elevator ? '有電梯' : '無電梯'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
            <MapPin className="h-12 w-12 text-walnut/20" />
            <p className="mt-4 text-walnut/60">尚未新增地址</p>
            <p className="mt-1 text-sm text-walnut/40">
              新增收貨地址以便更快速地完成訂單
            </p>
            <Button className="mt-6" onClick={() => setShowForm(true)}>
              新增地址
            </Button>
          </div>
        )
      )}
    </div>
  );
}
