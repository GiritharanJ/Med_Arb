// load-header.js - Properly loads header and executes its JavaScript
(function() {
  'use strict';
  
  // Check if header already exists
  if (document.querySelector('.medarb-nav-container')) {
    console.log('Header already exists');
    return;
  }
  
  // Function to execute scripts in loaded HTML
  function executeScripts(htmlElement) {
    const scripts = htmlElement.querySelectorAll('script');
    scripts.forEach(function(oldScript) {
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      document.body.appendChild(newScript);
      oldScript.remove();
    });
  }
  
  // Load header.html
  fetch('header.html')
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Header not found');
      }
      return response.text();
    })
    .then(function(html) {
      // Create temporary div to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Extract body content
      const headerContent = tempDiv.querySelector('.medarb-header') || tempDiv;
      
      // Insert header at the beginning of body
      document.body.insertAdjacentHTML('afterbegin', headerContent.outerHTML || html);
      
      // Execute any scripts
      const insertedHeader = document.querySelector('.medarb-header');
      if (insertedHeader) {
        executeScripts(insertedHeader);
      } else {
        executeScripts(tempDiv);
      }
      
      console.log('MedArb Header: Loaded successfully');
    })
    .catch(function(error) {
      console.error('MedArb Header: Failed to load', error);
    });
})();
