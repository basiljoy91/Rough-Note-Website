/**
 * Cloudflare Worker entrypoint used by OpenAI Sites.
 *
 * Vite emits the website as static files and Sites provides them through the
 * ASSETS binding, so the worker only needs to delegate each request.
 */
export default {
  fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
