(function(){
  'use strict';
  // The exact admin renderer owns the preview admin UI.
  // Keeping the legacy premium renderer disabled prevents its document-level
  // click handler from toggling theme or re-rendering the page behind controls.
  if (window.__NO11_EXACT_ADMIN__) return;
})();
