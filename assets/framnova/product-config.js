(function () {
  "use strict";

  var scriptUrl = document.currentScript && document.currentScript.src;
  var siteRoot = scriptUrl ? new URL(".", scriptUrl).pathname : "/";

  /* Public product state lives here so every marketing page points at the same
     verified destinations and does not drift back to pre-launch copy. */
  window.FramnovaConfig = Object.freeze({
    chromeWebStoreUrl: "https://chromewebstore.google.com/detail/framnova/fcagagedgniajofnacjggkgjpfiebndc",
    chromeBetaPath: siteRoot + "extension/",
    chromeStoreStatus: "live",
    mcpStatus: "live",
    billingProvider: "stripe",
    billingApiOrigin: "https://mcp.framnova.com",
    supportEmail: "support@framnova.com",
    supportEmailIsPlaceholder: false,
    productStates: Object.freeze({
      browserCapture: "live",
      webAiDelivery: "live",
      directMcp: "live",
      localMcp: "live",
      claudeDesktopOauth: "planned",
      shareLinks: "planned",
      desktopCompanion: "planned"
    })
  });
})();
