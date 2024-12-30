let urls = JSON.parse(localStorage.getItem('urls')) || [];
let lastRandomIndex = -1;  // Keep track of the last picked index

// Add URL to the list
function addUrl() {
    const input = document.getElementById('urlInput');
    const url = input.value.trim();

    if (url) {
        urls.push(url);
        input.value = '';
        saveUrls();
        renderUrlList();
    } else {
        alert("Please enter a valid URL or text.");
    }
}

// Save URLs to Local Storage
function saveUrls() {
    localStorage.setItem('urls', JSON.stringify(urls));
}

// Render the list below the input
function renderUrlList() {
    const urlListContainer = document.getElementById('urlListContainer');

    if (urls.length === 0) {
        urlListContainer.innerHTML = "<p>No URLs added yet.</p>";
        return;
    }

    urlListContainer.innerHTML = urls.map((url, index) => `
        <li class="url-item">
            <a href="${validateUrl(url)}" target="_blank">${url}</a>
            <button onclick="removeUrl(${index})">Remove</button>
        </li>
    `).join('');
}

// Remove URL with Confirmation Prompt
function removeUrl(index) {
    const urlToRemove = urls[index];  
    const confirmation = confirm(`Are you sure you want to remove this URL?\n\n${urlToRemove}`);

    if (confirmation) {
        urls.splice(index, 1);  
        saveUrls();
        renderUrlList();
    }
}

// Pick a Random URL
function pickRandomUrl() {
    if (urls.length === 0) {
        document.getElementById('output').innerHTML = "No URLs available.";
        return;
    }
    
    let randomIndex;
    // Ensure the new random index is different from the last one
    do {
        randomIndex = Math.floor(Math.random() * urls.length);
    } while (randomIndex === lastRandomIndex);

    const selectedUrl = urls[randomIndex];
    lastRandomIndex = randomIndex;  // Update the last picked index

    document.getElementById('output').innerHTML = `
        <a href="${validateUrl(selectedUrl)}" target="_blank">${selectedUrl}</a>
    `;
}

// Export URLs as JSON with a Custom Filename
function exportUrls() {
    const fileName = prompt("Enter a name for your export file (without extension):", "urls");
    
    if (!fileName) {
        alert("Export cancelled.");
        return;
    }

    const dataStr = JSON.stringify(urls);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.json`;  
    a.click();
    URL.revokeObjectURL(url);
}

// Import and Merge URLs from JSON (Resets Input After Import)
function importUrls(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const importedUrls = JSON.parse(e.target.result);
        urls = [...new Set([...urls, ...importedUrls])];
        saveUrls();
        renderUrlList();
        
        event.target.value = null;  // Reset file input
    };

    reader.readAsText(file);
}

// Validate and Format URLs
function validateUrl(url) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return 'https://' + url;
}

// Initial Render (Ensure saved data loads)
renderUrlList();

