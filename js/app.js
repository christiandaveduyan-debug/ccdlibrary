const demoUsers = [];
    const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://ccdlib-backend.onrender.com").replace(/\/+$/, "");
    const AUTH_TOKEN_KEY = "authToken";
    const SESSION_USER_KEY = "ccdLibraryCurrentUser";
    const SESSION_PAGE_KEY = "ccdLibraryCurrentPage";
    function persistUsers() {
      // Users are persisted by the backend only.
    }

    const pages = {
      dashboard: ["Dashboard", "Welcome back! Here's your library overview."],
      authors: ["Authors", "Manage book authors"],
      publishers: ["Publishers", "Manage publishers"],
      categories: ["Categories", "Manage book categories"],
      inventory: ["Inventory", "Inventory management"],
      barcode: ["Barcode Management", "Manage book barcodes"],
      assets: ["Asset Tracking", "Track library assets"],
      verification: ["Stock Verification", "Verify library stock"],
      missing: ["Missing Items", "Track missing items"],
      damaged: ["Damaged Items", "Manage damaged items"],
      "accession-update": ["Accession Update", "Update item accession numbers"],
      borrow: ["Borrow Books", "Process book loans"],
      return: ["Return Books", "Process book returns"],
      renew: ["Renew Loans", "Renew book loans"],
      reservations: ["Reservations", "Manage reservations"],
      fines: ["Fine Management", "Manage member fines"],
      "borrowing-reports": ["Borrowing Reports", "View borrowing reports"],
      "overdue-reports": ["Overdue Reports", "View overdue reports"],
      "lost-reports": ["Lost Books Reports", "View lost books reports"],
      statistics: ["Statistics", "View library statistics"],
      notifications: ["Notifications", "View and manage notifications"],
      users: ["Users", "Manage system users"],
      permissions: ["Permissions", "Manage user permissions"],
      settings: ["Settings", "Configure library settings"]
    };
    const menuItems = [
      { id: "dashboard", label: "Dashboard", icon: "dashboard", roles: ["admin", "librarian"] },
      { id: "books", label: "Catalog Management", icon: "books", roles: ["admin", "librarian"], children: [["books","Books"],["authors","Authors"],["publishers","Publishers"],["categories","Categories"]] },
      { id: "inventory", label: "Inventory Management", icon: "inventory", roles: ["admin", "librarian"], children: [["inventory","Inventory List"],["barcode","Barcode Management"],["assets","Asset Tracking"],["verification","Stock Verification"],["missing","Missing Items"],["damaged","Damaged Items"],["accession-update","Accession Update"]] },
      { id: "borrowing-reports", label: "Reports", icon: "reports", roles: ["admin", "librarian"], children: [["borrowing-reports","Borrowing Reports"],["overdue-reports","Overdue Reports"],["lost-reports","Lost Books Reports"],["statistics","Statistics"]] },
      { id: "notifications", label: "Notifications", icon: "notifications", roles: ["admin", "librarian"] },
      { id: "users", label: "User Management", icon: "users", roles: ["admin"], children: [["users","Users"],["permissions","Permissions"]] },
      { id: "settings", label: "Settings", icon: "settings", roles: ["admin", "librarian"] }
    ];
    let currentUser = null;
    let currentPage = "dashboard";
    let selectedBookIds = new Set();
    let expanded = new Set(["books"]);
    let filters = { search: "", status: "all", category: "" };
    let borrowSelection = { memberId:"", bookId:"" };
    let accessionLookup = { number:"", bookId:null, verified:false };
    let books = [];
    let members = [];
    let activities = [];
    let notifications = [];
    let barcodeHistory = [];
    let movementHistory = [];
    let verificationRecords = [];
    let damagedRecords = [];
    let accessionHistory = [];
    let customCatalog = { author:[], publisher:[], category:[] };
    let librarySettings = {
      libraryName:"City College of Davao Library",
      tagline:"Dedicated to Excellence, Committed to Service",
      contactEmail:"library@ccd.edu",
      contactPhone:"555-0000",
      address:"Davao City",
      loanDays:14,
      dailyFine:5,
      maxBorrowedBooks:5,
      emailNotifications:true,
      showDashboardNotices:true
    };

    const $ = (sel) => document.querySelector(sel);
    const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
    const id = () => Math.random().toString(36).slice(2, 11);
    const fmt = (date) => new Date(date).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });
    const fmtDateTime = (date) => new Date(date).toLocaleString("en-US", { year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"2-digit" });
    const isoDate = (date = new Date()) => date.toISOString().slice(0, 10);
    const addDays = (date, days) => {
      const next = new Date(date);
      next.setDate(next.getDate() + days);
      return isoDate(next);
    };
    const overdue = (date) => new Date(date) < new Date();
    const daysOverdue = (date) => Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86400000));
    const can = (roles) => roles.includes(currentUser.role);
    let systemConfirmAction = null;

    function systemDialog({ title = "City College of Davao Library", message = "", confirmText = "OK", cancelText = "", onConfirm = null } = {}) {
      const modal = $("#systemModal");
      if (!modal) return;
      systemConfirmAction = typeof onConfirm === "function" ? onConfirm : null;
      modal.innerHTML = `<div class="dialog small system-dialog" role="dialog" aria-modal="true">
        <div class="dialog-head"><h2>${esc(title)}</h2></div>
        <div class="dialog-body">
          <div class="system-mark">${appIcon(cancelText ? "help" : "info")}</div>
          <p class="system-message">${esc(message)}</p>
        </div>
        <div class="dialog-foot">
          ${cancelText ? `<button class="secondary" type="button" data-system-close>${esc(cancelText)}</button>` : ""}
          <button class="primary" type="button" data-system-confirm>${esc(confirmText)}</button>
        </div>
      </div>`;
      modal.style.display = "flex";
    }

    function systemAlert(message, title = "City College of Davao Library") {
      systemDialog({ title, message, confirmText:"OK" });
    }

    function systemConfirm(message, onConfirm, title = "Confirm Action") {
      systemDialog({ title, message, confirmText:"Continue", cancelText:"Cancel", onConfirm });
    }

    function closeSystemDialog(runAction = false) {
      const action = systemConfirmAction;
      systemConfirmAction = null;
      closeModal("systemModal");
      if (runAction && action) action();
    }

    function navIcon(name) {
      const icons = {
        dashboard: `<path d="M3 13h8V3H3z"></path><path d="M13 21h8V11h-8z"></path><path d="M13 3h8v6h-8z"></path><path d="M3 21h8v-6H3z"></path>`,
        books: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-17A2.5 2.5 0 0 1 6.5 2Z"></path><path d="M8 7h8"></path><path d="M8 11h6"></path>`,
        inventory: `<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="M3.3 7 12 12l8.7-5"></path><path d="M12 22V12"></path>`,
        circulation: `<path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>`,
        members: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>`,
        reports: `<path d="M3 3v18h18"></path><path d="M8 17V9"></path><path d="M13 17V5"></path><path d="M18 17v-6"></path>`,
        notifications: `<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>`,
        users: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><path d="M19 8h3"></path><path d="M20.5 6.5v3"></path>`,
        settings: `<circle cx="12" cy="12" r="3"></circle><path d="M12 1v4"></path><path d="M12 19v4"></path><path d="M4.22 4.22l2.83 2.83"></path><path d="M16.95 16.95l2.83 2.83"></path><path d="M1 12h4"></path><path d="M19 12h4"></path><path d="M4.22 19.78l2.83-2.83"></path><path d="M16.95 7.05l2.83-2.83"></path>`
      };
      return `<span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${icons[name] || icons.dashboard}</svg></span>`;
    }

    function appIcon(name) {
      const icons = {
        book: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-17A2.5 2.5 0 0 1 6.5 2Z"></path><path d="M8 7h8"></path><path d="M8 11h6"></path>`,
        check: `<path d="M20 6 9 17l-5-5"></path>`,
        borrow: `<path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>`,
        alert: `<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>`,
        users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>`,
        money: `<circle cx="12" cy="12" r="9"></circle><path d="M14.8 9.2A3 3 0 0 0 12 8c-1.7 0-3 .9-3 2s1.3 2 3 2 3 .9 3 2-1.3 2-3 2a3 3 0 0 1-2.8-1.2"></path><path d="M12 6v12"></path>`,
        bell: `<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>`,
        database: `<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"></path><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"></path>`,
        return: `<path d="m9 14-4-4 4-4"></path><path d="M5 10h11a4 4 0 0 1 0 8h-1"></path>`,
        calendar: `<path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M3 10h18"></path>`,
        trending: `<path d="m3 17 6-6 4 4 8-8"></path><path d="M14 7h7v7"></path>`,
        copy: `<rect x="9" y="9" width="13" height="13" rx="2"></rect><rect x="2" y="2" width="13" height="13" rx="2"></rect>`,
        search: `<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>`,
        tag: `<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"></path><circle cx="7.5" cy="7.5" r=".5"></circle>`,
        edit: `<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>`,
        info: `<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>`,
        help: `<circle cx="12" cy="12" r="10"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c-.8 1.4-2.9 1.6-2.9 3"></path><path d="M12 17h.01"></path>`,
        eye: `<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle>`,
        "eye-off": `<path d="m3 3 18 18"></path><path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-1.2"></path><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.2 3.2"></path><path d="M6.6 6.6C3.6 8.6 2 12 2 12s3.5 7 10 7a10.7 10.7 0 0 0 5.4-1.5"></path>`,
        file: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h5"></path>`,
        damaged: `<path d="m7 2 10 20"></path><path d="M5 5h14l-2 14H7Z"></path>`,
        author: `<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>`,
        publisher: `<path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path><path d="M9 9h.01"></path><path d="M9 13h.01"></path><path d="M9 17h.01"></path>`,
        category: `<path d="M4 4h6v6H4z"></path><path d="M14 4h6v6h-6z"></path><path d="M4 14h6v6H4z"></path><path d="M14 14h6v6h-6z"></path>`
      };
      return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.info}</svg>`;
    }
    function passwordToggleButton(targetSelector) {
      return `<button class="password-toggle" type="button" data-toggle-password="${esc(targetSelector)}" aria-label="Show password" title="Show password">${passwordToggleIcon(false)}</button>`;
    }
    function passwordToggleIcon(visible) {
      return appIcon(visible ? "eye-off" : "eye");
    }
    const accession = (book) => book.accessionNumber || (book.id ? `ACC-${String(book.id).padStart(4, "0")}` : "");
    const barcodeDate = (book) => book.barcodeDateGenerated || `${book.addedDate}T09:00:00`;
    const lastUpdated = (book) => book.lastUpdated || book.borrowDate || book.addedDate;
    const nextBarcode = () => `BC${String(books.length + barcodeHistory.length + 1).padStart(3, "0")}`;
    const nextAccessionNumber = () => {
      const used = new Set(books.map(book => String(book.accessionNumber || "").toLowerCase()).filter(Boolean));
      let number = books.length + 1;
      let candidate = "";
      do {
        candidate = `ACC-${String(number).padStart(4, "0")}`;
        number += 1;
      } while (used.has(candidate.toLowerCase()));
      return candidate;
    };
    const statusLabel = (status) => {
      if (status === "unprocessed") return "No Status";
      if (status === "missing") return "Lost";
      if (status === "replaced") return "Replaced";
      return status ? status[0].toUpperCase() + status.slice(1) : "No Status";
    };
    const accessionStatusLabel = (status) => status === "missing" ? "Missing" : status === "replaced" ? "Replaced" : statusLabel(status);
    const inventoryStatus = (status) => status === "missing" ? "lost" : status === "reserved" ? "borrowed" : status;
    const inventoryStatusLabel = (status) => statusLabel(inventoryStatus(status));
    const verificationRecord = (book) => verificationRecords.find(v => v.bookId === book.id) || {};
    const damagedRecord = (book) => damagedRecords.find(d => d.bookId === book.id && !d.archived) || {
      bookId: book.id,
      description: book.damageNote || "",
      repairStatus: damageStatusLabel(book.repairStatus) || (book.status === "damaged" ? "Damaged" : ""),
      reportedBy: "",
      dateReported: ""
    };
    const memberById = (memberId) => members.find(m => m.id === memberId) || members[0];
    const transactionNumber = () => `TXN-${new Date().getFullYear()}-${String(activities.length + 1).padStart(4, "0")}`;
    const statusClass = (status) => ({
      available: "background:#d1fae5;color:#047857",
      borrowed: "background:#fef3c7;color:#b45309",
      reserved: "background:#e0f2fe;color:#0369a1",
      unprocessed: "background:#f1f5f9;color:#475569",
      replaced: "background:#dcfce7;color:#166534",
      missing: "background:#fee2e2;color:#b91c1c",
      lost: "background:#fee2e2;color:#b91c1c",
      damaged: "background:#ffedd5;color:#c2410c"
    }[status] || "background:#f1f5f9;color:#475569");
    const damageStatusStyle = (status) => ({
      "Damaged": "background:#ffedd5;color:#c2410c",
      "For Repair": "background:#e0f2fe;color:#0369a1",
      "Beyond Repair": "background:#fee2e2;color:#b91c1c",
      "Replaced": "background:#d1fae5;color:#047857"
    }[status] || "background:#f1f5f9;color:#475569");
    const damageStatusLabel = (status) => String(status || "").toLowerCase().includes("minor") ? "Damaged" : (status || "Damaged");

    function showLoginError(message, tone = "error") {
      const error = $("#loginError");
      error.textContent = message;
      error.className = tone === "notice" ? "error notice" : "error";
      error.style.display = "block";
    }

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function showLoginTransition(work) {
      const transition = $("#loginTransition");
      if (!transition) {
        await work();
        return;
      }

      transition.classList.add("active");
      transition.setAttribute("aria-hidden", "false");
      await wait(320);
      await work();
      await wait(760);
      transition.classList.remove("active");
      transition.setAttribute("aria-hidden", "true");
    }

    async function apiRequest(path, body) {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(body)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Request failed.");
      }
      return data.data || null;
    }

    function normalizeApiUser(user, fallback = {}) {
      const cleanEmail = String(user?.email || fallback.email || "").trim().toLowerCase();
      const role = ["admin", "librarian", "member"].includes(user?.role) ? user.role : "librarian";
      const status = ["active", "inactive", "suspended", "pending"].includes(user?.status) ? user.status : "active";

      return {
        id:user?.id ? `U${user.id}` : fallback.id || `U${Date.now().toString(36).toUpperCase()}`,
        name:user?.name || fallback.name || cleanEmail.split("@")[0] || "Library User",
        email:cleanEmail,
        password:fallback.password || "",
        role,
        status,
        createdAt:user?.created_at || user?.createdAt || fallback.createdAt || "",
        lastLogin:user?.last_login || user?.lastLogin || fallback.lastLogin || ""
      };
    }

    function normalizeBackendUser(user) {
      return normalizeApiUser(user, {
        id:user?.id ? `U${user.id}` : "",
        email:user?.email || "",
        name:user?.name || "",
        createdAt:user?.created_at || user?.createdAt || "",
        lastLogin:user?.last_login || user?.lastLogin || ""
      });
    }

    function backendId(userId) {
      return String(userId || "").replace(/^U/, "");
    }

    function syncUser(user) {
      const existing = demoUsers.find(stored => stored.email.toLowerCase() === user.email.toLowerCase() || stored.id === user.id);
      if (existing) Object.assign(existing, user);
      else demoUsers.push(user);
      persistUsers();
      return existing || user;
    }

    function isPageAllowed(pageId, user = currentUser) {
      if (!pages[pageId] || !user) return false;
      return menuItems.some(item =>
        item.roles.includes(user.role) &&
        (item.id === pageId || (item.children || []).some(child => child[0] === pageId))
      );
    }

    function saveSession(user = currentUser) {
      if (!user) return;
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
      localStorage.setItem(SESSION_PAGE_KEY, currentPage);
    }

    function savedPageFor(user) {
      const savedPage = localStorage.getItem(SESSION_PAGE_KEY) || "dashboard";
      return isPageAllowed(savedPage, user) ? savedPage : "dashboard";
    }

    async function completeLogin(user, page = "dashboard", showTransition = true) {
      currentUser = user;
      currentPage = isPageAllowed(page, user) ? page : "dashboard";
      const finishLogin = async () => {
        $("#login").style.display = "none";
        $("#app").classList.add("logged");
        await loadAppData();
        saveSession(user);
        renderShell();
      };
      if (showTransition) await showLoginTransition(finishLogin);
      else await finishLogin();
    }

    async function restoreSession() {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const savedUser = localStorage.getItem(SESSION_USER_KEY);
      if (!token || !savedUser) return;

      try {
        const parsedUser = JSON.parse(savedUser);
        const user = syncUser({
          ...parsedUser,
          role:["admin", "librarian", "member"].includes(parsedUser.role) ? parsedUser.role : "librarian",
          status:["active", "inactive", "suspended", "pending"].includes(parsedUser.status) ? parsedUser.status : "active"
        });
        await completeLogin(user, savedPageFor(user), false);
      } catch (error) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(SESSION_USER_KEY);
        localStorage.removeItem(SESSION_PAGE_KEY);
      }
    }

    async function login(email, password) {
      const cleanEmail = String(email || "").trim().toLowerCase();
      showLoginError("Signing in...", "notice");

      try {
        const response = await apiRequest("/api/login", { email:cleanEmail, password });
        const apiUser = response?.user || response;
        localStorage.setItem(AUTH_TOKEN_KEY, response?.token || "");
        await completeLogin(syncUser(normalizeApiUser(apiUser, { email:cleanEmail })));
      } catch (error) {
        showLoginError(error.message || "Invalid email or password. Please try again.");
      }
    }

    async function submitSignup(form) {
      const data = Object.fromEntries(new FormData(form));
      const cleanEmail = String(data.email || "").trim().toLowerCase();
      const name = String(data.name || "").trim();
      const password = String(data.password || "");
      if (!name || !cleanEmail || password.length < 6) {
        showLoginError("Please complete the signup form. Password must be at least 6 characters.");
        return;
      }
      showLoginError("Creating account...", "notice");

      try {
        const response = await apiRequest("/api/signup", { name, email:cleanEmail, password });
        const apiUser = response?.user || response;
        const normalizedUser = normalizeApiUser(apiUser, { name, email:cleanEmail, password });
        
        // Check if account requires admin approval
        if (normalizedUser.status === "pending") {
          syncUser(normalizedUser);
          form.reset();
          showLoginError("Account request submitted! Please wait for admin approval before you can sign in.", "notice");
          return;
        }
        
        localStorage.setItem("authToken", response?.token || "");
        syncUser(normalizedUser);
        form.reset();
        showLoginError("Account created. You can sign in now.", "notice");
      } catch (error) {
        showLoginError(error.message || "Unable to create account.");
      }
    }

    function logout() {
      currentUser = null;
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(SESSION_USER_KEY);
      localStorage.removeItem(SESSION_PAGE_KEY);
      $("#loginTransition")?.classList.remove("active");
      $("#loginTransition")?.setAttribute("aria-hidden", "true");
      $("#app").classList.remove("logged");
      $("#login").style.display = "grid";
      $("#loginError").style.display = "none";
    }

    async function loadAppData() {
      try {
        // Fetch books
        const booksResponse = await fetch(`${API_BASE_URL}/api/books`);
        if (booksResponse.ok) {
          const booksData = await booksResponse.json();
          if (booksData.success && booksData.data) {
            books = booksData.data.map(b => ({
              id: b.id,
              title: b.title,
              author: b.author || "Unknown",
              authorId: b.author_id || "",
              isbn: b.isbn || "",
              category: b.category || "Uncategorized",
              categoryId: b.category_id || "",
              publisher: b.publisher || "Unknown",
              publisherId: b.publisher_id || "",
              callNumber: b.call_number || "",
              status: b.status,
              location: b.location || "",
              publishedYear: b.published_year || 0,
              copies: b.copies,
              availableCopies: b.available_copies,
              addedDate: b.added_date,
              accessionNumber: b.accession_number || "",
              damageNote: b.damage_note || "",
              repairStatus: b.repair_status || "",
              barcode: b.barcode || ""
            }));
          }
        }

        // Fetch members
        const membersResponse = await fetch(`${API_BASE_URL}/api/members`);
        if (membersResponse.ok) {
          const membersData = await membersResponse.json();
          if (membersData.success && membersData.data) {
            members = membersData.data.map(m => ({
              id: m.id,
              name: m.name,
              course: m.member_type || "Faculty",
              contact: m.phone || "",
              status: "active",
              fines: 0
            }));
          }
        }

        // Fetch categories
        const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories`);
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          if (categoriesData.success && categoriesData.data) {
            customCatalog.category = categoriesData.data.map(c => ({
              id: c.id,
              name: c.name,
              description: c.description || ""
            }));
          }
        }

        // Fetch authors
        const authorsResponse = await fetch(`${API_BASE_URL}/api/authors`);
        if (authorsResponse.ok) {
          const authorsData = await authorsResponse.json();
          if (authorsData.success && authorsData.data) {
            customCatalog.author = authorsData.data.map(a => ({
              id: a.id,
              name: a.name,
              bio: a.bio || "",
              nationality: a.nationality || ""
            }));
          }
        }

        // Fetch publishers
        const publishersResponse = await fetch(`${API_BASE_URL}/api/publishers`);
        if (publishersResponse.ok) {
          const publishersData = await publishersResponse.json();
          if (publishersData.success && publishersData.data) {
            customCatalog.publisher = publishersData.data.map(p => ({
              id: p.id,
              name: p.name,
              address: p.address || "",
              phone: p.phone || "",
              email: p.email || ""
            }));
          }
        }

        // Fetch users from backend to sync pending/updated accounts
        const usersResponse = await fetch(`${API_BASE_URL}/api/users`);
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          if (usersData.success && usersData.data) {
            demoUsers.splice(0, demoUsers.length, ...usersData.data.map(normalizeBackendUser));
          }
        }
      } catch (error) {
        console.error("Error loading app data:", error);
      }
    }

    // API Helper Functions
    async function apiPost(endpoint, data) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        return await response.json();
      } catch (error) {
        console.error("API error:", error);
        return { success: false, message: error.message };
      }
    }

    async function apiPut(endpoint, data) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        return await response.json();
      } catch (error) {
        console.error("API error:", error);
        return { success: false, message: error.message };
      }
    }

    async function apiDelete(endpoint) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });
        return await response.json();
      } catch (error) {
        console.error("API error:", error);
        return { success: false, message: error.message };
      }
    }

    async function apiDeleteWithBody(endpoint, data) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        return await response.json();
      } catch (error) {
        console.error("API error:", error);
        return { success: false, message: error.message };
      }
    }

    async function ensureCatalogEntry(type, name) {
      const cleanName = String(name || "").trim();
      if (!cleanName) return null;

      const existing = catalogEntries(type).find(entry => entry.name.toLowerCase() === cleanName.toLowerCase());
      if (existing?.id) return existing.id;

      const response = type === "author"
        ? await saveAuthorToAPI(cleanName, "", "", true)
        : type === "category"
          ? await saveCategoryToAPI(cleanName, "", true)
          : await savePublisherToAPI(cleanName, "", "", "", true);

      if (!response.success) throw new Error(response.message || `Unable to save ${type}.`);

      const entry = { id:response.data, name:cleanName };
      customCatalog[type].push(entry);
      return entry.id;
    }

    // Save book to Supabase
    async function saveBookToAPI(book, isNew = false) {
      book.authorId = await ensureCatalogEntry("author", book.author);
      book.categoryId = await ensureCatalogEntry("category", book.category);
      book.publisherId = await ensureCatalogEntry("publisher", book.publisher);
      const optionalText = (value) => cleanImportValue(value) || null;
      const copies = Number(book.copies);
      const availableCopies = Number(book.availableCopies);

      const payload = {
        title: book.title,
        author_id: book.authorId,
        category_id: book.categoryId,
        publisher_id: book.publisherId,
        isbn: optionalText(book.isbn),
        call_number: optionalText(book.callNumber),
        status: book.status === "lost" ? "missing" : book.status,
        location: optionalText(book.location),
        published_year: Number(book.publishedYear) || 0,
        copies: Number.isFinite(copies) && copies > 0 ? copies : 1,
        available_copies: Number.isFinite(availableCopies) ? Math.max(0, availableCopies) : 1,
        accession_number: optionalText(book.accessionNumber || accession(book)),
        damage_note: book.damageNote ?? null,
        repair_status: book.repairStatus ?? null,
        barcode: optionalText(book.barcode)
      };

      if (isNew) {
        return await apiPost("/api/books", payload);
      } else {
        return await apiPut(`/api/books/${book.id}`, payload);
      }
    }

    // Delete book from Supabase
    async function deleteBookFromAPI(bookId) {
      return await apiDelete(`/api/books/${bookId}`);
    }

    async function deleteSelectedBooksFromAPI(bookIds) {
      return await apiDeleteWithBody("/api/books", { ids:bookIds });
    }

    // Save category to Supabase
    async function saveCategoryToAPI(name, description = "", isNew = false) {
      const payload = { name, description };
      if (isNew) {
        return await apiPost("/api/categories", payload);
      } else {
        // For now, categories are identified by name in the UI, but in API they use ID
        // This would need adjustment based on how you want to handle updates
        return { success: true, message: "Category saved" };
      }
    }

    // Delete category from Supabase
    async function deleteCategoryFromAPI(categoryId) {
      return await apiDelete(`/api/categories/${categoryId}`);
    }

    // Save author to Supabase
    async function saveAuthorToAPI(name, bio = "", nationality = "", isNew = false) {
      const payload = { name, bio, nationality };
      if (isNew) {
        return await apiPost("/api/authors", payload);
      } else {
        return { success: true, message: "Author saved" };
      }
    }

    // Delete author from Supabase
    async function deleteAuthorFromAPI(authorId) {
      return await apiDelete(`/api/authors/${authorId}`);
    }

    // Save publisher to Supabase
    async function savePublisherToAPI(name, address = "", phone = "", email = "", isNew = false) {
      const payload = { name, address, phone, email };
      if (isNew) {
        return await apiPost("/api/publishers", payload);
      } else {
        return { success: true, message: "Publisher saved" };
      }
    }

    // Delete publisher from Supabase
    async function deletePublisherFromAPI(publisherId) {
      return await apiDelete(`/api/publishers/${publisherId}`);
    }

    function renderShell() {
      saveSession();
      $("#userName").textContent = currentUser.name;
      $("#avatar").textContent = currentUser.name[0].toUpperCase();
      const roleBadge = $("#roleBadge");
      roleBadge.textContent = currentUser.role[0].toUpperCase() + currentUser.role.slice(1);
      roleBadge.className = "badge " + (currentUser.role === "admin" ? "red" : currentUser.role === "librarian" ? "blue" : "green");
      renderNav();
      renderPage();
    }

    function renderNav() {
      $("#nav").innerHTML = menuItems.filter(m => can(m.roles)).map(item => {
        if (!item.children) {
          return `<button class="${currentPage === item.id ? "active" : ""}" data-page="${item.id}">${navIcon(item.icon)}<span>${item.label}</span></button>`;
        }
        const open = expanded.has(item.id);
        const children = item.children.filter(c => can(c[2] || item.roles)).map(c =>
          `<button class="child ${currentPage === c[0] ? "active" : ""}" data-page="${c[0]}">${c[1]}</button>`
        ).join("");
        return `<button class="${open ? "open" : ""}" data-toggle="${item.id}">${navIcon(item.icon)}<span>${item.label}</span><span class="chev">${open ? "▾" : "▸"}</span></button>${open ? children : ""}`;
      }).join("");
    }

    function pageHead(title, desc, action = "") {
      return `<div class="page-head"><div><h1>${esc(title)}</h1><p class="subtle">${esc(desc)}</p></div>${action}</div>`;
    }

    function renderPage() {
      if (currentPage === "dashboard") return renderDashboard();
      if (currentPage === "books") return renderBooks();
      if (currentPage === "authors") return renderCatalogList("author");
      if (currentPage === "publishers") return renderCatalogList("publisher");
      if (currentPage === "categories") return renderCatalogList("category");
      if (currentPage === "inventory") return renderInventory();
      if (currentPage === "barcode") return renderBarcodeManagement();
      if (currentPage === "assets") return renderAssetTracking();
      if (currentPage === "verification") return renderStockVerification();
      if (currentPage === "missing") return renderStockVerification("Missing Items");
      if (currentPage === "damaged") return renderDamagedItems();
      if (currentPage === "accession-update") return renderAccessionUpdate();
      if (currentPage === "borrowing-reports") return renderBorrowingReports();
      if (currentPage === "overdue-reports") return renderOverdueReports();
      if (currentPage === "lost-reports") return renderLostBooksReports();
      if (currentPage === "statistics") return renderStatisticsReport();
      if (currentPage === "notifications") return renderNotifications();
      if (currentPage === "users") {
        // Sync users from backend before rendering
        syncUsersFromBackend().then(() => renderUsers());
        return;
      }
      if (currentPage === "permissions") return renderPermissions();
      if (currentPage === "settings") return renderSettings();
      const [title, desc] = pages[currentPage] || ["Module", "Library module"];
      $("#main").innerHTML = pageHead(title, desc) + `<div class="card coming"><div class="coming-icon">${appIcon("file")}</div><h2>Module Coming Soon</h2><p class="subtle" style="margin:8px auto 0;max-width:430px">The ${esc(title)} module is under development. Check back later for full functionality.</p></div>`;
      renderNav();
    }

    function renderDashboard() {
      const totalBooks = books.reduce((sum, b) => sum + b.copies, 0);
      const availableBooks = books.reduce((sum, b) => sum + b.availableCopies, 0);
      const borrowedBooks = books.filter(b => b.status === "borrowed").length;
      const overdueBooks = books.filter(b => b.dueDate && overdue(b.dueDate));
      const activeMembers = members.filter(m => m.status === "active").length;
      const totalFines = members.reduce((sum, m) => sum + m.fines, 0);
      const unread = notifications.filter(n => !n.read).length;
      const stat = (label, value, icon, color) => `<div class="card stat-card"><div><p class="subtle">${label}</p><div class="stat-value" style="color:${color}">${value}</div></div><div class="icon-box" style="background:${color}">${appIcon(icon)}</div></div>`;
      $("#main").innerHTML = pageHead("Dashboard", "Welcome back! Here's your library overview.") + `
        <div class="grid stats">
          ${stat("Total Books", totalBooks, "book", "#0ea5e9")}
          ${stat("Available", availableBooks, "check", "#10b981")}
          ${stat("Borrowed", borrowedBooks, "borrow", "#f59e0b")}
          ${stat("Overdue", overdueBooks.length, "alert", "#ef4444")}
        </div>
        <div class="grid quick">
          <div class="card"><div class="icon-box">${appIcon("users")}</div><div><p class="subtle">Active Members</p><h2>${activeMembers}</h2></div></div>
          <div class="card"><div class="icon-box">${appIcon("money")}</div><div><p class="subtle">Pending Fines</p><h2>$${totalFines.toFixed(2)}</h2></div></div>
          <div class="card"><div class="icon-box">${appIcon("bell")}</div><div><p class="subtle">Notifications</p><h2>${unread}</h2></div></div>
        </div>
        <div class="grid two">
          <div class="card"><div class="card-title">Recent Activities</div>${activities.slice(0,5).map(a => `<div class="list-row"><span class="row-icon">${appIcon(a.type === "fine" ? "money" : a.type === "return" ? "return" : a.type === "borrow" ? "borrow" : "file")}</span><div><p>${esc(a.description)}</p><p class="subtle" style="font-size:12px;margin-top:4px">${esc(a.user)} | ${fmt(a.timestamp)}</p></div></div>`).join("")}</div>
          <div class="card"><div class="card-title">Overdue Books <span class="pill" style="background:#fee2e2;color:#dc2626">${overdueBooks.length} items</span></div>${overdueBooks.length ? overdueBooks.slice(0,5).map(b => `<div class="list-row" style="justify-content:space-between"><div><strong>${esc(b.title)}</strong><p class="subtle">${esc(b.borrower || "")}</p></div><div style="text-align:right"><strong style="color:#dc2626">${daysOverdue(b.dueDate)} days overdue</strong><p class="subtle" style="font-size:12px">Due: ${fmt(b.dueDate)}</p></div></div>`).join("") : `<div class="empty">No overdue books</div>`}</div>
        </div>
        ${librarySettings.showDashboardNotices ? `<div class="card" style="margin-top:24px"><div class="card-title">Recent Notifications <span class="pill" style="background:#e0f2fe;color:#0284c7">${unread} unread</span></div>${notifications.slice(0,3).map(n => `<div class="list-row" style="${!n.read ? "background:#f0f9ff" : ""}"><span class="row-icon">${appIcon(n.type === "overdue" ? "alert" : "bell")}</span><div><strong>${esc(n.title)}</strong><p class="subtle">${esc(n.message)}</p><p class="subtle" style="font-size:12px;margin-top:4px">${fmt(n.timestamp)}</p></div>${!n.read ? `<span class="pill" style="background:#0ea5e9;color:white;padding:4px"></span>` : ""}</div>`).join("")}</div>` : ""}`;
      renderNav();
    }

    function notificationStyle(type) {
      return ({
        overdue: { icon:"alert", label:"Overdue", color:"#dc2626", bg:"#fee2e2" },
        reminder: { icon:"calendar", label:"Reminder", color:"#d97706", bg:"#fef3c7" },
        announcement: { icon:"bell", label:"Announcement", color:"#0284c7", bg:"#e0f2fe" }
      }[type] || { icon:"bell", label:"Notification", color:"#16a34a", bg:"#dcfce7" });
    }

    function filteredNotifications() {
      const clean = filters.search.toLowerCase();
      return notifications.filter(n => {
        const text = `${n.title} ${n.message} ${n.type}`.toLowerCase();
        return (!clean || text.includes(clean)) &&
          (filters.status === "all" || (filters.status === "unread" && !n.read) || (filters.status === "read" && n.read));
      });
    }

    function renderNotifications() {
      const rows = filteredNotifications();
      const unread = notifications.filter(n => !n.read).length;
      const actions = `<div class="actions">
        <button class="secondary" id="markAllNotificationsRead" ${unread ? "" : "disabled"}>Mark All Read</button>
        <button class="primary" id="addTestNotification">New Notice</button>
      </div>`;

      $("#main").innerHTML = pageHead("Notifications", "View and manage notifications", actions) + `
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr 180px">
          <input id="searchNotifications" placeholder="Search notifications..." value="${esc(filters.search)}">
          <select id="notificationStatusFilter">
            <option value="all" ${filters.status === "all" ? "selected" : ""}>All</option>
            <option value="unread" ${filters.status === "unread" ? "selected" : ""}>Unread</option>
            <option value="read" ${filters.status === "read" ? "selected" : ""}>Read</option>
          </select>
        </div></div>
        <div class="grid stats" style="margin-bottom:16px">
          ${reportStat("Total Notices", notifications.length, "bell", "#16a34a")}
          ${reportStat("Unread", unread, "alert", "#ef4444")}
          ${reportStat("Reminders", notifications.filter(n => n.type === "reminder").length, "calendar", "#d97706")}
          ${reportStat("Announcements", notifications.filter(n => n.type === "announcement").length, "bell", "#0284c7")}
        </div>
        <div class="card">
          <div class="card-title">Notification Inbox <span class="pill" style="background:#dcfce7;color:#15803d">${rows.length} shown</span></div>
          ${rows.length ? rows.map(n => {
            const meta = notificationStyle(n.type);
            return `<div class="list-row notification-row ${!n.read ? "unread" : ""}">
              <span class="row-icon" style="background:${meta.bg};color:${meta.color}">${appIcon(meta.icon)}</span>
              <div class="notification-copy">
                <div class="notification-title-line">
                  <strong>${esc(n.title)}</strong>
                  <span class="pill" style="background:${meta.bg};color:${meta.color}">${esc(meta.label)}</span>
                  ${!n.read ? `<span class="pill" style="background:#16a34a;color:white">Unread</span>` : `<span class="pill" style="background:#f1f5f9;color:#64748b">Read</span>`}
                </div>
                <p class="subtle">${esc(n.message)}</p>
                <p class="subtle" style="font-size:12px;margin-top:4px">${fmtDateTime(n.timestamp)}</p>
              </div>
              <div class="notification-actions">
                <button class="secondary" data-toggle-notification="${n.id}">${n.read ? "Mark Unread" : "Mark Read"}</button>
                <button class="icon-btn" title="Delete notification" data-delete-notification="${n.id}">X</button>
              </div>
            </div>`;
          }).join("") : `<div class="empty">No notifications found.</div>`}
        </div>`;
      renderNav();
    }

    function addNotification(type, title, message) {
      notifications.unshift({
        id:id(),
        type,
        title,
        message,
        timestamp:new Date().toISOString(),
        read:false
      });
    }

    function toggleNotification(id) {
      notifications = notifications.map(n => n.id === id ? { ...n, read:!n.read } : n);
      renderPage();
    }

    function deleteNotification(id) {
      notifications = notifications.filter(n => n.id !== id);
      renderPage();
    }

    function markAllNotificationsRead() {
      notifications = notifications.map(n => ({ ...n, read:true }));
      renderPage();
    }

    function roleLabel(role) {
      return role[0].toUpperCase() + role.slice(1);
    }

    function roleBadgeClass(role) {
      return role === "admin" ? "red" : role === "librarian" ? "blue" : "green";
    }

    function userStatusStyle(status) {
      return ({
        active:"background:#d1fae5;color:#047857",
        pending:"background:#fef3c7;color:#b45309",
        inactive:"background:#fee2e2;color:#b91c1c"
      }[status] || "background:#f1f5f9;color:#475569");
    }

    function activeAdminCount() {
      return demoUsers.filter(user => user.role === "admin" && user.status === "active").length;
    }

    function filteredUsers() {
      const clean = filters.search.toLowerCase();
      return demoUsers.filter(user => {
        const text = `${user.name} ${user.email} ${user.role} ${user.status}`.toLowerCase();
        return (!clean || text.includes(clean)) &&
          (filters.status === "all" || user.status === filters.status || user.role === filters.status);
      });
    }

    async function syncUsersFromBackend() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            demoUsers.splice(0, demoUsers.length, ...data.data.map(normalizeBackendUser));
          }
        }
      } catch (error) {
        console.error("Error syncing users from backend:", error);
      }
    }

    function renderUsers() {
      const rows = filteredUsers();
      const actions = `<button class="primary" id="addUser">Add User</button>`;
      $("#main").innerHTML = pageHead("Users", "Manage system users", actions) + `
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr 180px">
          <input id="searchUsers" placeholder="Search users..." value="${esc(filters.search)}">
          <select id="userStatusFilter">
            <option value="all" ${filters.status === "all" ? "selected" : ""}>All Users</option>
            <option value="active" ${filters.status === "active" ? "selected" : ""}>Active</option>
            <option value="pending" ${filters.status === "pending" ? "selected" : ""}>Pending Approval</option>
            <option value="inactive" ${filters.status === "inactive" ? "selected" : ""}>Inactive</option>
            <option value="admin" ${filters.status === "admin" ? "selected" : ""}>Admins</option>
            <option value="librarian" ${filters.status === "librarian" ? "selected" : ""}>Librarians</option>
          </select>
        </div></div>
        <div class="grid stats" style="margin-bottom:16px">
          ${reportStat("Total Users", demoUsers.length, "users", "#16a34a")}
          ${reportStat("Active", demoUsers.filter(u => u.status === "active").length, "check", "#10b981")}
          ${reportStat("Pending", demoUsers.filter(u => u.status === "pending").length, "alert", "#d97706")}
          ${reportStat("Admins", demoUsers.filter(u => u.role === "admin").length, "users", "#dc2626")}
        </div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Created</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${rows.map(user => {
            const self = currentUser && user.id === currentUser.id;
            return `<tr>
              <td><strong>${esc(user.name)}</strong>${self ? `<p class="subtle" style="font-size:12px">Current account</p>` : ""}</td>
              <td>${esc(user.email)}</td>
              <td><span class="badge ${roleBadgeClass(user.role)}">${esc(roleLabel(user.role))}</span></td>
              <td><span class="pill" style="${userStatusStyle(user.status)}">${esc(user.status === "pending" ? "Pending Approval" : roleLabel(user.status))}</span></td>
              <td>${user.lastLogin ? fmtDateTime(user.lastLogin) : "-"}</td>
              <td>${user.createdAt ? fmt(user.createdAt) : "-"}</td>
              <td><div class="actions">
                <button class="secondary" data-edit-user="${user.id}">Edit</button>
                <button class="secondary" data-toggle-user-status="${user.id}" ${self ? "disabled" : ""}>${user.status === "active" ? "Deactivate" : user.status === "pending" ? "Approve" : "Activate"}</button>
                <button class="icon-btn" title="Delete user" data-delete-user="${user.id}" ${self ? "disabled" : ""}>X</button>
              </div></td>
            </tr>`;
          }).join("")}</tbody>
        </table>${rows.length ? "" : `<div class="empty">No users found.</div>`}</div>`;
      renderNav();
    }

    function openUserForm(user = null) {
      const editing = Boolean(user);
      $("#viewModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>${editing ? "Edit User" : "Add User"}</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="userForm">
          <div class="dialog-body">
            <input type="hidden" name="id" value="${esc(user?.id || "")}">
            <div class="field"><label>Name</label><input name="name" value="${esc(user?.name || "")}" required></div>
            <div class="field"><label>Email</label><input name="email" type="email" value="${esc(user?.email || "")}" required></div>
            <div class="form-grid">
              <div><label>Role</label><select name="role">${["admin","librarian"].map(role => `<option value="${role}" ${user?.role === role ? "selected" : ""}>${roleLabel(role)}</option>`).join("")}</select></div>
              <div><label>Status</label><select name="status">${["active","pending","inactive"].map(status => `<option value="${status}" ${user?.status === status ? "selected" : ""}>${status === "pending" ? "Pending Approval" : roleLabel(status)}</option>`).join("")}</select></div>
            </div>
            <div class="field"><label>${editing ? "New Password" : "Password"}</label><div class="password-field"><input id="userPasswordInput" name="password" type="password" ${editing ? `placeholder="Leave blank to keep current password"` : "required"}>${passwordToggleButton("#userPasswordInput")}</div></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Cancel</button><button class="primary" type="submit">Save User</button></div>
        </form>
      </div>`;
      $("#viewModal").style.display = "flex";
    }

    async function saveUser(form) {
      const data = Object.fromEntries(new FormData(form));
      const cleanEmail = String(data.email || "").trim().toLowerCase();
      const existing = data.id ? demoUsers.find(u => u.id === data.id) : null;
      const duplicate = demoUsers.find(u => u.email.toLowerCase() === cleanEmail && u.id !== data.id);
      if (duplicate) {
        systemAlert("Another user already uses that email address.");
        return;
      }

      if (existing) {
        if (existing.role === "admin" && existing.status === "active" && activeAdminCount() <= 1 && (data.role !== "admin" || data.status !== "active")) {
          systemAlert("At least one active admin account is required.");
          return;
        }
        const payload = {
          name:String(data.name || "").trim(),
          email:cleanEmail,
          role:existing.id === currentUser.id ? currentUser.role : data.role,
          status:existing.id === currentUser.id ? "active" : data.status,
          ...(data.password ? { password:data.password } : {})
        };
        const response = await apiPut(`/api/users/${backendId(existing.id)}`, payload);
        if (!response?.success) {
          systemAlert(response?.message || "Unable to save user.");
          return;
        }
      } else {
        const response = await apiRequest("/api/signup", {
          name:String(data.name || "").trim(),
          email:cleanEmail,
          password:String(data.password || "")
        });
        const created = normalizeApiUser(response?.user || response, { email:cleanEmail });
        if (data.role !== created.role || data.status !== created.status) {
          const update = await apiPut(`/api/users/${backendId(created.id)}`, {
            role:data.role,
            status:data.status
          });
          if (!update?.success) {
            systemAlert(update?.message || "User was created, but role/status could not be updated.");
            await syncUsersFromBackend();
            renderUsers();
            return;
          }
        }
      }
      activities.unshift({ id:id(), type:"add", description:`Saved user "${data.name}"`, user:currentUser.name, timestamp:new Date().toISOString() });
      await syncUsersFromBackend();
      if (existing?.id === currentUser.id) {
        const refreshed = demoUsers.find(user => user.id === currentUser.id);
        if (refreshed) currentUser = refreshed;
        renderShell();
      }
      closeModal("viewModal");
      renderUsers();
    }

    async function toggleUserStatus(userId) {
      const user = demoUsers.find(u => u.id === userId);
      if (!user || user.id === currentUser.id) return;
      if (user.role === "admin" && user.status === "active" && activeAdminCount() <= 1) {
        systemAlert("At least one active admin account is required.");
        return;
      }
      
      // Determine new status
      const oldStatus = user.status;
      let newStatus;
      if (user.status === "pending") {
        newStatus = "active";
      } else {
        newStatus = user.status === "active" ? "inactive" : "active";
      }
      try {
        const response = await apiPut(`/api/users/${backendId(user.id)}`, { status:newStatus });
        if (!response?.success) throw new Error(response?.message || "Unable to update user status.");
        await syncUsersFromBackend();
        renderUsers();
      } catch (error) {
        systemAlert(error.message || `Unable to change status from ${oldStatus}.`);
      }
    }

    function deleteUser(userId) {
      const user = demoUsers.find(u => u.id === userId);
      if (!user || user.id === currentUser.id) return;
      if (user.role === "admin" && user.status === "active" && activeAdminCount() <= 1) {
        systemAlert("At least one active admin account is required.");
        return;
      }
      systemConfirm(`Delete user "${user.name}"?`, async () => {
        const response = await apiDelete(`/api/users/${backendId(user.id)}`);
        if (!response?.success) {
          systemAlert(response?.message || "Unable to delete user.");
          return;
        }
        await syncUsersFromBackend();
        renderUsers();
      }, "Delete User");
    }

    function permissionRows() {
      const rows = [];
      menuItems.forEach(item => {
        rows.push({ id:item.id, label:item.label, roles:item.roles, item });
        (item.children || []).forEach(child => rows.push({
          id:child[0],
          label:`${item.label}: ${child[1]}`,
          roles:child[2] || item.roles,
          child,
          parent:item
        }));
      });
      return rows;
    }

    function renderPermissions() {
      const roles = ["admin", "librarian"];
      const rows = permissionRows();
      $("#main").innerHTML = pageHead("Permissions", "Manage user permissions", `<button class="primary" id="savePermissions">Save Permissions</button>`) + `
        <div class="card table-wrap"><table class="permission-table">
          <thead><tr><th>Module</th>${roles.map(role => `<th>${esc(roleLabel(role))}</th>`).join("")}</tr></thead>
          <tbody>${rows.map(row => `<tr>
            <td><strong>${esc(row.label)}</strong></td>
            ${roles.map(role => {
              const locked = (row.id === "dashboard" && role === "admin") || (["users","permissions"].includes(row.id) && role === "admin");
              return `<td><label class="check-cell"><input type="checkbox" data-permission="${esc(row.id)}" data-role="${role}" ${row.roles.includes(role) ? "checked" : ""} ${locked ? "disabled checked" : ""}><span></span></label></td>`;
            }).join("")}
          </tr>`).join("")}</tbody>
        </table></div>`;
      renderNav();
    }

    function savePermissions() {
      const rolesByPage = {};
      permissionRows().forEach(row => rolesByPage[row.id] = []);
      document.querySelectorAll("[data-permission][data-role]").forEach(input => {
        if (input.checked) rolesByPage[input.dataset.permission].push(input.dataset.role);
      });
      rolesByPage.dashboard = Array.from(new Set([...(rolesByPage.dashboard || []), "admin"]));
      rolesByPage.users = Array.from(new Set([...(rolesByPage.users || []), "admin"]));
      rolesByPage.permissions = Array.from(new Set([...(rolesByPage.permissions || []), "admin"]));

      permissionRows().forEach(row => {
        if (row.child) row.child[2] = rolesByPage[row.id];
        else row.item.roles = rolesByPage[row.id];
      });
      renderNav();
      systemAlert("Permissions saved.");
    }

    function renderSettings() {
      const adminSettings = currentUser.role === "admin" || currentUser.role === "librarian";
      $("#main").innerHTML = pageHead("Settings", "Configure library settings and account options") + `
        <div class="settings-grid">
          ${adminSettings ? `<form id="librarySettingsForm" class="card settings-panel">
            <div class="card-title">Library Settings</div>
            <div class="dialog-body">
              <div class="form-grid">
                <div><label>Library Name</label><input name="libraryName" value="${esc(librarySettings.libraryName)}" required></div>
                <div><label>Tagline</label><input name="tagline" value="${esc(librarySettings.tagline)}"></div>
                <div><label>Contact Email</label><input name="contactEmail" type="email" value="${esc(librarySettings.contactEmail)}"></div>
                <div><label>Contact Phone</label><input name="contactPhone" value="${esc(librarySettings.contactPhone)}"></div>
                <div class="wide-field"><label>Address</label><input name="address" value="${esc(librarySettings.address)}"></div>
              </div>
            </div>
            <div class="dialog-foot"><button class="primary" type="submit">Save Library Settings</button></div>
          </form>
          <form id="borrowingSettingsForm" class="card settings-panel">
            <div class="card-title">Borrowing Defaults</div>
            <div class="dialog-body">
              <div class="form-grid">
                <div><label>Loan Period (days)</label><input name="loanDays" type="number" min="1" max="90" value="${esc(librarySettings.loanDays)}" required></div>
                <div><label>Daily Fine</label><input name="dailyFine" type="number" min="0" step="0.01" value="${esc(librarySettings.dailyFine)}" required></div>
                <div><label>Max Borrowed Books</label><input name="maxBorrowedBooks" type="number" min="1" max="50" value="${esc(librarySettings.maxBorrowedBooks)}" required></div>
                <label class="toggle-row"><input name="emailNotifications" type="checkbox" ${librarySettings.emailNotifications ? "checked" : ""}><span>Email Notifications</span></label>
                <label class="toggle-row"><input name="showDashboardNotices" type="checkbox" ${librarySettings.showDashboardNotices ? "checked" : ""}><span>Dashboard Notices</span></label>
              </div>
            </div>
            <div class="dialog-foot"><button class="primary" type="submit">Save Borrowing Defaults</button></div>
          </form>` : ""}
          <form id="profileSettingsForm" class="card settings-panel">
            <div class="card-title">Account Settings</div>
            <div class="dialog-body">
              <div class="form-grid">
                <div><label>Name</label><input name="name" value="${esc(currentUser.name)}" required></div>
                <div><label>Email</label><input name="email" type="email" value="${esc(currentUser.email)}" required></div>
                <div><label>Role</label><input value="${esc(roleLabel(currentUser.role))}" readonly></div>
                <div><label>Status</label><input value="${esc(roleLabel(currentUser.status || "active"))}" readonly></div>
              </div>
            </div>
            <div class="dialog-foot"><button class="primary" type="submit">Save Account</button></div>
          </form>
          <form id="passwordSettingsForm" class="card settings-panel">
            <div class="card-title">Password</div>
            <div class="dialog-body">
              <div class="form-grid">
                <div><label>New Password</label><div class="password-field"><input id="newPasswordInput" name="newPassword" type="password" minlength="4" required>${passwordToggleButton("#newPasswordInput")}</div></div>
                <div><label>Confirm New Password</label><div class="password-field"><input id="confirmPasswordInput" name="confirmPassword" type="password" minlength="4" required>${passwordToggleButton("#confirmPasswordInput")}</div></div>
              </div>
            </div>
            <div class="dialog-foot"><button class="primary" type="submit">Update Password</button></div>
          </form>
        </div>`;
      renderNav();
    }

    function saveLibrarySettings(form) {
      const data = Object.fromEntries(new FormData(form));
      librarySettings = {
        ...librarySettings,
        libraryName:String(data.libraryName || "").trim() || librarySettings.libraryName,
        tagline:String(data.tagline || "").trim(),
        contactEmail:String(data.contactEmail || "").trim(),
        contactPhone:String(data.contactPhone || "").trim(),
        address:String(data.address || "").trim()
      };
      document.title = librarySettings.libraryName;
      systemAlert("Library settings saved.");
      renderSettings();
    }

    function saveBorrowingSettings(form) {
      const data = Object.fromEntries(new FormData(form));
      librarySettings = {
        ...librarySettings,
        loanDays:Math.max(1, Number(data.loanDays) || 14),
        dailyFine:Math.max(0, Number(data.dailyFine) || 0),
        maxBorrowedBooks:Math.max(1, Number(data.maxBorrowedBooks) || 1),
        emailNotifications:Boolean(data.emailNotifications),
        showDashboardNotices:Boolean(data.showDashboardNotices)
      };
      systemAlert("Borrowing defaults saved.");
      renderSettings();
    }

    async function saveProfileSettings(form) {
      const data = Object.fromEntries(new FormData(form));
      const cleanEmail = String(data.email || "").trim().toLowerCase();
      const duplicate = demoUsers.find(user => user.email.toLowerCase() === cleanEmail && user.id !== currentUser.id);
      if (duplicate) {
        systemAlert("Another user already uses that email address.");
        return;
      }
      const response = await apiPut(`/api/users/${backendId(currentUser.id)}`, {
        name:String(data.name || "").trim(),
        email:cleanEmail
      });
      if (!response?.success) {
        systemAlert(response?.message || "Unable to save account settings.");
        return;
      }
      await syncUsersFromBackend();
      const refreshed = demoUsers.find(user => user.id === currentUser.id);
      if (refreshed) currentUser = refreshed;
      renderShell();
      systemAlert("Account settings saved.");
    }

    async function updateCurrentPassword(form) {
      const data = Object.fromEntries(new FormData(form));
      if (data.newPassword !== data.confirmPassword) {
        systemAlert("New passwords do not match.");
        return;
      }
      const response = await apiPut(`/api/users/${backendId(currentUser.id)}`, {
        password:String(data.newPassword || "")
      });
      if (!response?.success) {
        systemAlert(response?.message || "Unable to update password.");
        return;
      }
      form.reset();
      systemAlert("Password updated.");
    }

    function filteredBooks() {
      return books.filter(b => {
        const damage = damagedRecord(b);
        const text = `${b.title} ${b.author} ${b.isbn} ${b.barcode || ""} ${accession(b)} ${b.location || ""} ${b.borrower || ""} ${damage.description || ""}`.toLowerCase();
        const effectiveStatus = inventoryStatus(b.status);
        const barcodeMode = currentPage === "barcode" && (filters.status === "assigned" || filters.status === "unassigned");
        const damagedMode = currentPage === "damaged";
        return (!filters.search || text.includes(filters.search.toLowerCase())) &&
          (barcodeMode || damagedMode || filters.status === "all" || b.status === filters.status || effectiveStatus === filters.status) &&
          (!filters.category || b.category === filters.category);
      });
    }

    function reportActions() {
      return `<button class="secondary" id="printReport">Print Report</button>`;
    }

    function reportStat(label, value, icon, color) {
      return `<div class="card stat-card"><div><p class="subtle">${esc(label)}</p><div class="stat-value" style="color:${color}">${esc(value)}</div></div><div class="icon-box" style="background:${color}">${appIcon(icon)}</div></div>`;
    }

    function reportGenerated() {
      return `<div class="count">Generated ${fmtDateTime(new Date())}</div>`;
    }

    function reportSearch(text) {
      const clean = String(text || "").toLowerCase();
      return books.filter(b => {
        const haystack = `${b.title} ${b.author} ${b.publisher || ""} ${b.category} ${b.isbn} ${b.barcode || ""} ${accession(b)} ${b.borrower || ""}`.toLowerCase();
        return !clean || haystack.includes(clean);
      });
    }

    function renderBorrowingReports() {
      const rows = reportSearch(filters.search).filter(b => b.borrower || b.borrowDate || b.status === "borrowed");
      const overdueRows = rows.filter(b => b.dueDate && overdue(b.dueDate));
      const returnedActivities = activities.filter(a => a.type === "return").length;
      $("#main").innerHTML = pageHead("Borrowing Reports", "View borrowing reports", reportActions()) + `
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr">
          <input id="searchReports" placeholder="Search by title, borrower, barcode, accession, or ISBN..." value="${esc(filters.search)}">
        </div></div>
        <div class="grid stats" style="margin-bottom:16px">
          ${reportStat("Current Loans", rows.length, "borrow", "#0ea5e9")}
          ${reportStat("Overdue Loans", overdueRows.length, "alert", "#ef4444")}
          ${reportStat("Return Records", returnedActivities, "return", "#16a34a")}
          ${reportStat("Borrow Activities", activities.filter(a => a.type === "borrow").length, "calendar", "#f59e0b")}
        </div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode</th><th>Book Title</th><th>Borrower</th><th>Borrow Date</th><th>Due Date</th><th>Status</th><th>Days Overdue</th></tr></thead>
          <tbody>${rows.map(b => `<tr>
            <td class="mono">${esc(b.barcode || "-")}</td>
            <td><strong>${esc(b.title)}</strong><p class="subtle mono" style="font-size:12px">${esc(accession(b))}</p></td>
            <td>${esc(b.borrower || "-")}</td>
            <td>${b.borrowDate ? fmt(b.borrowDate) : "-"}</td>
            <td>${b.dueDate ? fmt(b.dueDate) : "-"}</td>
            <td><span class="pill" style="${statusClass(inventoryStatus(b.status))}">${esc(inventoryStatusLabel(b.status))}</span></td>
            <td>${b.dueDate && overdue(b.dueDate) ? daysOverdue(b.dueDate) : "-"}</td>
          </tr>`).join("")}</tbody>
        </table>${rows.length ? "" : `<div class="empty">No borrowing records found.</div>`}</div>
        ${reportGenerated()}`;
      renderNav();
    }

    function renderOverdueReports() {
      const rows = reportSearch(filters.search).filter(b => b.dueDate && overdue(b.dueDate));
      const totalDays = rows.reduce((sum, b) => sum + daysOverdue(b.dueDate), 0);
      $("#main").innerHTML = pageHead("Overdue Reports", "View overdue reports", reportActions()) + `
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr">
          <input id="searchReports" placeholder="Search overdue books by title, borrower, barcode, accession, or ISBN..." value="${esc(filters.search)}">
        </div></div>
        <div class="grid stats" style="margin-bottom:16px">
          ${reportStat("Overdue Books", rows.length, "alert", "#ef4444")}
          ${reportStat("Total Overdue Days", totalDays, "calendar", "#f59e0b")}
          ${reportStat("Affected Borrowers", new Set(rows.map(b => b.borrower).filter(Boolean)).size, "users", "#0ea5e9")}
          ${reportStat("Longest Overdue", rows.length ? Math.max(...rows.map(b => daysOverdue(b.dueDate))) : 0, "trending", "#dc2626")}
        </div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode</th><th>Book Title</th><th>Borrower</th><th>Borrow Date</th><th>Due Date</th><th>Days Overdue</th><th>Location</th></tr></thead>
          <tbody>${rows.map(b => `<tr>
            <td class="mono">${esc(b.barcode || "-")}</td>
            <td><strong>${esc(b.title)}</strong><p class="subtle mono" style="font-size:12px">${esc(accession(b))}</p></td>
            <td>${esc(b.borrower || "-")}</td>
            <td>${b.borrowDate ? fmt(b.borrowDate) : "-"}</td>
            <td>${fmt(b.dueDate)}</td>
            <td><strong style="color:#dc2626">${daysOverdue(b.dueDate)}</strong></td>
            <td>${esc(b.location || "-")}</td>
          </tr>`).join("")}</tbody>
        </table>${rows.length ? "" : `<div class="empty">No overdue books found.</div>`}</div>
        ${reportGenerated()}`;
      renderNav();
    }

    function renderLostBooksReports() {
      const lostIds = new Set(verificationRecords.filter(v => v.physicalStatus === "lost").map(v => v.bookId));
      const rows = reportSearch(filters.search).filter(b => b.status === "missing" || lostIds.has(b.id));
      const totalCopies = rows.reduce((sum, b) => sum + Number(b.copies || 0), 0);
      $("#main").innerHTML = pageHead("Lost Books Reports", "View lost books reports", reportActions()) + `
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr">
          <input id="searchReports" placeholder="Search lost books by title, barcode, accession, author, or ISBN..." value="${esc(filters.search)}">
        </div></div>
        <div class="grid stats" style="margin-bottom:16px">
          ${reportStat("Lost Titles", rows.length, "alert", "#dc2626")}
          ${reportStat("Lost Copies", totalCopies, "copy", "#ef4444")}
          ${reportStat("Verified Lost", rows.filter(b => lostIds.has(b.id)).length, "check", "#f59e0b")}
          ${reportStat("Categories Affected", new Set(rows.map(b => b.category).filter(Boolean)).size, "category", "#0ea5e9")}
        </div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode</th><th>Accession</th><th>Book Title</th><th>Author</th><th>Category</th><th>Last Location</th><th>Last Updated</th></tr></thead>
          <tbody>${rows.map(b => `<tr>
            <td class="mono">${esc(b.barcode || "-")}</td>
            <td class="mono">${esc(accession(b))}</td>
            <td><strong>${esc(b.title)}</strong></td>
            <td>${esc(b.author)}</td>
            <td>${esc(b.category)}</td>
            <td>${esc(b.location || "-")}</td>
            <td>${fmt(lastUpdated(b))}</td>
          </tr>`).join("")}</tbody>
        </table>${rows.length ? "" : `<div class="empty">No lost books found.</div>`}</div>
        ${reportGenerated()}`;
      renderNav();
    }

    function renderStatisticsReport() {
      const totalCopies = books.reduce((sum, b) => sum + Number(b.copies || 0), 0);
      const availableCopies = books.reduce((sum, b) => sum + Number(b.availableCopies || 0), 0);
      const borrowedTitles = books.filter(b => b.status === "borrowed").length;
      const lostTitles = books.filter(b => b.status === "missing").length;
      const categoryRows = [...new Set(books.map(b => b.category).filter(Boolean))].sort().map(category => {
        const categoryBooks = books.filter(b => b.category === category);
        return { category, titles:categoryBooks.length, copies:categoryBooks.reduce((sum, b) => sum + Number(b.copies || 0), 0) };
      });
      const statusRows = ["unprocessed","available","borrowed","reserved","missing","damaged","replaced"].map(status => ({
        status,
        titles:books.filter(b => b.status === status).length,
        copies:books.filter(b => b.status === status).reduce((sum, b) => sum + Number(b.copies || 0), 0)
      })).filter(row => row.titles || row.copies);

      $("#main").innerHTML = pageHead("Statistics", "View library statistics", reportActions()) + `
        <div class="grid stats" style="margin-bottom:16px">
          ${reportStat("Total Titles", books.length, "book", "#0ea5e9")}
          ${reportStat("Total Copies", totalCopies, "copy", "#16a34a")}
          ${reportStat("Available Copies", availableCopies, "check", "#10b981")}
          ${reportStat("Borrowed Titles", borrowedTitles, "borrow", "#f59e0b")}
        </div>
        <div class="grid stats" style="margin-bottom:16px">
          ${reportStat("Lost Titles", lostTitles, "alert", "#ef4444")}
          ${reportStat("Damaged Titles", books.filter(b => b.status === "damaged").length, "damaged", "#d97706")}
          ${reportStat("Authors", catalogEntries("author").length, "author", "#6366f1")}
          ${reportStat("Categories", categoryRows.length, "category", "#14b8a6")}
        </div>
        <div class="grid two">
          <div class="card table-wrap"><div class="card-title">Books by Category</div><table>
            <thead><tr><th>Category</th><th>Titles</th><th>Copies</th></tr></thead>
            <tbody>${categoryRows.map(row => `<tr><td><strong>${esc(row.category)}</strong></td><td>${row.titles}</td><td>${row.copies}</td></tr>`).join("")}</tbody>
          </table></div>
          <div class="card table-wrap"><div class="card-title">Books by Status</div><table>
            <thead><tr><th>Status</th><th>Titles</th><th>Copies</th></tr></thead>
            <tbody>${statusRows.map(row => `<tr><td><span class="pill" style="${statusClass(row.status)}">${esc(statusLabel(row.status))}</span></td><td>${row.titles}</td><td>${row.copies}</td></tr>`).join("")}</tbody>
          </table></div>
        </div>
        ${reportGenerated()}`;
      renderNav();
    }

    function renderBooks() {
      const rows = filteredBooks();
      selectedBookIds = new Set([...selectedBookIds].filter(bookId => books.some(book => book.id === bookId)));
      const selectedVisibleCount = rows.filter(book => selectedBookIds.has(book.id)).length;
      const allVisibleSelected = rows.length > 0 && selectedVisibleCount === rows.length;
      const categories = [...new Set(books.map(b => b.category))].sort();
      $("#main").innerHTML = pageHead("Books Catalog", "Manage your library's book collection", `<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="secondary" id="deleteSelectedBooks" ${selectedBookIds.size ? "" : "disabled"}>Delete selected (${selectedBookIds.size})</button><button class="primary" id="addBook">+ Add Book</button></div>`) + `
        <div class="card filters"><div class="filter-row">
          <input id="searchBooks" placeholder="Search by title, author, or ISBN..." value="${esc(filters.search)}">
          <select id="statusFilter">
            ${["all","unprocessed","available","borrowed","reserved","missing","damaged","replaced"].map(s => `<option value="${s}" ${filters.status === s ? "selected" : ""}>${s === "all" ? "All Status" : statusLabel(s)}</option>`).join("")}
          </select>
          <select id="categoryFilter"><option value="">All Categories</option>${categories.map(c => `<option ${filters.category === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
        </div>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:12px">
          <label style="display:flex;gap:8px;align-items:center;font-weight:700"><input id="selectVisibleBooks" type="checkbox" ${allVisibleSelected ? "checked" : ""} ${rows.length ? "" : "disabled"}> Select all visible books</label>
          ${selectedBookIds.size ? `<button class="secondary" id="clearBookSelection">Clear selection</button>` : ""}
        </div></div>
        <div class="card table-wrap"><table>
          <thead><tr><th style="width:44px">Select</th><th>Title</th><th>Author</th><th>ISBN</th><th>Category</th><th>Status</th><th>Copies</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${rows.map(b => `<tr>
            <td><input type="checkbox" data-select-book="${b.id}" ${selectedBookIds.has(b.id) ? "checked" : ""}></td>
            <td><strong>${esc(b.title)}</strong><p class="subtle mono" style="font-size:12px">${esc(b.callNumber)}</p></td>
            <td>${esc(b.author)}</td><td class="mono">${esc(b.isbn)}</td><td>${esc(b.category)}</td>
            <td><span class="pill" style="${statusClass(b.status)}">${esc(statusLabel(b.status))}</span></td>
            <td><strong>${b.availableCopies}</strong><span class="subtle">/${b.copies}</span></td>
            <td><div class="actions"><button class="icon-btn" title="View details" data-view="${b.id}">View</button><button class="icon-btn" title="Edit" data-edit="${b.id}">Edit</button><button class="icon-btn" title="Delete" data-delete="${b.id}">Del</button></div></td>
          </tr>`).join("")}</tbody>
        </table>${rows.length ? "" : `<div class="empty">No books found matching your criteria.</div>`}</div>
        <div class="count">Showing ${rows.length} of ${books.length} books${selectedBookIds.size ? ` • ${selectedBookIds.size} selected` : ""}</div>`;
      renderNav();
    }

    function catalogConfig(type) {
      return {
        author: { page:"authors", title:"Authors", desc:"Manage book authors", label:"Author", plural:"Authors", field:"author", searchId:"searchAuthors" },
        publisher: { page:"publishers", title:"Publishers", desc:"Manage publishers", label:"Publisher", plural:"Publishers", field:"publisher", searchId:"searchPublishers" },
        category: { page:"categories", title:"Categories", desc:"Manage book categories", label:"Category", plural:"Categories", field:"category", searchId:"searchCategories" }
      }[type];
    }

    function catalogEntryName(entry) {
      return cleanImportValue(typeof entry === "string" ? entry : entry?.name);
    }

    function catalogEntries(type) {
      const cfg = catalogConfig(type);
      const entriesByName = new Map();
      books.map(b => cleanImportValue(b[cfg.field])).filter(Boolean).forEach(name => {
        entriesByName.set(name.toLowerCase(), { name });
      });
      (customCatalog[type] || []).forEach(entry => {
        const name = catalogEntryName(entry);
        if (!name) return;
        entriesByName.set(name.toLowerCase(), {
          ...(typeof entry === "object" && entry ? entry : {}),
          name
        });
      });
      return [...entriesByName.values()].sort((a, b) => a.name.localeCompare(b.name)).map(entry => {
        const name = entry.name;
        const linkedBooks = books.filter(book => cleanImportValue(book[cfg.field]).toLowerCase() === name.toLowerCase());
        return { ...entry, linkedBooks };
      });
    }

    function renderCatalogList(type) {
      const cfg = catalogConfig(type);
      const query = filters.search.toLowerCase();
      const entries = catalogEntries(type).filter(entry => !query || entry.name.toLowerCase().includes(query) || entry.linkedBooks.some(book => book.title.toLowerCase().includes(query)));
      const totalLinked = entries.reduce((sum, entry) => sum + entry.linkedBooks.length, 0);
      $("#main").innerHTML = pageHead(cfg.title, cfg.desc, `<button class="primary" data-catalog-add="${type}">+ Add ${cfg.label}</button>`) + `
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr">
          <input id="${cfg.searchId}" placeholder="Search ${cfg.plural.toLowerCase()} or linked books..." value="${esc(filters.search)}">
        </div></div>
        <div class="grid stats" style="margin-bottom:16px">
          <div class="card stat-card"><div><p class="subtle">Total ${cfg.plural}</p><div class="stat-value" style="color:#16a34a">${entries.length}</div></div><div class="icon-box" style="background:#16a34a">${appIcon(type)}</div></div>
          <div class="card stat-card"><div><p class="subtle">Linked Books</p><div class="stat-value" style="color:#0ea5e9">${totalLinked}</div></div><div class="icon-box" style="background:#0ea5e9">${appIcon("book")}</div></div>
        </div>
        <div class="card table-wrap"><table>
          <thead><tr><th>${esc(cfg.label)}</th><th>Books Linked</th><th>Sample Titles</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${entries.map(entry => `<tr>
            <td><strong>${esc(entry.name)}</strong></td>
            <td>${entry.linkedBooks.length}</td>
            <td>${entry.linkedBooks.length ? esc(entry.linkedBooks.slice(0,3).map(book => book.title).join(", ")) : `<span class="subtle">No linked books yet</span>`}</td>
            <td><div class="actions">
              <button class="icon-btn" title="View linked books" data-catalog-view="${type}" data-name="${esc(entry.name)}">View</button>
              <button class="icon-btn" title="Rename" data-catalog-edit="${type}" data-name="${esc(entry.name)}">Edit</button>
              <button class="icon-btn" title="Delete" data-catalog-delete="${type}" data-name="${esc(entry.name)}">Del</button>
            </div></td>
          </tr>`).join("")}</tbody>
        </table>${entries.length ? "" : `<div class="empty">No ${cfg.plural.toLowerCase()} found.</div>`}</div>
        <div class="count">Showing ${entries.length} ${cfg.plural.toLowerCase()}</div>`;
      renderNav();
    }

    function openCatalogForm(type, oldName = "") {
      const cfg = catalogConfig(type);
      $("#bookModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>${oldName ? `Edit ${cfg.label}` : `Add ${cfg.label}`}</h2><button class="icon-btn" data-close="bookModal">X</button></div>
        <form id="catalogForm" data-type="${type}" data-old-name="${esc(oldName)}">
          <div class="dialog-body">
            <div class="field"><label>${esc(cfg.label)} Name</label><input name="name" value="${esc(oldName)}" required autofocus></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="bookModal">Cancel</button><button class="primary" type="submit">${oldName ? "Save Changes" : `Add ${cfg.label}`}</button></div>
        </form>
      </div>`;
      $("#bookModal").style.display = "flex";
      $("#catalogForm").onsubmit = (e) => {
        e.preventDefault();
        saveCatalogEntry(type, oldName, Object.fromEntries(new FormData(e.currentTarget)).name);
      };
    }

    function saveCatalogEntry(type, oldName, nextName) {
      const cfg = catalogConfig(type);
      const cleanNext = cleanImportValue(nextName);
      if (!cleanNext) return;
      const duplicate = catalogEntries(type).some(entry => entry.name.toLowerCase() === cleanNext.toLowerCase() && entry.name.toLowerCase() !== String(oldName).toLowerCase());
      if (duplicate) {
        systemAlert(`${cfg.label} already exists.`);
        return;
      }

      if (oldName) {
        books = books.map(book => cleanImportValue(book[cfg.field]).toLowerCase() === oldName.toLowerCase() ? { ...book, [cfg.field]:cleanNext, lastUpdated:new Date().toISOString() } : book);
        customCatalog[type] = (customCatalog[type] || []).map(entry => {
          const name = catalogEntryName(entry);
          if (name.toLowerCase() !== oldName.toLowerCase()) return entry;
          return typeof entry === "object" && entry ? { ...entry, name:cleanNext } : cleanNext;
        });
        activities.unshift({ id:id(), type:"add", description:`Renamed ${cfg.label.toLowerCase()} "${oldName}" to "${cleanNext}"`, user:currentUser.name, timestamp:new Date().toISOString() });
      } else {
        customCatalog[type] = [...(customCatalog[type] || []), { name:cleanNext }];
        activities.unshift({ id:id(), type:"add", description:`Added ${cfg.label.toLowerCase()} "${cleanNext}"`, user:currentUser.name, timestamp:new Date().toISOString() });
      }

      const seen = new Set();
      customCatalog[type] = (customCatalog[type] || []).filter(entry => {
        const key = catalogEntryName(entry).toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      closeModal("bookModal");
      renderCatalogList(type);
    }

    function viewCatalogBooks(type, name) {
      const cfg = catalogConfig(type);
      const linkedBooks = books.filter(book => cleanImportValue(book[cfg.field]).toLowerCase() === name.toLowerCase());
      $("#viewModal").innerHTML = `<div class="dialog">
        <div class="dialog-head"><h2>${esc(name)}</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          ${linkedBooks.length ? `<div class="table-wrap"><table>
            <thead><tr><th>Title</th><th>Author</th><th>Publisher</th><th>Category</th><th>Status</th></tr></thead>
            <tbody>${linkedBooks.map(book => `<tr><td><strong>${esc(book.title)}</strong></td><td>${esc(book.author)}</td><td>${esc(book.publisher || "-")}</td><td>${esc(book.category)}</td><td><span class="pill" style="${statusClass(book.status)}">${esc(statusLabel(book.status))}</span></td></tr>`).join("")}</tbody>
          </table></div>` : `<div class="empty">No books are linked to this ${cfg.label.toLowerCase()} yet.</div>`}
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button></div>
      </div>`;
      $("#viewModal").style.display = "flex";
    }

    function deleteCatalogEntry(type, name) {
      const cfg = catalogConfig(type);
      const linkedCount = books.filter(book => cleanImportValue(book[cfg.field]).toLowerCase() === name.toLowerCase()).length;
      if (linkedCount) {
        systemAlert(`"${name}" is linked to ${linkedCount} book${linkedCount === 1 ? "" : "s"}. Rename it or edit those books before deleting.`);
        return;
      }
      systemConfirm(`Delete ${cfg.label.toLowerCase()} "${name}"?`, () => {
        customCatalog[type] = (customCatalog[type] || []).filter(item => catalogEntryName(item).toLowerCase() !== name.toLowerCase());
        activities.unshift({ id:id(), type:"delete", description:`Deleted ${cfg.label.toLowerCase()} "${name}"`, user:currentUser.name, timestamp:new Date().toISOString() });
        renderCatalogList(type);
      }, `Delete ${cfg.label}`);
    }

    function renderInventory() {
      const rows = filteredBooks();
      const categories = [...new Set(books.map(b => b.category))].sort();
      $("#main").innerHTML = pageHead("Inventory List", "Main list of all books and library materials", `<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="secondary" id="importInventoryExcel">Import Excel</button><button class="secondary" id="exportInventoryExcel">Export Excel</button><button class="primary" id="addItem">+ Add Item</button><input id="inventoryImportFile" type="file" accept=".xlsx,.xls,.csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style="display:none"></div>`) + `
        <div class="card filters"><div class="filter-row">
          <input id="searchInventory" placeholder="Search by barcode, accession, title, author, or ISBN..." value="${esc(filters.search)}">
          <select id="inventoryStatusFilter">
            ${["all","unprocessed","available","borrowed","lost","damaged","replaced"].map(s => `<option value="${s}" ${filters.status === s ? "selected" : ""}>${s === "all" ? "All Status" : statusLabel(s)}</option>`).join("")}
          </select>
          <select id="inventoryCategoryFilter"><option value="">All Categories</option>${categories.map(c => `<option ${filters.category === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
        </div></div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode</th><th>Accession Number</th><th>Book Title</th><th>Author</th><th>Category</th><th>ISBN</th><th>Shelf Location</th><th>Quantity</th><th>Available Copies</th><th>Status</th><th>Date Added</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${rows.map(b => `<tr>
            <td class="mono">${esc(b.barcode || "-")}</td>
            <td class="mono">${esc(accession(b))}</td>
            <td><strong>${esc(b.title)}</strong></td>
            <td>${esc(b.author)}</td>
            <td>${esc(b.category)}</td>
            <td class="mono">${esc(b.isbn)}</td>
            <td>${esc(b.location || "-")}</td>
            <td>${b.copies}</td>
            <td>${b.availableCopies}</td>
            <td><span class="pill" style="${statusClass(inventoryStatus(b.status))}">${esc(inventoryStatusLabel(b.status))}</span></td>
            <td>${fmt(b.addedDate)}</td>
            <td><div class="actions"><button class="icon-btn" title="View details" data-view="${b.id}">View</button><button class="icon-btn" title="Edit" data-edit="${b.id}">Edit</button><button class="icon-btn" title="Delete" data-delete="${b.id}">Del</button></div></td>
          </tr>`).join("")}</tbody>
        </table>${rows.length ? "" : `<div class="empty">No inventory items found matching your criteria.</div>`}</div>
        <div class="count">Showing ${rows.length} of ${books.length} inventory items</div>`;
      renderNav();
    }

    function renderBarcodeManagement() {
      const rows = filteredBooks();
      const visibleRows = rows.filter(b => filters.status === "all" || (filters.status === "assigned" && b.barcode) || (filters.status === "unassigned" && !b.barcode));
      $("#main").innerHTML = pageHead("Barcode Management", "Generate and manage barcodes attached to books", `<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="secondary" id="scanBarcode">Scan Barcode</button><button class="primary" id="generateBarcode">+ Generate Barcode</button></div>`) + `
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr 180px 190px">
          <input id="searchBarcode" placeholder="Search by barcode, title, accession number, or ISBN..." value="${esc(filters.search)}">
          <select id="barcodeStatusFilter">
            <option value="all" ${filters.status === "all" ? "selected" : ""}>All Status</option>
            <option value="assigned" ${filters.status === "assigned" ? "selected" : ""}>Assigned</option>
            <option value="unassigned" ${filters.status === "unassigned" ? "selected" : ""}>Unassigned</option>
          </select>
          <select id="barcodeCategoryFilter"><option value="">All Categories</option>${[...new Set(books.map(b => b.category))].sort().map(c => `<option ${filters.category === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
        </div></div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode Number</th><th>Book Title</th><th>Accession Number</th><th>Status</th><th>Date Generated</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${visibleRows.map(b => `<tr>
            <td class="mono">${esc(b.barcode || "Not generated")}</td>
            <td><strong>${esc(b.title)}</strong><p class="subtle mono" style="font-size:12px">${esc(b.isbn)}</p></td>
            <td class="mono">${esc(accession(b))}</td>
            <td><span class="pill" style="${b.barcode ? "background:#d1fae5;color:#047857" : "background:#f1f5f9;color:#475569"}">${b.barcode ? "Assigned" : "Unassigned"}</span></td>
            <td>${b.barcode ? fmt(barcodeDate(b)) : "-"}</td>
            <td><div class="actions">
              <button class="icon-btn" title="Print Barcode" data-print-barcode="${b.id}">Print</button>
              <button class="icon-btn" title="Reassign Barcode" data-reassign-barcode="${b.id}">Reassign</button>
              <button class="icon-btn" title="View Barcode History" data-barcode-history="${b.id}">History</button>
            </div></td>
          </tr>`).join("")}</tbody>
        </table>${visibleRows.length ? "" : `<div class="empty">No barcode records found matching your criteria.</div>`}</div>
        <div class="count">Showing ${visibleRows.length} of ${books.length} barcode records</div>`;
      renderNav();
    }

    function renderAssetTracking() {
      const rows = filteredBooks();
      $("#main").innerHTML = pageHead("Asset Tracking", "Track movement and status of library resources") + `
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr 180px 190px">
          <input id="searchAssets" placeholder="Search by barcode, title, borrower, location, or accession..." value="${esc(filters.search)}">
          <select id="assetStatusFilter">
            ${["all","unprocessed","available","borrowed","lost","damaged","replaced"].map(s => `<option value="${s}" ${filters.status === s ? "selected" : ""}>${s === "all" ? "All Status" : statusLabel(s)}</option>`).join("")}
          </select>
          <select id="assetCategoryFilter"><option value="">All Categories</option>${[...new Set(books.map(b => b.category))].sort().map(c => `<option ${filters.category === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
        </div></div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode</th><th>Item Title</th><th>Current Location</th><th>Borrower</th><th>Date Borrowed</th><th>Due Date</th><th>Last Updated</th><th>Current Status</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${rows.map(b => `<tr>
            <td class="mono">${esc(b.barcode || "-")}</td>
            <td><strong>${esc(b.title)}</strong><p class="subtle mono" style="font-size:12px">${esc(accession(b))}</p></td>
            <td>${esc(b.location || "-")}</td>
            <td>${esc(b.borrower || "-")}</td>
            <td>${b.borrowDate ? fmt(b.borrowDate) : "-"}</td>
            <td>${b.dueDate ? fmt(b.dueDate) : "-"}</td>
            <td>${fmt(lastUpdated(b))}</td>
            <td><span class="pill" style="${statusClass(inventoryStatus(b.status))}">${esc(inventoryStatusLabel(b.status))}</span></td>
            <td><div class="actions">
              <button class="icon-btn" title="Track Item Location" data-track-location="${b.id}">Track</button>
              <button class="icon-btn" title="View Borrowing History" data-borrow-history="${b.id}">Borrow</button>
              <button class="icon-btn" title="View Movement History" data-movement-history="${b.id}">Move</button>
              <button class="icon-btn" title="Update Status" data-update-status="${b.id}">Status</button>
            </div></td>
          </tr>`).join("")}</tbody>
        </table>${rows.length ? "" : `<div class="empty">No assets found matching your criteria.</div>`}</div>
        <div class="count">Showing ${rows.length} of ${books.length} tracked assets</div>`;
      renderNav();
    }

    function renderStockVerification(title = "Stock Verification") {
      const rows = title === "Missing Items"
        ? filteredBooks().filter(b => b.status === "missing" || verificationRecord(b).physicalStatus === "lost")
        : filteredBooks();
      const mismatches = books.filter(b => {
        const record = verificationRecord(b);
        return record.physicalStatus && record.physicalStatus !== inventoryStatus(b.status);
      }).length;
      $("#main").innerHTML = pageHead(title, "Verify physical books against the database", `<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="secondary" id="compareStock">Compare Inventory</button><button class="secondary" id="verificationReport">Generate Report</button><button class="primary" id="scanStock">Scan Books</button></div>`) + `
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr 180px 190px">
          <input id="searchVerification" placeholder="Search by barcode, title, accession, or ISBN..." value="${esc(filters.search)}">
          <select id="verificationStatusFilter">
            ${["all","unprocessed","available","borrowed","lost","damaged","replaced"].map(s => `<option value="${s}" ${filters.status === s ? "selected" : ""}>${s === "all" ? "All Status" : statusLabel(s)}</option>`).join("")}
          </select>
          <select id="verificationCategoryFilter"><option value="">All Categories</option>${[...new Set(books.map(b => b.category))].sort().map(c => `<option ${filters.category === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
        </div></div>
        <div class="grid quick" style="margin-bottom:16px">
          <div class="card"><div class="icon-box">${appIcon("database")}</div><div><p class="subtle">Database Items</p><h2>${books.length}</h2></div></div>
          <div class="card"><div class="icon-box">${appIcon("check")}</div><div><p class="subtle">Verified Items</p><h2>${verificationRecords.length}</h2></div></div>
          <div class="card"><div class="icon-box">${appIcon("alert")}</div><div><p class="subtle">Mismatches</p><h2>${mismatches}</h2></div></div>
        </div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode</th><th>Book Title</th><th>Database Status</th><th>Physical Status</th><th>Verification Date</th><th>Verified By</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${rows.map(b => {
            const record = verificationRecord(b);
            const physical = record.physicalStatus || "unverified";
            return `<tr>
              <td class="mono">${esc(b.barcode || "-")}</td>
              <td><strong>${esc(b.title)}</strong><p class="subtle mono" style="font-size:12px">${esc(accession(b))}</p></td>
              <td><span class="pill" style="${statusClass(inventoryStatus(b.status))}">${esc(inventoryStatusLabel(b.status))}</span></td>
              <td><span class="pill" style="${physical === "unverified" ? "background:#f1f5f9;color:#475569" : statusClass(physical)}">${esc(physical === "unverified" ? "Unverified" : statusLabel(physical))}</span></td>
              <td>${record.verificationDate ? fmt(record.verificationDate) : "-"}</td>
              <td>${esc(record.verifiedBy || "-")}</td>
              <td><div class="actions">
                <button class="icon-btn" title="Scan Book" data-scan-stock="${b.id}">Scan</button>
                <button class="icon-btn" title="Mark Missing Item" data-mark-missing="${b.id}">Missing</button>
              </div></td>
            </tr>`;
          }).join("")}</tbody>
        </table>${rows.length ? "" : `<div class="empty">No verification records found matching your criteria.</div>`}</div>
        <div class="count">Showing ${rows.length} of ${books.length} stock records</div>`;
      renderNav();
    }

    function renderDamagedItems() {
      const rows = filteredBooks().filter(b => b.status === "damaged");
      const damageStatuses = ["all","Damaged","For Repair","Beyond Repair","Replaced"];
      const selectedDamageStatus = filters.status === "damaged" ? "Damaged" : filters.status;
      const visibleRows = rows.filter(b => {
        const record = damagedRecord(b);
        return !damageStatuses.includes(selectedDamageStatus) || selectedDamageStatus === "all" || damageStatusLabel(record.repairStatus) === selectedDamageStatus;
      });
      $("#main").innerHTML = pageHead("Damaged Items", "Books that are worn out or damaged", `<button class="primary" id="reportDamage">+ Report Damage</button>`) + `
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr 180px 190px">
          <input id="searchDamaged" placeholder="Search by barcode, title, accession, or damage description..." value="${esc(filters.search)}">
          <select id="damageStatusFilter">
            ${damageStatuses.map(s => `<option value="${s}" ${selectedDamageStatus === s ? "selected" : ""}>${s === "all" ? "All Repair Status" : s}</option>`).join("")}
          </select>
          <select id="damageCategoryFilter"><option value="">All Categories</option>${[...new Set(books.map(b => b.category))].sort().map(c => `<option ${filters.category === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
        </div></div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode</th><th>Title</th><th>Damage Note</th><th>Date Reported</th><th>Reported By</th><th>Damage Status</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${visibleRows.map(b => {
            const record = damagedRecord(b);
            return `<tr>
              <td class="mono">${esc(b.barcode || "-")}</td>
              <td><strong>${esc(b.title)}</strong><p class="subtle mono" style="font-size:12px">${esc(accession(b))}</p></td>
              <td>${esc(record.description || "No damage note recorded.")}</td>
              <td>${record.dateReported ? fmt(record.dateReported) : "-"}</td>
              <td>${esc(record.reportedBy || "-")}</td>
              <td><span class="pill" style="${damageStatusStyle(damageStatusLabel(record.repairStatus))}">${esc(damageStatusLabel(record.repairStatus))}</span></td>
              <td><div class="actions">
                <button class="icon-btn" title="Upload Damage Photo" data-damage-photo="${b.id}">Photo</button>
                <button class="icon-btn" title="Mark for Repair" data-mark-repair="${b.id}">Repair</button>
                <button class="icon-btn" title="Mark for Replacement" data-mark-replace="${b.id}">Replace</button>
                <button class="icon-btn" title="Archive Damaged Item" data-archive-damage="${b.id}">Archive</button>
              </div></td>
            </tr>`;
          }).join("")}</tbody>
        </table>${visibleRows.length ? "" : `<div class="empty">No damaged items found.</div>`}</div>
        <div class="count">Showing ${visibleRows.length} damaged item records</div>`;
      renderNav();
    }

    function renderBorrowBooks() {
      const member = memberById(borrowSelection.memberId);
      const availableBooks = books.filter(b => b.availableCopies > 0 && b.status === "available");
      const selectedBook = books.find(b => b.id === borrowSelection.bookId) || availableBooks[0] || books[0];
      if (selectedBook && borrowSelection.bookId !== selectedBook.id) borrowSelection.bookId = selectedBook.id;
      const borrowedCount = books.filter(b => b.borrowerId === member.id && b.status === "borrowed").length;
      const borrowDate = isoDate();
      const dueDate = addDays(new Date(), librarySettings.loanDays);
      $("#main").innerHTML = pageHead("Borrow Books", "Process book loans and borrower details") + `
        <form id="borrowBooksForm" class="grid" style="gap:18px">
          <div class="card">
            <div class="card-title">Borrower Information</div>
            <div class="dialog-body"><div class="form-grid">
              <div><label>Student/Member ID</label><select id="borrowMemberSelect" name="memberId">${members.map(m => `<option value="${m.id}" ${m.id === member.id ? "selected" : ""}>${esc(m.id)} - ${esc(m.name)}</option>`).join("")}</select></div>
              <div><label>Full Name</label><input value="${esc(member.name)}" readonly></div>
              <div><label>Course/Grade Level</label><input value="${esc(member.course || "-")}" readonly></div>
              <div><label>Contact Number (optional)</label><input value="${esc(member.contact || "")}" readonly></div>
              <div><label>Member Status</label><input value="${member.status === "active" ? "Active" : "Inactive"}" readonly></div>
            </div></div>
          </div>
          <div class="card">
            <div class="card-title">Book Information</div>
            <div class="dialog-body"><div class="form-grid">
              <div><label>Barcode</label><select id="borrowBookSelect" name="bookId">${availableBooks.map(b => `<option value="${b.id}" ${selectedBook && b.id === selectedBook.id ? "selected" : ""}>${esc(b.barcode || "-")} - ${esc(b.title)}</option>`).join("")}</select></div>
              <div><label>Accession Number</label><input value="${esc(accession(selectedBook))}" readonly></div>
              <div><label>Book Title</label><input value="${esc(selectedBook.title)}" readonly></div>
              <div><label>Author</label><input value="${esc(selectedBook.author)}" readonly></div>
              <div><label>Category</label><input value="${esc(selectedBook.category)}" readonly></div>
              <div><label>Shelf Location</label><input value="${esc(selectedBook.location || "-")}" readonly></div>
              <div><label>Availability Status</label><input value="${selectedBook.availableCopies > 0 ? "Available" : "Unavailable"} (${selectedBook.availableCopies}/${selectedBook.copies})" readonly></div>
            </div></div>
          </div>
          <div class="card">
            <div class="card-title">Borrowing Details</div>
            <div class="dialog-body"><div class="form-grid">
              <div><label>Transaction Number</label><input name="transactionNumber" value="${transactionNumber()}" readonly></div>
              <div><label>Borrow Date</label><input name="borrowDate" type="date" value="${borrowDate}"></div>
              <div><label>Due Date</label><input name="dueDate" type="date" value="${dueDate}"></div>
              <div><label>Number of Books Borrowed</label><input value="${borrowedCount + 1}" readonly></div>
              <div><label>Librarian in Charge</label><input name="librarian" value="${esc(currentUser.name)}" readonly></div>
              <div><label>Remarks</label><input name="remarks" placeholder="Optional remarks"></div>
            </div></div>
            <div class="dialog-foot"><button class="primary" type="submit">Borrow Book</button></div>
          </div>
        </form>`;
      renderNav();
    }

    function renderAccessionUpdate() {
      const selectedBook = accessionLookup.verified ? books.find(b => b.id === accessionLookup.bookId) : null;
      $("#main").innerHTML = pageHead("Accession Update", "Update a book copy status using its accession number") + `
        <div class="grid" style="gap:18px">
          <div class="card">
            <div class="card-title">Input Section</div>
            <div class="dialog-body">
              <form id="accessionVerifyForm">
                <div class="form-grid">
                  <div><label>Accession Number (required)</label><input id="accessionNumberLookup" name="accessionNumber" value="${esc(accessionLookup.number)}" placeholder="Example: ACC-0001" required></div>
                  <div style="display:flex;align-items:end"><button class="primary" type="submit">Search/Verify</button></div>
                </div>
              </form>
            </div>
          </div>
          <div class="card">
            <div class="card-title">Book Information (Auto-Displayed)</div>
            ${selectedBook ? `<div class="dialog-body"><div class="form-grid">
              <div><label>Accession Number</label><input value="${esc(accession(selectedBook))}" readonly></div>
              <div><label>Barcode</label><input value="${esc(selectedBook.barcode || "-")}" readonly></div>
              <div><label>Book Title</label><input value="${esc(selectedBook.title)}" readonly></div>
              <div><label>Author</label><input value="${esc(selectedBook.author)}" readonly></div>
              <div><label>Category</label><input value="${esc(selectedBook.category)}" readonly></div>
              <div><label>Shelf Location</label><input value="${esc(selectedBook.location || "-")}" readonly></div>
              <div><label>Current Status</label><select id="accessionStatusOption">${["available","borrowed","missing","damaged","replaced"].map(s => `<option value="${s}" ${selectedBook.status === s ? "selected" : ""}>${accessionStatusLabel(s)}</option>`).join("")}</select></div>
              <div><label>Damage Note (required if damaged)</label><input id="accessionDamageNote" value="${esc(selectedBook.damageNote || "")}" placeholder="Describe the damage before updating"></div>
            </div></div>
            <div class="dialog-foot" style="flex-wrap:wrap">
              <button class="primary" type="button" id="markAccessionStatus">Update</button>
              <button class="secondary" type="button" id="clearAccessionLookup">Clear</button>
              <button class="secondary" type="button" id="cancelAccessionLookup">Cancel</button>
            </div>` : `<div class="empty">Enter an accession number and click Search/Verify to display book details.</div>`}
          </div>
          <div class="card">
            <div class="card-title">Update History</div>
            <div class="table-wrap"><table>
              <thead><tr><th>Accession Number</th><th>Book Title</th><th>Previous Status</th><th>New Status</th><th>Date Updated</th><th>Updated By</th></tr></thead>
              <tbody>${accessionHistory.length ? accessionHistory.map(h => `<tr><td class="mono">${esc(h.accessionNumber)}</td><td>${esc(h.title)}</td><td>${esc(h.previousStatus)}</td><td><span class="pill" style="${statusClass(String(h.newStatus).toLowerCase())}">${esc(h.newStatus)}</span></td><td>${fmtDateTime(h.dateUpdated)}</td><td>${esc(h.updatedBy)}</td></tr>`).join("") : `<tr><td colspan="6" class="empty">No accession updates yet.</td></tr>`}</tbody>
            </table></div>
          </div>
          <div class="card">
            <div class="card-title">How It Works</div>
            <div class="dialog-body">
              <p class="subtle">Enter an accession number. The system searches for the matching book copy and displays details. Confirm the update to change the status to Available and add the copy to active inventory.</p>
            </div>
          </div>
        </div>`;
      renderNav();
    }

    function openBookForm(book = null) {
      const b = book || { title:"", author:"", isbn:"", category:"", publisher:"", callNumber:"", status:"available", location:"", publishedYear:new Date().getFullYear(), copies:1, availableCopies:1, barcode:"", accessionNumber:"", damageNote:"", repairStatus:"" };
      $("#bookModal").innerHTML = `<div class="dialog">
        <div class="dialog-head"><h2>${book ? "Edit Item" : "Add New Item"}</h2><button class="icon-btn" data-close="bookModal">X</button></div>
        <form id="bookForm">
          <div class="dialog-body"><div class="form-grid">
            ${field("title","Title *",b.title,true)}${catalogField("author","author","Author *",b.author,true)}${field("isbn","ISBN *",b.isbn,true)}${catalogField("category","category","Category *",b.category,true)}
            ${catalogField("publisher","publisher","Publisher",b.publisher)}${field("callNumber","Call Number",b.callNumber)}${field("location","Location",b.location)}${field("publishedYear","Published Year",b.publishedYear,false,"number")}
            ${field("copies","Total Copies *",b.copies,true,"number",1)}${field("availableCopies","Available Copies *",b.availableCopies,true,"number",0)}
            <div><label>Status</label><select name="status">${["unprocessed","available","borrowed","lost","damaged","replaced"].map(s => `<option value="${s}" ${(b.status === s || (b.status === "missing" && s === "lost")) ? "selected" : ""}>${statusLabel(s)}</option>`).join("")}</select></div>
            ${field("damageNote","Damage Note",b.damageNote || "")}
            ${field("barcode","Barcode",b.barcode)}
            ${field("accessionNumber","Accession Number",accession(b))}
          </div></div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="bookModal">Cancel</button><button class="primary" type="submit">${book ? "Update Item" : "Add Item"}</button></div>
        </form></div>`;
      $("#bookModal").style.display = "flex";
      $("#bookForm").onsubmit = async (e) => {
        e.preventDefault();
        const submitButton = e.currentTarget.querySelector("button[type='submit']");
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = book ? "Updating..." : "Saving...";
        }
        const data = Object.fromEntries(new FormData(e.currentTarget));
        const normalizedStatus = data.status === "lost" ? "missing" : data.status;
        if (normalizedStatus === "damaged" && !cleanImportValue(data.damageNote)) {
          systemDialog({
            title:"Damage Note Required",
            message:"Please describe the book damage before marking it as damaged.",
            confirmText:"OK"
          });
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = book ? "Update Item" : "Add Item";
          }
          return;
        }
        const next = {
          ...b,
          ...data,
          status: normalizedStatus,
          publishedYear: Number(data.publishedYear) || new Date().getFullYear(),
          copies: Number(data.copies) || 1,
          availableCopies: normalizedStatus === "damaged" ? 0 : Number(data.availableCopies) || 0,
          damageNote: normalizedStatus === "damaged" ? cleanImportValue(data.damageNote) : "",
          repairStatus: normalizedStatus === "damaged" ? (b.repairStatus || "Damaged") : ""
        };

        try {
          const response = await saveBookToAPI(next, !book);
          if (!response.success) throw new Error(response.message || "Unable to save book.");

          if (book) books = books.map(x => x.id === book.id ? next : x);
          else {
            next.id = response.data || id();
            next.addedDate = new Date().toISOString().slice(0,10);
            next.accessionNumber = next.accessionNumber || nextAccessionNumber();
            books.push(next);
            activities.unshift({ id:id(), type:"add", description:`Added new book "${next.title}"`, user:currentUser.name, timestamp:new Date().toISOString() });
          }
          await loadAppData();
          closeModal("bookModal");
          renderPage();
        } catch (error) {
          systemDialog({
            title:"Unable to Save",
            message:error.message || "The database rejected this change.",
            confirmText:"OK"
          });
        } finally {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = book ? "Update Item" : "Add Item";
          }
        }
      };
    }

    function field(name, label, value, required = false, type = "text", min = "") {
      return `<div><label>${label}</label><input name="${name}" type="${type}" value="${esc(value)}" ${required ? "required" : ""} ${min !== "" ? `min="${min}"` : ""}></div>`;
    }

    function catalogField(type, name, label, value, required = false) {
      const listId = `${type}Options`;
      const options = catalogEntries(type).map(entry => `<option value="${esc(entry.name)}"></option>`).join("");
      return `<div><label>${label}</label><input name="${name}" list="${listId}" value="${esc(value)}" ${required ? "required" : ""}><datalist id="${listId}">${options}</datalist></div>`;
    }

    function viewBook(b) {
      const detailsStatus = currentPage === "inventory" ? inventoryStatusLabel(b.status) : statusLabel(b.status);
      const items = [["Barcode", b.barcode || "-"], ["Accession Number", accession(b)], ["Title", b.title], ["Author", b.author], ["Category", b.category], ["ISBN", b.isbn], ["Shelf Location", b.location || "-"], ["Quantity", b.copies], ["Available Copies", b.availableCopies], ["Status", detailsStatus], ["Publisher", b.publisher || "-"], ["Published Year", b.publishedYear], ["Call Number", b.callNumber || "-"], ["Date Added", fmt(b.addedDate)]];
      $("#viewModal").innerHTML = `<div class="dialog small"><div class="dialog-head"><h2>Book Details</h2><button class="icon-btn" data-close="viewModal">X</button></div><div class="dialog-body"><div class="detail-grid">${items.map(([k,v]) => `<div><p class="subtle" style="font-size:12px">${k}</p><strong>${esc(v)}</strong></div>`).join("")}</div>${b.borrower ? `<div style="margin-top:18px;padding:12px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb"><strong style="color:#b45309">Currently Borrowed</strong><p>Borrower: ${esc(b.borrower)}</p>${b.dueDate ? `<p>Due: ${fmt(b.dueDate)}</p>` : ""}</div>` : ""}</div><div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button></div></div>`;
      $("#viewModal").style.display = "flex";
    }

    function addBarcodeHistory(book, action, barcode) {
      barcodeHistory.unshift({ bookId:book.id, barcode, action, date:new Date().toISOString(), user:currentUser.name });
    }

    function assignBarcode(bookId, barcode, action = "Generated") {
      const book = books.find(b => b.id === bookId);
      if (!book) return;
      const code = barcode || nextBarcode();
      books = books.map(b => b.id === bookId ? { ...b, barcode:code, barcodeDateGenerated:new Date().toISOString() } : b);
      addBarcodeHistory({ ...book, id:bookId }, action, code);
      activities.unshift({ id:id(), type:"add", description:`${action} barcode "${code}" for "${book.title}"`, user:currentUser.name, timestamp:new Date().toISOString() });
      renderPage();
    }

    function openGenerateBarcode() {
      const first = books.find(b => !b.barcode) || books[0];
      $("#viewModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>Generate Barcode</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="generateBarcodeForm">
          <div class="dialog-body">
            <div class="field"><label>Book</label><select name="bookId">${books.map(b => `<option value="${b.id}" ${first && first.id === b.id ? "selected" : ""}>${esc(b.title)} - ${esc(accession(b))}</option>`).join("")}</select></div>
            <div class="field"><label>Barcode Number</label><input name="barcode" value="${esc(nextBarcode())}"></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Cancel</button><button class="primary" type="submit">Generate Barcode</button></div>
        </form>
      </div>`;
      $("#viewModal").style.display = "flex";
      $("#generateBarcodeForm").onsubmit = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        assignBarcode(data.bookId, data.barcode, "Generated");
        closeModal("viewModal");
      };
    }

    function printBarcode(book) {
      if (!book.barcode) assignBarcode(book.id, nextBarcode(), "Generated");
      const latest = books.find(b => b.id === book.id) || book;
      addBarcodeHistory(latest, "Printed", latest.barcode);
      $("#viewModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>Print Barcode</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          <div style="border:1px dashed #94a3b8;border-radius:12px;padding:24px;text-align:center;max-width:360px;margin:auto">
            <p class="subtle" style="font-size:12px">City College of Davao Library Barcode</p>
            <div class="mono" style="font-size:30px;font-weight:900;letter-spacing:2px;margin:12px 0">${esc(latest.barcode)}</div>
            <div style="height:72px;background:repeating-linear-gradient(90deg,#111 0 3px,#fff 3px 6px,#111 6px 8px,#fff 8px 13px);margin:12px 0"></div>
            <strong>${esc(latest.title)}</strong>
            <p class="subtle mono">${esc(accession(latest))}</p>
          </div>
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button><button class="primary" onclick="window.print()">Print Barcode</button></div>
      </div>`;
      $("#viewModal").style.display = "flex";
    }

    function openScanBarcode() {
      $("#viewModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>Scan Barcode</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="scanBarcodeForm">
          <div class="dialog-body">
            <div class="field"><label>Barcode Number</label><input name="barcode" placeholder="Enter or scan barcode number" autofocus></div>
            <div id="scanResult" class="subtle" style="margin-top:12px"></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Close</button><button class="primary" type="submit">Scan Barcode</button></div>
        </form>
      </div>`;
      $("#viewModal").style.display = "flex";
      $("#scanBarcodeForm").onsubmit = (e) => {
        e.preventDefault();
        const code = new FormData(e.currentTarget).get("barcode");
        const book = books.find(b => String(b.barcode).toLowerCase() === String(code).toLowerCase());
        $("#scanResult").innerHTML = book ? `<strong style="color:#047857">Found:</strong> ${esc(book.title)} (${esc(accession(book))})` : `<strong style="color:#b91c1c">No matching barcode found.</strong>`;
        if (book) addBarcodeHistory(book, "Scanned", book.barcode);
      };
    }

    function openReassignBarcode(book) {
      $("#viewModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>Reassign Barcode</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="reassignBarcodeForm">
          <div class="dialog-body">
            <p class="subtle" style="margin-bottom:12px">${esc(book.title)} - ${esc(accession(book))}</p>
            <div class="field"><label>New Barcode Number</label><input name="barcode" value="${esc(nextBarcode())}" required></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Cancel</button><button class="primary" type="submit">Reassign Barcode</button></div>
        </form>
      </div>`;
      $("#viewModal").style.display = "flex";
      $("#reassignBarcodeForm").onsubmit = (e) => {
        e.preventDefault();
        const code = new FormData(e.currentTarget).get("barcode");
        assignBarcode(book.id, code, "Reassigned");
        closeModal("viewModal");
      };
    }

    function viewBarcodeHistory(book) {
      const history = barcodeHistory.filter(h => h.bookId === book.id);
      $("#viewModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>Barcode History</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          <p style="font-weight:800">${esc(book.title)}</p>
          <p class="subtle mono" style="margin-bottom:14px">${esc(accession(book))}</p>
          ${history.length ? `<div class="table-wrap"><table style="min-width:480px"><thead><tr><th>Barcode</th><th>Action</th><th>User</th><th>Date</th></tr></thead><tbody>${history.map(h => `<tr><td class="mono">${esc(h.barcode)}</td><td>${esc(h.action)}</td><td>${esc(h.user)}</td><td>${fmt(h.date)}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">No barcode history yet.</div>`}
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button></div>
      </div>`;
      $("#viewModal").style.display = "flex";
    }

    function addMovementHistory(book, from, to, action) {
      movementHistory.unshift({ bookId:book.id, from, to, action, date:new Date().toISOString(), user:currentUser.name });
    }

    function openTrackLocation(book) {
      const history = movementHistory.filter(h => h.bookId === book.id);
      $("#viewModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>Track Item Location</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          <div class="detail-grid">
            <div><p class="subtle" style="font-size:12px">Item Title</p><strong>${esc(book.title)}</strong></div>
            <div><p class="subtle" style="font-size:12px">Barcode</p><strong class="mono">${esc(book.barcode || "-")}</strong></div>
            <div><p class="subtle" style="font-size:12px">Current Location</p><strong>${esc(book.location || "-")}</strong></div>
            <div><p class="subtle" style="font-size:12px">Current Status</p><strong>${esc(inventoryStatusLabel(book.status))}</strong></div>
          </div>
          <div class="field"><label>Update Location</label><input id="newAssetLocation" value="${esc(book.location || "")}"></div>
          <h3 style="font-size:16px;margin-top:18px">Recent Movement</h3>
          ${history.length ? history.slice(0,4).map(h => `<div class="list-row"><div><strong>${esc(h.action)}</strong><p class="subtle">${esc(h.from)} to ${esc(h.to)} | ${fmt(h.date)}</p></div></div>`).join("") : `<div class="empty">No movement history yet.</div>`}
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button><button class="primary" data-save-location="${book.id}">Update Location</button></div>
      </div>`;
      $("#viewModal").style.display = "flex";
    }

    function viewBorrowingHistory(book) {
      const borrowed = movementHistory.filter(h => h.bookId === book.id && (h.action === "Borrowed" || h.action === "Returned"));
      const current = book.borrower ? [{ action:"Current Borrower", user:book.borrower, date:book.borrowDate || lastUpdated(book), due:book.dueDate || "-" }] : [];
      $("#viewModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>Borrowing History</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          <p style="font-weight:800">${esc(book.title)}</p>
          <p class="subtle mono" style="margin-bottom:14px">${esc(book.barcode || "-")} | ${esc(accession(book))}</p>
          ${current.map(c => `<div class="list-row"><div><strong>${esc(c.action)}</strong><p class="subtle">${esc(c.user)} | Borrowed: ${fmt(c.date)} | Due: ${c.due === "-" ? "-" : fmt(c.due)}</p></div></div>`).join("")}
          ${borrowed.length ? borrowed.map(h => `<div class="list-row"><div><strong>${esc(h.action)}</strong><p class="subtle">${esc(h.user)} | ${fmt(h.date)} | ${esc(h.to)}</p></div></div>`).join("") : current.length ? "" : `<div class="empty">No borrowing history yet.</div>`}
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button></div>
      </div>`;
      $("#viewModal").style.display = "flex";
    }

    function viewMovementHistory(book) {
      const history = movementHistory.filter(h => h.bookId === book.id);
      $("#viewModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>Movement History</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          <p style="font-weight:800">${esc(book.title)}</p>
          <p class="subtle mono" style="margin-bottom:14px">${esc(book.barcode || "-")} | ${esc(accession(book))}</p>
          ${history.length ? `<div class="table-wrap"><table style="min-width:560px"><thead><tr><th>Action</th><th>From</th><th>To</th><th>User</th><th>Date</th></tr></thead><tbody>${history.map(h => `<tr><td>${esc(h.action)}</td><td>${esc(h.from)}</td><td>${esc(h.to)}</td><td>${esc(h.user)}</td><td>${fmt(h.date)}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">No movement history yet.</div>`}
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button></div>
      </div>`;
      $("#viewModal").style.display = "flex";
    }

    function openUpdateAssetStatus(book) {
      $("#viewModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>Update Status</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="assetStatusForm">
          <div class="dialog-body">
            <p style="font-weight:800">${esc(book.title)}</p>
            <p class="subtle mono" style="margin-bottom:14px">${esc(book.barcode || "-")} | ${esc(accession(book))}</p>
            <div class="field"><label>Current Status</label><select name="status">${["unprocessed","available","borrowed","lost","damaged","replaced"].map(s => `<option value="${s}" ${inventoryStatus(book.status) === s ? "selected" : ""}>${statusLabel(s)}</option>`).join("")}</select></div>
            <div class="field"><label>Current Location</label><input name="location" value="${esc(book.location || "")}"></div>
            <div class="field"><label>Borrower</label><input name="borrower" value="${esc(book.borrower || "")}"></div>
            <div class="form-grid">
              <div><label>Date Borrowed</label><input name="borrowDate" type="date" value="${esc(book.borrowDate || "")}"></div>
              <div><label>Due Date</label><input name="dueDate" type="date" value="${esc(book.dueDate || "")}"></div>
            </div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Cancel</button><button class="primary" type="submit">Update Status</button></div>
        </form>
      </div>`;
      $("#viewModal").style.display = "flex";
      $("#assetStatusForm").onsubmit = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        const nextStatus = data.status === "lost" ? "missing" : data.status;
        const from = `${book.location || "-"} / ${inventoryStatusLabel(book.status)}`;
        const to = `${data.location || "-"} / ${statusLabel(nextStatus)}`;
        books = books.map(b => b.id === book.id ? {
          ...b,
          status:nextStatus,
          location:data.location,
          borrower:data.borrower,
          borrowDate:data.borrowDate,
          dueDate:data.dueDate,
          lastUpdated:new Date().toISOString()
        } : b);
        addMovementHistory(book, from, to, "Status Updated");
        closeModal("viewModal");
        renderPage();
      };
    }

    function upsertVerification(bookId, physicalStatus) {
      const record = { bookId, physicalStatus, verificationDate:new Date().toISOString(), verifiedBy:currentUser.name };
      const exists = verificationRecords.some(v => v.bookId === bookId);
      verificationRecords = exists ? verificationRecords.map(v => v.bookId === bookId ? record : v) : [record, ...verificationRecords];
    }

    function openScanStock(book = null) {
      $("#viewModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>Scan Books</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="scanStockForm">
          <div class="dialog-body">
            <div class="field"><label>Barcode</label><input name="barcode" value="${esc(book?.barcode || "")}" placeholder="Enter or scan barcode" autofocus required></div>
            <div class="field"><label>Physical Status</label><select name="physicalStatus">${["available","borrowed","lost","damaged"].map(s => `<option value="${s}" ${book && inventoryStatus(book.status) === s ? "selected" : ""}>${statusLabel(s)}</option>`).join("")}</select></div>
            <div id="scanStockResult" class="subtle" style="margin-top:12px"></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Close</button><button class="primary" type="submit">Save Scan</button></div>
        </form>
      </div>`;
      $("#viewModal").style.display = "flex";
      $("#scanStockForm").onsubmit = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        const scanned = books.find(b => String(b.barcode).toLowerCase() === String(data.barcode).toLowerCase());
        if (!scanned) {
          $("#scanStockResult").innerHTML = `<strong style="color:#b91c1c">No matching barcode found.</strong>`;
          return;
        }
        upsertVerification(scanned.id, data.physicalStatus);
        $("#scanStockResult").innerHTML = `<strong style="color:#047857">Verified:</strong> ${esc(scanned.title)} as ${esc(statusLabel(data.physicalStatus))}`;
        renderPage();
      };
    }

    function compareStock() {
      const rows = books.map(b => {
        const record = verificationRecord(b);
        const database = inventoryStatus(b.status);
        const physical = record.physicalStatus || "unverified";
        const match = database === physical;
        return { book:b, database, physical, match };
      });
      $("#viewModal").innerHTML = `<div class="dialog">
        <div class="dialog-head"><h2>Database vs Physical Inventory</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          <div class="table-wrap"><table>
            <thead><tr><th>Barcode</th><th>Book Title</th><th>Database</th><th>Physical</th><th>Result</th></tr></thead>
            <tbody>${rows.map(r => `<tr>
              <td class="mono">${esc(r.book.barcode || "-")}</td>
              <td>${esc(r.book.title)}</td>
              <td>${esc(statusLabel(r.database))}</td>
              <td>${esc(r.physical === "unverified" ? "Unverified" : statusLabel(r.physical))}</td>
              <td><span class="pill" style="${r.match ? "background:#d1fae5;color:#047857" : "background:#fee2e2;color:#b91c1c"}">${r.match ? "Match" : "Mismatch"}</span></td>
            </tr>`).join("")}</tbody>
          </table></div>
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button></div>
      </div>`;
      $("#viewModal").style.display = "flex";
    }

    function generateVerificationReport() {
      const verified = verificationRecords.length;
      const missing = verificationRecords.filter(v => v.physicalStatus === "lost").length;
      const damaged = verificationRecords.filter(v => v.physicalStatus === "damaged").length;
      const mismatches = books.filter(b => {
        const record = verificationRecord(b);
        return record.physicalStatus && record.physicalStatus !== inventoryStatus(b.status);
      });
      $("#viewModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>Verification Report</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          <div class="detail-grid">
            <div><p class="subtle" style="font-size:12px">Database Items</p><strong>${books.length}</strong></div>
            <div><p class="subtle" style="font-size:12px">Verified Items</p><strong>${verified}</strong></div>
            <div><p class="subtle" style="font-size:12px">Physical Missing</p><strong>${missing}</strong></div>
            <div><p class="subtle" style="font-size:12px">Physical Damaged</p><strong>${damaged}</strong></div>
          </div>
          <h3 style="font-size:16px;margin-top:18px">Mismatches</h3>
          ${mismatches.length ? mismatches.map(b => {
            const record = verificationRecord(b);
            return `<div class="list-row"><div><strong>${esc(b.title)}</strong><p class="subtle">Database: ${esc(inventoryStatusLabel(b.status))} | Physical: ${esc(statusLabel(record.physicalStatus))}</p></div></div>`;
          }).join("") : `<div class="empty">No mismatches found.</div>`}
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button><button class="primary" onclick="window.print()">Print Report</button></div>
      </div>`;
      $("#viewModal").style.display = "flex";
    }

    function markMissingItem(book) {
      systemConfirm(`Mark "${book.title}" as missing?`, async () => {
        const nextBook = {
          ...book,
          status:"missing",
          availableCopies:0,
          lastUpdated:new Date().toISOString()
        };
        const response = await saveBookToAPI(nextBook, false);
        if (!response.success) {
          systemAlert(response.message || "Unable to mark this book missing.");
          return;
        }
        upsertVerification(book.id, "lost");
        damagedRecords = damagedRecords.map(d => d.bookId === book.id && !d.archived ? { ...d, archived:true } : d);
        books = books.map(b => b.id === book.id ? nextBook : b);
        addMovementHistory(book, book.location || "-", "Missing Review", "Marked Missing");
        renderPage();
      }, "Mark Missing");
    }

    async function upsertDamageRecord(bookId, data) {
      const existing = damagedRecords.find(d => d.bookId === bookId && !d.archived);
      const book = books.find(b => b.id === bookId);
      if (!book) return false;
      const currentRecord = existing || damagedRecord(book);
      const record = {
        bookId,
        description:data.description || currentRecord.description || "",
        dateReported:currentRecord.dateReported || new Date().toISOString(),
        reportedBy:currentRecord.reportedBy || currentUser.name,
        repairStatus:damageStatusLabel(data.repairStatus || currentRecord.repairStatus),
        photoNote:data.photoNote || currentRecord.photoNote || "",
        archived:false
      };
      const nextBook = {
        ...book,
        status:"damaged",
        availableCopies:0,
        damageNote:record.description,
        repairStatus:record.repairStatus,
        lastUpdated:new Date().toISOString()
      };
      const response = await saveBookToAPI(nextBook, false);
      if (!response.success) {
        systemAlert(response.message || "Unable to save damage note.");
        return false;
      }
      damagedRecords = existing
        ? damagedRecords.map(d => d === existing ? record : d)
        : [record, ...damagedRecords];
      books = books.map(b => b.id === bookId ? nextBook : b);
      return true;
    }

    function openReportDamage(book = null) {
      const selected = book || books[0];
      $("#viewModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>Report Damage</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="damageForm">
          <div class="dialog-body">
            <div class="field"><label>Book</label><select name="bookId">${books.map(b => `<option value="${b.id}" ${selected && selected.id === b.id ? "selected" : ""}>${esc(b.title)} - ${esc(accession(b))}</option>`).join("")}</select></div>
            <div class="field"><label>Damage Note</label><input name="description" placeholder="Describe the damage" required></div>
            <div class="field"><label>Damage Status</label><select name="repairStatus">${["Damaged","For Repair","Beyond Repair","Replaced"].map(s => `<option value="${s}">${s}</option>`).join("")}</select></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Cancel</button><button class="primary" type="submit">Report Damage</button></div>
        </form>
      </div>`;
      $("#viewModal").style.display = "flex";
      $("#damageForm").onsubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        const saved = await upsertDamageRecord(data.bookId, data);
        if (!saved) return;
        const damagedBook = books.find(b => b.id === data.bookId);
        if (damagedBook) addMovementHistory(damagedBook, damagedBook.location || "-", "Damage Review", "Damage Reported");
        closeModal("viewModal");
        renderPage();
      };
    }

    function openDamagePhoto(book) {
      const record = damagedRecord(book);
      $("#viewModal").innerHTML = `<div class="dialog small">
        <div class="dialog-head"><h2>Upload Damage Photo</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="damagePhotoForm">
          <div class="dialog-body">
            <p style="font-weight:800">${esc(book.title)}</p>
            <p class="subtle" style="margin-bottom:14px">Standalone HTML stores a photo note instead of an uploaded file.</p>
            <div class="field"><label>Damage Photo Note</label><input name="photoNote" value="${esc(record.photoNote || "")}" placeholder="Example: photo saved as IMG_2041.jpg"></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Cancel</button><button class="primary" type="submit">Save Photo Note</button></div>
        </form>
      </div>`;
      $("#viewModal").style.display = "flex";
      $("#damagePhotoForm").onsubmit = async (e) => {
        e.preventDefault();
        const saved = await upsertDamageRecord(book.id, Object.fromEntries(new FormData(e.currentTarget)));
        if (!saved) return;
        closeModal("viewModal");
        renderPage();
      };
    }

    async function setDamageStatus(book, repairStatus, movementAction) {
      const saved = await upsertDamageRecord(book.id, { repairStatus });
      if (!saved) return;
      addMovementHistory(book, book.location || "-", repairStatus, movementAction);
      renderPage();
    }

    function archiveDamagedItem(book) {
      systemConfirm(`Archive damaged record for "${book.title}"?`, async () => {
        const record = damagedRecord(book);
        const nextBook = {
          ...book,
          status:"available",
          availableCopies:Math.max(1, Number(book.availableCopies) || 0),
          damageNote:"",
          repairStatus:"",
          lastUpdated:new Date().toISOString()
        };
        const response = await saveBookToAPI(nextBook, false);
        if (!response.success) {
          systemAlert(response.message || "Unable to archive damage record.");
          return;
        }
        damagedRecords = damagedRecords.map(d => d.bookId === book.id && !d.archived ? { ...d, archived:true } : d);
        books = books.map(b => b.id === book.id ? nextBook : b);
        addMovementHistory(book, record.repairStatus || "Damaged", "Archived", "Archived Damaged Item");
        renderPage();
      }, "Archive Damage Record");
    }

    function processBorrow(form) {
      const data = Object.fromEntries(new FormData(form));
      const member = memberById(data.memberId);
      const book = books.find(b => b.id === data.bookId);
      if (!member || !book) return;
      if (member.status !== "active") {
        systemAlert("This member is inactive and cannot borrow books.");
        return;
      }
      const borrowedCount = books.filter(b => b.borrowerId === member.id && b.status === "borrowed").length;
      if (borrowedCount >= librarySettings.maxBorrowedBooks) {
        systemAlert(`This member has reached the ${librarySettings.maxBorrowedBooks} book borrowing limit.`);
        return;
      }
      if (book.availableCopies <= 0 || ["missing","damaged"].includes(book.status)) {
        systemAlert("This book is not available for borrowing.");
        return;
      }
      const nextCopies = Math.max(0, book.availableCopies - 1);
      books = books.map(b => b.id === book.id ? {
        ...b,
        status:"borrowed",
        availableCopies:nextCopies,
        borrower:member.name,
        borrowerId:member.id,
        borrowDate:data.borrowDate,
        dueDate:data.dueDate,
        lastUpdated:new Date().toISOString(),
        remarks:data.remarks
      } : b);
      activities.unshift({
        id:id(),
        type:"borrow",
        description:`Borrowed "${book.title}" (${data.transactionNumber})`,
        user:member.name,
        timestamp:new Date().toISOString(),
        bookTitle:book.title
      });
      if (librarySettings.emailNotifications) {
        addNotification("reminder", "Book Borrowed", `${book.title} is due on ${fmt(data.dueDate)} for ${member.name}.`);
      }
      addMovementHistory(book, book.location || "-", `Checked out to ${member.name}`, "Borrowed");
      systemAlert("Borrow transaction saved.");
      renderPage();
    }

    function verifyAccessionNumber(number) {
      const clean = String(number || "").trim().toLowerCase();
      const book = books.find(b => accession(b).toLowerCase() === clean);
      accessionLookup = { number, bookId:book ? book.id : null, verified:Boolean(book) };
      if (!book) systemAlert("No book copy found for that accession number.");
      renderAccessionUpdate();
    }

    async function updateAccessionStatus(nextStatus, damageNote = "") {
      const book = books.find(b => b.id === accessionLookup.bookId);
      if (!book) return;
      const previousStatus = accessionStatusLabel(book.status);
      const normalizedStatus = nextStatus === "missing" ? "missing" : nextStatus;
      const cleanDamageNote = cleanImportValue(damageNote);
      if (normalizedStatus === "damaged" && !cleanDamageNote) {
        systemAlert("Please describe the book damage before marking it as damaged.", "Damage Note Required");
        return;
      }
      const newStatusLabel = accessionStatusLabel(normalizedStatus);
      const nextBook = {
        ...book,
        status:normalizedStatus,
        availableCopies:["available","replaced"].includes(normalizedStatus) ? Math.max(1, book.availableCopies || 0) : 0,
        damageNote:normalizedStatus === "damaged" ? cleanDamageNote : "",
        repairStatus:normalizedStatus === "damaged" ? (book.repairStatus || "Damaged") : "",
        borrower:normalizedStatus === "borrowed" ? (book.borrower || "Recorded borrower") : "",
        borrowerId:normalizedStatus === "borrowed" ? book.borrowerId : "",
        borrowDate:normalizedStatus === "borrowed" ? (book.borrowDate || isoDate()) : "",
        dueDate:normalizedStatus === "borrowed" ? (book.dueDate || addDays(new Date(), librarySettings.loanDays)) : "",
        lastUpdated:new Date().toISOString()
      };
      const response = await saveBookToAPI(nextBook, false);
      if (!response.success) {
        systemAlert(response.message || "Unable to update accession status.");
        return;
      }
      books = books.map(b => b.id === book.id ? {
        ...b,
        ...nextBook
      } : b);
      accessionHistory.unshift({
        accessionNumber:accession(book),
        title:book.title,
        previousStatus,
        newStatus:newStatusLabel,
        dateUpdated:new Date().toISOString(),
        updatedBy:currentUser.name
      });
      activities.unshift({
        id:id(),
        type:"add",
        description:`Marked "${book.title}" ${newStatusLabel} via accession ${accession(book)}`,
        user:currentUser.name,
        timestamp:new Date().toISOString(),
        bookTitle:book.title
      });
      addMovementHistory(book, previousStatus, newStatusLabel, "Accession Status Updated");
      systemAlert(`Book copy marked ${newStatusLabel}.`);
      await loadAppData();
      renderPage();
    }

    function normalizeImportHeader(header) {
      return String(header || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    }

    function normalizeImportStatus(status) {
      const clean = String(status || "").trim().toLowerCase();
      if (!clean) return "unprocessed";
      if (clean === "lost" || clean === "missing") return "missing";
      if (["available", "borrowed", "reserved", "damaged", "replaced"].includes(clean)) return clean;
      return "unprocessed";
    }

    function cleanImportValue(value) {
      const clean = String(value ?? "").trim();
      return clean === "-" ? "" : clean;
    }

    function parseCsvRows(text) {
      const rows = [];
      let row = [];
      let cell = "";
      let quoted = false;

      for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        const next = text[i + 1];
        if (char === '"' && quoted && next === '"') {
          cell += '"';
          i += 1;
        } else if (char === '"') {
          quoted = !quoted;
        } else if (char === "," && !quoted) {
          row.push(cell.trim());
          cell = "";
        } else if ((char === "\n" || char === "\r") && !quoted) {
          if (char === "\r" && next === "\n") i += 1;
          row.push(cell.trim());
          if (row.some(Boolean)) rows.push(row);
          row = [];
          cell = "";
        } else {
          cell += char;
        }
      }

      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      return rows;
    }

    function tableRowsToObjects(tableRows) {
      if (tableRows.length < 2) return [];
      const headers = tableRows[0].map(normalizeImportHeader);
      return tableRows.slice(1).map(row => {
        const record = {};
        headers.forEach((header, index) => record[header] = cleanImportValue(row[index]));
        return record;
      }).filter(row => Object.values(row).some(Boolean));
    }

    function parseWorkbookRows(buffer) {
      if (!window.XLSX) {
        throw new Error("Excel workbook import needs the spreadsheet parser to load. Check your internet connection or import a .csv file.");
      }

      const workbook = window.XLSX.read(buffer, { type:"array", cellDates:true });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) return [];
      const sheet = workbook.Sheets[firstSheetName];
      return tableRowsToObjects(window.XLSX.utils.sheet_to_json(sheet, { header:1, raw:false, defval:"" }));
    }

    function ensureWorkbookParser() {
      if (window.XLSX) return Promise.resolve();
      if (window.__xlsxLoading) return window.__xlsxLoading;

      window.__xlsxLoading = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        const timeout = setTimeout(() => {
          reject(new Error("Excel parser did not finish loading. Please check your internet connection and try again."));
        }, 10000);

        script.onload = () => {
          clearTimeout(timeout);
          window.XLSX ? resolve() : reject(new Error("Excel parser loaded but is unavailable."));
        };
        script.onerror = () => {
          clearTimeout(timeout);
          reject(new Error("Excel workbook import needs the spreadsheet parser to load. Check your internet connection or import a .csv file."));
        };

        script.defer = true;
        script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
        document.head.appendChild(script);
      }).finally(() => {
        window.__xlsxLoading = null;
      });

      return window.__xlsxLoading;
    }

    function decodeImportBuffer(buffer) {
      if (window.TextDecoder) return new TextDecoder("utf-8").decode(buffer);
      const bytes = new Uint8Array(buffer);
      let text = "";
      bytes.forEach(byte => text += String.fromCharCode(byte));
      return text;
    }

    function parseInventoryImport(text, fileName) {
      if (/\.xlsx$/i.test(fileName)) {
        throw new Error("This .xlsx file needs the Excel workbook parser. Please try importing it again.");
      }

      if (/<table[\s>]/i.test(text)) {
        const doc = new DOMParser().parseFromString(text, "text/html");
        const table = doc.querySelector("table");
        if (!table) return [];
        const tableRows = [...table.querySelectorAll("tr")].map(tr =>
          [...tr.children].map(cell => cell.textContent.trim())
        ).filter(row => row.some(Boolean));
        return tableRowsToObjects(tableRows);
      }

      return tableRowsToObjects(parseCsvRows(text));
    }

    async function importInventoryRows(rows) {
      const now = new Date().toISOString();
      const usedAccessions = new Set(books.map(book => String(book.accessionNumber || "").toLowerCase()).filter(Boolean));
      let nextAccessionIndex = books.length + 1;

      const makeImportAccession = () => {
        let candidate = "";
        do {
          candidate = `ACC-${String(nextAccessionIndex).padStart(4, "0")}`;
          nextAccessionIndex += 1;
        } while (usedAccessions.has(candidate.toLowerCase()));
        usedAccessions.add(candidate.toLowerCase());
        return candidate;
      };

      const payloadBooks = [];

      for (const row of rows) {
        const title = cleanImportValue(row.booktitle || row.title);
        if (!title) continue;

        const barcode = cleanImportValue(row.barcode);
        const providedAccession = cleanImportValue(row.accessionnumber || row.accession);
        const accessionNumber = providedAccession || makeImportAccession();
        usedAccessions.add(accessionNumber.toLowerCase());
        const isbn = cleanImportValue(row.isbn);
        const copies = Math.max(1, Number(row.quantity || row.copies || 1) || 1);
        const availableCopies = Math.max(0, Number(row.availablecopies || row.available || copies) || 0);
        const parsedDate = new Date(cleanImportValue(row.dateadded || row.addeddate));
        const addedDate = Number.isNaN(parsedDate.getTime()) ? isoDate() : isoDate(parsedDate);
        const status = normalizeImportStatus(row.status);
        const activeAvailableCopies = status === "available" ? Math.min(availableCopies, copies) : 0;
        const importedBook = {
          title,
          author: cleanImportValue(row.author),
          category: cleanImportValue(row.category),
          isbn,
          publisher: cleanImportValue(row.publisher),
          callNumber: cleanImportValue(row.callnumber),
          location: cleanImportValue(row.shelflocation || row.location),
          copies,
          availableCopies: activeAvailableCopies,
          status,
          addedDate,
          barcode,
          accessionNumber,
          publishedYear: Number(row.publishedyear) || new Date().getFullYear(),
          lastUpdated: now
        };

        payloadBooks.push({
          title: importedBook.title,
          author: importedBook.author,
          category: importedBook.category,
          publisher: importedBook.publisher,
          isbn: importedBook.isbn || null,
          call_number: importedBook.callNumber || null,
          status: importedBook.status,
          location: importedBook.location || null,
          published_year: importedBook.publishedYear,
          copies: importedBook.copies,
          available_copies: importedBook.availableCopies,
          accession_number: importedBook.accessionNumber || null,
          damage_note: importedBook.damageNote || null,
          repair_status: importedBook.repairStatus || null,
          barcode: importedBook.barcode || null
        });
      }

      if (!payloadBooks.length) return { added:0, updated:0 };

      const response = await apiPost("/api/books/import", { books:payloadBooks });
      if (!response.success) throw new Error(response.message || "Unable to import inventory file.");

      const added = Number(response.data?.added || 0);
      const updated = Number(response.data?.updated || 0);

      if (added || updated) {
        activities.unshift({
          id:id(),
          type:"add",
          description:`Imported inventory file (${added} added, ${updated} updated)`,
          user:currentUser.name,
          timestamp:now
        });
      }

      return { added, updated };
    }

    function importInventoryExcel(file) {
      if (!file) return;
      const isWorkbook = /\.(xlsx|xls)$/i.test(file.name) && !/\.csv$/i.test(file.name);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          let rows = [];
          if (isWorkbook) {
            await ensureWorkbookParser();
            try {
              rows = parseWorkbookRows(reader.result);
            } catch (error) {
              if (/\.xlsx$/i.test(file.name)) {
                throw new Error(error.message || "Unable to read this Excel workbook. Please check that the file is not password-protected or corrupted.");
              }
              rows = parseInventoryImport(decodeImportBuffer(reader.result), file.name);
            }
          } else {
            rows = parseInventoryImport(String(reader.result || ""), file.name);
          }
          if (!rows.length) throw new Error("No inventory rows were found in this file.");
          const result = await importInventoryRows(rows);
          await loadAppData();
          systemAlert(`Inventory import complete. ${result.added} added, ${result.updated} updated.`);
          renderInventory();
        } catch (error) {
          systemAlert(error.message || "Unable to import this inventory file.");
        } finally {
          const input = $("#inventoryImportFile");
          if (input) input.value = "";
        }
      };
      reader.onerror = () => systemAlert("Unable to read this inventory file.");
      if (isWorkbook) reader.readAsArrayBuffer(file);
      else reader.readAsText(file);
    }

    function exportInventoryExcel() {
      const rows = filteredBooks();
      const headers = ["Barcode", "Accession Number", "Book Title", "Author", "Category", "ISBN", "Shelf Location", "Quantity", "Available Copies", "Status", "Date Added"];
      const body = rows.map(b => [
        b.barcode || "-",
        accession(b),
        b.title,
        b.author,
        b.category,
        b.isbn,
        b.location || "-",
        b.copies,
        b.availableCopies,
        inventoryStatusLabel(b.status),
        fmt(b.addedDate)
      ]);
      const table = `<table><thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${body.map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      const blob = new Blob([`\ufeff${table}`], { type:"application/vnd.ms-excel" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `inventory-list-${isoDate()}.xls`;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      link.remove();
    }

    function closeModal(id) { $("#" + id).style.display = "none"; }

    document.addEventListener("click", (e) => {
      const t = e.target.closest("button");
      if (!t) return;
      if (t.id === "toggleSignup") {
        const signupForm = $("#signupForm");
        const loginForm = $("#loginForm");
        const showingSignup = signupForm.hasAttribute("hidden");
        signupForm.toggleAttribute("hidden", !showingSignup);
        loginForm.toggleAttribute("hidden", showingSignup);
        t.textContent = showingSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up";
        $("#loginError").style.display = "none";
      }
      if (t.dataset.page) {
        if (t.dataset.page !== currentPage) filters.status = "all";
        currentPage = t.dataset.page;
        saveSession();
        renderPage();
      }
      if (t.dataset.toggle) {
        expanded.has(t.dataset.toggle) ? expanded.delete(t.dataset.toggle) : expanded.add(t.dataset.toggle);
        renderNav();
      }
      if (t.id === "logoutBtn") systemConfirm("Logout of your account?", logout, "Logout");
      if (t.dataset.togglePassword) {
        const input = document.querySelector(t.dataset.togglePassword);
        if (input) {
          const visible = input.type === "password";
          input.type = visible ? "text" : "password";
          t.innerHTML = passwordToggleIcon(visible);
          t.setAttribute("aria-label", visible ? "Hide password" : "Show password");
          t.title = visible ? "Hide password" : "Show password";
        }
      }
      if (t.id === "addBook" || t.id === "addItem") openBookForm();
      if (t.id === "addUser") openUserForm();
      if (t.id === "savePermissions") savePermissions();
      if (t.id === "clearBookSelection") {
        selectedBookIds.clear();
        renderBooks();
      }
      if (t.id === "deleteSelectedBooks") {
        const ids = [...selectedBookIds];
        if (!ids.length) return;
        systemConfirm(`Delete ${ids.length} selected book${ids.length === 1 ? "" : "s"}? This cannot be undone.`, async () => {
          try {
            const response = await deleteSelectedBooksFromAPI(ids);
            if (!response.success) throw new Error(response.message || "Unable to delete selected books.");
            const deleted = Number(response.data?.deleted || ids.length);
            selectedBookIds.clear();
            activities.unshift({ id:id(), type:"delete", description:`Deleted ${deleted} selected book${deleted === 1 ? "" : "s"}`, user:currentUser.name, timestamp:new Date().toISOString() });
            await loadAppData();
            renderPage();
          } catch (error) {
            systemDialog({
              title:"Unable to Delete",
              message:error.message || "The database rejected this change.",
              confirmText:"OK"
            });
          }
        }, "Delete Selected Books");
      }
      if (t.id === "importInventoryExcel") $("#inventoryImportFile")?.click();
      if (t.id === "exportInventoryExcel") exportInventoryExcel();
      if (t.dataset.catalogAdd) openCatalogForm(t.dataset.catalogAdd);
      if (t.dataset.catalogEdit) openCatalogForm(t.dataset.catalogEdit, t.dataset.name || "");
      if (t.dataset.catalogView) viewCatalogBooks(t.dataset.catalogView, t.dataset.name || "");
      if (t.dataset.catalogDelete) deleteCatalogEntry(t.dataset.catalogDelete, t.dataset.name || "");
      if (t.id === "generateBarcode") openGenerateBarcode();
      if (t.id === "scanBarcode") openScanBarcode();
      if (t.id === "scanStock") openScanStock();
      if (t.id === "compareStock") compareStock();
      if (t.id === "verificationReport") generateVerificationReport();
      if (t.id === "printReport") window.print();
      if (t.id === "markAllNotificationsRead") markAllNotificationsRead();
      if (t.id === "addTestNotification") {
        addNotification("announcement", "New Library Notice", "A new notification was created for review.");
        renderNotifications();
      }
      if (t.id === "reportDamage") openReportDamage();
      if (t.id === "markAccessionStatus") updateAccessionStatus($("#accessionStatusOption").value, $("#accessionDamageNote")?.value || "");
      if (t.id === "clearAccessionLookup") {
        accessionLookup = { number:"", bookId:null, verified:false };
        renderAccessionUpdate();
      }
      if (t.id === "cancelAccessionLookup") {
        accessionLookup = { number:"", bookId:null, verified:false };
        currentPage = "inventory";
        renderPage();
      }
      if (t.dataset.edit) openBookForm(books.find(b => b.id === t.dataset.edit));
      if (t.dataset.view) viewBook(books.find(b => b.id === t.dataset.view));
      if (t.dataset.printBarcode) printBarcode(books.find(b => b.id === t.dataset.printBarcode));
      if (t.dataset.reassignBarcode) openReassignBarcode(books.find(b => b.id === t.dataset.reassignBarcode));
      if (t.dataset.barcodeHistory) viewBarcodeHistory(books.find(b => b.id === t.dataset.barcodeHistory));
      if (t.dataset.trackLocation) openTrackLocation(books.find(b => b.id === t.dataset.trackLocation));
      if (t.dataset.borrowHistory) viewBorrowingHistory(books.find(b => b.id === t.dataset.borrowHistory));
      if (t.dataset.movementHistory) viewMovementHistory(books.find(b => b.id === t.dataset.movementHistory));
      if (t.dataset.updateStatus) openUpdateAssetStatus(books.find(b => b.id === t.dataset.updateStatus));
      if (t.dataset.scanStock) openScanStock(books.find(b => b.id === t.dataset.scanStock));
      if (t.dataset.markMissing) markMissingItem(books.find(b => b.id === t.dataset.markMissing));
      if (t.dataset.damagePhoto) openDamagePhoto(books.find(b => b.id === t.dataset.damagePhoto));
      if (t.dataset.markRepair) setDamageStatus(books.find(b => b.id === t.dataset.markRepair), "For Repair", "Marked for Repair");
      if (t.dataset.markReplace) setDamageStatus(books.find(b => b.id === t.dataset.markReplace), "Replaced", "Marked for Replacement");
      if (t.dataset.archiveDamage) archiveDamagedItem(books.find(b => b.id === t.dataset.archiveDamage));
      if (t.dataset.toggleNotification) toggleNotification(t.dataset.toggleNotification);
      if (t.dataset.deleteNotification) deleteNotification(t.dataset.deleteNotification);
      if (t.dataset.editUser) openUserForm(demoUsers.find(u => u.id === t.dataset.editUser));
      if (t.dataset.toggleUserStatus) toggleUserStatus(t.dataset.toggleUserStatus);
      if (t.dataset.deleteUser) deleteUser(t.dataset.deleteUser);
      if (t.dataset.saveLocation) {
        const book = books.find(b => b.id === t.dataset.saveLocation);
        const location = $("#newAssetLocation").value;
        if (book) {
          books = books.map(b => b.id === book.id ? { ...b, location, lastUpdated:new Date().toISOString() } : b);
          addMovementHistory(book, book.location || "-", location || "-", "Location Updated");
          closeModal("viewModal");
          renderPage();
        }
      }
      if (t.dataset.delete) {
        const book = books.find(b => b.id === t.dataset.delete);
        if (book) {
          systemConfirm("Are you sure you want to delete this book?", async () => {
            try {
              const response = await deleteBookFromAPI(book.id);
              if (!response.success) throw new Error(response.message || "Unable to delete book.");
              books = books.filter(b => b.id !== book.id);
              selectedBookIds.delete(book.id);
              activities.unshift({ id:id(), type:"delete", description:`Deleted book "${book.title}"`, user:currentUser.name, timestamp:new Date().toISOString() });
              await loadAppData();
              renderPage();
            } catch (error) {
              systemDialog({
                title:"Unable to Delete",
                message:error.message || "The database rejected this change.",
                confirmText:"OK"
              });
            }
          }, "Delete Book");
        }
      }
      if (t.hasAttribute("data-system-close")) closeSystemDialog(false);
      if (t.hasAttribute("data-system-confirm")) closeSystemDialog(true);
      if (t.dataset.close) closeModal(t.dataset.close);
    });

    document.addEventListener("input", (e) => {
      if (e.target.id === "searchBooks") {
        filters.search = e.target.value;
        renderBooks();
        $("#searchBooks").focus();
        $("#searchBooks").setSelectionRange(filters.search.length, filters.search.length);
      }
      if (e.target.id === "searchAuthors") {
        filters.search = e.target.value;
        renderCatalogList("author");
        $("#searchAuthors").focus();
        $("#searchAuthors").setSelectionRange(filters.search.length, filters.search.length);
      }
      if (e.target.id === "searchPublishers") {
        filters.search = e.target.value;
        renderCatalogList("publisher");
        $("#searchPublishers").focus();
        $("#searchPublishers").setSelectionRange(filters.search.length, filters.search.length);
      }
      if (e.target.id === "searchCategories") {
        filters.search = e.target.value;
        renderCatalogList("category");
        $("#searchCategories").focus();
        $("#searchCategories").setSelectionRange(filters.search.length, filters.search.length);
      }
      if (e.target.id === "searchReports") {
        filters.search = e.target.value;
        renderPage();
        $("#searchReports").focus();
        $("#searchReports").setSelectionRange(filters.search.length, filters.search.length);
      }
      if (e.target.id === "searchInventory") {
        filters.search = e.target.value;
        renderInventory();
        $("#searchInventory").focus();
        $("#searchInventory").setSelectionRange(filters.search.length, filters.search.length);
      }
      if (e.target.id === "searchBarcode") {
        filters.search = e.target.value;
        renderBarcodeManagement();
        $("#searchBarcode").focus();
        $("#searchBarcode").setSelectionRange(filters.search.length, filters.search.length);
      }
      if (e.target.id === "searchAssets") {
        filters.search = e.target.value;
        renderAssetTracking();
        $("#searchAssets").focus();
        $("#searchAssets").setSelectionRange(filters.search.length, filters.search.length);
      }
      if (e.target.id === "searchVerification") {
        filters.search = e.target.value;
        renderPage();
        $("#searchVerification").focus();
        $("#searchVerification").setSelectionRange(filters.search.length, filters.search.length);
      }
      if (e.target.id === "searchDamaged") {
        filters.search = e.target.value;
        renderDamagedItems();
        $("#searchDamaged").focus();
        $("#searchDamaged").setSelectionRange(filters.search.length, filters.search.length);
      }
      if (e.target.id === "searchNotifications") {
        filters.search = e.target.value;
        renderNotifications();
        $("#searchNotifications").focus();
        $("#searchNotifications").setSelectionRange(filters.search.length, filters.search.length);
      }
      if (e.target.id === "searchUsers") {
        filters.search = e.target.value;
        renderUsers();
        $("#searchUsers").focus();
        $("#searchUsers").setSelectionRange(filters.search.length, filters.search.length);
      }
      if (e.target.id === "accessionNumberLookup") accessionLookup.number = e.target.value;
    });
    document.addEventListener("change", (e) => {
      if (e.target.id === "borrowMemberSelect") {
        borrowSelection.memberId = e.target.value;
        renderBorrowBooks();
      }
      if (e.target.id === "borrowBookSelect") {
        borrowSelection.bookId = e.target.value;
        renderBorrowBooks();
      }
      if (e.target.id === "statusFilter") { filters.status = e.target.value; renderBooks(); }
      if (e.target.id === "categoryFilter") { filters.category = e.target.value; renderBooks(); }
      if (e.target.id === "inventoryStatusFilter") { filters.status = e.target.value; renderInventory(); }
      if (e.target.id === "inventoryCategoryFilter") { filters.category = e.target.value; renderInventory(); }
      if (e.target.id === "selectVisibleBooks") {
        filteredBooks().forEach(book => {
          if (e.target.checked) selectedBookIds.add(book.id);
          else selectedBookIds.delete(book.id);
        });
        renderBooks();
      }
      if (e.target.dataset.selectBook) {
        if (e.target.checked) selectedBookIds.add(e.target.dataset.selectBook);
        else selectedBookIds.delete(e.target.dataset.selectBook);
        renderBooks();
      }
      if (e.target.id === "barcodeStatusFilter") { filters.status = e.target.value; renderBarcodeManagement(); }
      if (e.target.id === "barcodeCategoryFilter") { filters.category = e.target.value; renderBarcodeManagement(); }
      if (e.target.id === "assetStatusFilter") { filters.status = e.target.value; renderAssetTracking(); }
      if (e.target.id === "assetCategoryFilter") { filters.category = e.target.value; renderAssetTracking(); }
      if (e.target.id === "verificationStatusFilter") { filters.status = e.target.value; renderPage(); }
      if (e.target.id === "verificationCategoryFilter") { filters.category = e.target.value; renderPage(); }
      if (e.target.id === "damageStatusFilter") { filters.status = e.target.value; renderDamagedItems(); }
      if (e.target.id === "damageCategoryFilter") { filters.category = e.target.value; renderDamagedItems(); }
      if (e.target.id === "notificationStatusFilter") { filters.status = e.target.value; renderNotifications(); }
      if (e.target.id === "userStatusFilter") { filters.status = e.target.value; renderUsers(); }
      if (e.target.id === "inventoryImportFile") importInventoryExcel(e.target.files && e.target.files[0]);
    });
    $("#loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      login($("#email").value, $("#password").value);
    });
    document.addEventListener("submit", (e) => {
      if (e.target.id === "signupForm") {
        e.preventDefault();
        submitSignup(e.target);
      }
      if (e.target.id === "borrowBooksForm") {
        e.preventDefault();
        processBorrow(e.target);
      }
      if (e.target.id === "accessionVerifyForm") {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        verifyAccessionNumber(data.accessionNumber);
      }
      if (e.target.id === "userForm") {
        e.preventDefault();
        saveUser(e.target);
      }
      if (e.target.id === "librarySettingsForm") {
        e.preventDefault();
        saveLibrarySettings(e.target);
      }
      if (e.target.id === "borrowingSettingsForm") {
        e.preventDefault();
        saveBorrowingSettings(e.target);
      }
      if (e.target.id === "profileSettingsForm") {
        e.preventDefault();
        saveProfileSettings(e.target);
      }
      if (e.target.id === "passwordSettingsForm") {
        e.preventDefault();
        updateCurrentPassword(e.target);
      }
    });
    document.querySelectorAll("[data-toggle-password]").forEach(button => {
      button.innerHTML = passwordToggleIcon(false);
    });
    restoreSession();
