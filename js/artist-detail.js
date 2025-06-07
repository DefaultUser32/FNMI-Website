// Parse query parameter
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const artistId = getQueryParam('id');
const artist = (typeof artists !== 'undefined') ? artists.find(a => a.id === artistId) : null;

if (artist) {
    document.querySelector('.artist-detail-image').src = artist.image;
    document.querySelector('.artist-detail-image').alt = artist.name;
    document.querySelector('.artist-detail-name').textContent = artist.name;
    document.querySelector('.artist-detail-origin').textContent = artist.origin;
} else {
    document.querySelector('.artist-detail-content').innerHTML = '<h2>Artist not found</h2>';
} 