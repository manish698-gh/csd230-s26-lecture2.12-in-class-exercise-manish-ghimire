import { useState } from 'react';
import { useAuth } from './provider/AuthProvider';

function Magazine({ id, title, publisher, price, onDelete, onUpdate }) {
    const { isAdmin } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(title);
    const [tempPublisher, setTempPublisher] = useState(publisher);
    const [tempPrice, setTempPrice] = useState(price);

    const handleSave = () => {
        onUpdate(id, { title: tempTitle, publisher: tempPublisher, price: parseFloat(tempPrice) });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div style={{ border: '2px solid orange', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', backgroundColor: '#fffdf5' }}>
                <input style={{ flex: 2 }} type="text" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
                <input style={{ flex: 1 }} type="text" value={tempPublisher} onChange={(e) => setTempPublisher(e.target.value)} />
                <input style={{ width: '80px' }} type="number" step="0.01" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />
                <button onClick={handleSave} style={{ backgroundColor: '#28a745', color: 'white' }}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
        );
    }

    return (
        <div style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
            <div>
                <h3>{title}</h3>
                <p><strong>Publisher:</strong> {publisher} | <strong>Price:</strong> ${Number(price).toFixed(2)}</p>
            </div>

            {isAdmin && (
                <div>
                    <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#ffc107', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => onDelete(id)} style={{ backgroundColor: '#ff4444', color: 'white', cursor: 'pointer' }}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default Magazine;