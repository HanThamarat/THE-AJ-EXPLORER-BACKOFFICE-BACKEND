import { Prisma } from "@prisma/client";
import { CurrencyConvert } from "../currencyConvertion";

type BookType = Prisma.BookingGetPayload<{
  select: {
      bookingId: true,
      adultPrice: true,
      adultQty: true,
      childPrice: true,
      childQty: true,
      amount: true,
      groupPrice: true,
      groupQty: true,
      booker: {
          select: {
              email: true,
              firstName: true,
              lastName: true
          }
      }
  }
}>;

export const NormalBookingSumary = (bookData: BookType) => `
<!DOCTYPE html>
<html>
  <body style="background:#f3f4f6; margin:0; padding:20px; font-family:Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto;">

      <!-- TOP BANNER -->
      <tr>
        <td style="background:#023047; border-radius:20px; padding:40px; text-align:center;">
          <img src="https://drive.google.com/uc?id=1HKq2QuWmltGMts8C1NE2JUQWiqSsg61B" width="300" />
        </td>
      </tr>

      <!-- SPACER -->
      <tr>
        <td style="height:20px; line-height:20px; font-size:0;">&nbsp;</td>
      </tr>
      <tr>
        <td style="background:#fff; border-radius:20px; padding:20px;">
          <p style="font-size:20px; color:#6b7280;">Hi ${bookData.booker.firstName} ${bookData.booker.lastName},</p>
          <p style="font-size:20px; color:#6b7280;">Thank you for your booking.</p>

          <p style="margin-top:20px; color:#6b7280; font-size:14px;">
            Your booking (#${bookData.bookingId}) was successful and your payment has been processed.
            Here is your booking summary:
          </p>
        </td>
      </tr>

      <!-- SPACER -->
      <tr>
        <td style="height:20px; line-height:20px; font-size:0;">&nbsp;</td>
      </tr>

      <!-- SUMMARY -->
      <tr>
        <td style="background:#fff; border-radius:20px; padding:20px;">
          <h3 style="text-align:center; color:#6b7280;">Booking summary</h3>
          <hr />

          <table width="100%" style="margin-top:10px; color:#6b7280; font-size:14px;">
            <tr>
              <td>Adult x ${bookData.adultQty}</td>
              <td align="right">${CurrencyConvert.currencyConvertToThai(bookData.adultPrice as number)} THB</td>
            </tr>
            <tr>
              <td>Child x ${bookData.childQty}</td>
              <td align="right">${CurrencyConvert.currencyConvertToThai(bookData.childPrice as number)} THB</td>
            </tr>
          </table>

          <hr style="margin-top:10px;" />

          <table width="100%" style="margin-top:10px; font-size:20px; color:#6b7280;">
            <tr>
              <td><strong>Total</strong></td>
              <td align="right"><strong>${CurrencyConvert.currencyConvertToThai(bookData.amount as number)} THB</strong></td>
            </tr>
          </table>
        </td>
      </tr>

    </table>

  </body>
</html>
`;

export const GroupBookingSumary = (bookData: BookType) => `
<!DOCTYPE html>
<html>
  <body style="background:#f3f4f6; margin:0; padding:20px; font-family:Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto;">

      <!-- TOP BANNER -->
      <tr>
        <td style="background:#023047; border-radius:20px; padding:40px; text-align:center;">
          <img src="https://drive.google.com/uc?id=1HKq2QuWmltGMts8C1NE2JUQWiqSsg61B" width="300" />
        </td>
      </tr>

      <!-- SPACER -->
      <tr>
        <td style="height:20px; line-height:20px; font-size:0;">&nbsp;</td>
      </tr>

      <!-- GREETING -->
      <tr>
        <td style="background:#fff; border-radius:20px; padding:20px;">
          <p style="font-size:20px; color:#6b7280;">Hi ${bookData.booker.firstName} ${bookData.booker.lastName},</p>
          <p style="font-size:20px; color:#6b7280;">Thank you for your booking.</p>

          <p style="margin-top:20px; color:#6b7280; font-size:14px;">
            Your booking (#${bookData.bookingId}) was successful and your payment has been processed.
            Here is your booking summary:
          </p>
        </td>
      </tr>

      <!-- SPACER -->
      <tr>
        <td style="height:20px; line-height:20px; font-size:0;">&nbsp;</td>
      </tr>

      <!-- SUMMARY -->
      <tr>
        <td style="background:#fff; border-radius:20px; padding:20px;">
          <h3 style="text-align:center; color:#6b7280;">Booking summary</h3>
          <hr />

          <table width="100%" style="margin-top:10px; color:#6b7280; font-size:14px;">
            <tr>
              <td>Group x ${bookData.groupQty}</td>
              <td align="right">${CurrencyConvert.currencyConvertToThai(bookData.groupPrice as number)} THB</td>
            </tr>
          </table>

          <hr style="margin-top:10px;" />

          <table width="100%" style="margin-top:10px; font-size:20px; color:#6b7280;">
            <tr>
              <td><strong>Total</strong></td>
              <td align="right"><strong>${CurrencyConvert.currencyConvertToThai(bookData.amount as number)} THB</strong></td>
            </tr>
          </table>
        </td>
      </tr>

    </table>

  </body>
</html>
`;