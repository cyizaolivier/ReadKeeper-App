/* ---------- ADMIN AUTO-CREATE ---------- */
(() => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (!users.find(u => u.username === "admin")) {
    users.push({ username:"admin", password:btoa("admin123"), role:"admin" });
    localStorage.setItem("users", JSON.stringify(users));
  }
})();

/* ---------- STATE ---------- */
let isRegister = false;

/* ---------- ELEMENTS ---------- */
const authTitle = document.getElementById("authTitle");
const authBtn = document.getElementById("authBtn");
const toggle = document.getElementById("toggle");
const username = document.getElementById("username");
const password = document.getElementById("password");
const role = document.getElementById("role");

const app = document.getElementById("app");
const adminPanel = document.getElementById("adminPanel");
const booksBox = document.getElementById("books");
const requestsBox = document.getElementById("requests");
const userBorrowsSection = document.getElementById("userBorrows");
const userRequestsBox = document.getElementById("userRequests");

const searchInput = document.getElementById("search");

/* ---------- AUTH TOGGLE ---------- */
toggle.onclick = () => {
  isRegister = !isRegister;
  authTitle.innerText = isRegister?"Register":"Login";
  authBtn.innerText = isRegister?"Register":"Login";
};

/* ---------- AUTH ---------- */
authBtn.onclick = () => {
  const u=username.value.trim();
  const p=btoa(password.value.trim());
  const r=role.value;
  let users=JSON.parse(localStorage.getItem("users"))||[];
  if(!u||!password.value) return alert("Enter username and password");

  if(isRegister){
    if(users.find(x=>x.username===u)) return alert("User exists");
    users.push({username:u,password:p,role:r});
    localStorage.setItem("users",JSON.stringify(users));
    toggle.click();
  }else{
    const user=users.find(x=>x.username===u && x.password===p);
    if(!user) return alert("Invalid credentials");
    localStorage.setItem("currentUser",JSON.stringify(user));
    loadApp();
  }
};

/* ---------- LOAD APP ---------- */
function loadApp(){
  if(document.getElementById("auth")) document.getElementById("auth").remove();
  app.classList.remove("hidden");
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if(adminPanel) adminPanel.style.display = user.role==="admin"?"block":"none";
  if(userBorrowsSection) userBorrowsSection.style.display = user.role==="user"?"block":"none";
  renderBooks();
  renderRequests();
  renderUserBorrows();
}

/* ---------- LOGOUT ---------- */
const logoutEl = document.getElementById("logout");
if(logoutEl) logoutEl.onclick = ()=>{ localStorage.removeItem("currentUser"); location.reload(); };


/* ---------- BOOKS ---------- */
document.getElementById("addBook")?.addEventListener("click",()=>{
  const title=document.getElementById("bookTitle").value.trim();
  const author=document.getElementById("bookAuthor").value.trim();
  const category=document.getElementById("bookCategory").value;
  if(!title||!author) return alert("Enter title and author");
  const books=JSON.parse(localStorage.getItem("books"))||[];
  books.push({id:Date.now(),title,author,category});
  localStorage.setItem("books",JSON.stringify(books));
  renderBooks();
});

/* ---------- RENDER BOOKS ---------- */
function renderBooks(){
  const books=JSON.parse(localStorage.getItem("books"))||[];
  const user=JSON.parse(localStorage.getItem("currentUser"));
  const q=searchInput.value.toLowerCase();
  booksBox.innerHTML="";
  books.filter(b=>b.title.toLowerCase().includes(q)||b.author.toLowerCase().includes(q))
  .forEach(b=>{
    const div=document.createElement("div");
    div.className="book";
    div.innerHTML=`
      <b>${b.title}</b><br>${b.author}<br>${b.category}<br><br>
      ${user.role==="admin"
        ? `<button class="delete" onclick="deleteBook(${b.id})">Delete</button>`
        : `<button onclick="borrowBook(${b.id})">Borrow</button>`}
    `;
    booksBox.appendChild(div);
  });
}
searchInput.addEventListener("input", renderBooks);

/* ---------- DELETE BOOK ---------- */
function deleteBook(id){
  let books=JSON.parse(localStorage.getItem("books"))||[];
  books=books.filter(b=>b.id!==id);
  localStorage.setItem("books",JSON.stringify(books));
  renderBooks();
  renderRequests();
}

/* ---------- BORROW ---------- */
function borrowBook(id){
  const user=JSON.parse(localStorage.getItem("currentUser"));
  const borrows=JSON.parse(localStorage.getItem("borrows"))||[];
  if(borrows.find(b=>b.bookId===id && b.user===user.username)) return alert("Already requested");
  borrows.push({id:Date.now(),bookId:id,user:user.username,status:"pending"});
  localStorage.setItem("borrows",JSON.stringify(borrows));
  alert("Borrow request sent");
  renderUserBorrows();
}

/* ---------- RENDER BORROW REQUESTS ADMIN ---------- */
function renderRequests(){
  const user=JSON.parse(localStorage.getItem("currentUser"));
  if(user.role!=="admin") return;
  const borrows=JSON.parse(localStorage.getItem("borrows"))||[];
  const books=JSON.parse(localStorage.getItem("books"))||[];
  requestsBox.innerHTML="";
  borrows.forEach(b=>{
    const book=books.find(x=>x.id===b.bookId);
    const div=document.createElement("div");
    div.className="book";
    div.innerHTML=`
      <b>${book?.title}</b><br>
      User: ${b.user}<br>Status: <span class="badge ${b.status}">${b.status}</span><br><br>
      <button onclick="updateBorrow(${b.id},'approved')">Approve</button>
      <button class="delete" onclick="updateBorrow(${b.id},'rejected')">Reject</button>
    `;
    requestsBox.appendChild(div);
  });
}

/* ---------- RENDER USER BORROWS ---------- */
function renderUserBorrows(){
  const user=JSON.parse(localStorage.getItem("currentUser"));
  if(user.role!=="user") return;
  const borrows=JSON.parse(localStorage.getItem("borrows"))||[];
  const books=JSON.parse(localStorage.getItem("books"))||[];
  const myBorrows=borrows.filter(b=>b.user===user.username);
  userRequestsBox.innerHTML="";
  myBorrows.forEach(b=>{
    const book=books.find(x=>x.id===b.bookId);
    let statusBadge = `<span class="badge ${b.status}">${b.status}</span>`;
    let extraInfo = "";

    if(b.status === "approved" && b.returnDate){
        extraInfo = `<div style="margin-top:0.5rem; font-size:0.85rem; color:var(--text-muted);">
                        <i data-feather="calendar" style="width:14px;"></i> Return by: <b>${b.returnDate}</b>
                     </div>`;
    }

    const div=document.createElement("div");
    div.className="book";
    div.innerHTML=`
      <b>${book?.title}</b><br>${book?.author}<br>
      <div style="margin-top:0.5rem;">Status: ${statusBadge}</div>
      ${extraInfo}
    `;
    userRequestsBox.appendChild(div);
  });
  if(window.feather) feather.replace();
}

/* ---------- UPDATE BORROW STATUS ADMIN ---------- */
function updateBorrow(id,status){
  let borrows=JSON.parse(localStorage.getItem("borrows"))||[];
  
  borrows=borrows.map(b=>{
    if(b.id===id){
        let updated = {...b, status};
        if(status === 'approved'){
            // Set return date to 14 days from now
            const date = new Date();
            date.setDate(date.getDate() + 14);
            updated.returnDate = date.toLocaleDateString();
        }
        return updated;
    }
    return b;
  });

  localStorage.setItem("borrows",JSON.stringify(borrows));
  renderRequests();
  renderUserBorrows();
}

/* ---------- MEMBERS PAGE LOGIC ---------- */
function renderMembers(){
    const membersGrid = document.getElementById('membersGrid');
    const countEl = document.getElementById('memberCount');
    if(!membersGrid) return; // Not on members page
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if(countEl) countEl.innerText = `${users.length} Users`;
    membersGrid.innerHTML = '';
    
    users.forEach(u => {
        const isMe = u.username === currentUser.username;
        const isAdmin = u.role === 'admin';
        
        const div = document.createElement('div');
        div.className = 'card';
        div.style.marginBottom = '0';
        div.innerHTML = `
            <div style="padding:1.5rem; display:flex; gap:1rem; align-items:center;">
                <div style="width:50px; height:50px; background:${isAdmin ? 'var(--primary)' : 'var(--secondary)'}; border-radius:50%; color:white; display:flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:bold;">
                    ${u.username.charAt(0).toUpperCase()}
                </div>
                <div style="flex:1">
                    <h4 style="margin:0; font-size:1.1rem;">${u.username}</h4>
                    <span class="badge ${isAdmin ? 'badge-success' : 'pending'}" style="margin-top:0.25rem; display:inline-block;">${u.role}</span>
                </div>
                ${currentUser.role === 'admin' && !isMe ? 
                  `<button onclick="deleteUser('${u.username}')" class="btn btn-danger btn-sm" title="Remove User"><i data-feather="trash-2"></i></button>` 
                  : ''}
            </div>
        `;
        membersGrid.appendChild(div);
    });
    if(window.feather) feather.replace();
}

function deleteUser(username){
    if(!confirm(`Are you sure you want to remove user: ${username}?`)) return;
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(u => u.username !== username);
    localStorage.setItem('users', JSON.stringify(users));
    
    renderMembers();
}

/* ---------- SETTINGS PAGE LOGIC ---------- */
const profileForm = document.getElementById('profileForm');
if(profileForm){
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPass = document.getElementById('newPassword').value;
        if(!newPass) return alert("Password unchanged");
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Update users array
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        if(userIndex > -1){
            users[userIndex].password = btoa(newPass); // simple update
            localStorage.setItem('users', JSON.stringify(users));
            
            // Update current session
            currentUser.password = btoa(newPass);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            alert("Password updated successfully!");
            document.getElementById('newPassword').value = '';
        }
    });
}

const resetBtn = document.getElementById('resetAppBtn');
if(resetBtn){
    resetBtn.addEventListener('click', () => {
        if(confirm("WARNING: This will delete ALL books and borrow requests. Are you sure?")){
            localStorage.removeItem('books');
            localStorage.removeItem('borrows');
            alert("Application data reset.");
            window.location.reload();
        }
    });
}

/* ---------- INIT PAGES ---------- */
if(localStorage.getItem("currentUser")) {
    if(document.getElementById("auth")) { loadApp(); } // If on index and logged in
    renderMembers(); // Try rendering members if on members page
}
