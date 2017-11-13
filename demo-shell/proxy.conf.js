module.exports = {
  "/alfresco": {
    "target": "http://adfdev.lab.alfresco.me",
    "secure": false,
    "pathRewrite": {
      "^/alfresco/alfresco": ""
    },
    "changeOrigin": true,
    // workaround for REPO-2260
    onProxyRes: function (proxyRes, req, res) {
      const header = proxyRes.headers['www-authenticate'];
      if (header && header.startsWith('Basic')) {
          proxyRes.headers['www-authenticate'] = 'x' + header;
      }
    }
  },
  "/activiti-app": {
    "target": "http://adfdev.lab.alfresco.me",
    "secure": false,
    "pathRewrite": {
      "^/activiti-app/activiti-app": ""
    },
    "changeOrigin": true
  }
};