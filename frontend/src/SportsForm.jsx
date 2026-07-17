import { useState } from 'react';
import api from './api/axiosConfig';

function SportsForm({ onSportsItemAdded }) {
    const [type, setType] = useState('FOOTBALL');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState(0.0);
    const [teamName, setTeamName] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [size, setSize] = useState('');
    const [officialMerch, setOfficialMerch] = useState(false);
    const [accessoryType, setAccessoryType] = useState('');
    const [color, setColor] = useState('');
    const [material, setMaterial] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // 'sports_type' matches the @JsonTypeInfo property in your Java backend
        let newItem = {
            sports_type: type,
            brand,
            category,
            price: parseFloat(price)
        };

        if (type === 'FOOTBALL') {
            newItem = { ...newItem, teamName, playerName, size, officialMerch };
        } else if (type === 'ACCESSORY') {
            newItem = { ...newItem, accessoryType, color, material };
        }

        // Uses the centralized api instance — the Authorization header
        // is attached automatically by the Axios Request Interceptor.
        api.post('/rest/sports', newItem)
            .then(response => {
                alert('Sports Item Saved!');
                onSportsItemAdded(response.data); // Axios puts the body in .data
            })
            .catch(err => {
                console.error('🔴 Error:', err);
                alert('Unauthorized: You do not have permission to add sports items.');
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid #6f42c1', padding: '20px' }}>
            <h3>Add New Sports Item</h3>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="FOOTBALL">⚽ Football Item</option>
                <option value="ACCESSORY">🧢 Accessory</option>
            </select>
            <input placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
            <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
            <input type="number" step="0.01" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />

            {type === 'FOOTBALL' && (
                <div>
                    <input placeholder="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
                    <input placeholder="Player Name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
                    <input placeholder="Size" value={size} onChange={(e) => setSize(e.target.value)} required />
                    <label>
                        <input type="checkbox" checked={officialMerch} onChange={(e) => setOfficialMerch(e.target.checked)} />
                        Official Merch
                    </label>
                </div>
            )}

            {type === 'ACCESSORY' && (
                <div>
                    <input placeholder="Accessory Type" value={accessoryType} onChange={(e) => setAccessoryType(e.target.value)} required />
                    <input placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} required />
                    <input placeholder="Material" value={material} onChange={(e) => setMaterial(e.target.value)} required />
                </div>
            )}
            <button type="submit">Save Sports Item</button>
        </form>
    );
}

export default SportsForm;