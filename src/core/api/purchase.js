// get all purchase 

export function allPurchaseOrderApi() {
    return new Promise((resolve, reject) => {
        const resp = { data : {
            data  : [
                
                {
                id: 1,
                date: "30 Aug 2022",
                purchase_order: "PO-002",
                reference:'123ref',
                vendor_name: "Mujtaba", 
                status: "DRAFT",
                payment_status: "pending",
                amount: "10000",
                expected_deleivery_date: "22 Sep 2023",
            },

            {
                id: 2,
                date: "30 Aug 2022",
                purchase_order: "PO-002",
                reference:'123ref',
                vendor_name: "Hassan", 
                status: "active",
                payment_status: "pending",
                amount: "10000",
                expected_deleivery_date: "22 Sep 2023",
            },
             
         ]
        }}
       setTimeout(() => {resolve(resp)}, 1000)
});
}