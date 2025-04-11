console.log('Started', self);

//importScripts('../uibuilder/uibuilder.esm.min.js');

self.addEventListener('install', function(event) {
   self.skipWaiting();
   console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
   console.log('Activated', event);
});
self.addEventListener('push', function(event) {
   console.log('Push message received', event);
});