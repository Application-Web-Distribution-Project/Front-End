/**
 * jspdf-polyfill.js
 * This polyfill ensures jspdf works correctly in Docker environments
 */
(function() {
  if (typeof window !== 'undefined') {
    // Fix for missing canvas features that jspdf relies on
    if (window.CanvasPixelArray) {
      CanvasPixelArray.prototype.set = function(arr) {
        for (var i = 0; i < this.length && i < arr.length; i++) {
          this[i] = arr[i];
        }
      };
    }
    
    // Ensure proper CORS headers are set for font loading
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
      originalXhrOpen.apply(this, arguments);
      this.withCredentials = false;
    };
    
    // Add additional polyfill for Blob and canvas in Docker
    if (typeof Blob !== 'undefined' && typeof Blob.prototype.arrayBuffer === 'undefined') {
      Blob.prototype.arrayBuffer = function() {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Failed to read Blob as ArrayBuffer'));
          reader.readAsArrayBuffer(this);
        });
      };
    }

    // Fix for html2canvas issues in containerized environments
    if (typeof navigator !== 'undefined') {
      const _userAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        get: function() {
          // Ensure Chrome detection works
          return _userAgent + ' Chrome/88.0.4324.150';
        }
      });
    }
    
    console.log('jspdf-polyfill: Polyfills for jspdf in Docker environment loaded successfully');
  }
})();