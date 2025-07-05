// Test script for the offers API
const testOfferCreation = async () => {
  const testOffer = {
    property_uid: 'SEED-PROP-007', // Investment Duplex owned by agent1@example.com
    offer_amount: 215000,
    message: 'Test offer message',
    financing_type: 'conventional',
    contingencies: ['inspection', 'financing'],
    closing_date: '2025-09-01',
    earnest_money: 5000,
    inspection_period_days: 10,
  };

  try {
    console.log('Testing offer creation with data:', testOffer);

    const response = await fetch('http://localhost:3001/api/offers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOffer),
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);

    if (!response.ok) {
      console.error('Error response:', result);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Test getting offers
const testGetOffers = async () => {
  try {
    console.log('Testing GET offers...');

    const response = await fetch('http://localhost:3001/api/offers');
    const result = await response.json();

    console.log('GET Response status:', response.status);
    console.log('GET Response data:', result);
  } catch (error) {
    console.error('GET Network error:', error);
  }
};

// Run tests
console.log('Starting API tests...');
testGetOffers();
testOfferCreation();
