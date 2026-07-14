import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router';
import Navbar from './Navbar';
import Home from './Home';
import Book from './Book';
import BookForm from './BookForm';
import Magazine from './Magazine';
import MagazineForm from './MagazineForm';
import './App.css';

function App() {
  // ===== STATE =====
  const [books, setBooks] = useState([]);
  const [magazines, setMagazines] = useState([]);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== 1. HANDSHAKE - Login to get RSA Token =====
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
      } else {
        alert('Login Failed. Check credentials.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      alert('Network error. Is the backend running?');
    }
  };

  // ===== 2. READ - Fetch books and magazines when token changes =====
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);

    // Fetch Books
    fetch('/api/rest/books', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(data => {
          setBooks(data);
        })
        .catch(err => console.error('Error fetching books:', err));

    // Fetch Magazines
    fetch('/api/rest/magazines', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(data => {
          setMagazines(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching magazines:', err);
          setLoading(false);
        });
  }, [token]);

  // ===== 3. BOOK CRUD OPERATIONS =====

  // CREATE Book
  const handleAddBook = (newBook) => setBooks([...books, newBook]);

  // DELETE Book
  const handleDeleteBook = (id) => {
    if (!window.confirm('Delete this book?')) return;
    fetch(`/api/rest/books/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => {
      if (res.ok) setBooks(books.filter(b => b.id !== id));
      else alert('Delete failed. Check permissions.');
    }).catch(err => console.error('Delete error:', err));
  };

  // UPDATE Book
  const handleUpdateBook = (id, data) => {
    fetch(`/api/rest/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
        .then(res => {
          if (!res.ok) throw new Error('Update failed');
          return res.json();
        })
        .then(saved => setBooks(books.map(b => (b.id === id ? saved : b))))
        .catch(err => alert(err.message));
  };

  // ===== 4. MAGAZINE CRUD OPERATIONS =====

  // CREATE Magazine
  const handleAddMagazine = (newMagazine) => setMagazines([...magazines, newMagazine]);

  // DELETE Magazine
  const handleDeleteMagazine = (id) => {
    if (!window.confirm('Delete this magazine?')) return;
    fetch(`/api/rest/magazines/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => {
      if (res.ok) setMagazines(magazines.filter(m => m.id !== id));
      else alert('Delete failed. Check permissions.');
    }).catch(err => console.error('Delete error:', err));
  };

  // UPDATE Magazine
  const handleUpdateMagazine = (id, data) => {
    fetch(`/api/rest/magazines/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
        .then(res => {
          if (!res.ok) throw new Error('Update failed');
          return res.json();
        })
        .then(saved => setMagazines(magazines.map(m => (m.id === id ? saved : m))))
        .catch(err => alert(err.message));
  };

  // ===== RENDER LOGIC =====

  // Loading Screen
  if (loading) {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Connecting to DigitalReads RSA Server...</h2>
          <p>Loading books and magazines...</p>
        </div>
    );
  }

  // Login Screen
  if (!token) {
    return (
        <div className="login-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>📚 DigitalReads Login</h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Username</label>
              <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
            >
              🔑 Get RSA Token
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '15px', color: '#666' }}>
            Default: admin / admin
          </p>
        </div>
    );
  }

  // ===== Main App (Authenticated) =====
  return (
      <div className="app-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <Navbar username={username} onLogout={() => setToken(null)} />

        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />

          {/* Books Routes */}
          <Route path="/inventory" element={
            <div className="book-list">
              <h1>📚 Book Inventory</h1>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                {books.length} book{books.length !== 1 ? 's' : ''} in stock
              </p>
              {books.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#999' }}>No books available. Add one!</p>
              ) : (
                  books.map((b) => (
                      <Book
                          key={b.id}
                          {...b}
                          onDelete={handleDeleteBook}
                          onUpdate={handleUpdateBook}
                      />
                  ))
              )}
            </div>
          } />

          <Route path="/add" element={
            <BookForm token={token} onBookAdded={handleAddBook} />
          } />

          {/* Magazines Routes */}
          <Route path="/magazines" element={
            <div className="magazine-list">
              <h1>📰 Magazine Inventory</h1>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                {magazines.length} magazine{magazines.length !== 1 ? 's' : ''} in stock
              </p>
              {magazines.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#999' }}>No magazines available. Add one!</p>
              ) : (
                  magazines.map((m) => (
                      <Magazine
                          key={m.id}
                          {...m}
                          onDelete={handleDeleteMagazine}
                          onUpdate={handleUpdateMagazine}
                      />
                  ))
              )}
            </div>
          } />

          <Route path="/add-magazine" element={
            <MagazineForm token={token} onMagazineAdded={handleAddMagazine} />
          } />
        </Routes>
      </div>
  );
}

export default App;