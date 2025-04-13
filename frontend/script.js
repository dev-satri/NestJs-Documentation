const API_BASE = 'http://localhost:3000/books';

const form = document.getElementById('bookForm');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const yearInput = document.getElementById('year');
const list = document.getElementById('bookList');

let editingId = null;

// Load all books
async function loadBooks() {
    const res = await fetch(`${API_BASE}/all`);
    const books = await res.json();

    list.innerHTML = '';
    books.forEach(book => {
        const li = document.createElement('li');
        li.innerHTML = `
      <div>
        <strong>${book.title}</strong> by ${book.author} (${book.publishedYear})
      </div>
      <div class="actions">
        <button onclick="editBook('${book._id}', '${book.title}', '${book.author}', ${book.publishedYear})">Edit</button>
        <button onclick="deleteBook('${book._id}')">Delete</button>
      </div>
    `;
        list.appendChild(li);
    });
}

// Submit form - Create or Update
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const book = {
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        publishedYear: parseInt(yearInput.value.trim())
    };

    if (editingId) {
        await fetch(`${API_BASE}/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
        editingId = null;
    } else {
        await fetch(`${API_BASE}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
    }

    form.reset();
    loadBooks();
});

// Edit book
function editBook(id, title, author, year) {
    titleInput.value = title;
    authorInput.value = author;
    yearInput.value = year;
    editingId = id;
}

// Delete book
async function deleteBook(id) {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    loadBooks();
}

// Initial load
loadBooks();
