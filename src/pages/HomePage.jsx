import React, { useState, useEffect } from 'react';
import '../assets/css/HomePage.css';

const HomePage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${days[date.getDay()]}`;
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString();
    };

    return (
        <div className="row mainvwrow">
            {/* 手機只顯示這個div */}
            <div className="col indexdiv">
                {/* 打卡按鈕 */}
                <div className={'leftbuttoncontainer'}>
                    <button className="leftbutton" style={{ backgroundColor: '#77ff77' }}>簽到</button>
                    <button className="leftbutton" style={{ backgroundColor: '#f5a199' }}>簽退</button>
                    <button className="leftbutton" style={{ backgroundColor: '#ff9966' }}>外出</button>
                </div>

                {/* 時間 */}
                <div style={{
                    height: '25%', containerType: 'inline-size',
                    display: 'grid', placeItems: 'center', fontSize: '5cqw'
                }}>
                    <span id="day" style={{ fontSize: '7cqw' }}>{formatDate(currentTime)}</span>
                    <span id="clock" style={{ fontSize: '9cqw' }}>{formatTime(currentTime)}</span>
                </div>

                {/* 今日待辦 */}
                <div className="block" style={{ height: '55%' }}>
                    <ul style={{ fontSize: '8cqw', display: 'grid', placeItems: 'center', padding: 0 }}>
                        今日待辦事項
                    </ul>
                </div>
            </div>

            {/* 中 行事曆 */}
            <div className="col d-none d-md-block indexdiv">
                <div className="block" style={{ height: '100%', padding: '0 5%' }}>
                    <div style={{ width: '100%', position: 'relative', textAlign: 'center' }}>
                        <span style={{ fontSize: '8cqw' }}>行事曆</span>
                    </div>
                    {/* 原本的 Razor 註解：作業資訊 */}
                    <div className="calendar">
                        <div className="calendarfield">日期</div>
                        <div className="calendarfield">星期</div>
                        <div className="calendarfield">早班</div>
                        <div className="calendarfield">晚班</div>
                        <div className="calendarfield">大夜班</div>
                    </div>
                </div>
            </div>

            {/* 右 */}
            <div className="col d-none d-md-block indexdiv">
                {/* 公佈欄 */}
                <div className="block" style={{ height: '43%' }}>
                    <div style={{ width: '100%', position: 'relative', textAlign: 'center' }}>
                        <span style={{ fontSize: '8cqw' }}>公佈欄</span>
                        <a href="#" style={{ position: 'absolute', right: '10px', bottom: '3px' }}>more</a>
                    </div>
                    <ul style={{ fontSize: '6cqw' }}>
                        <li><a href="#">1</a></li>
                        <li><a href="#">2</a></li>
                        <li><a href="#">3</a></li>
                        <li><a href="#">4</a></li>
                        <li><a href="#">5</a></li>
                    </ul>
                </div>

                {/* 留空 */}
                <div style={{ height: '5%', width: '100%' }}></div>

                {/* 快速按鈕 */}
                <div className={'rightbuttoncontainer'}>
                    <button className="rightbutton">個人任務</button>
                    <button className="rightbutton">案件管理</button>
                    <button className="rightbutton">請假事宜</button>
                    <button className="rightbutton">出勤管理</button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
