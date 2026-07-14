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
import { ProtectedRoute } from './routes/ProtectedRoute';
import './App.css';

function App() {
    const { token, setToken, isAdmin, logout } = useAuth();

    const [books, setBooks] = useState([]);
    const [magazines, setMagazines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');

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
            console.error('Handshake Network Error:', err);
        }
    };

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
            .then(res => {
                setMagazines(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching magazines:', err);
                setLoading(false);
            });
    }, [token]);

    const handleAddBook = (newBook) => setBooks([...books, newBook]);
    const handleDeleteBook = (id) => {
        if (!window.confirm('Delete this book?')) return;
        api.delete(`/rest/books/${id}`)
            .then(() => setBooks(books.filter(b => b.id !== id)))
            .catch(err => alert('Only Admins can delete.'));
    };
    const handleUpdateBook = (id, data) => {
        api.put(`/rest/books/${id}`, data)
            .then(res => setBooks(books.map(b => (b.id === id ? res.data : b))))
            .catch(err => alert('Update failed.'));
    };

    const handleAddMagazine = (newMagazine) => setMagazines([...magazines, newMagazine]);
    const handleDeleteMagazine = (id) => {
        if (!window.confirm('Delete this magazine?')) return;
        api.delete(`/rest/magazines/${id}`)
            .then(() => setMagazines(magazines.filter(m => m.id !== id)))
            .catch(err => alert('Only Admins can delete.'));
    };
    const handleUpdateMagazine = (id, data) => {
        api.put(`/rest/magazines/${id}`, data)
            .then(res => setMagazines(magazines.map(m => (m.id === id ? res.data : m))))
            .catch(err => alert('Update failed.'));
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}><h2>Connecting to RSA Server...</h2></div>;
    }

    if (!token) {
        return (
            <div className="login-container" style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>DigitalReads Login (RSA)</h1>
                <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Username:</label><br />
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '8px', width: '250px' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Password:</label><br />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '8px', width: '250px' }} />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Get RSA Token
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <Navbar username={username} onLogout={logout} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/inventory" element={
                        <div>
                            <h1>📚 Book Inventory</h1>
                            <p>Role: <strong>{isAdmin ? 'Administrator' : 'User'}</strong></p>
                            {books.map(b => <Book key={b.id} {...b} onDelete={handleDeleteBook} onUpdate={handleUpdateBook} />)}
                        </div>
                    } />
                    <Route path="/add" element={<BookForm onBookAdded={handleAddBook} />} />
                    <Route path="/magazines" element={
                        <div>
                            <h1>📰 Magazine Inventory</h1>
                            {magazines.map(m => <Magazine key={m.id} {...m} onDelete={handleDeleteMagazine} onUpdate={handleUpdateMagazine} />)}
                        </div>
                    } />
                    <Route path="/add-magazine" element={<MagazineForm onMagazineAdded={handleAddMagazine} />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;