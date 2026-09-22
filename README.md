# Deen Al Noor Travels

Deen Al Noor Travels is a Hajj and Umrah agency website with a browser-based management dashboard.

## Management system

Open `admin.html` to use the management workspace. It includes:

- Dashboard: income, expenses, profit, outstanding balances and trip overview
- Clients / pilgrims: passport, contact, package and balance records
- Umrah packages: dates, price, hotel, transport and included services
- Payments: deposits, payment history, references and printable receipts
- Expenses: visa, flight, hotel, transport, licence, staff and other costs
- Bookings: flight, accommodation and transport confirmations
- Reports: financial totals and profit by package, printable to PDF
- User account placeholder with admin/staff roles
- WhatsApp payment reminders and client communication links

The current GitHub Pages-friendly implementation uses `localStorage`, so data is stored in the browser used to enter it. The user accounts and WhatsApp links are interface-ready; production deployment should connect them to a secure backend, database, authentication provider and WhatsApp Business Cloud API.

## Existing public website

Open `index.html` for the public Deen Al Noor Travels website and package inquiry form.
