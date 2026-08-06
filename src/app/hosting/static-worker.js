/**
 * Cloudflare Worker entrypoint used by OpenAI Sites.
 *
 * Vite emits the website as static files and Sites provides them through the
 * ASSETS binding, so the worker only needs to delegate each request.
 */
export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    
    if (response.status === 404) {
      const url = new URL(request.url);
      url.pathname = '/html/pagenotfound.html';
      const fallbackRequest = new Request(url, request);
      const fallbackResponse = await env.ASSETS.fetch(fallbackRequest);
      
      if (fallbackResponse.status === 200) {
        return new Response(fallbackResponse.body, {
          status: 404,
          headers: fallbackResponse.headers
        });
      }
    }
    
    return response;
  }
};
