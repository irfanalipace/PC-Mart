// Dummy API response
const dummyApiResponse = {
    data: {
      data: [
        {
          type: 'Laptop',
          serial_number: '123456',
          make: 'BrandX',
          model: 'ModelY',
          cpu: 'Intel i5',
          ram: '8GB',
          hdd: '256GB SSD',
          price: '$109',
          processing_start_time: '2023-11-10T12:00:00',
          ready_start_time: '2023-11-10T14:00:00',
        },
        {
            type: 'desktop',
            serial_number: '123456',
            make: 'BrndY',
            model: 'ModelY',
            cpu: 'Intel i5',
            ram: '8GB',
            hdd: '256GB SSD',
            price: '$33',
            processing_start_time: '2023-11-10T12:00:00',
            ready_start_time: '2023-11-10T14:00:00',
          },
          {
            type: 'Screen',
            serial_number: '123456',
            make: 'BrandW',
            model: 'ModelY',
            cpu: 'Intel i5',
            ram: '8GB',
            hdd: '256GB SSD',
            price: '$999',
            processing_start_time: '2023-11-10T12:00:00',
            ready_start_time: '2023-11-10T14:00:00',
          },
        // Add more dummy data as needed
      ],
    },
  };
  
  // Dummy API function
  export function getNonReadyItems(params) {
    return new Promise((resolve, reject) => {
      // Simulate an API call delay (you can remove this in a real scenario)
      setTimeout(() => {
        // Resolve the promise with the dummy API response
        resolve(dummyApiResponse);
      }, 1000); // Simulate a 1-second delay (adjust as needed)
    });
  }
  