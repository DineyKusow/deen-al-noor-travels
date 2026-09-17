const STORAGE_KEYS = {
  packages: "deenAlNoorPackages",
  transactions: "deenAlNoorTransactions",
  bookings: "deenAlNoorBookings",
};

const WHATSAPP_NUMBER = "254725312074";

const defaultPackages = [
  {
    id: "sep-2026",
    name: "September Umrah Package",
    category: "Umrah",
    price: 1300,
    currency: "USD",
    startDate: "17 September 2026",
    endDate: "27 September 2026",
    image: "https://images.unsplash.com/photo-1565552645632-d725f011c3f7?auto=format&fit=crop&w=1200&q=80",
    description: "A carefully arranged Umrah journey with flights, visa assistance, accommodation, transportation and pilgrimage support.",
  },
  {
    id: "oct-2026",
    name: "October Umrah Package",
    category: "Umrah",
    price: 1300,
    currency: "USD",
    startDate: "5 October 2026",
    endDate: "15 October 2026",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80",
    description: "A comfortable October Umrah package featuring accommodation, transport, visa support and spiritual guidance.",
  },
  {
    id: "nov-2026",
    name: "November Umrah Package",
    category: "Umrah",
    price: 1450,
    currency: "USD",
    startDate: "4 November 2026",
    endDate: "14 November 2026",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80",
    description: "Comfortable Umrah travel with coordination for accommodation, transport, visa support and Ziyaaraat.",
  },
  {
    id: "dec-2026",
    name: "December Umrah Package",
    category: "Umrah",
    price: 0,
    currency: "USD",
    startDate: "December 2026",
    endDate: "",
    image: "https://images.unsplash.com/photo-1590420553376-7d7d3f0d36ae?auto=format&fit=crop&w=1200&q=80",
    description: "Plan your December Umrah journey with our team. Contact us for dates, availability and package pricing.",
  },
  {
    id: "ramadan-2027",
    name: "Last 10 Days of Ramadan Umrah Package",
    category: "Ramadan",
    price: 1600,
    currency: "USD",
    startDate: "Last 10 days of Ramadan 2027",
    endDate: "",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    description: "A special Umrah journey during the last ten blessed days of Ramadan, with travel support, accommodation, visa assistance and spiritual guidance.",
  },
  {
    id: "hajj-2027",
    name: "Hajj 2027",
    category: "Hajj",
    price: 0,
    currency: "KSh",
    startDate: "2027",
    endDate: "",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    description: "Register your interest for Hajj 2027 and contact our team for package availability and details.",
  },
];

function getData(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getPackages() {
  const stored = getData(STORAGE_KEYS.packages);
  if (!stored.length) {
    saveData(STORAGE_KEYS.packages, defaultPackages);
    return defaultPackages;
  }

  const updated = [...stored];
  defaultPackages.forEach((defaultPackage) => {
    const existing = updated.find((pkg) => pkg.id === defaultPackage.id || pkg.name === defaultPackage.name);
    if (!existing) updated.push(defaultPackage);
    else {
      if (defaultPackage.id === "oct-2026") existing.price = 1300;
      if (defaultPackage.id === "ramadan-2027") {
        existing.name = "Last 10 Days of Ramadan Umrah Package";
        existing.price = 1600;
        existing.category = "Ramadan";
        existing.startDate = "Last 10 days of Ramadan 2027";
        existing.description = "A special Umrah journey during the last ten blessed days of Ramadan, with travel support, accommodation, visa assistance and spiritual guidance.";
      }
    }
  });

  saveData(STORAGE_KEYS.packages, updated);
  return updated;
}

function getTransactions() { return getData(STORAGE_KEYS.transactions); }
function getBookings() { return getData(STORAGE_KEYS.bookings); }

function formatMoney(amount, currency = "KSh") {
  const number = Number(amount) || 0;
  return currency === "USD"
    ? `USD ${number.toLocaleString("en-US")}`
    : `KSh ${number.toLocaleString("en-KE")}`;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function renderPublicPackages() {
  const grid = document.getElementById("packageGrid");
  if (!grid) return;
  const packages = getPackages();
  if (!packages.length) {
    grid.innerHTML = '<p class="empty-state">No packages are currently available. Please contact us.</p>';
    return;
  }

  grid.innerHTML = packages.map((pkg) => {
    const dateText = pkg.startDate || pkg.endDate
      ? `${escapeHTML(pkg.startDate || "")}${pkg.endDate ? ` – ${escapeHTML(pkg.endDate)}` : ""}`
      : "Dates on request";
    const price = Number(pkg.price) > 0 ? formatMoney(pkg.price, pkg.currency || "KSh") : "Contact us";
    const image = pkg.image || defaultPackages[0].image;
    const whatsappMessage = encodeURIComponent(`Assalamu Alaikum, I am interested in the ${pkg.name} package. Please send me the details.`);

    return `<article class="package-card">
      <div class="package-thumb" style="background-image:url('${escapeHTML(image)}')">
        <span class="package-badge">${escapeHTML(pkg.category || "Travel")}</span>
      </div>
      <div class="package-body">
        <h3>${escapeHTML(pkg.name)}</h3>
        <p>${escapeHTML(pkg.description || "")}</p>
        <div class="package-meta"><span>📅 ${dateText}</span></div>
        <div class="package-price-row">
          <strong>${price}</strong>
          <a class="btn btn-primary" target="_blank" rel="noopener" href="https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}">Book</a>
        </div>
      </div>
    </article>`;
  }).join("");
}

function populatePublicPackageSelect() {
  const select = document.getElementById("packageSelect");
  if (!select) return;
  select.innerHTML = '<option value="">Select package</option>' + getPackages().map((pkg) =>
    `<option value="${escapeHTML(pkg.name)}">${escapeHTML(pkg.name)}</option>`).join("");
}

function setupBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("fullName")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const packageName = document.getElementById("packageSelect")?.value.trim();
    const message = document.getElementById("message")?.value.trim();
    if (!name || !phone || !packageName) {
      alert("Please complete your name, phone number and package.");
      return;
    }
    const booking = { id: createId(), name, phone, packageName, message, date: new Date().toISOString() };
    const bookings = getBookings();
    bookings.unshift(booking);
    saveData(STORAGE_KEYS.bookings, bookings);
    const whatsappText = encodeURIComponent(`Assalamu Alaikum DEEN AL NOOR TRAVELS,\n\nName: ${name}\nPhone: ${phone}\nPackage: ${packageName}\nMessage: ${message || "I would like more information and booking assistance."}`);
    form.reset();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`, "_blank", "noopener");
    alert("Your inquiry has been saved. WhatsApp will open so you can send it directly to DEEN AL NOOR TRAVELS.");
  });
}

function renderAdminPackages() {
  const list = document.getElementById("packageList");
  if (!list) return;
  const packages = getPackages();
  if (!packages.length) { list.innerHTML = "<p>No packages added yet.</p>"; return; }
  list.innerHTML = packages.map((pkg) => `<div class="list-item"><div><strong>${escapeHTML(pkg.name)}</strong><small>${escapeHTML(pkg.category || "Travel")} ${Number(pkg.price) > 0 ? ` • ${formatMoney(pkg.price, pkg.currency || "KSh")}` : ""}</small></div><button type="button" class="btn btn-outline delete-package" data-id="${escapeHTML(pkg.id)}">Delete</button></div>`).join("");
  list.querySelectorAll(".delete-package").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.id;
    const pkg = getPackages().find((item) => item.id === id);
    if (!pkg || !confirm(`Delete "${pkg.name}"?`)) return;
    saveData(STORAGE_KEYS.packages, getPackages().filter((item) => item.id !== id));
    renderAdminPackages(); renderPublicPackages(); populatePublicPackageSelect();
  }));
}

function setupPackageForm() {
  const form = document.getElementById("packageForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const packageName = document.getElementById("packageName")?.value.trim();
    const category = document.getElementById("packageCategory")?.value.trim();
    const price = Number(document.getElementById("packagePrice")?.value);
    const image = document.getElementById("packageImage")?.value.trim();
    const description = document.getElementById("packageDescription")?.value.trim();
    if (!packageName || !category || !price || price < 1) { alert("Please enter the package name, category and a valid price."); return; }
    const packages = getPackages();
    packages.unshift({ id: createId(), name: packageName, category, price, currency: "KSh", startDate: "", endDate: "", image, description });
    saveData(STORAGE_KEYS.packages, packages); form.reset(); renderAdminPackages(); renderPublicPackages(); populatePublicPackageSelect(); alert("Package added successfully.");
  });
}

function setupIncomeForm() {
  const form = document.getElementById("incomeForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const customer = document.getElementById("incomeCustomer")?.value.trim();
    const packageName = document.getElementById("incomePackage")?.value.trim();
    const amount = Number(document.getElementById("incomeAmount")?.value);
    const method = document.getElementById("incomeMethod")?.value;
    if (!customer || !packageName || !amount || amount < 1) { alert("Please enter all payment details."); return; }
    const transactions = getTransactions();
    transactions.unshift({ id: createId(), date: new Date().toISOString(), type: "income", description: `${customer} — ${packageName}`, amount, method });
    saveData(STORAGE_KEYS.transactions, transactions); form.reset(); renderTransactions(); updateFinanceSummary(); alert("Payment saved successfully.");
  });
}

function setupExpenseForm() {
  const form = document.getElementById("expenseForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("expenseTitle")?.value.trim();
    const category = document.getElementById("expenseCategory")?.value;
    const amount = Number(document.getElementById("expenseAmount")?.value);
    if (!title || !amount || amount < 1) { alert("Please enter the expense title and a valid amount."); return; }
    const transactions = getTransactions();
    transactions.unshift({ id: createId(), date: new Date().toISOString(), type: "expense", description: `${title} — ${category}`, amount, method: "Expense" });
    saveData(STORAGE_KEYS.transactions, transactions); form.reset(); renderTransactions(); updateFinanceSummary(); alert("Expense saved successfully.");
  });
}

function renderTransactions() {
  const tbody = document.getElementById("transactionTableBody");
  if (!tbody) return;
  const transactions = getTransactions();
  if (!transactions.length) { tbody.innerHTML = '<tr><td colspan="5">No transactions recorded yet.</td></tr>'; return; }
  tbody.innerHTML = transactions.map((transaction) => `<tr><td>${new Date(transaction.date).toLocaleDateString("en-KE")}</td><td><span class="type-tag ${escapeHTML(transaction.type)}">${escapeHTML(transaction.type)}</span></td><td>${escapeHTML(transaction.description)}</td><td>${formatMoney(transaction.amount)}</td><td>${escapeHTML(transaction.method || "-")}</td></tr>`).join("");
}

function updateFinanceSummary() {
  const transactions = getTransactions();
  const income = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const expenses = transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalIncome = document.getElementById("totalIncome");
  const totalExpenses = document.getElementById("totalExpenses");
  const netProfit = document.getElementById("netProfit");
  const bookingCount = document.getElementById("bookingCount");
  if (totalIncome) totalIncome.textContent = formatMoney(income);
  if (totalExpenses) totalExpenses.textContent = formatMoney(expenses);
  if (netProfit) netProfit.textContent = formatMoney(income - expenses);
  if (bookingCount) bookingCount.textContent = getBookings().length;
}

function renderBookings() {
  const tbody = document.getElementById("bookingTableBody");
  if (!tbody) return;
  const bookings = getBookings();
  if (!bookings.length) { tbody.innerHTML = '<tr><td colspan="5">No booking inquiries yet.</td></tr>'; return; }
  tbody.innerHTML = bookings.map((booking) => `<tr><td>${escapeHTML(booking.name)}</td><td>${escapeHTML(booking.phone)}</td><td>${escapeHTML(booking.packageName)}</td><td>${escapeHTML(booking.message || "-")}</td><td>${new Date(booking.date).toLocaleString("en-KE")}</td></tr>`).join("");
}

function setupLogout() {
  const button = document.getElementById("logoutBtn");
  if (button) button.addEventListener("click", () => { window.location.href = "index.html"; });
}

document.addEventListener("DOMContentLoaded", () => {
  getPackages();
  renderPublicPackages();
  populatePublicPackageSelect();
  setupBookingForm();
  renderAdminPackages();
  setupPackageForm();
  setupIncomeForm();
  setupExpenseForm();
  renderTransactions();
  renderBookings();
  updateFinanceSummary();
  setupLogout();
});
