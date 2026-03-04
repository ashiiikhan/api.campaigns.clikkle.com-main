export default class ResendProvider {
  async send({ to, from, subject, html, text, headers }) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({ 
        from, 
        to, 
        subject, 
        html,
        text,
        headers
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return { success: true, messageId: data.id };
  }
}
