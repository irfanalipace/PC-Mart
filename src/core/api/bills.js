// Define your initial dummy array data

const resp = {

    data: {

        data: [
            {
                id:1,
                date: "2023-09-01",
                bill: "Bill 001",
                reference: "REF-001",
                vendor_number: "VND-001",
                status: "Paid",
                due_date: "2023-09-15",
                amount: 1000,
                balance_date: "2023-09-15",
            },
            {
                id:2,
                date: "2023-09-02",
                bill: "Bill 002",
                reference: "REF-002",
                vendor_number: "VND-002",
                status: "Unpaid",
                due_date: "2023-09-20",
                amount: 1500,
                balance_date: "2023-09-20",
            },
            {
                id:3,
                date: "2023-09-01",
                bill: "Bill 001",
                reference: "REF-001",
                vendor_number: "VND-001",
                status: "Paid",
                due_date: "2023-09-15",
                amount: 1000,
                balance_date: "2023-09-15",
            },
            {
                id:4,
                date: "2023-09-02",
                bill: "Bill 002",
                reference: "REF-002",
                vendor_number: "VND-002",
                status: "Unpaid",
                due_date: "2023-09-20",
                amount: 1500,
                balance_date: "2023-09-20",
            },
            // Add more bill objects as needed
        ]

    }

}
// Simulate an API function to get all estimates
export function getAllBillsApi() {
    return new Promise((resolve, reject) => {
        // Simulate an API call with a delay
        setTimeout(() => {
            // You can add sorting, filtering, or any other data manipulation logic here
            resolve(resp);
           
        }, 3000);
    });
}
