document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value.trim();
    const resultsContainer = document.getElementById('search-results');

    // Clear previous results
    resultsContainer.innerHTML = '';

    if (!query) {
        resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }

    try {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`https://openlibrary.org/search.json?title=${encodedQuery}&limit=25`,);
        if (!response.ok) {
            throw new Error('Failed to fetch results');
        }
        const data = await response.json();
        console.log('Full API Response:', data);

        if (data.docs && data.docs.length > 0) {
            for (const book of data.docs) {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                try {
                    const bookDetailsResponse = await fetch(`http://localhost:3000/proxy?url=https://openlibrary.org${book.key}.json`);
                    const bookDetails = await bookDetailsResponse.json();

                    const description = bookDetails.description
                        ? (typeof bookDetails.description === 'string' ? bookDetails.description : bookDetails.description.value)
                        : 'No description available';
                    const coverId = book.cover_i || bookDetails.covers?.[0];
                    const coverImage = coverId
                        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
                        : 'https://via.placeholder.com/150?text=No+Cover';
                    resultItem.innerHTML = `
                        <img src="${coverImage}" alt="${book.title} Cover" style="width:100px;height:auto;">
                        <h3>${book.title}</h3>
                        <p><strong>Author:</strong> ${book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
                        <p><strong>First Published:</strong> ${book.first_publish_year || 'N/A'}</p>
                        <p><strong>Description:</strong> ${description}</p>`;
                } catch (error) {
                    console.error(`Error fetching details for ${book.title}:`, error.message);
                    resultItem.innerHTML = `<p>Error fetching details for ${book.title}</p>`;
                }
                resultsContainer.appendChild(resultItem);
            }
        } else {
            resultsContainer.innerHTML = '<p>No results found.</p>';
        }
    } catch (error) {
        resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});