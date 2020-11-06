const fetch = require('node-fetch');
module.exports = {
    getAccessToken: async function(code, client_id, client_secret) {
        const request = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          client_id,
          client_secret,
          code
        })
      });
      const text = await request.text();
      const params = new URLSearchParams(text);
      return params.get("access_token");
    }
}