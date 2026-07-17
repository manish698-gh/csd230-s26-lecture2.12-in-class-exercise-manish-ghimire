import { useState } from 'react';
import api from './api/axiosConfig';

function MagazineForm({ onMagazineAdded }) {
    const [title, setTitle] = useState('');
    const [publisher, setPublisher] = useState('');
    const [price, setPrice] = useState(0.0);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newMagazine = {
            title,
            publisher,
            price: parseFloat(price)
        };

        api.post('/rest/magazines', newMagazine)
            .then(response => {
                alert("Magazine Saved!");
                onMagazineAdded(response.data);
                setTitle(''); setPublisher(''); setPrice(0.0);
            })
            .catch(err => {
                console.error("Save Error:", err);
                alert("Unauthorized: You do not have permission to add magazines.");
            });
    };

    return (
        <div style={{ border: '2px solid blue', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
            <h3>Add New Magazine</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ flex: 2, padding: '8px' }} />
                    <input type="text" placeholder="Publisher" value={publisher} onChange={(e) => setPublisher(e.target.value)} required style={{ flex: 1, padding: '8px' }} />
                    <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100px', padding: '8px' }} />
                    <button type="submit" style={{ width: '150px', padding: '8px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                        Save to Backend
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MagazineForm;