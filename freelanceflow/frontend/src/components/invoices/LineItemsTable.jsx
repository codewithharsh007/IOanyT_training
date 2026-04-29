// Line items table for invoice detail.
const LineItemsTable = ({ lineItems }) => (
  <div className="border border-slate-200 rounded-lg overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-slate-50 text-slate-500">
        <tr>
          <th className="text-left px-3 py-2">Description</th>
          <th className="text-left px-3 py-2">Quantity</th>
          <th className="text-left px-3 py-2">Unit Price</th>
          <th className="text-right px-3 py-2">Total</th>
        </tr>
      </thead>
      <tbody>
        {lineItems.map((item, index) => (
          <tr key={index} className="border-t border-slate-100">
            <td className="px-3 py-2">{item.description}</td>
            <td className="px-3 py-2">{item.quantity}</td>
            <td className="px-3 py-2">{item.rate}</td>
            <td className="px-3 py-2 text-right">{item.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LineItemsTable;
