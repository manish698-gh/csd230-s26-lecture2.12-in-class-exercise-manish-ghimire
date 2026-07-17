import { Link } from 'react-router';

function Navbar({ username, onLogout }) {
    return (
        <nav style={{
            padding: '1rem',
            backgroundColor: '#222',
            color: 'white',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '8px',
            flexWrap: 'wrap'
        }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Home</Link>
                <Link to="/inventory" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>📚 Books</Link>
                <Link to="/add" style={{ color: '#ffc107', textDecoration: 'none', fontWeight: 'bold' }}>➕ Add Book</Link>
                <Link to="/magazines" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>📰 Magazines</Link>
                <Link to="/add-magazine" style={{ color: '#ffc107', textDecoration: 'none', fontWeight: 'bold' }}>➕ Add Magazine</Link>
                <Link to="/sports" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>⚽ Sports</Link>
                <Link to="/add-sports" style={{ color: '#ffc107', textDecoration: 'none', fontWeight: 'bold' }}>➕ Add Sports</Link>
            </div>
            <div>
                <span style={{ marginRight: '15px' }}>👤 {username}</span>
                <button onClick={onLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;