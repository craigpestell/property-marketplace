// Test script for the notifications system
const testNotificationsAPI = async () => {
  try {
    console.log('Testing notifications API...');

    // Test GET notifications
    const response = await fetch('http://localhost:3002/api/notifications');
    const result = await response.json();

    console.log('GET Notifications Response status:', response.status);
    console.log('GET Notifications Response data:', result);

    if (!response.ok) {
      console.error('Error response:', result);
      return;
    }

    // Test notification creation
    const testNotification = {
      user_email: 'buyer1@example.com',
      type: 'offer_received',
      title: 'Test Notification',
      message: 'This is a test notification from the API test script',
      priority: 'normal',
      metadata: {
        property_uid: 'SEED-PROP-001',
        offer_amount: 150000,
      },
    };

    console.log('\nTesting notification creation with data:', testNotification);

    const createResponse = await fetch(
      'http://localhost:3002/api/notifications',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testNotification),
      },
    );

    const createResult = await createResponse.json();
    console.log('POST Notification Response status:', createResponse.status);
    console.log('POST Notification Response data:', createResult);

    if (!createResponse.ok) {
      console.error('Create notification error:', createResult);
    } else {
      console.log('✅ Notification created successfully!');

      // Mark the notification as read
      if (createResult.data && createResult.data.id) {
        console.log('\nTesting mark as read...');
        const markReadResponse = await fetch(
          `http://localhost:3002/api/notifications`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              notificationId: createResult.data.id,
              read_at: new Date().toISOString(),
            }),
          },
        );

        const markReadResult = await markReadResponse.json();
        console.log(
          'PATCH Notification Response status:',
          markReadResponse.status,
        );
        console.log('PATCH Notification Response data:', markReadResult);
      }
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Test SSE connection
const testSSEConnection = () => {
  console.log('\nTesting SSE connection...');

  try {
    const eventSource = new EventSource(
      'http://localhost:3002/api/notifications/stream?user_email=buyer1@example.com',
    );

    eventSource.onopen = () => {
      console.log('✅ SSE connection opened');
    };

    eventSource.onmessage = (event) => {
      console.log('📨 SSE message received:', event.data);
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Parsed SSE data:', data);
      } catch (e) {
        console.log('📨 SSE data (raw):', event.data);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ SSE error:', error);
      eventSource.close();
    };

    // Close connection after 10 seconds for testing
    setTimeout(() => {
      console.log('⏰ Closing SSE connection after 10 seconds');
      eventSource.close();
    }, 10000);
  } catch (error) {
    console.error('SSE setup error:', error);
  }
};

// Run tests
console.log('Starting notification system tests...');
testNotificationsAPI().then(() => {
  // Note: SSE test is commented out as it requires a browser environment
  // testSSEConnection();
  console.log('\n🎉 Notification API tests completed!');
});
