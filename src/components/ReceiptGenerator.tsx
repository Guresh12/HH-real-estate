import { useRef } from 'react';
import { Printer, Download } from 'lucide-react';
import { Receipt, Client, Property, Plot } from '../types/database';
import { formatKES } from '../lib/currency';

interface ReceiptGeneratorProps {
  receipt: Receipt & {
    client?: Client;
    property?: Property;
    plot?: Plot;
  };
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  companyLogoUrl?: string;
}

export function ReceiptGenerator({
  receipt,
  companyName,
  companyPhone,
  companyEmail,
  companyAddress,
  companyLogoUrl,
}: ReceiptGeneratorProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write(receiptRef.current.innerHTML);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownload = () => {
    if (receiptRef.current) {
      const element = receiptRef.current;
      const opt = {
        margin: 10,
        filename: `receipt-${receipt.receipt_no}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      };
      alert('PDF download integration needed - using print for now');
      handlePrint();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Printer className="h-4 w-4" />
          Print Receipt
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>

      <div
        ref={receiptRef}
        className="bg-white p-12 max-w-2xl mx-auto border-2 border-gray-300 rounded-lg"
        style={{ minHeight: '800px' }}
      >
        <div className="text-center mb-8">
          {companyLogoUrl && (
            <img src={companyLogoUrl} alt="Company Logo" className="h-16 mx-auto mb-4" />
          )}
          <h1 className="text-3xl font-bold text-gray-900">{companyName}</h1>
          <p className="text-gray-600 mt-2">{companyAddress}</p>
          <p className="text-gray-600">Tel: {companyPhone} | Email: {companyEmail}</p>
        </div>

        <div className="border-t-2 border-b-2 border-gray-300 py-6 mb-6">
          <h2 className="text-2xl font-bold text-center text-gray-900">RECEIPT</h2>
          <div className="grid grid-cols-2 gap-8 mt-4">
            <div>
              <p className="text-xs text-gray-600">Receipt No:</p>
              <p className="text-lg font-bold text-gray-900">{receipt.receipt_no}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Date:</p>
              <p className="text-lg font-bold text-gray-900">
                {new Date(receipt.date).toLocaleDateString('en-KE')}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-gray-900 mb-3">BILL TO:</h3>
          {receipt.client && (
            <div className="text-gray-700 space-y-1">
              <p className="font-medium">{receipt.client.name}</p>
              <p>{receipt.client.email}</p>
              <p>{receipt.client.phone}</p>
              {receipt.client.physical_address && <p>{receipt.client.physical_address}</p>}
              {receipt.client.id_number && (
                <p>{receipt.client.id_type}: {receipt.client.id_number}</p>
              )}
            </div>
          )}
        </div>

        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-t-2 border-b-2 border-gray-300">
                <th className="text-left py-3 text-gray-900 font-bold">Description</th>
                <th className="text-right py-3 text-gray-900 font-bold">Amount (KES)</th>
              </tr>
            </thead>
            <tbody>
              {receipt.property && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-700">Property: {receipt.property.title}</td>
                  <td className="text-right text-gray-700">{formatKES(receipt.property.price)}</td>
                </tr>
              )}
              {receipt.plot && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-700">Plot #{receipt.plot.plot_no} - {receipt.plot.location}</td>
                  <td className="text-right text-gray-700">{formatKES(receipt.plot.price)}</td>
                </tr>
              )}
              <tr className="border-t-2 border-b-2 border-gray-300">
                <td className="py-4 text-gray-900 font-bold">Amount Paid</td>
                <td className="text-right py-4 text-gray-900 font-bold text-xl">
                  {formatKES(receipt.amount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-8">
          <p className="text-xs text-gray-600 mb-1">Payment Method:</p>
          <p className="text-gray-900 font-medium">{receipt.payment_method}</p>
        </div>

        {receipt.notes && (
          <div className="mb-8">
            <p className="text-xs text-gray-600 mb-1">Notes:</p>
            <p className="text-gray-700">{receipt.notes}</p>
          </div>
        )}

        <div className="mt-12 pt-8 border-t-2 border-gray-300 text-center">
          <p className="text-xs text-gray-600">Thank you for your business!</p>
          <p className="text-xs text-gray-600 mt-2">
            This is a computer-generated receipt and does not require a signature.
          </p>
        </div>
      </div>
    </div>
  );
}
