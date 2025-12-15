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
const themes = [{name:"Blue", class:"blue"},{name:"Green", class:"green"},{name:"Purple", class:"purple"}];
let themeIndex = parseInt(localStorage.getItem("theme")) || 0;

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
const themeBtn = document.getElementById("themeBtn");
const themeNameEl = document.getElementById("themeName");

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
  document.getElementById("auth").remove();
  app.classList.remove("hidden");
  const user = JSON.parse(localStorage.getItem("currentUser"));
  adminPanel.style.display = user.role==="admin"?"block":"none";
  userBorrowsSection.style.display = user.role==="user"?"block":"none";
  renderBooks();
  renderRequests();
  renderUserBorrows();
}

/* ---------- LOGOUT ---------- */
document.getElementById("logout").onclick = ()=>{ localStorage.removeItem("currentUser"); location.reload(); };

/* ---------- THEME BUTTON ---------- */
function applyTheme(index){
  document.body.classList.remove("blue","green","purple");
  document.body.classList.add(themes[index].class);
  themeNameEl.innerText = themes[index].name;
  localStorage.setItem("theme",index);
}
themeBtn.addEventListener("click",()=>{ themeIndex=(themeIndex+1)%themes.length; applyTheme(themeIndex); });
applyTheme(themeIndex);

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
    const div=document.createElement("div");
    div.className="book";
    div.innerHTML=`
      <b>${book?.title}</b><br>${book?.author}<br>Status: <span class="badge ${b.status}">${b.status}</span>
    `;
    userRequestsBox.appendChild(div);
  });
}

/* ---------- UPDATE BORROW STATUS ADMIN ---------- */
function updateBorrow(id,status){
  let borrows=JSON.parse(localStorage.getItem("borrows"))||[];
  borrows=borrows.map(b=>b.id===id?{...b,status}:b);
  localStorage.setItem("borrows",JSON.stringify(borrows));
  renderRequests();
  renderUserBorrows();
}

/* ---------- AUTO LOGIN ---------- */
if(localStorage.getItem("currentUser")) loadApp();
