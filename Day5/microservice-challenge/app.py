from flask import Flask, jsonify, request
import sqlite3
import hashlib

app = Flask(__name__)
DB_PATH = 'bookshelf.db'


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            author TEXT,
            isbn TEXT,
            status TEXT DEFAULT 'unread',
            rating INTEGER,
            notes TEXT,
            added_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    ''')
    conn.commit()
    conn.close()


# ─── AUTH ───

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    # ISSUE: MD5 is insecure for password hashing
    hashed = hashlib.md5(password.encode()).hexdigest()

    conn = get_db()
    try:
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)',
                     (username, hashed))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username already exists'}), 409
    finally:
        conn.close()

    return jsonify({'message': 'User created', 'username': username}), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    hashed = hashlib.md5(password.encode()).hexdigest()

    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?',
                        (username, hashed)).fetchone()
    conn.close()

    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    # ISSUE: No actual session/token — just returns user_id (no auth on other routes)
    return jsonify({'message': 'Login successful', 'user_id': user['id']})


# ─── BOOKS ───

@app.route('/api/books', methods=['GET'])
def list_books():
    # ISSUE: No authentication check — any user can see all books
    user_id = request.args.get('user_id')
    status = request.args.get('status')

    conn = get_db()
    query = 'SELECT * FROM books WHERE 1=1'
    params = []

    if user_id:
        query += f' AND user_id = {user_id}'  # ISSUE: SQL injection
    if status:
        query += ' AND status = ?'
        params.append(status)

    books = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(b) for b in books])


@app.route('/api/books', methods=['POST'])
def add_book():
    data = request.get_json()
    user_id = data.get('user_id')
    title = data.get('title')

    if not title:
        return jsonify({'error': 'Title required'}), 400

    # ISSUE: No validation on rating range
    rating = data.get('rating')

    conn = get_db()
    cursor = conn.execute(
        'INSERT INTO books (user_id, title, author, isbn, status, rating, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        (user_id, title, data.get('author'), data.get('isbn'),
         data.get('status', 'unread'), rating, data.get('notes'))
    )
    book_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({'id': book_id, 'title': title}), 201


@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.get_json()
    conn = get_db()

    # ISSUE: No ownership check — anyone can update any book
    fields = []
    params = []
    for key in ('title', 'author', 'isbn', 'status', 'rating', 'notes'):
        if key in data:
            fields.append(f'{key} = ?')
            params.append(data[key])

    if not fields:
        return jsonify({'error': 'No fields to update'}), 400

    params.append(book_id)
    conn.execute(f'UPDATE books SET {", ".join(fields)} WHERE id = ?', params)
    conn.commit()

    book = conn.execute('SELECT * FROM books WHERE id = ?', (book_id,)).fetchone()
    conn.close()

    if not book:
        return jsonify({'error': 'Book not found'}), 404

    return jsonify(dict(book))


@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    conn = get_db()
    # ISSUE: No check if book exists before deleting
    conn.execute('DELETE FROM books WHERE id = ?', (book_id,))
    conn.commit()
    conn.close()
    return jsonify({'deleted': True})


@app.route('/api/books/search', methods=['GET'])
def search_books():
    q = request.args.get('q', '')
    conn = get_db()
    # ISSUE: SQL injection via string formatting
    books = conn.execute(
        f"SELECT * FROM books WHERE title LIKE '%{q}%' OR author LIKE '%{q}%'"
    ).fetchall()
    conn.close()
    return jsonify([dict(b) for b in books])


@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_db()
    total = conn.execute('SELECT COUNT(*) as c FROM books').fetchone()['c']
    read = conn.execute("SELECT COUNT(*) as c FROM books WHERE status = 'read'").fetchone()['c']
    avg_rating = conn.execute('SELECT AVG(rating) as avg FROM books WHERE rating IS NOT NULL').fetchone()['avg']
    conn.close()

    return jsonify({
        'total_books': total,
        'books_read': read,
        'books_unread': total - read,  # ISSUE: ignores 'reading' status
        'average_rating': round(avg_rating, 1) if avg_rating else None,
        'completion_rate': round(read / total * 100, 1) if total else 0,
    })


if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5001)  # ISSUE: debug=True in production
