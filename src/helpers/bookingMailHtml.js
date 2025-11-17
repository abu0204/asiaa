export const bookingMailHtml = (data) => {
  return `
  <div style="max-width:600px;margin:auto;padding:20px;background:#f8f8f8;font-family:Arial;border-radius:8px;">
    <h2 style="text-align:center;color:#333;">🚖 Your Trip is Confirmed</h2>
    <p style="font-size:16px;color:#555;">Hi <strong>${data.name}</strong>,</p>
    <p style="font-size:15px;color:#555;">
      Thank you for choosing our service. Below are your booking details:
    </p>

    <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:6px;overflow:hidden;">
      <tbody>
        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;">Name</td>
          <td style="padding:10px;border-bottom:1px solid #eee;">${data.name}</td>
        </tr>

        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;">Email</td>
          <td style="padding:10px;border-bottom:1px solid #eee;">${data.email}</td>
        </tr>

        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;">Mobile</td>
          <td style="padding:10px;border-bottom:1px solid #eee;">${data.mobile}</td>
        </tr>

        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;">Pickup Location</td>
          <td style="padding:10px;border-bottom:1px solid #eee;">${data.pickup}</td>
        </tr>

        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;">Drop Location</td>
          <td style="padding:10px;border-bottom:1px solid #eee;">${data.drop}</td>
        </tr>

        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;">Travel Date & Time</td>
          <td style="padding:10px;border-bottom:1px solid #eee;">${data.dateTime}</td>
        </tr>

        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;">Travel Type</td>
          <td style="padding:10px;border-bottom:1px solid #eee;">${data.travelType}</td>
        </tr>

        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;">Vehicle Type</td>
          <td style="padding:10px;border-bottom:1px solid #eee;">${data.vehicleType}</td>
        </tr>

        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;">Days</td>
          <td style="padding:10px;border-bottom:1px solid #eee;">${data.days}</td>
        </tr>

        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;">Distance</td>
          <td style="padding:10px;border-bottom:1px solid #eee;">${data.distanceVal}</td>
        </tr>

        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;">KM Rate</td>
          <td style="padding:10px;border-bottom:1px solid #eee;">${data.kilometerPerVal}</td>
        </tr>

        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;">Driver Bata</td>
          <td style="padding:10px;border-bottom:1px solid #eee;">${data.driverBata}</td>
        </tr>

        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;">Fare</td>
          <td style="padding:10px;border-bottom:1px solid #eee;">${data.fareVal}</td>
        </tr>

        <tr>
          <td style="padding:10px;font-weight:bold;">Total Amount</td>
          <td style="padding:10px;font-weight:bold;color:#28a745;">${data.totalVal}</td>
        </tr>
      </tbody>
    </table>

    <p style="font-size:15px;color:#555;margin-top:20px;">
      If you have any questions, feel free to reply to this email.
    </p>

    <p style="font-size:14px;color:#777;text-align:center;margin-top:30px;">
      Thank you for choosing our service.<br>
      <strong>Asiaa Travel</strong>
    </p>
  </div>`;
};
