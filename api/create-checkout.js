const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {

  // CORS headers - mora biti prije svega ostalog
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Samo POST zahtjevi
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      }],
      success_url: 'https://domagojs-beautiful-site-cd1c03.webflow.io/success',
      cancel_url: 'https://domagojs-beautiful-site-cd1c03.webflow.io/membership',
    });

    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};