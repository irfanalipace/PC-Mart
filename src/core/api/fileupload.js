// Dummy API response
const dummyApiResponse = {
    data: {
      data: [
        {
        file_name:'Inventory 1',
          upload_date:'Aus 24,2023',
          time:'09:00Am',
          status: 'pending',
          batch_no:'2643',
    
        },
        {
            file_name:'Inventory 2',
              upload_date:'Jan 21,2023',
              time:'03:00PM',
              status: 'processing',
              batch_no:'213236652',
            },
            {
                file_name:'Inventory 3',
                  upload_date:'Oct 11,2023',
                  time:'04:00AM',
                  status: 'error',
                  batch_no:'213232',
            
                },
                {
                    file_name:'Inventory 4',
                      upload_date:'Oct 11,2023',
                      time:'04:00AM',
                      status: 'processed',
                      batch_no:'213232',
                
                    },
        // Add more dummy data as needed
      ],
    },
  };
  
  // Dummy API function
  export function getUploadFile(params) {
    return new Promise((resolve, reject) => {
      // Simulate an API call delay (you can remove this in a real scenario)
      setTimeout(() => {
        // Resolve the promise with the dummy API response
        resolve(dummyApiResponse);
      }, 1000); // Simulate a 1-second delay (adjust as needed)
    });
  }
  