import Link from 'next/link';

export default function InventoryDashboard() {
  return (
    <div className="flex flex-col max-w-md mx-auto p-6 space-y-6">

      {/* Top Count Cards */}
      <div className="grid grid-cols-2 gap-4">

        <div className="border rounded-xl p-6 flex flex-col items-center justify-center">
          <p className="text-4xl font-bold">12</p>
          <p className="text-sm uppercase text-gray-500">Low Stock</p>
        </div>

        <div className="border rounded-xl p-6 flex flex-col items-center justify-center">
          <p className="text-4xl font-bold">4</p>
          <p className="text-sm uppercase text-gray-500">Expiring Soon</p>
        </div>

      </div>

      {/* Inventory Button */}
      <Link href="/inventory">
        <div className="border rounded-xl p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50">
          <span className="font-medium">Check on your inventory</span>
          <span className="text-xl">→</span>
        </div>
      </Link>

    </div>
  );
}