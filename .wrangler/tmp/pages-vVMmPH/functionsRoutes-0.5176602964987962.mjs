import { onRequest as __api_browse_js_onRequest } from "/Users/phillipbosua/devrepo/HM website/functions/api/browse.js"
import { onRequest as __api_videos_js_onRequest } from "/Users/phillipbosua/devrepo/HM website/functions/api/videos.js"

export const routes = [
    {
      routePath: "/api/browse",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_browse_js_onRequest],
    },
  {
      routePath: "/api/videos",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_videos_js_onRequest],
    },
  ]