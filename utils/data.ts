const address = "0x1a17Fc032e9e0500bc2C53a9c150dc353Da28018";

export const test = {
  chainName: "MUMBAI",
  contractDetails: {
    contractAddress: "0x6EE253a4b7cEBAB8fc29bfcD56E7436D26c9DC7E",
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    functionName: "mint",
    args: [address],
    value: 10 ** -7,
  },
};

export const claimCouponContractDetails = {
  contractAddress: "0xd1fD14e3Cf4f96E63A1561681dc8765DF8f7Cf91",
  abi: [
    {
      inputs: [
        { internalType: "uint256", name: "_tokenID", type: "uint256" },
        { internalType: "address", name: "_claimer", type: "address" },
      ],
      name: "claimCoupon",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  functionName: "claimCoupon",
  args: [1, "0xD243090e67788bc26968a7339680Fd0AE2b0b6A4"],
  // value: 0.000001,
};
