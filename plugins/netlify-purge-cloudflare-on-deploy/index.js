/**
 * Safe netlify-purge-cloudflare-on-deploy plugin
 * Overrides the crashing npm plugin so that Netlify deployments NEVER fail,
 * whether Cloudflare credentials are fully provided, partially provided, or omitted.
 */

const {
  env: {
    CLOUDFLARE_API_TOKEN,
    CLOUDFLARE_TOKEN,
    CLOUDFLARE_API_KEY,
    CLOUDFLARE_ZONE_ID,
    CLOUDFLARE_ZONE,
    CLOUDFLARE_EMAIL,
  },
} = process;

const token = CLOUDFLARE_API_TOKEN || CLOUDFLARE_TOKEN;
const zoneId = CLOUDFLARE_ZONE_ID || CLOUDFLARE_ZONE;
const apiKey = CLOUDFLARE_API_KEY;
const email = CLOUDFLARE_EMAIL;

module.exports = {
  onPostBuild({ utils }) {
    console.log('[Safe Cloudflare Plugin] onPostBuild hook running...');
    if (token && zoneId) {
      console.log('[Safe Cloudflare Plugin] Cloudflare Token & Zone ID detected.');
    } else if (apiKey && email && zoneId) {
      console.log('[Safe Cloudflare Plugin] Cloudflare Global API Key & Zone ID detected.');
    } else {
      console.log(
        '[Safe Cloudflare Plugin] Cloudflare credentials/Zone ID not fully configured.\n' +
        '-> Skipping cache purge safely to prevent deploy failure.'
      );
    }
  },

  async onSuccess({ utils }) {
    if (!zoneId || (!token && (!apiKey || !email))) {
      console.log('[Safe Cloudflare Plugin] No active Cloudflare configuration to purge. Deploy continues successfully.');
      return;
    }

    console.log(`[Safe Cloudflare Plugin] Preparing to purge Cloudflare cache for Zone: ${zoneId}`);
    const baseUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`;
    const headers = { 'Content-Type': 'application/json' };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (apiKey && email) {
      headers['X-Auth-Email'] = email;
      headers['X-Auth-Key'] = apiKey;
    }

    try {
      const fetchFn = typeof fetch !== 'undefined' ? fetch : require('node-fetch');
      const response = await fetchFn(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ purge_everything: true }),
      });

      if (response.ok) {
        console.log('[Safe Cloudflare Plugin] ✅ Cloudflare cache purged successfully!');
      } else {
        const text = await response.text();
        console.warn(`[Safe Cloudflare Plugin] ⚠️ Cloudflare cache purge returned status ${response.status}: ${text}.`);
        console.warn('[Safe Cloudflare Plugin] Ignoring error to keep Netlify site deployed and online.');
      }
    } catch (err) {
      console.warn('[Safe Cloudflare Plugin] ⚠️ Cloudflare purge request error:', err.message);
      console.warn('[Safe Cloudflare Plugin] Deploy remains successful.');
    }
  },
};
