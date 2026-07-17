import { useState } from 'react';
import { useAuth } from './provider/AuthProvider';

function SportsItem({ id, sports_type, brand, category, price, teamName, playerName, size, officialMerch, accessoryType, color, material, onDelete, onUpdate }) {
    const { isAdmin } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const [tempBrand, setTempBrand] = useState(brand);
    const [tempCategory, setTempCategory] = useState(category);
    const [tempPrice, setTempPrice] = useState(price);
    const [tempTeamName, setTempTeamName] = useState(teamName || '');
    const [tempPlayerName, setTempPlayerName] = useState(playerName || '');
    const [tempSize, setTempSize] = useState(size || '');
    const [tempOfficialMerch, setTempOfficialMerch] = useState(officialMerch || false);
    const [tempAccessoryType, setTempAccessoryType] = useState(accessoryType || '');
    const [tempColor, setTempColor] = useState(color || '');
    const [tempMaterial, setTempMaterial] = useState(material || '');

    const handleSave = () => {
        let updated = {
            sports_type,
            brand: tempBrand,
            category: tempCategory,
            price: parseFloat(tempPrice)
        };

        if (sports_type === 'FOOTBALL') {
            updated = { ...updated, teamName: tempTeamName, playerName: tempPlayerName, size: tempSize, officialMerch: tempOfficialMerch };
        } else if (sports_type === 'ACCESSORY') {
            updated = { ...updated, accessoryType: tempAccessoryType, color: tempColor, material: tempMaterial };
        }

        onUpdate(id, updated);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div style={{ border: '2px solid orange', margin: '10px 0', padding: '15px', borderRadius: '8px', backgroundColor: '#fffdf5' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input placeholder="Brand" style={{ flex: 1 }} value={tempBrand} onChange={(e) => setTempBrand(e.target.value)} />
                    <input placeholder="Category" style={{ flex: 1 }} value={tempCategory} onChange={(e) => setTempCategory(e.target.value)} />
                    <input type="number" step="0.01" style={{ width: '90px' }} value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />
                </div>

                {sports_type === 'FOOTBALL' && (
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                        <input placeholder="Team" style={{ flex: 1 }} value={tempTeamName} onChange={(e) => setTempTeamName(e.target.value)} />
                        <input placeholder="Player" style={{ flex: 1 }} value={tempPlayerName} onChange={(e) => setTempPlayerName(e.target.value)} />
                        <input placeholder="Size" style={{ width: '80px' }} value={tempSize} onChange={(e) => setTempSize(e.target.value)} />
                        <label style={{ whiteSpace: 'nowrap' }}>
                            <input type="checkbox" checked={tempOfficialMerch} onChange={(e) => setTempOfficialMerch(e.target.checked)} />
                            Official
                        </label>
                    </div>
                )}

                {sports_type === 'ACCESSORY' && (
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input placeholder="Accessory Type" style={{ flex: 1 }} value={tempAccessoryType} onChange={(e) => setTempAccessoryType(e.target.value)} />
                        <input placeholder="Color" style={{ flex: 1 }} value={tempColor} onChange={(e) => setTempColor(e.target.value)} />
                        <input placeholder="Material" style={{ flex: 1 }} value={tempMaterial} onChange={(e) => setTempMaterial(e.target.value)} />
                    </div>
                )}

                <button onClick={handleSave} style={{ backgroundColor: '#28a745', color: 'white', marginRight: '5px' }}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
        );
    }

    return (
        <div style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
            <div>
                <h3>{brand} - {sports_type === 'FOOTBALL' ? 'Football' : accessoryType} ({category})</h3>
                <p>Price: ${Number(price).toFixed(2)}</p>
                {sports_type === 'FOOTBALL' && (
                    <p>Team: {teamName} | Player: {playerName} | Size: {size} {officialMerch ? '| ✅ Official' : ''}</p>
                )}
                {sports_type === 'ACCESSORY' && (
                    <p>Type: {accessoryType} | Color: {color} | Material: {material}</p>
                )}
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

export default SportsItem;