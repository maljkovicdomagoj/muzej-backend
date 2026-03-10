const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {

  // Allow requests from Webflow
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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

    res.json({ url: session.url });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};