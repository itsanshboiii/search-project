const YOUTUBE_API_KEY = "AIzaSyCP7BuGix08_CyAGqg5rm-wU4b7vY9ajVY";
const GIPHY_API_KEY = "2rpNW4nXURk2K4MrhZ83JnDl9f8zbzlN";
let selectedPlatform = "youtube";
const searchButton = document.querySelector(".search-button");

const toggleSwitch = document.querySelector("#checkbox");
toggleSwitch.addEventListener("change", switchTheme);

function switchTheme(e) {
  document.documentElement.setAttribute(
    "data-theme",
    e.target.checked ? "dark" : "light"
  );
}

document
  .getElementById("searchInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") performSearch();
  });

function selectPlatform(platform) {
  selectedPlatform = platform;
  document.querySelectorAll(".platform-button").forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.platform === platform);
  });
}

async function performSearch() {
  const searchTerm = document.getElementById("searchInput").value;
  const resultsContainer = document.getElementById("results");

  searchButton.classList.add("loading");
  resultsContainer.innerHTML = '<div class="loading">Searching...</div>';

  try {
    let data;
    if (selectedPlatform === "youtube") {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
          searchTerm
        )}&key=${YOUTUBE_API_KEY}`
      );
      data = await response.json();
      displayYouTubeResults(data.items);
    } else if (selectedPlatform === "reddit") {
      const response = await fetch(
        `https://www.reddit.com/search.json?q=${encodeURIComponent(
          searchTerm
        )}&limit=10`
      );
      data = await response.json();
      displayRedditResults(data.data.children);
    } else if (selectedPlatform === "giphy") {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
          searchTerm
        )}&limit=10`
      );
      data = await response.json();
      displayGiphyResults(data.data);
    }
  } catch (error) {
    resultsContainer.innerHTML = `
                    <div class="error">
                        ⚠️ Error: ${error.message}
                    </div>
                `;
  } finally {
    searchButton.classList.remove("loading");
  }
}

function displayYouTubeResults(items) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = items
    .map(
      (item, index) => `
                <div class="result-card" style="animation-delay: ${
                  index * 0.1
                }s">
                    <h3>${item.snippet.title}</h3>
                    <p>${item.snippet.description}</p>
                    <a href="https://www.youtube.com/watch?v=${
                      item.id.videoId
                    }" target="_blank">
                        Watch Video →
                    </a>
                </div>
            `
    )
    .join("");
}

function displayRedditResults(posts) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = posts
    .map(
      (post, index) => `
                <div class="result-card" style="animation-delay: ${
                  index * 0.1
                }s">
                    <h3>${post.data.title}</h3>
                    <p>r/${post.data.subreddit}</p>
                    <a href="${post.data.url}" target="_blank">
                        View Post →
                    </a>
                </div>
            `
    )
    .join("");
}

function displayGiphyResults(gifs) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = gifs
    .map(
      (gif, index) => `
                <div class="result-card" style="animation-delay: ${
                  index * 0.1
                }s">
                    <img src="${gif.images.fixed_height.url}" alt="${
        gif.title
      }" class="giphy-image">
                    <a href="${gif.url}" target="_blank">
                        View on Giphy →
                    </a>
                </div>
            `
    )
    .join("");
}

selectPlatform("youtube");
