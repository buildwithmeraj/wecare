"use server";

const buildInvoiceHtml = (booking) => {
  return `
    <h2>Booking Invoice - Care.xyz</h2>
    <p>Hi ${booking.userName || "Customer"},</p>
    <p>Your booking has been received successfully.</p>
    <ul>
      <li><strong>Service:</strong> ${booking.serviceName}</li>
      <li><strong>Duration:</strong> ${booking.serviceDuration} ${booking.serviceType === "perHour" ? "hour(s)" : "day(s)"}</li>
      <li><strong>Rate:</strong> ${booking.pricePerUnit}</li>
      <li><strong>Total:</strong> ${booking.totalCost}</li>
      <li><strong>Status:</strong> ${booking.status}</li>
      <li><strong>Location:</strong> ${booking.location?.region}, ${booking.location?.district}, ${booking.location?.city}, ${booking.location?.area}</li>
      <li><strong>Address:</strong> ${booking.location?.address}</li>
    </ul>
    <p>Thank you for using Care.xyz.</p>
  `;
};

export const sendInvoiceEmail = async ({ to, booking }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INVOICE_FROM_EMAIL;

  if (!apiKey || !from || !to) {
    return { success: false, message: "Email configuration missing" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Booking Invoice - ${booking.serviceName}`,
        html: buildInvoiceHtml(booking),
      }),
    });

    if (!response.ok) {
      return { success: false, message: "Failed to send invoice email" };
    }

    return { success: true };
  } catch {
    return { success: false, message: "Failed to send invoice email" };
  }
};
