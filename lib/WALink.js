import dayjs from "dayjs";
import "dayjs/locale/id"; // Indonesian locale
import { Linking } from "react-native";
import sanitizeWhatsapp from "./sanitizeWhatsapp";

dayjs.locale("id");

export const buildWALink = async (sale, user) => {
  try {
    const invoiceNumber = sale.invoice_number;
    const invoiceDate = dayjs(sale.created_at).format("D MMMM YYYY");
    const customerName = sale.customer?.name || "-";
    const storeName = user?.access?.store?.name || "-";
    const customerPhone = sale.customer?.whatsapp || "";
    const totalPrice = sale.total_price;
    

    let orderText = "";
    sale.items.forEach((item) => {
        const productName = item.product?.name || "-";
        const qty = item.quantity;
        const grandTotal = item.total_price;
        orderText += `- ${productName} x${qty} — Rp${grandTotal.toLocaleString("id-ID")}\n`;

        if (item.addons && item.addons.length > 0) {
        item.addons.forEach((addonItem) => {
            const addonName = addonItem.addon?.name || "-";
            const addonQty = addonItem.quantity;
            const addonTotal = addonItem.total_price;
            orderText += `   • ${addonName} x${addonQty} — Rp${addonTotal.toLocaleString("id-ID")}\n`;
        });
        }
    });


    const message = `Halo ${customerName}

    Berikut adalah rincian pesanan Anda :

    *Invoice No* : ${invoiceNumber}
    *Tanggal* : ${invoiceDate}
    *Nama* : ${customerName}
    *Pesanan* :
    ${orderText}
    Total Pembayaran : Rp${totalPrice.toLocaleString("id-ID")}

    Terima kasih atas kepercayaannya

    Salam,
    _${process.env.APP_NAME || user?.access?.store.name}_

    ${`https://nasgormaster.domcloud.dev/invoice/${invoiceNumber}`}`; // replace with your invoice URL

    // Format phone number
    // let waPhone = customerPhone.replace(/[^0-9]/g, ""); // digits only
    // if (waPhone.startsWith("0")) {
    //   waPhone = "62" + waPhone.slice(1); // local to intl format
    // }
    let waPhone = sanitizeWhatsapp(customerPhone, '62');

    const waUrl = `whatsapp://send?phone=${waPhone}&text=${encodeURIComponent(
        message
    )}`;
    console.log(message);

    // Try to open WhatsApp
    try {
        
        await Linking.openURL(waUrl);
    } catch (err) {
        console.error("Error opening WhatsApp:", err);
    }
  } catch (err) {
    console.error(err);
  }
};
