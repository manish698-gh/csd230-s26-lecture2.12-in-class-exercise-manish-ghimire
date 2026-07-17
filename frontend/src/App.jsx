import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router';
import { useAuth } from './provider/AuthProvider';
import api from './api/axiosConfig';
import Navbar from './Navbar';
import Home from './Home';
import Book from './Book';
import BookForm from './BookForm';
import Magazine from './Magazine';
import MagazineForm from './MagazineForm';
import SportsItem from './SportsItem';
import SportsForm from './SportsForm';
import { ProtectedRoute } from './routes/ProtectedRoute';
import './App.css';

function App() {
    const { token, setToken, isAdmin, logout } = useAuth();

    const [books, setBooks] = useState([]);
    const [magazines, setMagazines] = useState([]);
    const [sportsItems, setSportsItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');

    // ===== 1. HANDSHAKE =====
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
                const jwt = data.token || data.jwt || data.accessToken || data.access_token;

                if (!jwt) {
                    alert("Server did not return a token");
                    return;
                }

                setToken(jwt); // Goes through AuthProvider — writes to localStorage AND decodes role
            } else {
                alert('Login Failed. Check credentials.');
            }
        } catch (err) {
            console.error('Login Error:', err);
            alert('Network error. Is the backend running?');
        }
    };

    // ===== 2. READ — via the centralized api instance (auto-attaches token) =====
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);

        api.get('/rest/books')
            .then(res => setBooks(res.data))
            .catch(err => console.error('Error fetching books:', err));

        api.get('/rest/magazines')
            .then(res => setMagazines(res.data))
            .catch(err => console.error('Error fetching magazines:', err));

        api.get('/rest/sports')
            .then(res => {
                setSportsItems(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching sports items:', err);
                setLoading(false);
            });

    }, [token]);

    // ===== 3. BOOK CRUD =====
    const handleAddBook = (newBook) => setBooks([...books, newBook]);

    const handleDeleteBook = (id) => {
        if (!window.confirm('Delete this book?')) return;
        api.delete(`/rest/books/${id}`)
            .then(() => setBooks(books.filter(b => b.id !== id)))
            .catch(() => alert('Only admins can delete books.'));
    };

    const handleUpdateBook = (id, data) => {
        api.put(`/rest/books/${id}`, data)
            .then(response => setBooks(books.map(b => (b.id === id ? response.data : b))))
            .catch(() => alert('Update failed.'));
    };

    // ===== 4. MAGAZINE CRUD =====
    const handleAddMagazine = (newMagazine) => setMagazines([...magazines, newMagazine]);

    const handleDeleteMagazine = (id) => {
        if (!window.confirm('Delete this magazine?')) return;
        api.delete(`/rest/magazines/${id}`)
            .then(() => setMagazines(magazines.filter(m => m.id !== id)))
            .catch(() => alert('Only admins can delete magazines.'));
    };

    const handleUpdateMagazine = (id, data) => {
        api.put(`/rest/magazines/${id}`, data)
            .then(response => setMagazines(magazines.map(m => (m.id === id ? response.data : m))))
            .catch(() => alert('Update failed.'));
    };

    // ===== 5. SPORTS CRUD =====
    const handleAddSportsItem = (newItem) => setSportsItems([...sportsItems, newItem]);

    const handleDeleteSportsItem = (id) => {
        if (!window.confirm('Delete this sports item?')) return;
        api.delete(`/rest/sports/${id}`)
            .then(() => setSportsItems(sportsItems.filter(item => item.id !== id)))
            .catch(() => alert('Only admins can delete sports items.'));
    };

    const handleUpdateSportsItem = (id, data) => {
        api.put(`/rest/sports/${id}`, data)
            .then(response => setSportsItems(sportsItems.map(item => (item.id === id ? response.data : item))))
            .catch(() => alert('Update failed.'));
    };

    // ===== RENDER LOGIC =====
    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Connecting to DigitalReads RSA Server...</h2>
            </div>
        );
    }

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
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        🔑 Get RSA Token
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '15px', color: '#666' }}>Default: admin / admin</p>
            </div>
        );
    }

    return (
        <div className="app-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <Navbar username={username} onLogout={logout} />

            <Routes>
                <Route path="/" element={<Home />} />

                <Route element={<ProtectedRoute />}>

                    <Route path="/inventory" element={
                        <div className="book-list">
                            <h1>📚 Book Inventory</h1>
                            <p>Role: <strong>{isAdmin ? "Administrator" : "User"}</strong></p>
                            <p>{books.length} book{books.length !== 1 ? 's' : ''} in stock</p>
                            {books.map((b) => (
                                <Book key={b.id} {...b} onDelete={handleDeleteBook} onUpdate={handleUpdateBook} />
                            ))}
                        </div>
                    } />

                    <Route path="/add" element={<BookForm onBookAdded={handleAddBook} />} />

                    <Route path="/magazines" element={
                        <div className="magazine-list">
                            <h1>📰 Magazine Inventory</h1>
                            <p>{magazines.length} magazine{magazines.length !== 1 ? 's' : ''} in stock</p>
                            {magazines.map((m) => (
                                <Magazine key={m.id} {...m} onDelete={handleDeleteMagazine} onUpdate={handleUpdateMagazine} />
                            ))}
                        </div>
                    } />

                    <Route path="/add-magazine" element={<MagazineForm onMagazineAdded={handleAddMagazine} />} />

                    <Route path="/sports" element={
                        <div className="sports-list">
                            <h1>⚽ Sports Inventory</h1>
                            <p>{sportsItems.length} item{sportsItems.length !== 1 ? 's' : ''} in stock</p>
                            {sportsItems.map((item) => (
                                <SportsItem key={item.id} {...item} onDelete={handleDeleteSportsItem} onUpdate={handleUpdateSportsItem} />
                            ))}
                        </div>
                    } />

                    <Route path="/add-sports" element={<SportsForm onSportsItemAdded={handleAddSportsItem} />} />

                </Route>
            </Routes>
        </div>
    );
}

export default App;