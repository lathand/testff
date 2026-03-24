exports.handler = async function(event) {
  if(event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ valid: false }) };

  let token, expectedId;
  try {
    const body = JSON.parse(event.body || '{}');
    token = body.token;
    expectedId = body.expectedId;
  } catch(e) {
    return { statusCode: 200, body: JSON.stringify({ valid: false }) };
  }

  // Reject immediately if no token or no ID
  if (!token || !expectedId || typeof token !== 'string' || token.length < 10) {
    return { statusCode: 200, body: JSON.stringify({ valid: false }) };
  }

  try {
    const res = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return { statusCode: 200, body: JSON.stringify({ valid: false }) };
    const user = await res.json();
    // Token must belong to the exact Discord ID stored
    if (!user.id || user.id !== expectedId) {
      return { statusCode: 200, body: JSON.stringify({ valid: false }) };
    }
    return { statusCode: 200, body: JSON.stringify({ valid: true, id: user.id }) };
  } catch(e) {
    return { statusCode: 200, body: JSON.stringify({ valid: false }) };
  }
};
