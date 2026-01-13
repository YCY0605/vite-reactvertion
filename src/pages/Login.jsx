import React from 'react';

const LoginPage = () => {
  return (
      <>
        {/* TEST */}
        <a 
          href="/" 
          style={{ fontSize: '20px', position: 'absolute', height: '30px', color: 'red' }}
        >
          TEST:index
        </a>

        <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
          <div 
            style={{ 
              display: 'grid', 
              placeItems: 'center', 
              gridTemplateRows: '30px 2px 168px', 
              border: '2px solid #888888', 
              borderRadius: '10px', 
              overflow: 'hidden' 
            }}
          >
            <div 
              style={{ 
                width: '400px', 
                backgroundColor: '#ffefbf', 
                position: 'relative', 
                textAlign: 'center', 
                fontSize: '20px' 
              }}
            >
              系統登入
            </div>
            <div style={{ width: '400px', height: '2px', backgroundColor: '#888888' }}></div>
            <div 
              style={{ 
                width: '400px', 
                height: '168px', 
                backgroundColor: '#fff7e1', 
                display: 'grid', 
                placeItems: 'center' 
              }}
            >
              <div>
                <label htmlFor="username">帳號：</label>
                <input type="text" id="username" name="username" placeholder="請輸入帳號" required />
              </div>
              {/* 密碼欄位 */}
              <div>
                <label htmlFor="password">密碼：</label>
                <input type="password" id="password" name="password" placeholder="請輸入密碼" required />
              </div>
              <button type="submit" style={{ width: '250px', borderRadius: '25px' }}>
                登入
              </button>
            </div>
          </div>
        </div>
      </>
  );
};

export default LoginPage;
