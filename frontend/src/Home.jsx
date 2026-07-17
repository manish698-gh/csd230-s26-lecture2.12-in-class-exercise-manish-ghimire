import { useLocation } from 'react-router';

function Home() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isExpired = queryParams.get("expired");

    return (
        <div style={{ textAlign: "center", padding: "50px", fontFamily: "Arial, sans-serif" }}>
            <h1>Welcome to DigitalReads</h1>

            {isExpired && (
                <div style={{
                    backgroundColor: '#fff3cd',
                    color: '#856404',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #ffeeba',
                    marginBottom: '30px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}>
                    ⚠️ Security Alert: Your RSA session has expired or was invalid.
                    <br/>
                    Please log in again to restore your access.
                </div>
            )}

            <p style={{ fontSize: '1.2rem', color: '#555' }}>
                Use the navigation bar above to manage your Digital Library inventory.
            </p>
        </div>
    );
}

export default Home;