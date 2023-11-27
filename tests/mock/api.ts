import { ResponseItem } from '@/constants/dns';

export const exampleResponseItem: ResponseItem = {
  // This is a single api call mock for example.com
  success: true,
  data: {
    Status: 0,
    TC: false,
    RD: true,
    RA: true,
    AD: true,
    CD: false,
    Question: [{ name: 'example.com', type: 16 }],
    Answer: [
      { name: 'example1.com', type: 16, TTL: 86400, data: '"v=spf1 -all"' },
      {
        name: 'exampl1e.com',
        type: 16,
        TTL: 86400,
        data: '"wgyf8z8cgvm2qmxpnbnldrcltvk4xqfn"',
      },
    ],
  },
};
