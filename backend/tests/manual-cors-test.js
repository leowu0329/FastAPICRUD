const fetch = require('node-fetch');

async function testCORS() {
  const testCases = [
    {
      name: '測試正確源',
      origin: 'http://localhost:5173',
      expected: true,
    },
    {
      name: '測試錯誤源',
      origin: 'http://malicious-site.com',
      expected: false,
    },
  ];

  console.log('開始 CORS 測試...\n');

  for (const testCase of testCases) {
    console.log(`測試案例: ${testCase.name}`);
    console.log(`Origin: ${testCase.origin}`);

    try {
      const response = await fetch('http://localhost:5000/', {
        headers: {
          Origin: testCase.origin,
        },
      });

      const allowedOrigin = response.headers.get('access-control-allow-origin');
      const isAllowed = allowedOrigin === testCase.origin;

      console.log('狀態碼:', response.status);
      console.log('Access-Control-Allow-Origin:', allowedOrigin);
      console.log(
        '測試結果:',
        isAllowed === testCase.expected ? '通過' : '失敗',
      );
      console.log('----------------------------------------\n');
    } catch (error) {
      console.error('測試失敗:', error.message);
      console.log('----------------------------------------\n');
    }
  }
}

testCORS();
