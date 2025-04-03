export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      // Let the Functions handle API requests
      return env.ASSETS.fetch(request);
    }
    
    // For all other requests, serve static content
    return env.ASSETS.fetch(request);
  }
}; 