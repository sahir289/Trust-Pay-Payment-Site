const transactionStatuses = [
    {
      status: "Success",
      description: "Transaction completed",
      color: "green-theme",
      transaction_id: "TXN12345",
      utr_id: "UTR67890"
    },
    {
      status: "Pending",
      description: "Transaction in process",
      color: "blue-theme",
      transaction_id: "TXN54321",
      utr_id: "UTR09876"
    },
    {
      status: "Bank-Mismatch",
      description: "Mismatch in bank details",
      color: "red-theme",
      transaction_id: "TXN67890",
      utr_id: "UTR54321"
    },
    {
      status: "Not Found",
      description: "Transaction not located",
      color: "red-theme",
      transaction_id: "TXN11111",
      utr_id: "UTR22222"
    },
    {
      status: "Duplicate",
      description: "Transaction duplicated",
      color: "red-theme",
      transaction_id: "TXN33333",
      utr_id: "UTR44444"
    },
    {
      status: "Dispute",
      description: "Transaction under dispute",
      color: "red-theme",
      transaction_id: "TXN55555",
      utr_id: "UTR66666"
    }
  ];
  
  export default transactionStatuses;
  