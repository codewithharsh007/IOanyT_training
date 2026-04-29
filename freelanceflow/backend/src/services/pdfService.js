// PDF generation for invoice documents.
const PDFDocument = require('pdfkit');
const { calculateBalanceDue } = require('../utils/invoiceCalculator');

const generateInvoicePDF = (invoiceData) =>
  new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const buffers = [];
      doc.on('data', (data) => buffers.push(data));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const { invoice, lineItems, payments, client, freelancer } = invoiceData;

      doc.fontSize(18).text('Invoice', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Freelancer: ${freelancer.name}`);
      doc.text(`Company: ${freelancer.company || 'N/A'}`);
      doc.text(`Email: ${freelancer.email}`);
      doc.moveDown();

      doc.fontSize(12).text(`Client: ${client.name}`);
      doc.text(`Email: ${client.email}`);
      doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
      doc.text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`);
      doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`);
      doc.moveDown();

      doc.fontSize(12).text('Line Items');
      doc.moveDown(0.5);

      lineItems.forEach((item) => {
        doc.text(`${item.description} | Qty: ${item.quantity} | Rate: ${item.rate} | Total: ${item.total}`);
      });

      doc.moveDown();

      doc.text(`Subtotal: ${invoice.subtotal}`);
      doc.text(`Tax: ${invoice.taxPercent}%`);
      doc.text(`Total: ${invoice.totalAmount}`);

      const balanceDue = calculateBalanceDue(
        Number(invoice.totalAmount),
        payments.map((payment) => ({ amount: Number(payment.amount) }))
      );

      doc.text(`Total Paid: ${payments.reduce((sum, p) => sum + Number(p.amount), 0)}`);
      doc.text(`Balance Due: ${balanceDue}`);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });

module.exports = { generateInvoicePDF };
