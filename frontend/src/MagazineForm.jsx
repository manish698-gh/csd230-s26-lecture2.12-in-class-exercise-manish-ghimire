import { useState } from 'react';
import api from './api/axiosConfig';

function MagazineForm({ onMagazineAdded }) {  // Remove 'token' prop
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(0.0);
    const [copies, setCopies] = useState(10);
    const [issueNumber, setIssueNumber] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMagazine = {
            title,
            price: parseFloat(price),
            copies: parseInt(copies),
            issueNumber: parseInt(issueNumber)
        };

        // Use api.post instead of fetch - Axios automatically adds the token!
        api.post('/rest/magazines', newMagazine)
            .then(response => {
                alert('Magazine Saved!');
                onMagazineAdded(response.data);
                setTitle('');
                setPrice(0.0);
                setCopies(10);
                setIssueNumber(1);
            })
            .catch(err => {
                console.error('Save Error:', err);
                alert('Unauthorized: You do not have permission to add magazines.');
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid green', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
            <h3>Add New Magazine (Secured via Axios)</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ padding: '8px', flex: '2' }}
                />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    style={{ padding: '8px', width: '100px' }}
                />
                <input
                    type="number"
                    placeholder="Copies"
                    value={copies}
                    onChange={(e) => setCopies(e.target.value)}
                    required
                    style={{ padding: '8px', width: '80px' }}
                />
                <input
                    type="number"
                    placeholder="Issue #"
                    value={issueNumber}
                    onChange={(e) => setIssueNumber(e.target.value)}
                    required
                    style={{ padding: '8px', width: '80px' }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '8px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Save Magazine
                </button>
            </div>
        </form>
    );
}

export default MagazineForm;