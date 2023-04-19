window.addEventListener('DOMContentLoaded', function() {
    const filterInput = document.getElementById('filterInput');
    const searchButton = document.getElementById('searchButton');
  
    searchButton.addEventListener('click', function() {
      const filterValue = filterInput.value.toLowerCase();
      const searchUrl = '/sklad/pc/?search=' + encodeURIComponent(filterValue);
      window.location.href = searchUrl;
    });
  
    filterInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        searchButton.click();
      }
    });
  });
  