const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if(!currentUser){
    window.location.href = 'index.html';
}

const welcomeMsg = document.getElementById('welcomeMsg');
welcomeMsg.textContent = `Welcome, ${currentUser.username} (${currentUser.role})`;

const logoutBtn = document.getElementById('logoutBtnTop');
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => document.body.classList.toggle('dark'));

// Books stored per user (admin sees all)
let books = JSON.parse(localStorage.getItem('books')) || [];

const bookForm = document.getElementById('bookForm');
const bookTableBody = document.getElementById('bookTableBody');
const searchInput = document.getElementById('searchInput');

function renderBooks(filter=''){
    bookTableBody.innerHTML = '';
    let visibleBooks = books;

    if(currentUser.role !== 'admin'){
        visibleBooks = books.filter(b => b.owner === currentUser.username);
    }

    visibleBooks.filter(book =>
        book.title.toLowerCase().includes(filter.toLowerCase()) ||
        book.author.toLowerCase().includes(filter.toLowerCase())
    ).forEach((book, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.year}</td>
            <td class="actions">
                <button onclick="editBook(${index})">Edit</button>
                <button onclick="deleteBook(${index})">Delete</button>
            </td>
        `;
        bookTableBody.appendChild(row);
    });
}

function saveBooks(){ localStorage.setItem('books', JSON.stringify(books)); }

bookForm.addEventListener('submit', e => {
    e.preventDefault();
    const index = document.getElementById('bookIndex').value;
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const year = document.getElementById('year').value;

    const book = {title, author, genre, year, owner: currentUser.username};

    if(index === ''){
        books.push(book);
    } else {
        books[index] = book;
    }

    saveBooks();
    renderBooks();
    bookForm.reset();
    document.getElementById('bookIndex').value = '';
});

function editBook(index){
    let book = books[index];
    if(currentUser.role !== 'admin' && book.owner !== currentUser.username) return;
    document.getElementById('bookIndex').value = index;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('genre').value = book.genre;
    document.getElementById('year').value = book.year;
}

function deleteBook(index){
    let book = books[index];
    if(currentUser.role !== 'admin' && book.owner !== currentUser.username) return;
    if(confirm('Are you sure you want to delete this book?')){
        books.splice(index,1);
        saveBooks();
        renderBooks();
    }
}

searchInput.addEventListener('input', ()=>renderBooks(searchInput.value));

renderBooks();
