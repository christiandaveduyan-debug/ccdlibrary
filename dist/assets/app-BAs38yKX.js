const g=[{email:"admin@library.edu",password:"admin123",name:"Admin User",role:"admin"},{email:"librarian@library.edu",password:"lib123",name:"Jane Librarian",role:"librarian"}],te="ccdLibraryUsers",P="http://127.0.0.1:8000";function j(){try{localStorage.setItem(te,JSON.stringify(g))}catch(t){console.warn("Unable to save users.",t)}}g.forEach((t,e)=>{t.id=t.id||`U${String(e+1).padStart(3,"0")}`,t.status=t.status||"active",t.createdAt=t.createdAt||`2024-01-${String(e+5).padStart(2,"0")}T09:00:00`,t.lastLogin=t.lastLogin||""});try{const t=JSON.parse(localStorage.getItem(te)||"[]");Array.isArray(t)&&t.forEach(e=>{if(!e||!e.email)return;const a=String(e.email).trim().toLowerCase(),i=g.find(n=>n.email.toLowerCase()===a||n.id===e.id),s={...e,email:a,role:["admin","librarian"].includes(e.role)?e.role:"librarian",status:["active","inactive","pending"].includes(e.status)?e.status:"pending",createdAt:e.createdAt||new Date().toISOString(),lastLogin:e.lastLogin||""};i?Object.assign(i,s):g.push(s)})}catch(t){console.warn("Unable to load saved users.",t)}const ue={dashboard:["Dashboard","Welcome back! Here's your library overview."],authors:["Authors","Manage book authors"],publishers:["Publishers","Manage publishers"],categories:["Categories","Manage book categories"],inventory:["Inventory","Inventory management"],barcode:["Barcode Management","Manage book barcodes"],assets:["Asset Tracking","Track library assets"],verification:["Stock Verification","Verify library stock"],missing:["Missing Items","Track missing items"],damaged:["Damaged Items","Manage damaged items"],"accession-update":["Accession Update","Update item accession numbers"],borrow:["Borrow Books","Process book loans"],return:["Return Books","Process book returns"],renew:["Renew Loans","Renew book loans"],reservations:["Reservations","Manage reservations"],fines:["Fine Management","Manage member fines"],"borrowing-reports":["Borrowing Reports","View borrowing reports"],"overdue-reports":["Overdue Reports","View overdue reports"],"lost-reports":["Lost Books Reports","View lost books reports"],statistics:["Statistics","View library statistics"],notifications:["Notifications","View and manage notifications"],users:["Users","Manage system users"],permissions:["Permissions","Manage user permissions"],settings:["Settings","Configure library settings"]},ee=[{id:"dashboard",label:"Dashboard",icon:"dashboard",roles:["admin","librarian"]},{id:"books",label:"Catalog Management",icon:"books",roles:["admin","librarian"],children:[["books","Books"],["authors","Authors"],["publishers","Publishers"],["categories","Categories"]]},{id:"inventory",label:"Inventory Management",icon:"inventory",roles:["admin","librarian"],children:[["inventory","Inventory List"],["barcode","Barcode Management"],["assets","Asset Tracking"],["verification","Stock Verification"],["missing","Missing Items"],["damaged","Damaged Items"],["accession-update","Accession Update"]]},{id:"borrowing-reports",label:"Reports",icon:"reports",roles:["admin","librarian"],children:[["borrowing-reports","Borrowing Reports"],["overdue-reports","Overdue Reports"],["lost-reports","Lost Books Reports"],["statistics","Statistics"]]},{id:"notifications",label:"Notifications",icon:"notifications",roles:["admin","librarian"]},{id:"users",label:"User Management",icon:"users",roles:["admin"],children:[["users","Users"],["permissions","Permissions"]]},{id:"settings",label:"Settings",icon:"settings",roles:["admin","librarian"]}];let p=null,h="dashboard",rt=new Set(["books"]),l={search:"",status:"all",category:""},J={memberId:"M001",bookId:"1"},V={number:"",bookId:null,verified:!1},c=[{id:"1",title:"The Great Gatsby",author:"F. Scott Fitzgerald",isbn:"978-0743273565",category:"Fiction",publisher:"Scribner",callNumber:"FIC FIT",status:"available",location:"Shelf A1",publishedYear:1925,copies:3,availableCopies:2,addedDate:"2024-01-15",barcode:"BC001"},{id:"2",title:"Clean Code",author:"Robert C. Martin",isbn:"978-0132350884",category:"Technology",publisher:"Prentice Hall",callNumber:"TEC MAR",status:"borrowed",location:"Shelf B2",publishedYear:2008,copies:2,availableCopies:0,addedDate:"2024-01-20",borrower:"John Smith",borrowerId:"M001",dueDate:"2024-02-15",borrowDate:"2024-01-28",barcode:"BC002"},{id:"3",title:"To Kill a Mockingbird",author:"Harper Lee",isbn:"978-0061120084",category:"Fiction",publisher:"HarperCollins",callNumber:"FIC LEE",status:"available",location:"Shelf A1",publishedYear:1960,copies:4,availableCopies:4,addedDate:"2024-01-10",barcode:"BC003"},{id:"4",title:"1984",author:"George Orwell",isbn:"978-0451524935",category:"Fiction",publisher:"Signet Classic",callNumber:"FIC ORW",status:"reserved",location:"Shelf A2",publishedYear:1949,copies:2,availableCopies:1,addedDate:"2024-01-05",barcode:"BC004"},{id:"5",title:"Database Systems",author:"Thomas Connolly",isbn:"978-0321215958",category:"Technology",publisher:"Addison Wesley",callNumber:"TEC CON",status:"borrowed",location:"Shelf B1",publishedYear:2014,copies:3,availableCopies:1,addedDate:"2024-01-12",borrower:"Jane Doe",borrowerId:"M002",dueDate:"2024-01-20",borrowDate:"2024-01-06",barcode:"BC005"},{id:"6",title:"The Catcher in the Rye",author:"J.D. Salinger",isbn:"978-0316769488",category:"Fiction",publisher:"Little, Brown",callNumber:"FIC SAL",status:"missing",location:"Shelf A3",publishedYear:1951,copies:2,availableCopies:0,addedDate:"2024-01-08",barcode:"BC006"},{id:"7",title:"Pride and Prejudice",author:"Jane Austen",isbn:"978-0141439518",category:"Romance",publisher:"Penguin",callNumber:"ROM AUS",status:"damaged",location:"Shelf C1",publishedYear:1813,copies:3,availableCopies:2,addedDate:"2024-01-18",barcode:"BC007"},{id:"8",title:"The Hobbit",author:"J.R.R. Tolkien",isbn:"978-0547928227",category:"Fantasy",publisher:"Houghton Mifflin",callNumber:"FAN TOL",status:"available",location:"Shelf D1",publishedYear:1937,copies:5,availableCopies:5,addedDate:"2024-01-22",barcode:"BC008"}],Y=[{id:"M001",name:"John Smith",course:"BS Information Technology - 2nd Year",contact:"555-0101",status:"active",fines:0},{id:"M002",name:"Jane Doe",course:"Faculty - Computer Studies",contact:"555-0102",status:"active",fines:5.5},{id:"M003",name:"Mike Johnson",course:"Grade 12 - STEM",contact:"555-0103",status:"active",fines:0},{id:"M004",name:"Sarah Williams",course:"BS Education - 1st Year",contact:"555-0104",status:"inactive",fines:25}],L=[{id:"1",type:"borrow",description:'Borrowed "Clean Code"',user:"John Smith",timestamp:"2024-01-28T10:30:00"},{id:"2",type:"return",description:'Returned "The Great Gatsby"',user:"Jane Doe",timestamp:"2024-01-27T14:15:00"},{id:"3",type:"reserve",description:'Reserved "1984"',user:"Mike Johnson",timestamp:"2024-01-26T09:45:00"},{id:"4",type:"add",description:'Added new book "The Hobbit"',user:"Admin",timestamp:"2024-01-22T11:00:00"},{id:"5",type:"fine",description:"Fine issued for overdue book",user:"Jane Doe",timestamp:"2024-01-21T16:30:00"}],B=[{id:"1",type:"overdue",title:"Overdue Book Notice",message:"Database Systems is 8 days overdue",timestamp:"2024-01-28T08:00:00",read:!1},{id:"2",type:"reminder",title:"Due Date Reminder",message:"Clean Code is due in 3 days",timestamp:"2024-01-27T08:00:00",read:!1},{id:"3",type:"announcement",title:"Library Hours Update",message:"Library will close early on Friday",timestamp:"2024-01-25T10:00:00",read:!0}],xt=[{bookId:"1",barcode:"BC001",action:"Generated",date:"2024-01-15T09:00:00",user:"Admin"},{bookId:"2",barcode:"BC002",action:"Generated",date:"2024-01-20T09:00:00",user:"Admin"},{bookId:"3",barcode:"BC003",action:"Generated",date:"2024-01-10T09:00:00",user:"Admin"},{bookId:"4",barcode:"BC004",action:"Generated",date:"2024-01-05T09:00:00",user:"Admin"},{bookId:"5",barcode:"BC005",action:"Generated",date:"2024-01-12T09:00:00",user:"Admin"},{bookId:"6",barcode:"BC006",action:"Generated",date:"2024-01-08T09:00:00",user:"Admin"},{bookId:"7",barcode:"BC007",action:"Generated",date:"2024-01-18T09:00:00",user:"Admin"},{bookId:"8",barcode:"BC008",action:"Generated",date:"2024-01-22T09:00:00",user:"Admin"}],pt=[{bookId:"1",from:"Processing",to:"Shelf A1",action:"Shelved",date:"2024-01-15T10:00:00",user:"Admin"},{bookId:"2",from:"Shelf B2",to:"Checked out to John Smith",action:"Borrowed",date:"2024-01-28T10:30:00",user:"John Smith"},{bookId:"3",from:"Processing",to:"Shelf A1",action:"Shelved",date:"2024-01-10T10:00:00",user:"Admin"},{bookId:"4",from:"Shelf A2",to:"Reservation Hold",action:"Reserved",date:"2024-01-26T09:45:00",user:"Mike Johnson"},{bookId:"5",from:"Shelf B1",to:"Checked out to Jane Doe",action:"Borrowed",date:"2024-01-06T11:00:00",user:"Jane Doe"},{bookId:"6",from:"Shelf A3",to:"Missing Review",action:"Marked Lost",date:"2024-01-18T13:00:00",user:"Admin"},{bookId:"7",from:"Shelf C1",to:"Repair Desk",action:"Marked Damaged",date:"2024-01-20T14:00:00",user:"Admin"},{bookId:"8",from:"Processing",to:"Shelf D1",action:"Shelved",date:"2024-01-22T11:00:00",user:"Admin"}],F=[{bookId:"1",physicalStatus:"available",verificationDate:"2024-02-01T09:00:00",verifiedBy:"Jane Librarian"},{bookId:"2",physicalStatus:"borrowed",verificationDate:"2024-02-01T09:05:00",verifiedBy:"Jane Librarian"},{bookId:"3",physicalStatus:"available",verificationDate:"2024-02-01T09:10:00",verifiedBy:"Jane Librarian"},{bookId:"4",physicalStatus:"borrowed",verificationDate:"2024-02-01T09:15:00",verifiedBy:"Jane Librarian"},{bookId:"5",physicalStatus:"borrowed",verificationDate:"2024-02-01T09:20:00",verifiedBy:"Jane Librarian"},{bookId:"6",physicalStatus:"lost",verificationDate:"2024-02-01T09:25:00",verifiedBy:"Jane Librarian"},{bookId:"7",physicalStatus:"damaged",verificationDate:"2024-02-01T09:30:00",verifiedBy:"Jane Librarian"},{bookId:"8",physicalStatus:"available",verificationDate:"2024-02-01T09:35:00",verifiedBy:"Jane Librarian"}],O=[{bookId:"7",description:"Cover torn and several pages water-stained.",dateReported:"2024-01-20T14:00:00",reportedBy:"Admin",repairStatus:"For Repair",archived:!1},{bookId:"6",description:"Spine detached and item previously flagged for review.",dateReported:"2024-01-18T13:00:00",reportedBy:"Admin",repairStatus:"Beyond Repair",archived:!1}],Mt=[],I={author:[],publisher:[],category:[]},$={libraryName:"City College of Davao Library",tagline:"Committed to Excellence",contactEmail:"library@ccd.edu",contactPhone:"555-0000",address:"Davao City",loanDays:14,dailyFine:5,maxBorrowedBooks:5,emailNotifications:!0,showDashboardNotices:!0};const d=t=>document.querySelector(t),o=t=>String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),A=()=>Math.random().toString(36).slice(2,11),f=t=>new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),vt=t=>new Date(t).toLocaleString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}),_=(t=new Date)=>t.toISOString().slice(0,10),ae=(t,e)=>{const a=new Date(t);return a.setDate(a.getDate()+e),_(a)},nt=t=>new Date(t)<new Date,et=t=>Math.max(0,Math.floor((Date.now()-new Date(t).getTime())/864e5)),zt=t=>t.includes(p.role);let Ct=null;function ht({title:t="City College of Davao Library",message:e="",confirmText:a="OK",cancelText:i="",onConfirm:s=null}={}){const n=d("#systemModal");n&&(Ct=typeof s=="function"?s:null,n.innerHTML=`<div class="dialog small system-dialog" role="dialog" aria-modal="true">
        <div class="dialog-head"><h2>${o(t)}</h2></div>
        <div class="dialog-body">
          <div class="system-mark">${C(i?"help":"info")}</div>
          <p class="system-message">${o(e)}</p>
        </div>
        <div class="dialog-foot">
          ${i?`<button class="secondary" type="button" data-system-close>${o(i)}</button>`:""}
          <button class="primary" type="button" data-system-confirm>${o(a)}</button>
        </div>
      </div>`,n.style.display="flex")}function y(t,e="City College of Davao Library"){ht({title:e,message:t,confirmText:"OK"})}function Z(t,e,a="Confirm Action"){ht({title:a,message:t,confirmText:"Continue",cancelText:"Cancel",onConfirm:e})}function qt(t=!1){const e=Ct;Ct=null,R("systemModal"),t&&e&&e()}function Xt(t){const e={dashboard:'<path d="M3 13h8V3H3z"></path><path d="M13 21h8V11h-8z"></path><path d="M13 3h8v6h-8z"></path><path d="M3 21h8v-6H3z"></path>',books:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-17A2.5 2.5 0 0 1 6.5 2Z"></path><path d="M8 7h8"></path><path d="M8 11h6"></path>',inventory:'<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="M3.3 7 12 12l8.7-5"></path><path d="M12 22V12"></path>',circulation:'<path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>',members:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',reports:'<path d="M3 3v18h18"></path><path d="M8 17V9"></path><path d="M13 17V5"></path><path d="M18 17v-6"></path>',notifications:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>',users:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><path d="M19 8h3"></path><path d="M20.5 6.5v3"></path>',settings:'<circle cx="12" cy="12" r="3"></circle><path d="M12 1v4"></path><path d="M12 19v4"></path><path d="M4.22 4.22l2.83 2.83"></path><path d="M16.95 16.95l2.83 2.83"></path><path d="M1 12h4"></path><path d="M19 12h4"></path><path d="M4.22 19.78l2.83-2.83"></path><path d="M16.95 7.05l2.83-2.83"></path>'};return`<span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${e[t]||e.dashboard}</svg></span>`}function C(t){const e={book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-17A2.5 2.5 0 0 1 6.5 2Z"></path><path d="M8 7h8"></path><path d="M8 11h6"></path>',check:'<path d="M20 6 9 17l-5-5"></path>',borrow:'<path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>',alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',money:'<circle cx="12" cy="12" r="9"></circle><path d="M14.8 9.2A3 3 0 0 0 12 8c-1.7 0-3 .9-3 2s1.3 2 3 2 3 .9 3 2-1.3 2-3 2a3 3 0 0 1-2.8-1.2"></path><path d="M12 6v12"></path>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>',database:'<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"></path><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"></path>',return:'<path d="m9 14-4-4 4-4"></path><path d="M5 10h11a4 4 0 0 1 0 8h-1"></path>',calendar:'<path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M3 10h18"></path>',trending:'<path d="m3 17 6-6 4 4 8-8"></path><path d="M14 7h7v7"></path>',copy:'<rect x="9" y="9" width="13" height="13" rx="2"></rect><rect x="2" y="2" width="13" height="13" rx="2"></rect>',search:'<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>',tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"></path><circle cx="7.5" cy="7.5" r=".5"></circle>',edit:'<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>',info:'<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>',help:'<circle cx="12" cy="12" r="10"></circle><path d="M9.1 9a3 3 0 1 1 5.8 1c-.8 1.4-2.9 1.6-2.9 3"></path><path d="M12 17h.01"></path>',file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h5"></path>',damaged:'<path d="m7 2 10 20"></path><path d="M5 5h14l-2 14H7Z"></path>',author:'<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>',publisher:'<path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path><path d="M9 9h.01"></path><path d="M9 13h.01"></path><path d="M9 17h.01"></path>',category:'<path d="M4 4h6v6H4z"></path><path d="M14 4h6v6h-6z"></path><path d="M4 14h6v6H4z"></path><path d="M14 14h6v6h-6z"></path>'};return`<svg viewBox="0 0 24 24" aria-hidden="true">${e[t]||e.info}</svg>`}const b=t=>t.accessionNumber||(t.id?`ACC-${String(t.id).padStart(4,"0")}`:""),pe=t=>t.barcodeDateGenerated||`${t.addedDate}T09:00:00`,It=t=>t.lastUpdated||t.borrowDate||t.addedDate,mt=()=>`BC${String(c.length+xt.length+1).padStart(3,"0")}`,k=t=>t==="missing"?"Lost":t[0].toUpperCase()+t.slice(1),Bt=t=>t==="missing"?"Missing":t==="replaced"?"Replaced":k(t),N=t=>t==="missing"?"lost":t==="reserved"?"borrowed":t,H=t=>k(N(t)),at=t=>F.find(e=>e.bookId===t.id)||{},it=t=>O.find(e=>e.bookId===t.id&&!e.archived)||{},ie=t=>Y.find(e=>e.id===t)||Y[0],ve=()=>`TXN-${new Date().getFullYear()}-${String(L.length+1).padStart(4,"0")}`,E=t=>({available:"background:#d1fae5;color:#047857",borrowed:"background:#fef3c7;color:#b45309",reserved:"background:#e0f2fe;color:#0369a1",missing:"background:#fee2e2;color:#b91c1c",lost:"background:#fee2e2;color:#b91c1c",damaged:"background:#ffedd5;color:#c2410c"})[t]||"background:#f1f5f9;color:#475569",he=t=>({"Minor Damage":"background:#fef3c7;color:#b45309","For Repair":"background:#e0f2fe;color:#0369a1","Beyond Repair":"background:#fee2e2;color:#b91c1c",Replaced:"background:#d1fae5;color:#047857"})[t]||"background:#f1f5f9;color:#475569";function T(t,e="error"){const a=d("#loginError");a.textContent=t,a.className=e==="notice"?"error notice":"error",a.style.display="block"}async function oe(t,e){const a=await fetch(`${P}${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),i=await a.json().catch(()=>({}));if(!a.ok||i.success===!1)throw new Error(i.message||"Request failed.");return i.data||null}function se(t,e={}){const a=String((t==null?void 0:t.email)||e.email||"").trim().toLowerCase(),i=["admin","librarian"].includes(t==null?void 0:t.role)?t.role:"librarian",s=["active","inactive","pending"].includes(t==null?void 0:t.status)?t.status:"active";return{id:t!=null&&t.id?`U${t.id}`:e.id||`U${Date.now().toString(36).toUpperCase()}`,name:(t==null?void 0:t.name)||e.name||a.split("@")[0]||"Library User",email:a,password:e.password||"",role:i,status:s,createdAt:e.createdAt||new Date().toISOString(),lastLogin:new Date().toISOString()}}function re(t){const e=g.find(a=>a.email.toLowerCase()===t.email.toLowerCase()||a.id===t.id);return e?Object.assign(e,t):g.push(t),j(),e||t}function Gt(t){p=t,d("#login").style.display="none",d("#app").classList.add("logged"),h="dashboard",Tt().then(()=>Nt())}function me(t,e,a=!0){const i=String(t||"").trim().toLowerCase(),s=g.find(n=>n.email.toLowerCase()===i&&n.password===e);return s?s.status==="pending"?(T("Your account request is waiting for admin approval."),null):s.status==="inactive"?(T("This account is inactive. Please contact the administrator."),null):(s.lastLogin=new Date().toISOString(),j(),s):(a&&T("Invalid email or password. Please try again."),null)}async function ne(t,e){const a=String(t||"").trim().toLowerCase();T("Signing in...","notice");try{const i=await oe("/api/login",{email:a,password:e}),s=g.find(r=>r.email.toLowerCase()===a)||{email:a,password:e},n=(i==null?void 0:i.user)||i;localStorage.setItem("authToken",(i==null?void 0:i.token)||""),Gt(re(se(n,s)))}catch(i){const s=me(a,e,!1);if(s){Gt(s);return}T(i.message||"Invalid email or password. Please try again.")}}async function be(t){const e=Object.fromEntries(new FormData(t)),a=String(e.email||"").trim().toLowerCase(),i=String(e.name||"").trim(),s=String(e.password||"");if(!i||!a||s.length<6){T("Please complete the signup form. Password must be at least 6 characters.");return}const n=g.find(r=>r.email.toLowerCase()===a);if(n){const r=n.status==="pending"?"This email already has a pending approval request.":"An account with this email already exists.";T(r);return}T("Creating account...","notice");try{const r=await oe("/api/signup",{name:i,email:a,password:s}),v=(r==null?void 0:r.user)||r;localStorage.setItem("authToken",(r==null?void 0:r.token)||""),re(se(v,{name:i,email:a,password:s})),t.reset(),T("Account created. You can sign in now.","notice")}catch(r){if(/Unable to|Failed to fetch|NetworkError/i.test(r.message)){g.push({id:`U${Date.now().toString(36).toUpperCase()}`,name:i,email:a,password:s,role:"librarian",status:"pending",createdAt:new Date().toISOString(),lastLogin:""}),j(),Rt("announcement","New Account Request",`${i} requested a library system account.`),t.reset(),T("Backend is offline, so the account request was saved locally for admin approval.","notice");return}T(r.message||"Unable to create account.")}}function ge(){p=null,d("#app").classList.remove("logged"),d("#login").style.display="grid",d("#loginError").style.display="none"}async function Tt(){try{const t=await fetch(`${P}/api/books`);if(t.ok){const n=await t.json();n.success&&n.data&&(c=n.data.map(r=>({id:r.id,title:r.title,author:r.author||"Unknown",authorId:r.author_id||"",isbn:r.isbn||"",category:r.category||"Uncategorized",categoryId:r.category_id||"",publisher:r.publisher||"Unknown",publisherId:r.publisher_id||"",callNumber:r.call_number||"",status:r.status,location:r.location||"",publishedYear:r.published_year||0,copies:r.copies,availableCopies:r.available_copies,addedDate:r.added_date,barcode:r.barcode||""})))}const e=await fetch(`${P}/api/members`);if(e.ok){const n=await e.json();n.success&&n.data&&(Y=n.data.map(r=>({id:r.id,name:r.name,course:r.member_type||"Faculty",contact:r.phone||"",status:"active",fines:0})))}const a=await fetch(`${P}/api/categories`);if(a.ok){const n=await a.json();n.success&&n.data&&(I.category=n.data.map(r=>({id:r.id,name:r.name,description:r.description||""})))}const i=await fetch(`${P}/api/authors`);if(i.ok){const n=await i.json();n.success&&n.data&&(I.author=n.data.map(r=>({id:r.id,name:r.name,bio:r.bio||"",nationality:r.nationality||""})))}const s=await fetch(`${P}/api/publishers`);if(s.ok){const n=await s.json();n.success&&n.data&&(I.publisher=n.data.map(r=>({id:r.id,name:r.name,address:r.address||"",phone:r.phone||"",email:r.email||""})))}}catch(t){console.error("Error loading app data:",t)}}async function bt(t,e){try{return await(await fetch(`${P}${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).json()}catch(a){return console.error("API error:",a),{success:!1,message:a.message}}}async function fe(t,e){try{return await(await fetch(`${P}${t}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).json()}catch(a){return console.error("API error:",a),{success:!1,message:a.message}}}async function ye(t){try{return await(await fetch(`${P}${t}`,{method:"DELETE",headers:{"Content-Type":"application/json"}})).json()}catch(e){return console.error("API error:",e),{success:!1,message:e.message}}}async function Dt(t,e){const a=String(e||"").trim();if(!a)return null;const i=st(t).find(r=>r.name.toLowerCase()===a.toLowerCase());if(i!=null&&i.id)return i.id;const s=t==="author"?await De(a,"","",!0):t==="category"?await Se(a,"",!0):await ke(a,"","","",!0);if(!s.success)throw new Error(s.message||`Unable to save ${t}.`);const n={id:s.data,name:a};return I[t].push(n),n.id}async function $e(t,e=!1){t.authorId=await Dt("author",t.author),t.categoryId=await Dt("category",t.category),t.publisherId=await Dt("publisher",t.publisher);const a={title:t.title,author_id:t.authorId,category_id:t.categoryId,publisher_id:t.publisherId,isbn:t.isbn,call_number:t.callNumber,status:t.status==="lost"?"missing":t.status,location:t.location,published_year:Number(t.publishedYear)||0,copies:Number(t.copies)||1,available_copies:Number(t.availableCopies)||1,barcode:t.barcode};return e?await bt("/api/books",a):await fe(`/api/books/${t.id}`,a)}async function we(t){return await ye(`/api/books/${t}`)}async function Se(t,e="",a=!1){const i={name:t,description:e};return a?await bt("/api/categories",i):{success:!0,message:"Category saved"}}async function De(t,e="",a="",i=!1){const s={name:t,bio:e,nationality:a};return i?await bt("/api/authors",s):{success:!0,message:"Author saved"}}async function ke(t,e="",a="",i="",s=!1){const n={name:t,address:e,phone:a,email:i};return s?await bt("/api/publishers",n):{success:!0,message:"Publisher saved"}}function Nt(){d("#userName").textContent=p.name,d("#avatar").textContent=p.name[0].toUpperCase();const t=d("#roleBadge");t.textContent=p.role[0].toUpperCase()+p.role.slice(1),t.className="badge "+(p.role==="admin"?"red":p.role==="librarian"?"blue":"green"),w(),S()}function w(){d("#nav").innerHTML=ee.filter(t=>zt(t.roles)).map(t=>{if(!t.children)return`<button class="${h===t.id?"active":""}" data-page="${t.id}">${Xt(t.icon)}<span>${t.label}</span></button>`;const e=rt.has(t.id),a=t.children.filter(i=>zt(i[2]||t.roles)).map(i=>`<button class="child ${h===i[0]?"active":""}" data-page="${i[0]}">${i[1]}</button>`).join("");return`<button class="${e?"open":""}" data-toggle="${t.id}">${Xt(t.icon)}<span>${t.label}</span><span class="chev">${e?"▾":"▸"}</span></button>${e?a:""}`}).join("")}function D(t,e,a=""){return`<div class="page-head"><div><h1>${o(t)}</h1><p class="subtle">${o(e)}</p></div>${a}</div>`}function S(){if(h==="dashboard")return Me();if(h==="books")return dt();if(h==="authors")return z("author");if(h==="publishers")return z("publisher");if(h==="categories")return z("category");if(h==="inventory")return ot();if(h==="barcode")return lt();if(h==="assets")return ct();if(h==="verification")return W();if(h==="missing")return W("Missing Items");if(h==="damaged")return ut();if(h==="accession-update")return Et();if(h==="borrowing-reports")return qe();if(h==="overdue-reports")return Xe();if(h==="lost-reports")return Ge();if(h==="statistics")return Je();if(h==="notifications")return gt();if(h==="users")return K();if(h==="permissions")return Ee();if(h==="settings")return Ut();const[t,e]=ue[h]||["Module","Library module"];d("#main").innerHTML=D(t,e)+`<div class="card coming"><div class="coming-icon">${C("file")}</div><h2>Module Coming Soon</h2><p class="subtle" style="margin:8px auto 0;max-width:430px">The ${o(t)} module is under development. Check back later for full functionality.</p></div>`,w()}function Me(){const t=c.reduce((u,x)=>u+x.copies,0),e=c.reduce((u,x)=>u+x.availableCopies,0),a=c.filter(u=>u.status==="borrowed").length,i=c.filter(u=>u.dueDate&&nt(u.dueDate)),s=Y.filter(u=>u.status==="active").length,n=Y.reduce((u,x)=>u+x.fines,0),r=B.filter(u=>!u.read).length,v=(u,x,$t,tt)=>`<div class="card stat-card"><div><p class="subtle">${u}</p><div class="stat-value" style="color:${tt}">${x}</div></div><div class="icon-box" style="background:${tt}">${C($t)}</div></div>`;d("#main").innerHTML=D("Dashboard","Welcome back! Here's your library overview.")+`
        <div class="grid stats">
          ${v("Total Books",t,"book","#0ea5e9")}
          ${v("Available",e,"check","#10b981")}
          ${v("Borrowed",a,"borrow","#f59e0b")}
          ${v("Overdue",i.length,"alert","#ef4444")}
        </div>
        <div class="grid quick">
          <div class="card"><div class="icon-box">${C("users")}</div><div><p class="subtle">Active Members</p><h2>${s}</h2></div></div>
          <div class="card"><div class="icon-box">${C("money")}</div><div><p class="subtle">Pending Fines</p><h2>$${n.toFixed(2)}</h2></div></div>
          <div class="card"><div class="icon-box">${C("bell")}</div><div><p class="subtle">Notifications</p><h2>${r}</h2></div></div>
        </div>
        <div class="grid two">
          <div class="card"><div class="card-title">Recent Activities</div>${L.slice(0,5).map(u=>`<div class="list-row"><span class="row-icon">${C(u.type==="fine"?"money":u.type==="return"?"return":u.type==="borrow"?"borrow":"file")}</span><div><p>${o(u.description)}</p><p class="subtle" style="font-size:12px;margin-top:4px">${o(u.user)} | ${f(u.timestamp)}</p></div></div>`).join("")}</div>
          <div class="card"><div class="card-title">Overdue Books <span class="pill" style="background:#fee2e2;color:#dc2626">${i.length} items</span></div>${i.length?i.slice(0,5).map(u=>`<div class="list-row" style="justify-content:space-between"><div><strong>${o(u.title)}</strong><p class="subtle">${o(u.borrower||"")}</p></div><div style="text-align:right"><strong style="color:#dc2626">${et(u.dueDate)} days overdue</strong><p class="subtle" style="font-size:12px">Due: ${f(u.dueDate)}</p></div></div>`).join(""):'<div class="empty">No overdue books</div>'}</div>
        </div>
        ${$.showDashboardNotices?`<div class="card" style="margin-top:24px"><div class="card-title">Recent Notifications <span class="pill" style="background:#e0f2fe;color:#0284c7">${r} unread</span></div>${B.slice(0,3).map(u=>`<div class="list-row" style="${u.read?"":"background:#f0f9ff"}"><span class="row-icon">${C(u.type==="overdue"?"alert":"bell")}</span><div><strong>${o(u.title)}</strong><p class="subtle">${o(u.message)}</p><p class="subtle" style="font-size:12px;margin-top:4px">${f(u.timestamp)}</p></div>${u.read?"":'<span class="pill" style="background:#0ea5e9;color:white;padding:4px"></span>'}</div>`).join("")}</div>`:""}`,w()}function Ce(t){return{overdue:{icon:"alert",label:"Overdue",color:"#dc2626",bg:"#fee2e2"},reminder:{icon:"calendar",label:"Reminder",color:"#d97706",bg:"#fef3c7"},announcement:{icon:"bell",label:"Announcement",color:"#0284c7",bg:"#e0f2fe"}}[t]||{icon:"bell",label:"Notification",color:"#16a34a",bg:"#dcfce7"}}function Be(){const t=l.search.toLowerCase();return B.filter(e=>{const a=`${e.title} ${e.message} ${e.type}`.toLowerCase();return(!t||a.includes(t))&&(l.status==="all"||l.status==="unread"&&!e.read||l.status==="read"&&e.read)})}function gt(){const t=Be(),e=B.filter(i=>!i.read).length,a=`<div class="actions">
        <button class="secondary" id="markAllNotificationsRead" ${e?"":"disabled"}>Mark All Read</button>
        <button class="primary" id="addTestNotification">New Notice</button>
      </div>`;d("#main").innerHTML=D("Notifications","View and manage notifications",a)+`
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr 180px">
          <input id="searchNotifications" placeholder="Search notifications..." value="${o(l.search)}">
          <select id="notificationStatusFilter">
            <option value="all" ${l.status==="all"?"selected":""}>All</option>
            <option value="unread" ${l.status==="unread"?"selected":""}>Unread</option>
            <option value="read" ${l.status==="read"?"selected":""}>Read</option>
          </select>
        </div></div>
        <div class="grid stats" style="margin-bottom:16px">
          ${m("Total Notices",B.length,"bell","#16a34a")}
          ${m("Unread",e,"alert","#ef4444")}
          ${m("Reminders",B.filter(i=>i.type==="reminder").length,"calendar","#d97706")}
          ${m("Announcements",B.filter(i=>i.type==="announcement").length,"bell","#0284c7")}
        </div>
        <div class="card">
          <div class="card-title">Notification Inbox <span class="pill" style="background:#dcfce7;color:#15803d">${t.length} shown</span></div>
          ${t.length?t.map(i=>{const s=Ce(i.type);return`<div class="list-row notification-row ${i.read?"":"unread"}">
              <span class="row-icon" style="background:${s.bg};color:${s.color}">${C(s.icon)}</span>
              <div class="notification-copy">
                <div class="notification-title-line">
                  <strong>${o(i.title)}</strong>
                  <span class="pill" style="background:${s.bg};color:${s.color}">${o(s.label)}</span>
                  ${i.read?'<span class="pill" style="background:#f1f5f9;color:#64748b">Read</span>':'<span class="pill" style="background:#16a34a;color:white">Unread</span>'}
                </div>
                <p class="subtle">${o(i.message)}</p>
                <p class="subtle" style="font-size:12px;margin-top:4px">${vt(i.timestamp)}</p>
              </div>
              <div class="notification-actions">
                <button class="secondary" data-toggle-notification="${i.id}">${i.read?"Mark Unread":"Mark Read"}</button>
                <button class="icon-btn" title="Delete notification" data-delete-notification="${i.id}">X</button>
              </div>
            </div>`}).join(""):'<div class="empty">No notifications found.</div>'}
        </div>`,w()}function Rt(t,e,a){B.unshift({id:A(),type:t,title:e,message:a,timestamp:new Date().toISOString(),read:!1})}function Le(t){B=B.map(e=>e.id===t?{...e,read:!e.read}:e),S()}function Ae(t){B=B.filter(e=>e.id!==t),S()}function xe(){B=B.map(t=>({...t,read:!0})),S()}function X(t){return t[0].toUpperCase()+t.slice(1)}function Ie(t){return t==="admin"?"red":t==="librarian"?"blue":"green"}function Te(t){return{active:"background:#d1fae5;color:#047857",pending:"background:#fef3c7;color:#b45309",inactive:"background:#fee2e2;color:#b91c1c"}[t]||"background:#f1f5f9;color:#475569"}function Ft(){return g.filter(t=>t.role==="admin"&&t.status==="active").length}function Ne(){const t=l.search.toLowerCase();return g.filter(e=>{const a=`${e.name} ${e.email} ${e.role} ${e.status}`.toLowerCase();return(!t||a.includes(t))&&(l.status==="all"||e.status===l.status||e.role===l.status)})}function K(){const t=Ne(),e='<button class="primary" id="addUser">Add User</button>';d("#main").innerHTML=D("Users","Manage system users",e)+`
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr 180px">
          <input id="searchUsers" placeholder="Search users..." value="${o(l.search)}">
          <select id="userStatusFilter">
            <option value="all" ${l.status==="all"?"selected":""}>All Users</option>
            <option value="active" ${l.status==="active"?"selected":""}>Active</option>
            <option value="pending" ${l.status==="pending"?"selected":""}>Pending Approval</option>
            <option value="inactive" ${l.status==="inactive"?"selected":""}>Inactive</option>
            <option value="admin" ${l.status==="admin"?"selected":""}>Admins</option>
            <option value="librarian" ${l.status==="librarian"?"selected":""}>Librarians</option>
          </select>
        </div></div>
        <div class="grid stats" style="margin-bottom:16px">
          ${m("Total Users",g.length,"users","#16a34a")}
          ${m("Active",g.filter(a=>a.status==="active").length,"check","#10b981")}
          ${m("Pending",g.filter(a=>a.status==="pending").length,"alert","#d97706")}
          ${m("Admins",g.filter(a=>a.role==="admin").length,"users","#dc2626")}
        </div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Created</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${t.map(a=>{const i=p&&a.id===p.id;return`<tr>
              <td><strong>${o(a.name)}</strong>${i?'<p class="subtle" style="font-size:12px">Current account</p>':""}</td>
              <td>${o(a.email)}</td>
              <td><span class="badge ${Ie(a.role)}">${o(X(a.role))}</span></td>
              <td><span class="pill" style="${Te(a.status)}">${o(a.status==="pending"?"Pending Approval":X(a.status))}</span></td>
              <td>${a.lastLogin?vt(a.lastLogin):"-"}</td>
              <td>${f(a.createdAt)}</td>
              <td><div class="actions">
                <button class="secondary" data-edit-user="${a.id}">Edit</button>
                <button class="secondary" data-reset-user-password="${a.id}">Reset</button>
                <button class="secondary" data-toggle-user-status="${a.id}" ${i?"disabled":""}>${a.status==="active"?"Deactivate":a.status==="pending"?"Approve":"Activate"}</button>
                <button class="icon-btn" title="Delete user" data-delete-user="${a.id}" ${i?"disabled":""}>X</button>
              </div></td>
            </tr>`}).join("")}</tbody>
        </table>${t.length?"":'<div class="empty">No users found.</div>'}</div>`,w()}function Jt(t=null){const e=!!t;d("#viewModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>${e?"Edit User":"Add User"}</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="userForm">
          <div class="dialog-body">
            <input type="hidden" name="id" value="${o((t==null?void 0:t.id)||"")}">
            <div class="field"><label>Name</label><input name="name" value="${o((t==null?void 0:t.name)||"")}" required></div>
            <div class="field"><label>Email</label><input name="email" type="email" value="${o((t==null?void 0:t.email)||"")}" required></div>
            <div class="form-grid">
              <div><label>Role</label><select name="role">${["admin","librarian"].map(a=>`<option value="${a}" ${(t==null?void 0:t.role)===a?"selected":""}>${X(a)}</option>`).join("")}</select></div>
              <div><label>Status</label><select name="status">${["active","pending","inactive"].map(a=>`<option value="${a}" ${(t==null?void 0:t.status)===a?"selected":""}>${a==="pending"?"Pending Approval":X(a)}</option>`).join("")}</select></div>
            </div>
            <div class="field"><label>${e?"New Password":"Password"}</label><input name="password" type="password" ${e?'placeholder="Leave blank to keep current password"':"required"}></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Cancel</button><button class="primary" type="submit">Save User</button></div>
        </form>
      </div>`,d("#viewModal").style.display="flex"}function Re(t){const e=Object.fromEntries(new FormData(t)),a=String(e.email||"").trim().toLowerCase(),i=e.id?g.find(n=>n.id===e.id):null;if(g.find(n=>n.email.toLowerCase()===a&&n.id!==e.id)){y("Another user already uses that email address.");return}if(i){if(i.role==="admin"&&i.status==="active"&&Ft()<=1&&(e.role!=="admin"||e.status!=="active")){y("At least one active admin account is required.");return}i.name=String(e.name||"").trim(),i.email=a,i.role=i.id===p.id?p.role:e.role,i.status=i.id===p.id?"active":e.status,e.password&&(i.password=e.password),i.id===p.id&&Nt()}else g.push({id:`U${A().toUpperCase().slice(0,6)}`,name:String(e.name||"").trim(),email:a,password:e.password,role:e.role,status:e.status,createdAt:new Date().toISOString(),lastLogin:""});j(),L.unshift({id:A(),type:"add",description:`Saved user "${e.name}"`,user:p.name,timestamp:new Date().toISOString()}),R("viewModal"),K()}function Fe(t){const e=g.find(a=>a.id===t);if(!(!e||e.id===p.id)){if(e.role==="admin"&&e.status==="active"&&Ft()<=1){y("At least one active admin account is required.");return}e.status=e.status==="active"?"inactive":"active",j(),K()}}function Ue(t){const e=g.find(a=>a.id===t);if(!(!e||e.id===p.id)){if(e.role==="admin"&&e.status==="active"&&Ft()<=1){y("At least one active admin account is required.");return}Z(`Delete user "${e.name}"?`,()=>{const a=g.findIndex(i=>i.id===t);a>=0&&g.splice(a,1),j(),K()},"Delete User")}}function Pe(t){const e=g.find(a=>a.id===t);e&&(e.password="password123",j(),y(`Password reset for ${e.name}. Temporary password: password123`,"Password Reset"))}function Lt(){const t=[];return ee.forEach(e=>{t.push({id:e.id,label:e.label,roles:e.roles,item:e}),(e.children||[]).forEach(a=>t.push({id:a[0],label:`${e.label}: ${a[1]}`,roles:a[2]||e.roles,child:a,parent:e}))}),t}function Ee(){const t=["admin","librarian"],e=Lt();d("#main").innerHTML=D("Permissions","Manage user permissions",'<button class="primary" id="savePermissions">Save Permissions</button>')+`
        <div class="card table-wrap"><table class="permission-table">
          <thead><tr><th>Module</th>${t.map(a=>`<th>${o(X(a))}</th>`).join("")}</tr></thead>
          <tbody>${e.map(a=>`<tr>
            <td><strong>${o(a.label)}</strong></td>
            ${t.map(i=>{const s=a.id==="dashboard"&&i==="admin"||["users","permissions"].includes(a.id)&&i==="admin";return`<td><label class="check-cell"><input type="checkbox" data-permission="${o(a.id)}" data-role="${i}" ${a.roles.includes(i)?"checked":""} ${s?"disabled checked":""}><span></span></label></td>`}).join("")}
          </tr>`).join("")}</tbody>
        </table></div>`,w()}function je(){const t={};Lt().forEach(e=>t[e.id]=[]),document.querySelectorAll("[data-permission][data-role]").forEach(e=>{e.checked&&t[e.dataset.permission].push(e.dataset.role)}),t.dashboard=Array.from(new Set([...t.dashboard||[],"admin"])),t.users=Array.from(new Set([...t.users||[],"admin"])),t.permissions=Array.from(new Set([...t.permissions||[],"admin"])),Lt().forEach(e=>{e.child?e.child[2]=t[e.id]:e.item.roles=t[e.id]}),w(),y("Permissions saved.")}function Ut(){const t=p.role==="admin"||p.role==="librarian";d("#main").innerHTML=D("Settings","Configure library settings and account options")+`
        <div class="settings-grid">
          ${t?`<form id="librarySettingsForm" class="card settings-panel">
            <div class="card-title">Library Settings</div>
            <div class="dialog-body">
              <div class="form-grid">
                <div><label>Library Name</label><input name="libraryName" value="${o($.libraryName)}" required></div>
                <div><label>Tagline</label><input name="tagline" value="${o($.tagline)}"></div>
                <div><label>Contact Email</label><input name="contactEmail" type="email" value="${o($.contactEmail)}"></div>
                <div><label>Contact Phone</label><input name="contactPhone" value="${o($.contactPhone)}"></div>
                <div class="wide-field"><label>Address</label><input name="address" value="${o($.address)}"></div>
              </div>
            </div>
            <div class="dialog-foot"><button class="primary" type="submit">Save Library Settings</button></div>
          </form>
          <form id="borrowingSettingsForm" class="card settings-panel">
            <div class="card-title">Borrowing Defaults</div>
            <div class="dialog-body">
              <div class="form-grid">
                <div><label>Loan Period (days)</label><input name="loanDays" type="number" min="1" max="90" value="${o($.loanDays)}" required></div>
                <div><label>Daily Fine</label><input name="dailyFine" type="number" min="0" step="0.01" value="${o($.dailyFine)}" required></div>
                <div><label>Max Borrowed Books</label><input name="maxBorrowedBooks" type="number" min="1" max="50" value="${o($.maxBorrowedBooks)}" required></div>
                <label class="toggle-row"><input name="emailNotifications" type="checkbox" ${$.emailNotifications?"checked":""}><span>Email Notifications</span></label>
                <label class="toggle-row"><input name="showDashboardNotices" type="checkbox" ${$.showDashboardNotices?"checked":""}><span>Dashboard Notices</span></label>
              </div>
            </div>
            <div class="dialog-foot"><button class="primary" type="submit">Save Borrowing Defaults</button></div>
          </form>`:""}
          <form id="profileSettingsForm" class="card settings-panel">
            <div class="card-title">Account Settings</div>
            <div class="dialog-body">
              <div class="form-grid">
                <div><label>Name</label><input name="name" value="${o(p.name)}" required></div>
                <div><label>Email</label><input name="email" type="email" value="${o(p.email)}" required></div>
                <div><label>Role</label><input value="${o(X(p.role))}" readonly></div>
                <div><label>Status</label><input value="${o(X(p.status||"active"))}" readonly></div>
              </div>
            </div>
            <div class="dialog-foot"><button class="primary" type="submit">Save Account</button></div>
          </form>
          <form id="passwordSettingsForm" class="card settings-panel">
            <div class="card-title">Password</div>
            <div class="dialog-body">
              <div class="form-grid">
                <div><label>Current Password</label><input name="currentPassword" type="password" required></div>
                <div><label>New Password</label><input name="newPassword" type="password" minlength="4" required></div>
                <div><label>Confirm New Password</label><input name="confirmPassword" type="password" minlength="4" required></div>
              </div>
            </div>
            <div class="dialog-foot"><button class="primary" type="submit">Update Password</button></div>
          </form>
        </div>`,w()}function He(t){const e=Object.fromEntries(new FormData(t));$={...$,libraryName:String(e.libraryName||"").trim()||$.libraryName,tagline:String(e.tagline||"").trim(),contactEmail:String(e.contactEmail||"").trim(),contactPhone:String(e.contactPhone||"").trim(),address:String(e.address||"").trim()},document.title=$.libraryName,y("Library settings saved."),Ut()}function Oe(t){const e=Object.fromEntries(new FormData(t));$={...$,loanDays:Math.max(1,Number(e.loanDays)||14),dailyFine:Math.max(0,Number(e.dailyFine)||0),maxBorrowedBooks:Math.max(1,Number(e.maxBorrowedBooks)||1),emailNotifications:!!e.emailNotifications,showDashboardNotices:!!e.showDashboardNotices},y("Borrowing defaults saved."),Ut()}function Ve(t){const e=Object.fromEntries(new FormData(t)),a=String(e.email||"").trim().toLowerCase();if(g.find(s=>s.email.toLowerCase()===a&&s.id!==p.id)){y("Another user already uses that email address.");return}p.name=String(e.name||"").trim(),p.email=a,j(),Nt(),y("Account settings saved.")}function ze(t){const e=Object.fromEntries(new FormData(t));if(e.currentPassword!==p.password){y("Current password is incorrect.");return}if(e.newPassword!==e.confirmPassword){y("New passwords do not match.");return}p.password=e.newPassword,j(),t.reset(),y("Password updated.")}function G(){return c.filter(t=>{const e=it(t),a=`${t.title} ${t.author} ${t.isbn} ${t.barcode||""} ${b(t)} ${t.location||""} ${t.borrower||""} ${e.description||""}`.toLowerCase(),i=N(t.status),s=h==="barcode"&&(l.status==="assigned"||l.status==="unassigned"),n=h==="damaged";return(!l.search||a.includes(l.search.toLowerCase()))&&(s||n||l.status==="all"||t.status===l.status||i===l.status)&&(!l.category||t.category===l.category)})}function ft(){return'<button class="secondary" id="printReport">Print Report</button>'}function m(t,e,a,i){return`<div class="card stat-card"><div><p class="subtle">${o(t)}</p><div class="stat-value" style="color:${i}">${o(e)}</div></div><div class="icon-box" style="background:${i}">${C(a)}</div></div>`}function yt(){return`<div class="count">Generated ${vt(new Date)}</div>`}function Pt(t){const e=String(t||"").toLowerCase();return c.filter(a=>{const i=`${a.title} ${a.author} ${a.publisher||""} ${a.category} ${a.isbn} ${a.barcode||""} ${b(a)} ${a.borrower||""}`.toLowerCase();return!e||i.includes(e)})}function qe(){const t=Pt(l.search).filter(i=>i.borrower||i.borrowDate||i.status==="borrowed"),e=t.filter(i=>i.dueDate&&nt(i.dueDate)),a=L.filter(i=>i.type==="return").length;d("#main").innerHTML=D("Borrowing Reports","View borrowing reports",ft())+`
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr">
          <input id="searchReports" placeholder="Search by title, borrower, barcode, accession, or ISBN..." value="${o(l.search)}">
        </div></div>
        <div class="grid stats" style="margin-bottom:16px">
          ${m("Current Loans",t.length,"borrow","#0ea5e9")}
          ${m("Overdue Loans",e.length,"alert","#ef4444")}
          ${m("Return Records",a,"return","#16a34a")}
          ${m("Borrow Activities",L.filter(i=>i.type==="borrow").length,"calendar","#f59e0b")}
        </div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode</th><th>Book Title</th><th>Borrower</th><th>Borrow Date</th><th>Due Date</th><th>Status</th><th>Days Overdue</th></tr></thead>
          <tbody>${t.map(i=>`<tr>
            <td class="mono">${o(i.barcode||"-")}</td>
            <td><strong>${o(i.title)}</strong><p class="subtle mono" style="font-size:12px">${o(b(i))}</p></td>
            <td>${o(i.borrower||"-")}</td>
            <td>${i.borrowDate?f(i.borrowDate):"-"}</td>
            <td>${i.dueDate?f(i.dueDate):"-"}</td>
            <td><span class="pill" style="${E(N(i.status))}">${o(H(i.status))}</span></td>
            <td>${i.dueDate&&nt(i.dueDate)?et(i.dueDate):"-"}</td>
          </tr>`).join("")}</tbody>
        </table>${t.length?"":'<div class="empty">No borrowing records found.</div>'}</div>
        ${yt()}`,w()}function Xe(){const t=Pt(l.search).filter(a=>a.dueDate&&nt(a.dueDate)),e=t.reduce((a,i)=>a+et(i.dueDate),0);d("#main").innerHTML=D("Overdue Reports","View overdue reports",ft())+`
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr">
          <input id="searchReports" placeholder="Search overdue books by title, borrower, barcode, accession, or ISBN..." value="${o(l.search)}">
        </div></div>
        <div class="grid stats" style="margin-bottom:16px">
          ${m("Overdue Books",t.length,"alert","#ef4444")}
          ${m("Total Overdue Days",e,"calendar","#f59e0b")}
          ${m("Affected Borrowers",new Set(t.map(a=>a.borrower).filter(Boolean)).size,"users","#0ea5e9")}
          ${m("Longest Overdue",t.length?Math.max(...t.map(a=>et(a.dueDate))):0,"trending","#dc2626")}
        </div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode</th><th>Book Title</th><th>Borrower</th><th>Borrow Date</th><th>Due Date</th><th>Days Overdue</th><th>Location</th></tr></thead>
          <tbody>${t.map(a=>`<tr>
            <td class="mono">${o(a.barcode||"-")}</td>
            <td><strong>${o(a.title)}</strong><p class="subtle mono" style="font-size:12px">${o(b(a))}</p></td>
            <td>${o(a.borrower||"-")}</td>
            <td>${a.borrowDate?f(a.borrowDate):"-"}</td>
            <td>${f(a.dueDate)}</td>
            <td><strong style="color:#dc2626">${et(a.dueDate)}</strong></td>
            <td>${o(a.location||"-")}</td>
          </tr>`).join("")}</tbody>
        </table>${t.length?"":'<div class="empty">No overdue books found.</div>'}</div>
        ${yt()}`,w()}function Ge(){const t=new Set(F.filter(i=>i.physicalStatus==="lost").map(i=>i.bookId)),e=Pt(l.search).filter(i=>i.status==="missing"||t.has(i.id)),a=e.reduce((i,s)=>i+Number(s.copies||0),0);d("#main").innerHTML=D("Lost Books Reports","View lost books reports",ft())+`
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr">
          <input id="searchReports" placeholder="Search lost books by title, barcode, accession, author, or ISBN..." value="${o(l.search)}">
        </div></div>
        <div class="grid stats" style="margin-bottom:16px">
          ${m("Lost Titles",e.length,"alert","#dc2626")}
          ${m("Lost Copies",a,"copy","#ef4444")}
          ${m("Verified Lost",e.filter(i=>t.has(i.id)).length,"check","#f59e0b")}
          ${m("Categories Affected",new Set(e.map(i=>i.category).filter(Boolean)).size,"category","#0ea5e9")}
        </div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode</th><th>Accession</th><th>Book Title</th><th>Author</th><th>Category</th><th>Last Location</th><th>Last Updated</th></tr></thead>
          <tbody>${e.map(i=>`<tr>
            <td class="mono">${o(i.barcode||"-")}</td>
            <td class="mono">${o(b(i))}</td>
            <td><strong>${o(i.title)}</strong></td>
            <td>${o(i.author)}</td>
            <td>${o(i.category)}</td>
            <td>${o(i.location||"-")}</td>
            <td>${f(It(i))}</td>
          </tr>`).join("")}</tbody>
        </table>${e.length?"":'<div class="empty">No lost books found.</div>'}</div>
        ${yt()}`,w()}function Je(){const t=c.reduce((r,v)=>r+Number(v.copies||0),0),e=c.reduce((r,v)=>r+Number(v.availableCopies||0),0),a=c.filter(r=>r.status==="borrowed").length,i=c.filter(r=>r.status==="missing").length,s=[...new Set(c.map(r=>r.category).filter(Boolean))].sort().map(r=>{const v=c.filter(u=>u.category===r);return{category:r,titles:v.length,copies:v.reduce((u,x)=>u+Number(x.copies||0),0)}}),n=["available","borrowed","reserved","missing","damaged"].map(r=>({status:r,titles:c.filter(v=>v.status===r).length,copies:c.filter(v=>v.status===r).reduce((v,u)=>v+Number(u.copies||0),0)})).filter(r=>r.titles||r.copies);d("#main").innerHTML=D("Statistics","View library statistics",ft())+`
        <div class="grid stats" style="margin-bottom:16px">
          ${m("Total Titles",c.length,"book","#0ea5e9")}
          ${m("Total Copies",t,"copy","#16a34a")}
          ${m("Available Copies",e,"check","#10b981")}
          ${m("Borrowed Titles",a,"borrow","#f59e0b")}
        </div>
        <div class="grid stats" style="margin-bottom:16px">
          ${m("Lost Titles",i,"alert","#ef4444")}
          ${m("Damaged Titles",c.filter(r=>r.status==="damaged").length,"damaged","#d97706")}
          ${m("Authors",st("author").length,"author","#6366f1")}
          ${m("Categories",s.length,"category","#14b8a6")}
        </div>
        <div class="grid two">
          <div class="card table-wrap"><div class="card-title">Books by Category</div><table>
            <thead><tr><th>Category</th><th>Titles</th><th>Copies</th></tr></thead>
            <tbody>${s.map(r=>`<tr><td><strong>${o(r.category)}</strong></td><td>${r.titles}</td><td>${r.copies}</td></tr>`).join("")}</tbody>
          </table></div>
          <div class="card table-wrap"><div class="card-title">Books by Status</div><table>
            <thead><tr><th>Status</th><th>Titles</th><th>Copies</th></tr></thead>
            <tbody>${n.map(r=>`<tr><td><span class="pill" style="${E(r.status)}">${o(k(r.status))}</span></td><td>${r.titles}</td><td>${r.copies}</td></tr>`).join("")}</tbody>
          </table></div>
        </div>
        ${yt()}`,w()}function dt(){const t=G(),e=[...new Set(c.map(a=>a.category))].sort();d("#main").innerHTML=D("Books Catalog","Manage your library's book collection",'<button class="primary" id="addBook">+ Add Book</button>')+`
        <div class="card filters"><div class="filter-row">
          <input id="searchBooks" placeholder="Search by title, author, or ISBN..." value="${o(l.search)}">
          <select id="statusFilter">
            ${["all","available","borrowed","reserved","missing","damaged"].map(a=>`<option value="${a}" ${l.status===a?"selected":""}>${a==="all"?"All Status":a[0].toUpperCase()+a.slice(1)}</option>`).join("")}
          </select>
          <select id="categoryFilter"><option value="">All Categories</option>${e.map(a=>`<option ${l.category===a?"selected":""}>${o(a)}</option>`).join("")}</select>
        </div></div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Title</th><th>Author</th><th>ISBN</th><th>Category</th><th>Status</th><th>Copies</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${t.map(a=>`<tr>
            <td><strong>${o(a.title)}</strong><p class="subtle mono" style="font-size:12px">${o(a.callNumber)}</p></td>
            <td>${o(a.author)}</td><td class="mono">${o(a.isbn)}</td><td>${o(a.category)}</td>
            <td><span class="pill" style="${E(a.status)}">${o(k(a.status))}</span></td>
            <td><strong>${a.availableCopies}</strong><span class="subtle">/${a.copies}</span></td>
            <td><div class="actions"><button class="icon-btn" title="View details" data-view="${a.id}">View</button><button class="icon-btn" title="Edit" data-edit="${a.id}">Edit</button><button class="icon-btn" title="Delete" data-delete="${a.id}">Del</button></div></td>
          </tr>`).join("")}</tbody>
        </table>${t.length?"":'<div class="empty">No books found matching your criteria.</div>'}</div>
        <div class="count">Showing ${t.length} of ${c.length} books</div>`,w()}function Q(t){return{author:{page:"authors",title:"Authors",desc:"Manage book authors",label:"Author",plural:"Authors",field:"author",searchId:"searchAuthors"},publisher:{page:"publishers",title:"Publishers",desc:"Manage publishers",label:"Publisher",plural:"Publishers",field:"publisher",searchId:"searchPublishers"},category:{page:"categories",title:"Categories",desc:"Manage book categories",label:"Category",plural:"Categories",field:"category",searchId:"searchCategories"}}[t]}function st(t){const e=Q(t);return[...new Set([...c.map(i=>M(i[e.field])).filter(Boolean),...I[t]||[]])].sort((i,s)=>i.localeCompare(s)).map(i=>{const s=c.filter(n=>M(n[e.field]).toLowerCase()===i.toLowerCase());return{name:i,linkedBooks:s}})}function z(t){const e=Q(t),a=l.search.toLowerCase(),i=st(t).filter(n=>!a||n.name.toLowerCase().includes(a)||n.linkedBooks.some(r=>r.title.toLowerCase().includes(a))),s=i.reduce((n,r)=>n+r.linkedBooks.length,0);d("#main").innerHTML=D(e.title,e.desc,`<button class="primary" data-catalog-add="${t}">+ Add ${e.label}</button>`)+`
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr">
          <input id="${e.searchId}" placeholder="Search ${e.plural.toLowerCase()} or linked books..." value="${o(l.search)}">
        </div></div>
        <div class="grid stats" style="margin-bottom:16px">
          <div class="card stat-card"><div><p class="subtle">Total ${e.plural}</p><div class="stat-value" style="color:#16a34a">${i.length}</div></div><div class="icon-box" style="background:#16a34a">${C(t)}</div></div>
          <div class="card stat-card"><div><p class="subtle">Linked Books</p><div class="stat-value" style="color:#0ea5e9">${s}</div></div><div class="icon-box" style="background:#0ea5e9">${C("book")}</div></div>
        </div>
        <div class="card table-wrap"><table>
          <thead><tr><th>${o(e.label)}</th><th>Books Linked</th><th>Sample Titles</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${i.map(n=>`<tr>
            <td><strong>${o(n.name)}</strong></td>
            <td>${n.linkedBooks.length}</td>
            <td>${n.linkedBooks.length?o(n.linkedBooks.slice(0,3).map(r=>r.title).join(", ")):'<span class="subtle">No linked books yet</span>'}</td>
            <td><div class="actions">
              <button class="icon-btn" title="View linked books" data-catalog-view="${t}" data-name="${o(n.name)}">View</button>
              <button class="icon-btn" title="Rename" data-catalog-edit="${t}" data-name="${o(n.name)}">Edit</button>
              <button class="icon-btn" title="Delete" data-catalog-delete="${t}" data-name="${o(n.name)}">Del</button>
            </div></td>
          </tr>`).join("")}</tbody>
        </table>${i.length?"":`<div class="empty">No ${e.plural.toLowerCase()} found.</div>`}</div>
        <div class="count">Showing ${i.length} ${e.plural.toLowerCase()}</div>`,w()}function Yt(t,e=""){const a=Q(t);d("#bookModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>${e?`Edit ${a.label}`:`Add ${a.label}`}</h2><button class="icon-btn" data-close="bookModal">X</button></div>
        <form id="catalogForm" data-type="${t}" data-old-name="${o(e)}">
          <div class="dialog-body">
            <div class="field"><label>${o(a.label)} Name</label><input name="name" value="${o(e)}" required autofocus></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="bookModal">Cancel</button><button class="primary" type="submit">${e?"Save Changes":`Add ${a.label}`}</button></div>
        </form>
      </div>`,d("#bookModal").style.display="flex",d("#catalogForm").onsubmit=i=>{i.preventDefault(),Ye(t,e,Object.fromEntries(new FormData(i.currentTarget)).name)}}function Ye(t,e,a){const i=Q(t),s=M(a);if(!s)return;if(st(t).some(r=>r.name.toLowerCase()===s.toLowerCase()&&r.name.toLowerCase()!==String(e).toLowerCase())){y(`${i.label} already exists.`);return}e?(c=c.map(r=>M(r[i.field]).toLowerCase()===e.toLowerCase()?{...r,[i.field]:s,lastUpdated:new Date().toISOString()}:r),I[t]=(I[t]||[]).map(r=>r.toLowerCase()===e.toLowerCase()?s:r),L.unshift({id:A(),type:"add",description:`Renamed ${i.label.toLowerCase()} "${e}" to "${s}"`,user:p.name,timestamp:new Date().toISOString()})):(I[t]=[...I[t]||[],s],L.unshift({id:A(),type:"add",description:`Added ${i.label.toLowerCase()} "${s}"`,user:p.name,timestamp:new Date().toISOString()})),I[t]=[...new Set((I[t]||[]).filter(Boolean))],R("bookModal"),z(t)}function _e(t,e){const a=Q(t),i=c.filter(s=>M(s[a.field]).toLowerCase()===e.toLowerCase());d("#viewModal").innerHTML=`<div class="dialog">
        <div class="dialog-head"><h2>${o(e)}</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          ${i.length?`<div class="table-wrap"><table>
            <thead><tr><th>Title</th><th>Author</th><th>Publisher</th><th>Category</th><th>Status</th></tr></thead>
            <tbody>${i.map(s=>`<tr><td><strong>${o(s.title)}</strong></td><td>${o(s.author)}</td><td>${o(s.publisher||"-")}</td><td>${o(s.category)}</td><td><span class="pill" style="${E(s.status)}">${o(k(s.status))}</span></td></tr>`).join("")}</tbody>
          </table></div>`:`<div class="empty">No books are linked to this ${a.label.toLowerCase()} yet.</div>`}
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button></div>
      </div>`,d("#viewModal").style.display="flex"}function Ze(t,e){const a=Q(t),i=c.filter(s=>M(s[a.field]).toLowerCase()===e.toLowerCase()).length;if(i){y(`"${e}" is linked to ${i} book${i===1?"":"s"}. Rename it or edit those books before deleting.`);return}Z(`Delete ${a.label.toLowerCase()} "${e}"?`,()=>{I[t]=(I[t]||[]).filter(s=>s.toLowerCase()!==e.toLowerCase()),L.unshift({id:A(),type:"delete",description:`Deleted ${a.label.toLowerCase()} "${e}"`,user:p.name,timestamp:new Date().toISOString()}),z(t)},`Delete ${a.label}`)}function ot(){const t=G(),e=[...new Set(c.map(a=>a.category))].sort();d("#main").innerHTML=D("Inventory List","Main list of all books and library materials",'<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="secondary" id="importInventoryExcel">Import Excel</button><button class="secondary" id="exportInventoryExcel">Export Excel</button><button class="primary" id="addItem">+ Add Item</button><input id="inventoryImportFile" type="file" accept=".xlsx,.xls,.csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style="display:none"></div>')+`
        <div class="card filters"><div class="filter-row">
          <input id="searchInventory" placeholder="Search by barcode, accession, title, author, or ISBN..." value="${o(l.search)}">
          <select id="inventoryStatusFilter">
            ${["all","available","borrowed","lost","damaged"].map(a=>`<option value="${a}" ${l.status===a?"selected":""}>${a==="all"?"All Status":k(a)}</option>`).join("")}
          </select>
          <select id="inventoryCategoryFilter"><option value="">All Categories</option>${e.map(a=>`<option ${l.category===a?"selected":""}>${o(a)}</option>`).join("")}</select>
        </div></div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode</th><th>Accession Number</th><th>Book Title</th><th>Author</th><th>Category</th><th>ISBN</th><th>Shelf Location</th><th>Quantity</th><th>Available Copies</th><th>Status</th><th>Date Added</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${t.map(a=>`<tr>
            <td class="mono">${o(a.barcode||"-")}</td>
            <td class="mono">${o(b(a))}</td>
            <td><strong>${o(a.title)}</strong></td>
            <td>${o(a.author)}</td>
            <td>${o(a.category)}</td>
            <td class="mono">${o(a.isbn)}</td>
            <td>${o(a.location||"-")}</td>
            <td>${a.copies}</td>
            <td>${a.availableCopies}</td>
            <td><span class="pill" style="${E(N(a.status))}">${o(H(a.status))}</span></td>
            <td>${f(a.addedDate)}</td>
            <td><div class="actions"><button class="icon-btn" title="View details" data-view="${a.id}">View</button><button class="icon-btn" title="Edit" data-edit="${a.id}">Edit</button><button class="icon-btn" title="Delete" data-delete="${a.id}">Del</button></div></td>
          </tr>`).join("")}</tbody>
        </table>${t.length?"":'<div class="empty">No inventory items found matching your criteria.</div>'}</div>
        <div class="count">Showing ${t.length} of ${c.length} inventory items</div>`,w()}function lt(){const e=G().filter(a=>l.status==="all"||l.status==="assigned"&&a.barcode||l.status==="unassigned"&&!a.barcode);d("#main").innerHTML=D("Barcode Management","Generate and manage barcodes attached to books",'<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="secondary" id="scanBarcode">Scan Barcode</button><button class="primary" id="generateBarcode">+ Generate Barcode</button></div>')+`
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr 180px 190px">
          <input id="searchBarcode" placeholder="Search by barcode, title, accession number, or ISBN..." value="${o(l.search)}">
          <select id="barcodeStatusFilter">
            <option value="all" ${l.status==="all"?"selected":""}>All Status</option>
            <option value="assigned" ${l.status==="assigned"?"selected":""}>Assigned</option>
            <option value="unassigned" ${l.status==="unassigned"?"selected":""}>Unassigned</option>
          </select>
          <select id="barcodeCategoryFilter"><option value="">All Categories</option>${[...new Set(c.map(a=>a.category))].sort().map(a=>`<option ${l.category===a?"selected":""}>${o(a)}</option>`).join("")}</select>
        </div></div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode Number</th><th>Book Title</th><th>Accession Number</th><th>Status</th><th>Date Generated</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${e.map(a=>`<tr>
            <td class="mono">${o(a.barcode||"Not generated")}</td>
            <td><strong>${o(a.title)}</strong><p class="subtle mono" style="font-size:12px">${o(a.isbn)}</p></td>
            <td class="mono">${o(b(a))}</td>
            <td><span class="pill" style="${a.barcode?"background:#d1fae5;color:#047857":"background:#f1f5f9;color:#475569"}">${a.barcode?"Assigned":"Unassigned"}</span></td>
            <td>${a.barcode?f(pe(a)):"-"}</td>
            <td><div class="actions">
              <button class="icon-btn" title="Print Barcode" data-print-barcode="${a.id}">Print</button>
              <button class="icon-btn" title="Reassign Barcode" data-reassign-barcode="${a.id}">Reassign</button>
              <button class="icon-btn" title="View Barcode History" data-barcode-history="${a.id}">History</button>
            </div></td>
          </tr>`).join("")}</tbody>
        </table>${e.length?"":'<div class="empty">No barcode records found matching your criteria.</div>'}</div>
        <div class="count">Showing ${e.length} of ${c.length} barcode records</div>`,w()}function ct(){const t=G();d("#main").innerHTML=D("Asset Tracking","Track movement and status of library resources")+`
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr 180px 190px">
          <input id="searchAssets" placeholder="Search by barcode, title, borrower, location, or accession..." value="${o(l.search)}">
          <select id="assetStatusFilter">
            ${["all","available","borrowed","lost","damaged"].map(e=>`<option value="${e}" ${l.status===e?"selected":""}>${e==="all"?"All Status":k(e)}</option>`).join("")}
          </select>
          <select id="assetCategoryFilter"><option value="">All Categories</option>${[...new Set(c.map(e=>e.category))].sort().map(e=>`<option ${l.category===e?"selected":""}>${o(e)}</option>`).join("")}</select>
        </div></div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode</th><th>Item Title</th><th>Current Location</th><th>Borrower</th><th>Date Borrowed</th><th>Due Date</th><th>Last Updated</th><th>Current Status</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${t.map(e=>`<tr>
            <td class="mono">${o(e.barcode||"-")}</td>
            <td><strong>${o(e.title)}</strong><p class="subtle mono" style="font-size:12px">${o(b(e))}</p></td>
            <td>${o(e.location||"-")}</td>
            <td>${o(e.borrower||"-")}</td>
            <td>${e.borrowDate?f(e.borrowDate):"-"}</td>
            <td>${e.dueDate?f(e.dueDate):"-"}</td>
            <td>${f(It(e))}</td>
            <td><span class="pill" style="${E(N(e.status))}">${o(H(e.status))}</span></td>
            <td><div class="actions">
              <button class="icon-btn" title="Track Item Location" data-track-location="${e.id}">Track</button>
              <button class="icon-btn" title="View Borrowing History" data-borrow-history="${e.id}">Borrow</button>
              <button class="icon-btn" title="View Movement History" data-movement-history="${e.id}">Move</button>
              <button class="icon-btn" title="Update Status" data-update-status="${e.id}">Status</button>
            </div></td>
          </tr>`).join("")}</tbody>
        </table>${t.length?"":'<div class="empty">No assets found matching your criteria.</div>'}</div>
        <div class="count">Showing ${t.length} of ${c.length} tracked assets</div>`,w()}function W(t="Stock Verification"){const e=G(),a=c.filter(i=>{const s=at(i);return s.physicalStatus&&s.physicalStatus!==N(i.status)}).length;d("#main").innerHTML=D(t,"Verify physical books against the database",'<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="secondary" id="compareStock">Compare Inventory</button><button class="secondary" id="verificationReport">Generate Report</button><button class="primary" id="scanStock">Scan Books</button></div>')+`
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr 180px 190px">
          <input id="searchVerification" placeholder="Search by barcode, title, accession, or ISBN..." value="${o(l.search)}">
          <select id="verificationStatusFilter">
            ${["all","available","borrowed","lost","damaged"].map(i=>`<option value="${i}" ${l.status===i?"selected":""}>${i==="all"?"All Status":k(i)}</option>`).join("")}
          </select>
          <select id="verificationCategoryFilter"><option value="">All Categories</option>${[...new Set(c.map(i=>i.category))].sort().map(i=>`<option ${l.category===i?"selected":""}>${o(i)}</option>`).join("")}</select>
        </div></div>
        <div class="grid quick" style="margin-bottom:16px">
          <div class="card"><div class="icon-box">${C("database")}</div><div><p class="subtle">Database Items</p><h2>${c.length}</h2></div></div>
          <div class="card"><div class="icon-box">${C("check")}</div><div><p class="subtle">Verified Items</p><h2>${F.length}</h2></div></div>
          <div class="card"><div class="icon-box">${C("alert")}</div><div><p class="subtle">Mismatches</p><h2>${a}</h2></div></div>
        </div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode</th><th>Book Title</th><th>Database Status</th><th>Physical Status</th><th>Verification Date</th><th>Verified By</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${e.map(i=>{const s=at(i),n=s.physicalStatus||"unverified";return`<tr>
              <td class="mono">${o(i.barcode||"-")}</td>
              <td><strong>${o(i.title)}</strong><p class="subtle mono" style="font-size:12px">${o(b(i))}</p></td>
              <td><span class="pill" style="${E(N(i.status))}">${o(H(i.status))}</span></td>
              <td><span class="pill" style="${n==="unverified"?"background:#f1f5f9;color:#475569":E(n)}">${o(n==="unverified"?"Unverified":k(n))}</span></td>
              <td>${s.verificationDate?f(s.verificationDate):"-"}</td>
              <td>${o(s.verifiedBy||"-")}</td>
              <td><div class="actions">
                <button class="icon-btn" title="Scan Book" data-scan-stock="${i.id}">Scan</button>
                <button class="icon-btn" title="Mark Missing Item" data-mark-missing="${i.id}">Missing</button>
              </div></td>
            </tr>`}).join("")}</tbody>
        </table>${e.length?"":'<div class="empty">No verification records found matching your criteria.</div>'}</div>
        <div class="count">Showing ${e.length} of ${c.length} stock records</div>`,w()}function ut(){const t=new Set(O.filter(i=>!i.archived).map(i=>i.bookId)),a=G().filter(i=>i.status==="damaged"||t.has(i.id)).filter(i=>{const s=it(i);return l.status==="all"||s.repairStatus===l.status});d("#main").innerHTML=D("Damaged Items","Books that are worn out or damaged",'<button class="primary" id="reportDamage">+ Report Damage</button>')+`
        <div class="card filters"><div class="filter-row" style="grid-template-columns:1fr 180px 190px">
          <input id="searchDamaged" placeholder="Search by barcode, title, accession, or damage description..." value="${o(l.search)}">
          <select id="damageStatusFilter">
            ${["all","Minor Damage","For Repair","Beyond Repair","Replaced"].map(i=>`<option value="${i}" ${l.status===i?"selected":""}>${i==="all"?"All Repair Status":i}</option>`).join("")}
          </select>
          <select id="damageCategoryFilter"><option value="">All Categories</option>${[...new Set(c.map(i=>i.category))].sort().map(i=>`<option ${l.category===i?"selected":""}>${o(i)}</option>`).join("")}</select>
        </div></div>
        <div class="card table-wrap"><table>
          <thead><tr><th>Barcode</th><th>Title</th><th>Damage Description</th><th>Date Reported</th><th>Reported By</th><th>Repair Status</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${a.map(i=>{const s=it(i);return`<tr>
              <td class="mono">${o(i.barcode||"-")}</td>
              <td><strong>${o(i.title)}</strong><p class="subtle mono" style="font-size:12px">${o(b(i))}</p></td>
              <td>${o(s.description||"No damage description recorded.")}</td>
              <td>${s.dateReported?f(s.dateReported):"-"}</td>
              <td>${o(s.reportedBy||"-")}</td>
              <td><span class="pill" style="${he(s.repairStatus||"Minor Damage")}">${o(s.repairStatus||"Minor Damage")}</span></td>
              <td><div class="actions">
                <button class="icon-btn" title="Upload Damage Photo" data-damage-photo="${i.id}">Photo</button>
                <button class="icon-btn" title="Mark for Repair" data-mark-repair="${i.id}">Repair</button>
                <button class="icon-btn" title="Mark for Replacement" data-mark-replace="${i.id}">Replace</button>
                <button class="icon-btn" title="Archive Damaged Item" data-archive-damage="${i.id}">Archive</button>
              </div></td>
            </tr>`}).join("")}</tbody>
        </table>${a.length?"":'<div class="empty">No damaged items found.</div>'}</div>
        <div class="count">Showing ${a.length} damaged item records</div>`,w()}function _t(){const t=ie(J.memberId),e=c.filter(r=>r.availableCopies>0&&!["missing","damaged"].includes(r.status)),a=c.find(r=>r.id===J.bookId)||e[0]||c[0];a&&J.bookId!==a.id&&(J.bookId=a.id);const i=c.filter(r=>r.borrowerId===t.id&&r.status==="borrowed").length,s=_(),n=ae(new Date,$.loanDays);d("#main").innerHTML=D("Borrow Books","Process book loans and borrower details")+`
        <form id="borrowBooksForm" class="grid" style="gap:18px">
          <div class="card">
            <div class="card-title">Borrower Information</div>
            <div class="dialog-body"><div class="form-grid">
              <div><label>Student/Member ID</label><select id="borrowMemberSelect" name="memberId">${Y.map(r=>`<option value="${r.id}" ${r.id===t.id?"selected":""}>${o(r.id)} - ${o(r.name)}</option>`).join("")}</select></div>
              <div><label>Full Name</label><input value="${o(t.name)}" readonly></div>
              <div><label>Course/Grade Level</label><input value="${o(t.course||"-")}" readonly></div>
              <div><label>Contact Number (optional)</label><input value="${o(t.contact||"")}" readonly></div>
              <div><label>Member Status</label><input value="${t.status==="active"?"Active":"Inactive"}" readonly></div>
            </div></div>
          </div>
          <div class="card">
            <div class="card-title">Book Information</div>
            <div class="dialog-body"><div class="form-grid">
              <div><label>Barcode</label><select id="borrowBookSelect" name="bookId">${e.map(r=>`<option value="${r.id}" ${a&&r.id===a.id?"selected":""}>${o(r.barcode||"-")} - ${o(r.title)}</option>`).join("")}</select></div>
              <div><label>Accession Number</label><input value="${o(b(a))}" readonly></div>
              <div><label>Book Title</label><input value="${o(a.title)}" readonly></div>
              <div><label>Author</label><input value="${o(a.author)}" readonly></div>
              <div><label>Category</label><input value="${o(a.category)}" readonly></div>
              <div><label>Shelf Location</label><input value="${o(a.location||"-")}" readonly></div>
              <div><label>Availability Status</label><input value="${a.availableCopies>0?"Available":"Unavailable"} (${a.availableCopies}/${a.copies})" readonly></div>
            </div></div>
          </div>
          <div class="card">
            <div class="card-title">Borrowing Details</div>
            <div class="dialog-body"><div class="form-grid">
              <div><label>Transaction Number</label><input name="transactionNumber" value="${ve()}" readonly></div>
              <div><label>Borrow Date</label><input name="borrowDate" type="date" value="${s}"></div>
              <div><label>Due Date</label><input name="dueDate" type="date" value="${n}"></div>
              <div><label>Number of Books Borrowed</label><input value="${i+1}" readonly></div>
              <div><label>Librarian in Charge</label><input name="librarian" value="${o(p.name)}" readonly></div>
              <div><label>Remarks</label><input name="remarks" placeholder="Optional remarks"></div>
            </div></div>
            <div class="dialog-foot"><button class="primary" type="submit">Borrow Book</button></div>
          </div>
        </form>`,w()}function Et(){const t=V.verified?c.find(e=>e.id===V.bookId):null;d("#main").innerHTML=D("Accession Update","Update a book copy status using its accession number")+`
        <div class="grid" style="gap:18px">
          <div class="card">
            <div class="card-title">Input Section</div>
            <div class="dialog-body">
              <form id="accessionVerifyForm">
                <div class="form-grid">
                  <div><label>Accession Number (required)</label><input id="accessionNumberLookup" name="accessionNumber" value="${o(V.number)}" placeholder="Example: ACC-0001" required></div>
                  <div style="display:flex;align-items:end"><button class="primary" type="submit">Search/Verify</button></div>
                </div>
              </form>
            </div>
          </div>
          <div class="card">
            <div class="card-title">Book Information (Auto-Displayed)</div>
            ${t?`<div class="dialog-body"><div class="form-grid">
              <div><label>Accession Number</label><input value="${o(b(t))}" readonly></div>
              <div><label>Barcode</label><input value="${o(t.barcode||"-")}" readonly></div>
              <div><label>Book Title</label><input value="${o(t.title)}" readonly></div>
              <div><label>Author</label><input value="${o(t.author)}" readonly></div>
              <div><label>Category</label><input value="${o(t.category)}" readonly></div>
              <div><label>Shelf Location</label><input value="${o(t.location||"-")}" readonly></div>
              <div><label>Current Status</label><select id="accessionStatusOption">${["available","borrowed","missing","damaged","replaced"].map(e=>`<option value="${e}" ${t.status===e?"selected":""}>${Bt(e)}</option>`).join("")}</select></div>
            </div></div>
            <div class="dialog-foot" style="flex-wrap:wrap">
              <button class="primary" type="button" id="markAccessionStatus">Update</button>
              <button class="secondary" type="button" id="clearAccessionLookup">Clear</button>
              <button class="secondary" type="button" id="cancelAccessionLookup">Cancel</button>
            </div>`:'<div class="empty">Enter an accession number and click Search/Verify to display book details.</div>'}
          </div>
          <div class="card">
            <div class="card-title">Update History</div>
            <div class="table-wrap"><table>
              <thead><tr><th>Accession Number</th><th>Book Title</th><th>Previous Status</th><th>New Status</th><th>Date Updated</th><th>Updated By</th></tr></thead>
              <tbody>${Mt.length?Mt.map(e=>`<tr><td class="mono">${o(e.accessionNumber)}</td><td>${o(e.title)}</td><td>${o(e.previousStatus)}</td><td><span class="pill" style="${E(String(e.newStatus).toLowerCase())}">${o(e.newStatus)}</span></td><td>${vt(e.dateUpdated)}</td><td>${o(e.updatedBy)}</td></tr>`).join(""):'<tr><td colspan="6" class="empty">No accession updates yet.</td></tr>'}</tbody>
            </table></div>
          </div>
          <div class="card">
            <div class="card-title">How It Works</div>
            <div class="dialog-body">
              <p class="subtle">Enter an accession number. The system searches for the matching book copy and displays details. Confirm the update to change the status to Available and add the copy to active inventory.</p>
            </div>
          </div>
        </div>`,w()}function Zt(t=null){const e=t||{title:"",author:"",isbn:"",category:"",publisher:"",callNumber:"",status:"available",location:"",publishedYear:new Date().getFullYear(),copies:1,availableCopies:1,barcode:"",accessionNumber:""};d("#bookModal").innerHTML=`<div class="dialog">
        <div class="dialog-head"><h2>${t?"Edit Item":"Add New Item"}</h2><button class="icon-btn" data-close="bookModal">X</button></div>
        <form id="bookForm">
          <div class="dialog-body"><div class="form-grid">
            ${U("title","Title *",e.title,!0)}${kt("author","author","Author *",e.author,!0)}${U("isbn","ISBN *",e.isbn,!0)}${kt("category","category","Category *",e.category,!0)}
            ${kt("publisher","publisher","Publisher",e.publisher)}${U("callNumber","Call Number",e.callNumber)}${U("location","Location",e.location)}${U("publishedYear","Published Year",e.publishedYear,!1,"number")}
            ${U("copies","Total Copies *",e.copies,!0,"number",1)}${U("availableCopies","Available Copies *",e.availableCopies,!0,"number",0)}
            <div><label>Status</label><select name="status">${["available","borrowed","lost","damaged"].map(a=>`<option value="${a}" ${e.status===a||e.status==="missing"&&a==="lost"?"selected":""}>${k(a)}</option>`).join("")}</select></div>
            ${U("barcode","Barcode",e.barcode)}
            ${U("accessionNumber","Accession Number",b(e))}
          </div></div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="bookModal">Cancel</button><button class="primary" type="submit">${t?"Update Item":"Add Item"}</button></div>
        </form></div>`,d("#bookModal").style.display="flex",d("#bookForm").onsubmit=async a=>{a.preventDefault();const i=a.currentTarget.querySelector("button[type='submit']");i&&(i.disabled=!0,i.textContent=t?"Updating...":"Saving...");const s=Object.fromEntries(new FormData(a.currentTarget)),n={...e,...s,status:s.status==="lost"?"missing":s.status,publishedYear:Number(s.publishedYear)||new Date().getFullYear(),copies:Number(s.copies)||1,availableCopies:Number(s.availableCopies)||0};try{const r=await $e(n,!t);if(!r.success)throw new Error(r.message||"Unable to save book.");t?c=c.map(v=>v.id===t.id?n:v):(n.id=r.data||A(),n.addedDate=new Date().toISOString().slice(0,10),n.accessionNumber=n.accessionNumber||`ACC-${String(c.length+1).padStart(4,"0")}`,c.push(n),L.unshift({id:A(),type:"add",description:`Added new book "${n.title}"`,user:p.name,timestamp:new Date().toISOString()})),await Tt(),R("bookModal"),S()}catch(r){ht({title:"Unable to Save",message:r.message||"The database rejected this change.",confirmText:"OK"})}finally{i&&(i.disabled=!1,i.textContent=t?"Update Item":"Add Item")}}}function U(t,e,a,i=!1,s="text",n=""){return`<div><label>${e}</label><input name="${t}" type="${s}" value="${o(a)}" ${i?"required":""} ${n!==""?`min="${n}"`:""}></div>`}function kt(t,e,a,i,s=!1){const n=`${t}Options`,r=st(t).map(v=>`<option value="${o(v.name)}"></option>`).join("");return`<div><label>${a}</label><input name="${e}" list="${n}" value="${o(i)}" ${s?"required":""}><datalist id="${n}">${r}</datalist></div>`}function We(t){const e=h==="inventory"?H(t.status):k(t.status),a=[["Barcode",t.barcode||"-"],["Accession Number",b(t)],["Title",t.title],["Author",t.author],["Category",t.category],["ISBN",t.isbn],["Shelf Location",t.location||"-"],["Quantity",t.copies],["Available Copies",t.availableCopies],["Status",e],["Publisher",t.publisher||"-"],["Published Year",t.publishedYear],["Call Number",t.callNumber||"-"],["Date Added",f(t.addedDate)]];d("#viewModal").innerHTML=`<div class="dialog small"><div class="dialog-head"><h2>Book Details</h2><button class="icon-btn" data-close="viewModal">X</button></div><div class="dialog-body"><div class="detail-grid">${a.map(([i,s])=>`<div><p class="subtle" style="font-size:12px">${i}</p><strong>${o(s)}</strong></div>`).join("")}</div>${t.borrower?`<div style="margin-top:18px;padding:12px;border:1px solid #fde68a;border-radius:10px;background:#fffbeb"><strong style="color:#b45309">Currently Borrowed</strong><p>Borrower: ${o(t.borrower)}</p>${t.dueDate?`<p>Due: ${f(t.dueDate)}</p>`:""}</div>`:""}</div><div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button></div></div>`,d("#viewModal").style.display="flex"}function jt(t,e,a){xt.unshift({bookId:t.id,barcode:a,action:e,date:new Date().toISOString(),user:p.name})}function Ht(t,e,a="Generated"){const i=c.find(n=>n.id===t);if(!i)return;const s=e||mt();c=c.map(n=>n.id===t?{...n,barcode:s,barcodeDateGenerated:new Date().toISOString()}:n),jt({...i,id:t},a,s),L.unshift({id:A(),type:"add",description:`${a} barcode "${s}" for "${i.title}"`,user:p.name,timestamp:new Date().toISOString()}),S()}function Ke(){const t=c.find(e=>!e.barcode)||c[0];d("#viewModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>Generate Barcode</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="generateBarcodeForm">
          <div class="dialog-body">
            <div class="field"><label>Book</label><select name="bookId">${c.map(e=>`<option value="${e.id}" ${t&&t.id===e.id?"selected":""}>${o(e.title)} - ${o(b(e))}</option>`).join("")}</select></div>
            <div class="field"><label>Barcode Number</label><input name="barcode" value="${o(mt())}"></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Cancel</button><button class="primary" type="submit">Generate Barcode</button></div>
        </form>
      </div>`,d("#viewModal").style.display="flex",d("#generateBarcodeForm").onsubmit=e=>{e.preventDefault();const a=Object.fromEntries(new FormData(e.currentTarget));Ht(a.bookId,a.barcode,"Generated"),R("viewModal")}}function Qe(t){t.barcode||Ht(t.id,mt(),"Generated");const e=c.find(a=>a.id===t.id)||t;jt(e,"Printed",e.barcode),d("#viewModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>Print Barcode</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          <div style="border:1px dashed #94a3b8;border-radius:12px;padding:24px;text-align:center;max-width:360px;margin:auto">
            <p class="subtle" style="font-size:12px">City College of Davao Library Barcode</p>
            <div class="mono" style="font-size:30px;font-weight:900;letter-spacing:2px;margin:12px 0">${o(e.barcode)}</div>
            <div style="height:72px;background:repeating-linear-gradient(90deg,#111 0 3px,#fff 3px 6px,#111 6px 8px,#fff 8px 13px);margin:12px 0"></div>
            <strong>${o(e.title)}</strong>
            <p class="subtle mono">${o(b(e))}</p>
          </div>
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button><button class="primary" onclick="window.print()">Print Barcode</button></div>
      </div>`,d("#viewModal").style.display="flex"}function ta(){d("#viewModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>Scan Barcode</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="scanBarcodeForm">
          <div class="dialog-body">
            <div class="field"><label>Barcode Number</label><input name="barcode" placeholder="Enter or scan barcode number" autofocus></div>
            <div id="scanResult" class="subtle" style="margin-top:12px"></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Close</button><button class="primary" type="submit">Scan Barcode</button></div>
        </form>
      </div>`,d("#viewModal").style.display="flex",d("#scanBarcodeForm").onsubmit=t=>{t.preventDefault();const e=new FormData(t.currentTarget).get("barcode"),a=c.find(i=>String(i.barcode).toLowerCase()===String(e).toLowerCase());d("#scanResult").innerHTML=a?`<strong style="color:#047857">Found:</strong> ${o(a.title)} (${o(b(a))})`:'<strong style="color:#b91c1c">No matching barcode found.</strong>',a&&jt(a,"Scanned",a.barcode)}}function ea(t){d("#viewModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>Reassign Barcode</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="reassignBarcodeForm">
          <div class="dialog-body">
            <p class="subtle" style="margin-bottom:12px">${o(t.title)} - ${o(b(t))}</p>
            <div class="field"><label>New Barcode Number</label><input name="barcode" value="${o(mt())}" required></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Cancel</button><button class="primary" type="submit">Reassign Barcode</button></div>
        </form>
      </div>`,d("#viewModal").style.display="flex",d("#reassignBarcodeForm").onsubmit=e=>{e.preventDefault();const a=new FormData(e.currentTarget).get("barcode");Ht(t.id,a,"Reassigned"),R("viewModal")}}function aa(t){const e=xt.filter(a=>a.bookId===t.id);d("#viewModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>Barcode History</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          <p style="font-weight:800">${o(t.title)}</p>
          <p class="subtle mono" style="margin-bottom:14px">${o(b(t))}</p>
          ${e.length?`<div class="table-wrap"><table style="min-width:480px"><thead><tr><th>Barcode</th><th>Action</th><th>User</th><th>Date</th></tr></thead><tbody>${e.map(a=>`<tr><td class="mono">${o(a.barcode)}</td><td>${o(a.action)}</td><td>${o(a.user)}</td><td>${f(a.date)}</td></tr>`).join("")}</tbody></table></div>`:'<div class="empty">No barcode history yet.</div>'}
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button></div>
      </div>`,d("#viewModal").style.display="flex"}function q(t,e,a,i){pt.unshift({bookId:t.id,from:e,to:a,action:i,date:new Date().toISOString(),user:p.name})}function ia(t){const e=pt.filter(a=>a.bookId===t.id);d("#viewModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>Track Item Location</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          <div class="detail-grid">
            <div><p class="subtle" style="font-size:12px">Item Title</p><strong>${o(t.title)}</strong></div>
            <div><p class="subtle" style="font-size:12px">Barcode</p><strong class="mono">${o(t.barcode||"-")}</strong></div>
            <div><p class="subtle" style="font-size:12px">Current Location</p><strong>${o(t.location||"-")}</strong></div>
            <div><p class="subtle" style="font-size:12px">Current Status</p><strong>${o(H(t.status))}</strong></div>
          </div>
          <div class="field"><label>Update Location</label><input id="newAssetLocation" value="${o(t.location||"")}"></div>
          <h3 style="font-size:16px;margin-top:18px">Recent Movement</h3>
          ${e.length?e.slice(0,4).map(a=>`<div class="list-row"><div><strong>${o(a.action)}</strong><p class="subtle">${o(a.from)} to ${o(a.to)} | ${f(a.date)}</p></div></div>`).join(""):'<div class="empty">No movement history yet.</div>'}
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button><button class="primary" data-save-location="${t.id}">Update Location</button></div>
      </div>`,d("#viewModal").style.display="flex"}function oa(t){const e=pt.filter(i=>i.bookId===t.id&&(i.action==="Borrowed"||i.action==="Returned")),a=t.borrower?[{action:"Current Borrower",user:t.borrower,date:t.borrowDate||It(t),due:t.dueDate||"-"}]:[];d("#viewModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>Borrowing History</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          <p style="font-weight:800">${o(t.title)}</p>
          <p class="subtle mono" style="margin-bottom:14px">${o(t.barcode||"-")} | ${o(b(t))}</p>
          ${a.map(i=>`<div class="list-row"><div><strong>${o(i.action)}</strong><p class="subtle">${o(i.user)} | Borrowed: ${f(i.date)} | Due: ${i.due==="-"?"-":f(i.due)}</p></div></div>`).join("")}
          ${e.length?e.map(i=>`<div class="list-row"><div><strong>${o(i.action)}</strong><p class="subtle">${o(i.user)} | ${f(i.date)} | ${o(i.to)}</p></div></div>`).join(""):a.length?"":'<div class="empty">No borrowing history yet.</div>'}
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button></div>
      </div>`,d("#viewModal").style.display="flex"}function sa(t){const e=pt.filter(a=>a.bookId===t.id);d("#viewModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>Movement History</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          <p style="font-weight:800">${o(t.title)}</p>
          <p class="subtle mono" style="margin-bottom:14px">${o(t.barcode||"-")} | ${o(b(t))}</p>
          ${e.length?`<div class="table-wrap"><table style="min-width:560px"><thead><tr><th>Action</th><th>From</th><th>To</th><th>User</th><th>Date</th></tr></thead><tbody>${e.map(a=>`<tr><td>${o(a.action)}</td><td>${o(a.from)}</td><td>${o(a.to)}</td><td>${o(a.user)}</td><td>${f(a.date)}</td></tr>`).join("")}</tbody></table></div>`:'<div class="empty">No movement history yet.</div>'}
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button></div>
      </div>`,d("#viewModal").style.display="flex"}function ra(t){d("#viewModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>Update Status</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="assetStatusForm">
          <div class="dialog-body">
            <p style="font-weight:800">${o(t.title)}</p>
            <p class="subtle mono" style="margin-bottom:14px">${o(t.barcode||"-")} | ${o(b(t))}</p>
            <div class="field"><label>Current Status</label><select name="status">${["available","borrowed","lost","damaged"].map(e=>`<option value="${e}" ${N(t.status)===e?"selected":""}>${k(e)}</option>`).join("")}</select></div>
            <div class="field"><label>Current Location</label><input name="location" value="${o(t.location||"")}"></div>
            <div class="field"><label>Borrower</label><input name="borrower" value="${o(t.borrower||"")}"></div>
            <div class="form-grid">
              <div><label>Date Borrowed</label><input name="borrowDate" type="date" value="${o(t.borrowDate||"")}"></div>
              <div><label>Due Date</label><input name="dueDate" type="date" value="${o(t.dueDate||"")}"></div>
            </div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Cancel</button><button class="primary" type="submit">Update Status</button></div>
        </form>
      </div>`,d("#viewModal").style.display="flex",d("#assetStatusForm").onsubmit=e=>{e.preventDefault();const a=Object.fromEntries(new FormData(e.currentTarget)),i=a.status==="lost"?"missing":a.status,s=`${t.location||"-"} / ${H(t.status)}`,n=`${a.location||"-"} / ${k(i)}`;c=c.map(r=>r.id===t.id?{...r,status:i,location:a.location,borrower:a.borrower,borrowDate:a.borrowDate,dueDate:a.dueDate,lastUpdated:new Date().toISOString()}:r),q(t,s,n,"Status Updated"),R("viewModal"),S()}}function de(t,e){const a={bookId:t,physicalStatus:e,verificationDate:new Date().toISOString(),verifiedBy:p.name};F=F.some(s=>s.bookId===t)?F.map(s=>s.bookId===t?a:s):[a,...F]}function Wt(t=null){d("#viewModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>Scan Books</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="scanStockForm">
          <div class="dialog-body">
            <div class="field"><label>Barcode</label><input name="barcode" value="${o((t==null?void 0:t.barcode)||"")}" placeholder="Enter or scan barcode" autofocus required></div>
            <div class="field"><label>Physical Status</label><select name="physicalStatus">${["available","borrowed","lost","damaged"].map(e=>`<option value="${e}" ${t&&N(t.status)===e?"selected":""}>${k(e)}</option>`).join("")}</select></div>
            <div id="scanStockResult" class="subtle" style="margin-top:12px"></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Close</button><button class="primary" type="submit">Save Scan</button></div>
        </form>
      </div>`,d("#viewModal").style.display="flex",d("#scanStockForm").onsubmit=e=>{e.preventDefault();const a=Object.fromEntries(new FormData(e.currentTarget)),i=c.find(s=>String(s.barcode).toLowerCase()===String(a.barcode).toLowerCase());if(!i){d("#scanStockResult").innerHTML='<strong style="color:#b91c1c">No matching barcode found.</strong>';return}de(i.id,a.physicalStatus),d("#scanStockResult").innerHTML=`<strong style="color:#047857">Verified:</strong> ${o(i.title)} as ${o(k(a.physicalStatus))}`,W()}}function na(){const t=c.map(e=>{const a=at(e),i=N(e.status),s=a.physicalStatus||"unverified";return{book:e,database:i,physical:s,match:i===s}});d("#viewModal").innerHTML=`<div class="dialog">
        <div class="dialog-head"><h2>Database vs Physical Inventory</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          <div class="table-wrap"><table>
            <thead><tr><th>Barcode</th><th>Book Title</th><th>Database</th><th>Physical</th><th>Result</th></tr></thead>
            <tbody>${t.map(e=>`<tr>
              <td class="mono">${o(e.book.barcode||"-")}</td>
              <td>${o(e.book.title)}</td>
              <td>${o(k(e.database))}</td>
              <td>${o(e.physical==="unverified"?"Unverified":k(e.physical))}</td>
              <td><span class="pill" style="${e.match?"background:#d1fae5;color:#047857":"background:#fee2e2;color:#b91c1c"}">${e.match?"Match":"Mismatch"}</span></td>
            </tr>`).join("")}</tbody>
          </table></div>
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button></div>
      </div>`,d("#viewModal").style.display="flex"}function da(){const t=F.length,e=F.filter(s=>s.physicalStatus==="lost").length,a=F.filter(s=>s.physicalStatus==="damaged").length,i=c.filter(s=>{const n=at(s);return n.physicalStatus&&n.physicalStatus!==N(s.status)});d("#viewModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>Verification Report</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <div class="dialog-body">
          <div class="detail-grid">
            <div><p class="subtle" style="font-size:12px">Database Items</p><strong>${c.length}</strong></div>
            <div><p class="subtle" style="font-size:12px">Verified Items</p><strong>${t}</strong></div>
            <div><p class="subtle" style="font-size:12px">Physical Missing</p><strong>${e}</strong></div>
            <div><p class="subtle" style="font-size:12px">Physical Damaged</p><strong>${a}</strong></div>
          </div>
          <h3 style="font-size:16px;margin-top:18px">Mismatches</h3>
          ${i.length?i.map(s=>{const n=at(s);return`<div class="list-row"><div><strong>${o(s.title)}</strong><p class="subtle">Database: ${o(H(s.status))} | Physical: ${o(k(n.physicalStatus))}</p></div></div>`}).join(""):'<div class="empty">No mismatches found.</div>'}
        </div>
        <div class="dialog-foot"><button class="secondary" data-close="viewModal">Close</button><button class="primary" onclick="window.print()">Print Report</button></div>
      </div>`,d("#viewModal").style.display="flex"}function la(t){Z(`Mark "${t.title}" as missing?`,()=>{de(t.id,"lost"),c=c.map(e=>e.id===t.id?{...e,status:"missing",lastUpdated:new Date().toISOString()}:e),q(t,t.location||"-","Missing Review","Marked Missing"),S()},"Mark Missing")}function Ot(t,e){const a=O.find(s=>s.bookId===t&&!s.archived),i={bookId:t,description:e.description||(a==null?void 0:a.description)||"",dateReported:(a==null?void 0:a.dateReported)||new Date().toISOString(),reportedBy:(a==null?void 0:a.reportedBy)||p.name,repairStatus:e.repairStatus||(a==null?void 0:a.repairStatus)||"Minor Damage",photoNote:e.photoNote||(a==null?void 0:a.photoNote)||"",archived:!1};O=a?O.map(s=>s===a?i:s):[i,...O],c=c.map(s=>s.id===t?{...s,status:"damaged",lastUpdated:new Date().toISOString()}:s)}function ca(t=null){const e=t||c[0];d("#viewModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>Report Damage</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="damageForm">
          <div class="dialog-body">
            <div class="field"><label>Book</label><select name="bookId">${c.map(a=>`<option value="${a.id}" ${e&&e.id===a.id?"selected":""}>${o(a.title)} - ${o(b(a))}</option>`).join("")}</select></div>
            <div class="field"><label>Damage Description</label><input name="description" placeholder="Describe the damage" required></div>
            <div class="field"><label>Repair Status</label><select name="repairStatus">${["Minor Damage","For Repair","Beyond Repair","Replaced"].map(a=>`<option value="${a}">${a}</option>`).join("")}</select></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Cancel</button><button class="primary" type="submit">Report Damage</button></div>
        </form>
      </div>`,d("#viewModal").style.display="flex",d("#damageForm").onsubmit=a=>{a.preventDefault();const i=Object.fromEntries(new FormData(a.currentTarget));Ot(i.bookId,i);const s=c.find(n=>n.id===i.bookId);s&&q(s,s.location||"-","Damage Review","Damage Reported"),R("viewModal"),S()}}function ua(t){const e=it(t);d("#viewModal").innerHTML=`<div class="dialog small">
        <div class="dialog-head"><h2>Upload Damage Photo</h2><button class="icon-btn" data-close="viewModal">X</button></div>
        <form id="damagePhotoForm">
          <div class="dialog-body">
            <p style="font-weight:800">${o(t.title)}</p>
            <p class="subtle" style="margin-bottom:14px">Standalone HTML stores a photo note instead of an uploaded file.</p>
            <div class="field"><label>Damage Photo Note</label><input name="photoNote" value="${o(e.photoNote||"")}" placeholder="Example: photo saved as IMG_2041.jpg"></div>
          </div>
          <div class="dialog-foot"><button class="secondary" type="button" data-close="viewModal">Cancel</button><button class="primary" type="submit">Save Photo Note</button></div>
        </form>
      </div>`,d("#viewModal").style.display="flex",d("#damagePhotoForm").onsubmit=a=>{a.preventDefault(),Ot(t.id,Object.fromEntries(new FormData(a.currentTarget))),R("viewModal"),S()}}function Kt(t,e,a){Ot(t.id,{repairStatus:e}),q(t,t.location||"-",e,a),S()}function pa(t){Z(`Archive damaged record for "${t.title}"?`,()=>{const e=it(t);O=O.map(a=>a.bookId===t.id&&!a.archived?{...a,archived:!0}:a),c=c.map(a=>a.id===t.id?{...a,status:"available",lastUpdated:new Date().toISOString()}:a),q(t,e.repairStatus||"Damaged","Archived","Archived Damaged Item"),S()},"Archive Damage Record")}function va(t){const e=Object.fromEntries(new FormData(t)),a=ie(e.memberId),i=c.find(r=>r.id===e.bookId);if(!a||!i)return;if(a.status!=="active"){y("This member is inactive and cannot borrow books.");return}if(c.filter(r=>r.borrowerId===a.id&&r.status==="borrowed").length>=$.maxBorrowedBooks){y(`This member has reached the ${$.maxBorrowedBooks} book borrowing limit.`);return}if(i.availableCopies<=0||["missing","damaged"].includes(i.status)){y("This book is not available for borrowing.");return}const n=Math.max(0,i.availableCopies-1);c=c.map(r=>r.id===i.id?{...r,status:"borrowed",availableCopies:n,borrower:a.name,borrowerId:a.id,borrowDate:e.borrowDate,dueDate:e.dueDate,lastUpdated:new Date().toISOString(),remarks:e.remarks}:r),L.unshift({id:A(),type:"borrow",description:`Borrowed "${i.title}" (${e.transactionNumber})`,user:a.name,timestamp:new Date().toISOString(),bookTitle:i.title}),$.emailNotifications&&Rt("reminder","Book Borrowed",`${i.title} is due on ${f(e.dueDate)} for ${a.name}.`),q(i,i.location||"-",`Checked out to ${a.name}`,"Borrowed"),y("Borrow transaction saved."),S()}function ha(t){const e=String(t||"").trim().toLowerCase(),a=c.find(i=>b(i).toLowerCase()===e);V={number:t,bookId:a?a.id:null,verified:!!a},a||y("No book copy found for that accession number."),Et()}function ma(t){const e=c.find(n=>n.id===V.bookId);if(!e)return;const a=Bt(e.status),i=t==="missing"?"missing":t,s=Bt(i);c=c.map(n=>n.id===e.id?{...n,status:i,availableCopies:["available","replaced"].includes(i)?Math.max(1,n.availableCopies||0):0,borrower:i==="borrowed"?n.borrower||"Recorded borrower":"",borrowerId:i==="borrowed"?n.borrowerId:"",borrowDate:i==="borrowed"?n.borrowDate||_():"",dueDate:i==="borrowed"?n.dueDate||ae(new Date,$.loanDays):"",lastUpdated:new Date().toISOString()}:n),Mt.unshift({accessionNumber:b(e),title:e.title,previousStatus:a,newStatus:s,dateUpdated:new Date().toISOString(),updatedBy:p.name}),L.unshift({id:A(),type:"add",description:`Marked "${e.title}" ${s} via accession ${b(e)}`,user:p.name,timestamp:new Date().toISOString(),bookTitle:e.title}),q(e,a,s,"Accession Status Updated"),y(`Book copy marked ${s}.`),S()}function ba(t){return String(t||"").toLowerCase().replace(/[^a-z0-9]/g,"")}function ga(t){const e=String(t||"available").trim().toLowerCase();return e==="lost"||e==="missing"?"missing":["available","borrowed","reserved","damaged"].includes(e)?e:"available"}function M(t){const e=String(t??"").trim();return e==="-"?"":e}function fa(t){const e=[];let a=[],i="",s=!1;for(let n=0;n<t.length;n+=1){const r=t[n],v=t[n+1];r==='"'&&s&&v==='"'?(i+='"',n+=1):r==='"'?s=!s:r===","&&!s?(a.push(i.trim()),i=""):(r===`
`||r==="\r")&&!s?(r==="\r"&&v===`
`&&(n+=1),a.push(i.trim()),a.some(Boolean)&&e.push(a),a=[],i=""):i+=r}return a.push(i.trim()),a.some(Boolean)&&e.push(a),e}function At(t){if(t.length<2)return[];const e=t[0].map(ba);return t.slice(1).map(a=>{const i={};return e.forEach((s,n)=>i[s]=M(a[n])),i}).filter(a=>Object.values(a).some(Boolean))}function ya(t){if(!window.XLSX)throw new Error("Excel workbook import needs the spreadsheet parser to load. Check your internet connection or import a .csv file.");const e=XLSX.read(t,{type:"array",cellDates:!0}),a=e.SheetNames[0];if(!a)return[];const i=e.Sheets[a];return At(XLSX.utils.sheet_to_json(i,{header:1,raw:!1,defval:""}))}function $a(t){if(window.TextDecoder)return new TextDecoder("utf-8").decode(t);const e=new Uint8Array(t);let a="";return e.forEach(i=>a+=String.fromCharCode(i)),a}function Qt(t,e){if(/\.xlsx$/i.test(e))throw new Error("Unable to read this .xlsx workbook. Please try a standard Excel workbook or save it as .csv.");if(/<table[\s>]/i.test(t)){const i=new DOMParser().parseFromString(t,"text/html").querySelector("table");if(!i)return[];const s=[...i.querySelectorAll("tr")].map(n=>[...n.children].map(r=>r.textContent.trim())).filter(n=>n.some(Boolean));return At(s)}return At(fa(t))}function wa(t){let e=0,a=0;const i=new Date().toISOString();return t.forEach(s=>{const n=M(s.booktitle||s.title);if(!n)return;const r=M(s.barcode),v=M(s.accessionnumber||s.accession),u=M(s.isbn),x=Math.max(1,Number(s.quantity||s.copies||1)||1),$t=Math.max(0,Number(s.availablecopies||s.available||x)||0),tt=new Date(M(s.dateadded||s.addeddate)),le=Number.isNaN(tt.getTime())?_():_(tt),ce=ga(s.status),Vt={title:n,author:M(s.author),category:M(s.category),isbn:u,publisher:M(s.publisher),callNumber:M(s.callnumber),location:M(s.shelflocation||s.location),copies:x,availableCopies:Math.min($t,x),status:ce,addedDate:le,barcode:r,accessionNumber:v,publishedYear:Number(s.publishedyear)||new Date().getFullYear(),lastUpdated:i},wt=c.findIndex(St=>v&&b(St).toLowerCase()===v.toLowerCase()||r&&String(St.barcode||"").toLowerCase()===r.toLowerCase()||u&&String(St.isbn||"").toLowerCase()===u.toLowerCase());wt>=0?(c[wt]={...c[wt],...Vt},a+=1):(c.push({id:A(),...Vt,accessionNumber:v||`ACC-${String(c.length+1).padStart(4,"0")}`}),e+=1)}),(e||a)&&L.unshift({id:A(),type:"add",description:`Imported inventory file (${e} added, ${a} updated)`,user:p.name,timestamp:i}),{added:e,updated:a}}function Sa(t){if(!t)return;const e=/\.(xlsx|xls)$/i.test(t.name)&&!/\.csv$/i.test(t.name),a=new FileReader;a.onload=()=>{try{let i=[];if(e&&window.XLSX)try{i=ya(a.result)}catch(n){if(/\.xlsx$/i.test(t.name))throw n;i=Qt($a(a.result),t.name)}else i=Qt(String(a.result||""),t.name);if(!i.length)throw new Error("No inventory rows were found in this file.");const s=wa(i);y(`Inventory import complete. ${s.added} added, ${s.updated} updated.`),ot()}catch(i){y(i.message||"Unable to import this inventory file.")}finally{const i=d("#inventoryImportFile");i&&(i.value="")}},a.onerror=()=>y("Unable to read this inventory file."),e&&window.XLSX?a.readAsArrayBuffer(t):a.readAsText(t)}function Da(){const t=G(),e=["Barcode","Accession Number","Book Title","Author","Category","ISBN","Shelf Location","Quantity","Available Copies","Status","Date Added"],a=t.map(r=>[r.barcode||"-",b(r),r.title,r.author,r.category,r.isbn,r.location||"-",r.copies,r.availableCopies,H(r.status),f(r.addedDate)]),i=`<table><thead><tr>${e.map(r=>`<th>${o(r)}</th>`).join("")}</tr></thead><tbody>${a.map(r=>`<tr>${r.map(v=>`<td>${o(v)}</td>`).join("")}</tr>`).join("")}</tbody></table>`,s=new Blob([`\uFEFF${i}`],{type:"application/vnd.ms-excel"}),n=document.createElement("a");n.href=URL.createObjectURL(s),n.download=`inventory-list-${_()}.xls`,document.body.appendChild(n),n.click(),URL.revokeObjectURL(n.href),n.remove()}function R(t){d("#"+t).style.display="none"}document.addEventListener("click",t=>{var a;const e=t.target.closest("button");if(e){if(e.dataset.login){const[i,s]=e.dataset.login.split("|");ne(i,s)}if(e.id==="toggleSignup"){const i=d("#signupForm"),s=d("#loginForm"),n=i.hasAttribute("hidden");i.toggleAttribute("hidden",!n),s.toggleAttribute("hidden",n),e.textContent=n?"Already have an account? Sign in":"Don't have an account? Sign up",d("#loginError").style.display="none"}if(e.dataset.page&&(e.dataset.page!==h&&(l.status="all"),h=e.dataset.page,S()),e.dataset.toggle&&(rt.has(e.dataset.toggle)?rt.delete(e.dataset.toggle):rt.add(e.dataset.toggle),w()),e.id==="logoutBtn"&&Z("Logout of your account?",ge,"Logout"),(e.id==="addBook"||e.id==="addItem")&&Zt(),e.id==="addUser"&&Jt(),e.id==="savePermissions"&&je(),e.id==="importInventoryExcel"&&((a=d("#inventoryImportFile"))==null||a.click()),e.id==="exportInventoryExcel"&&Da(),e.dataset.catalogAdd&&Yt(e.dataset.catalogAdd),e.dataset.catalogEdit&&Yt(e.dataset.catalogEdit,e.dataset.name||""),e.dataset.catalogView&&_e(e.dataset.catalogView,e.dataset.name||""),e.dataset.catalogDelete&&Ze(e.dataset.catalogDelete,e.dataset.name||""),e.id==="generateBarcode"&&Ke(),e.id==="scanBarcode"&&ta(),e.id==="scanStock"&&Wt(),e.id==="compareStock"&&na(),e.id==="verificationReport"&&da(),e.id==="printReport"&&window.print(),e.id==="markAllNotificationsRead"&&xe(),e.id==="addTestNotification"&&(Rt("announcement","New Library Notice","A new notification was created for review."),gt()),e.id==="reportDamage"&&ca(),e.id==="markAccessionStatus"&&ma(d("#accessionStatusOption").value),e.id==="clearAccessionLookup"&&(V={number:"",bookId:null,verified:!1},Et()),e.id==="cancelAccessionLookup"&&(V={number:"",bookId:null,verified:!1},h="inventory",S()),e.dataset.edit&&Zt(c.find(i=>i.id===e.dataset.edit)),e.dataset.view&&We(c.find(i=>i.id===e.dataset.view)),e.dataset.printBarcode&&Qe(c.find(i=>i.id===e.dataset.printBarcode)),e.dataset.reassignBarcode&&ea(c.find(i=>i.id===e.dataset.reassignBarcode)),e.dataset.barcodeHistory&&aa(c.find(i=>i.id===e.dataset.barcodeHistory)),e.dataset.trackLocation&&ia(c.find(i=>i.id===e.dataset.trackLocation)),e.dataset.borrowHistory&&oa(c.find(i=>i.id===e.dataset.borrowHistory)),e.dataset.movementHistory&&sa(c.find(i=>i.id===e.dataset.movementHistory)),e.dataset.updateStatus&&ra(c.find(i=>i.id===e.dataset.updateStatus)),e.dataset.scanStock&&Wt(c.find(i=>i.id===e.dataset.scanStock)),e.dataset.markMissing&&la(c.find(i=>i.id===e.dataset.markMissing)),e.dataset.damagePhoto&&ua(c.find(i=>i.id===e.dataset.damagePhoto)),e.dataset.markRepair&&Kt(c.find(i=>i.id===e.dataset.markRepair),"For Repair","Marked for Repair"),e.dataset.markReplace&&Kt(c.find(i=>i.id===e.dataset.markReplace),"Replaced","Marked for Replacement"),e.dataset.archiveDamage&&pa(c.find(i=>i.id===e.dataset.archiveDamage)),e.dataset.toggleNotification&&Le(e.dataset.toggleNotification),e.dataset.deleteNotification&&Ae(e.dataset.deleteNotification),e.dataset.editUser&&Jt(g.find(i=>i.id===e.dataset.editUser)),e.dataset.toggleUserStatus&&Fe(e.dataset.toggleUserStatus),e.dataset.deleteUser&&Ue(e.dataset.deleteUser),e.dataset.resetUserPassword&&Pe(e.dataset.resetUserPassword),e.dataset.saveLocation){const i=c.find(n=>n.id===e.dataset.saveLocation),s=d("#newAssetLocation").value;i&&(c=c.map(n=>n.id===i.id?{...n,location:s,lastUpdated:new Date().toISOString()}:n),q(i,i.location||"-",s||"-","Location Updated"),R("viewModal"),S())}if(e.dataset.delete){const i=c.find(s=>s.id===e.dataset.delete);i&&Z("Are you sure you want to delete this book?",async()=>{try{const s=await we(i.id);if(!s.success)throw new Error(s.message||"Unable to delete book.");c=c.filter(n=>n.id!==i.id),L.unshift({id:A(),type:"delete",description:`Deleted book "${i.title}"`,user:p.name,timestamp:new Date().toISOString()}),await Tt(),S()}catch(s){ht({title:"Unable to Delete",message:s.message||"The database rejected this change.",confirmText:"OK"})}},"Delete Book")}e.hasAttribute("data-system-close")&&qt(!1),e.hasAttribute("data-system-confirm")&&qt(!0),e.dataset.close&&R(e.dataset.close)}});document.addEventListener("input",t=>{t.target.id==="searchBooks"&&(l.search=t.target.value,dt(),d("#searchBooks").focus(),d("#searchBooks").setSelectionRange(l.search.length,l.search.length)),t.target.id==="searchAuthors"&&(l.search=t.target.value,z("author"),d("#searchAuthors").focus(),d("#searchAuthors").setSelectionRange(l.search.length,l.search.length)),t.target.id==="searchPublishers"&&(l.search=t.target.value,z("publisher"),d("#searchPublishers").focus(),d("#searchPublishers").setSelectionRange(l.search.length,l.search.length)),t.target.id==="searchCategories"&&(l.search=t.target.value,z("category"),d("#searchCategories").focus(),d("#searchCategories").setSelectionRange(l.search.length,l.search.length)),t.target.id==="searchReports"&&(l.search=t.target.value,S(),d("#searchReports").focus(),d("#searchReports").setSelectionRange(l.search.length,l.search.length)),t.target.id==="searchInventory"&&(l.search=t.target.value,ot(),d("#searchInventory").focus(),d("#searchInventory").setSelectionRange(l.search.length,l.search.length)),t.target.id==="searchBarcode"&&(l.search=t.target.value,lt(),d("#searchBarcode").focus(),d("#searchBarcode").setSelectionRange(l.search.length,l.search.length)),t.target.id==="searchAssets"&&(l.search=t.target.value,ct(),d("#searchAssets").focus(),d("#searchAssets").setSelectionRange(l.search.length,l.search.length)),t.target.id==="searchVerification"&&(l.search=t.target.value,W(),d("#searchVerification").focus(),d("#searchVerification").setSelectionRange(l.search.length,l.search.length)),t.target.id==="searchDamaged"&&(l.search=t.target.value,ut(),d("#searchDamaged").focus(),d("#searchDamaged").setSelectionRange(l.search.length,l.search.length)),t.target.id==="searchNotifications"&&(l.search=t.target.value,gt(),d("#searchNotifications").focus(),d("#searchNotifications").setSelectionRange(l.search.length,l.search.length)),t.target.id==="searchUsers"&&(l.search=t.target.value,K(),d("#searchUsers").focus(),d("#searchUsers").setSelectionRange(l.search.length,l.search.length)),t.target.id==="accessionNumberLookup"&&(V.number=t.target.value)});document.addEventListener("change",t=>{t.target.id==="borrowMemberSelect"&&(J.memberId=t.target.value,_t()),t.target.id==="borrowBookSelect"&&(J.bookId=t.target.value,_t()),t.target.id==="statusFilter"&&(l.status=t.target.value,dt()),t.target.id==="categoryFilter"&&(l.category=t.target.value,dt()),t.target.id==="inventoryStatusFilter"&&(l.status=t.target.value,ot()),t.target.id==="inventoryCategoryFilter"&&(l.category=t.target.value,ot()),t.target.id==="barcodeStatusFilter"&&(l.status=t.target.value,lt()),t.target.id==="barcodeCategoryFilter"&&(l.category=t.target.value,lt()),t.target.id==="assetStatusFilter"&&(l.status=t.target.value,ct()),t.target.id==="assetCategoryFilter"&&(l.category=t.target.value,ct()),t.target.id==="verificationStatusFilter"&&(l.status=t.target.value,W()),t.target.id==="verificationCategoryFilter"&&(l.category=t.target.value,W()),t.target.id==="damageStatusFilter"&&(l.status=t.target.value,ut()),t.target.id==="damageCategoryFilter"&&(l.category=t.target.value,ut()),t.target.id==="notificationStatusFilter"&&(l.status=t.target.value,gt()),t.target.id==="userStatusFilter"&&(l.status=t.target.value,K()),t.target.id==="inventoryImportFile"&&Sa(t.target.files&&t.target.files[0])});d("#loginForm").addEventListener("submit",t=>{t.preventDefault(),ne(d("#email").value,d("#password").value)});document.addEventListener("submit",t=>{if(t.target.id==="signupForm"&&(t.preventDefault(),be(t.target)),t.target.id==="borrowBooksForm"&&(t.preventDefault(),va(t.target)),t.target.id==="accessionVerifyForm"){t.preventDefault();const e=Object.fromEntries(new FormData(t.target));ha(e.accessionNumber)}t.target.id==="userForm"&&(t.preventDefault(),Re(t.target)),t.target.id==="librarySettingsForm"&&(t.preventDefault(),He(t.target)),t.target.id==="borrowingSettingsForm"&&(t.preventDefault(),Oe(t.target)),t.target.id==="profileSettingsForm"&&(t.preventDefault(),Ve(t.target)),t.target.id==="passwordSettingsForm"&&(t.preventDefault(),ze(t.target))});
