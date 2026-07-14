import { useState } from 'react';

function BookForm({ token, onBookAdded }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState(0.0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newBook = {
            title,
            author,
            price: parseFloat(price),
            copies: 10
        };

        fetch('/api/rest/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newBook),
        })
            .then(response => {
                if(!response.ok) throw new Error('Could not save book.');
                return response.json();
            })
            .then(savedBook => {
                alert('Book Saved!');
                onBookAdded(savedBook);
                setTitle('');
                setAuthor('');
                setPrice(0.0);
            })
            .catch(err => alert(err.message));
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid blue', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
            <h3>Add New Book</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '8px', flex: '2' }} />
                <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required style={{ padding: '8px', flex: '1' }} />
                <input type="number" step="0.01" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ padding: '8px', width: '100px' }} />
                <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save to Backend</button>
            </div>
        </form>
    );
}

export default BookForm;