const YOUTUBE_API_KEY = 'AIzaSyCP7BuGix08_CyAGqg5rm-wU4b7vY9ajVY';
const GIPHY_API_KEY = '2rpNW4nXURk2K4MrhZ83JnDl9f8zbzlN';

document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

async function performSearch() {
    const searchTerm = document.getElementById('searchInput').value;
    const platform = document.getElementById('platformSelect').value;
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = 'Loading...';

    try {
        if (platform === 'youtube') {
            const data = await searchYouTube(searchTerm);
            displayYouTubeResults(data);
        } else if (platform === 'reddit') {
            const data = await searchReddit(searchTerm);
            displayRedditResults(data);
        } else if (platform === 'giphy') {
            const data = await searchGiphy(searchTerm);
            displayGiphyResults(data);
        }
    } catch (error) {
        resultsContainer.innerHTML = `Error: ${error.message}`;
    }
}

async function searchYouTube(query) {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    return data.items;
}

function displayYouTubeResults(items) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = items.map(item => `
        <div class="result-card">
            <h3>${item.snippet.title}</h3>
            <p>${item.snippet.description}</p>
            <a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">Watch Video</a>
        </div>
    `).join('');
}

async function searchReddit(query) {
    const response = await fetch(
        `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=10`
    );
    const data = await response.json();
    return data.data.children;
}

function displayRedditResults(posts) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = posts.map(post => `
        <div class="result-card">
            <h3>${post.data.title}</h3>
            <p>Subreddit: ${post.data.subreddit}</p>
            <a href="${post.data.url}" target="_blank">View Post</a>
        </div>
    `).join('');
}

async function searchGiphy(query) {
    const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=10`
    );
    const data = await response.json();
    return data.data;
}

function displayGiphyResults(gifs) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = gifs.map(gif => `
        <div class="result-card">
            <img src="${gif.images.fixed_height.url}" alt="${gif.title}" class="giphy-image">
            <a href="${gif.url}" target="_blank">View on Giphy</a>
        </div>
    `).join('');
}