// main.js

// 1) Protect page: if not logged in, send back to index.html
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    loadAds();  // initial unfiltered load
  }
});

// 2) Wire up Profile/Post/Logout buttons
document.getElementById('logoutBtn').addEventListener('click', () => auth.signOut());
document.getElementById('toProfile').addEventListener('click', () => alert('Iría al perfil'));
const toPostBtn = document.getElementById('toPost');
if (toPostBtn) toPostBtn.addEventListener('click', () => alert('Iría al formulario'));

// --- FILTERS SETUP ---

// 3) Hold current filter values
const filters = { location: null, maxRent: null, type: null, bedrooms: null, availability: { start: null, end: null } };

// 4) Panel toggle on button click
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key   = btn.dataset.filter;
    const panel = document.getElementById(`panel-${key}`);

    // Hide all filter panels first
    document.querySelectorAll('.filter-panel').forEach(p => p.style.display = 'none');
    
    // Show the selected panel
    panel.style.display = 'block';
  });
});

// 5) Slider update for max rent
const rentRange = document.getElementById('rent-range');
const rentValue = document.getElementById('rent-value');
rentRange.addEventListener('input', () => {
  rentValue.textContent = rentRange.value + '€';
});

// 6) Apply and Cancel Buttons for all filters
document.querySelectorAll('.apply-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.filter;
    let value;

    // Fetch the selected value based on filter type
    if (key === 'location') value = document.getElementById('location-select').value;
    if (key === 'maxRent') value = document.getElementById('rent-range').value;
    if (key === 'type') value = document.getElementById('type-select').value;
    if (key === 'bedrooms') value = document.getElementById('bedroom-select').value;
    if (key === 'availability') {
      // Fetch the start and end dates for availability
      const startDate = document.getElementById('start-date').value;
      const endDate = document.getElementById('end-date').value;
      value = { start: startDate, end: endDate }; // Store as an object with start and end dates
    }

    // Store filters
    filters[key] = value;

    // Update the corresponding filter button text
    const filterBtn = document.querySelector(`.filter-btn[data-filter="${key}"]`);
    if (filterBtn) {
      if (key === 'availability') {
        filterBtn.textContent = `Available: ${value.start} to ${value.end}`; // Display date range
      } else {
        filterBtn.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
      }
      filterBtn.classList.add('active');
    }

    // Hide the filter panel after applying the filter
    btn.closest('.filter-panel').style.display = 'none';
  });
});

document.querySelectorAll('.cancel-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Reset filter selections to default
    document.getElementById('location-select').value = '';
    rentRange.value = 1200;
    rentValue.textContent = '1200€';
    document.getElementById('type-select').value = '';
    document.getElementById('bedroom-select').value = '';
    document.getElementById('start-date').value = ''; // Reset start date
    document.getElementById('end-date').value = '';   // Reset end date

    // Close panel
    btn.closest('.filter-panel').style.display = 'none';
  });
});

// --- ADS LOADING ---
function loadAds() {
  // Your ad-loading logic here...
}
