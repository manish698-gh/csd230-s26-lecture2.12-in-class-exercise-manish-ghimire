import { useState } from 'react';
import api from './api/axiosConfig';  // ← Import the Axios instance

function BookForm({ onBookAdded }) {
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

        // Use api.post instead of fetch - Axios automatically adds the token!
        api.post('/rest/books', newBook)
            .then(response => {
                alert('Book Saved to RSA-Secured Database!');
                onBookAdded(response.data);  // Axios returns data in .data property
                setTitle('');
                setAuthor('');
                setPrice(0.0);
            })
            .catch(err => {
                console.error('Save Error:', err);
                alert('Unauthorized: You do not have permission to add books.');
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid blue', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
            <h3>Add New Book (Secured via Axios)</h3>
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
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    style={{ padding: '8px', flex: '1' }}
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
                    Save to Backend
                </button>
            </div>
        </form>
    );
}

export default BookForm;