exports.handler = async function(event) {
  const { code } = event.queryStringParameters || {};
  if (!code) return { statusCode: 400, body: JSON.stringify({ error: 'No code provided' }) };

  const CLIENT_ID = '1484475596762513428';
  const CLIENT_SECRET = 'B2IRY7AOGHR7BYCdnMRy4s0LYnmwt2In';
  const REDIRECT_URI = 'https://bgsitousd.netlify.app/callback';
  const GUILD_ID = '1484475950635683921';

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      })
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return { statusCode: 401, body: JSON.stringify({ error: 'Token exchange failed', detail: tokenData }) };

    const accessToken = tokenData.access_token;

    // Get user info
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const user = await userRes.json();

    // Check guild membership
    const memberRes = await fetch(`https://discord.com/api/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const guilds = await memberRes.json();
    const inGuild = Array.isArray(guilds) && guilds.some(g => g.id === GUILD_ID);

    if (!inGuild) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'not_in_guild' })
      };
    }

    const avatar = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || 0) % 5}.png`;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: user.id,
        username: user.global_name || user.username,
        avatar,
        accessToken
      })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
