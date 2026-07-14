import { useState } from 'react';
import { useAuth } from './provider/AuthProvider';

function Magazine({ id, title, price, copies, issueNumber, onDelete, onUpdate }) {
    const { isAdmin } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(title);
    const [tempPrice, setTempPrice] = useState(price);
    const [tempCopies, setTempCopies] = useState(copies);
    const [tempIssueNumber, setTempIssueNumber] = useState(issueNumber);

    const handleSave = () => {
        const updatedMagazine = {
            title: tempTitle,
            price: parseFloat(tempPrice),
            copies: parseInt(tempCopies),
            issueNumber: parseInt(tempIssueNumber)
        };
        onUpdate(id, updatedMagazine);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="magazine-row editing" style={{ border: '2px solid orange', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', backgroundColor: '#fffdf5' }}>
                <input style={{ flex: 2, padding: '5px' }} type="text" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} placeholder="Title" />
                <input style={{ width: '80px', padding: '5px' }} type="number" step="0.01" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} placeholder="Price" />
                <input style={{ width: '80px', padding: '5px' }} type="number" value={tempCopies} onChange={(e) => setTempCopies(e.target.value)} placeholder="Copies" />
                <input style={{ width: '80px', padding: '5px' }} type="number" value={tempIssueNumber} onChange={(e) => setTempIssueNumber(e.target.value)} placeholder="Issue #" />
                <button onClick={handleSave} style={{ backgroundColor: '#28a745', color: 'white', cursor: 'pointer' }}>Save</button>
                <button onClick={() => setIsEditing(false)} style={{ cursor: 'pointer' }}>Cancel</button>
            </div>
        );
    }

    return (
        <div className="magazine-row" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
            <div className="magazine-info">
                <h3>{title}</h3>
                <p><strong>Issue:</strong> #{issueNumber} | <strong>Price:</strong> ${Number(price).toFixed(2)} | <strong>Copies:</strong> {copies}</p>
            </div>
            {/* RBAC: Only show Edit/Delete buttons if user is Admin */}
            {isAdmin && (
                <div className="magazine-actions">
                    <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#ffc107', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => onDelete(id)} style={{ backgroundColor: '#ff4444', color: 'white', cursor: 'pointer' }}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default Magazine;