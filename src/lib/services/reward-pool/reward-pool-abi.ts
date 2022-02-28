export const REWARD_POOL_ABI = [
  {
    type: 'function',
    name: 'userInfo',
    outputs: [
      {
        internalType: 'uint256',
        type: 'uint256',
        name: 'amount',
      },
      {
        name: 'rewardDebt',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    inputs: [
      {
        internalType: 'uint256',
        type: 'uint256',
        name: '',
      },
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
];
