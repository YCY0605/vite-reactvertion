import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { NavDropdown, Offcanvas, Collapse } from 'react-bootstrap';

import '../assets/css/site.css';
import '../assets/css/mainLayout.css';

const MainLayout = () => {
    // 狀態管理：控制側邊選單開關
    const [showSidebar, setShowSidebar] = useState(false);
    // 狀態管理：控制各項功能的摺疊開關 (對應原本的 data-bs-toggle="collapse")
    const [openMenus, setOpenMenus] = useState({});

    const handleClose = () => setShowSidebar(false);
    const handleShow = () => setShowSidebar(true);

    // 切換選單狀態函式
    const toggleMenu = (e, menuId) => {
        e.preventDefault();
        setOpenMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    return (
        <>
            <header>
                {/* 導覽列 */}
                <nav className="navbar navbar-light custom-nav shadow-1-strong fixed-top" style={{ boxShadow: 'inset 0px -2px 4px #eda'}}>
                    <div className="container-fluid">
                        {/* hamburger button */}
                        <button
                            className="navbar-toggler"
                            type="button"
                            onClick={handleShow}
                            aria-controls="sidebarMenu"
                        >
                            <i className="fa fa-bars fa-lg"></i>
                        </button>

                        <Link className="navbar-brand me-auto ms-2" to="/">
                            <i style={{ color: '#F75000' }} className="fa-solid fa-truck-fast"></i>
                            &nbsp;XX搬運
                        </Link>
                        <NavDropdown
                            title={<i className="fa-solid fa-bell fa-xl"></i>}
                            id="nav-notify"
                            align="end"
                            className="no-caret me-2"
                            style={{ color: '#F9F900', backgroundColor: '#fff', borderRadius: '50%', padding: '5px'}}

                        >
                            <NavDropdown.Item href="#">通知1</NavDropdown.Item>
                            <NavDropdown.Item href="#">通知2</NavDropdown.Item>
                            <NavDropdown.Item href="#">通知3</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">更多通知</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                            title="[帳號] - [員工姓名]"
                            id="nav-user"
                            align="end"
                            style={{marginLeft: '1vw'} }
                        >
                            <NavDropdown.Item href="#">帳號中心</NavDropdown.Item>
                            <NavDropdown.Item href="#">1</NavDropdown.Item>
                            <NavDropdown.Item href="#">2</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">登出</NavDropdown.Item>
                        </NavDropdown>
                        {/*</div>*/}
                    </div>
                </nav>

                {/*側邊選單 細項須調整*/}
                <Offcanvas
                    show={showSidebar}
                    onHide={handleClose}
                    id="sidebarMenu"
                    aria-labelledby="sidebarMenuLabel"
                    style={{ width: '280px' }}
                >
                    <div className="offcanvas-header border-bottom">
                        <h5 className="offcanvas-title" id="sidebarMenuLabel">功能導覽</h5>
                        <button type="button" className="btn-close text-reset" onClick={handleClose} aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body p-0">
                        <div className="list-group list-group-flush">
                            {/* 最愛列 似乎沒必要 */}
                            {/* 
                            <a className="list-group-item list-group-item-action py-3" onClick={(e) => toggleMenu(e, 'favorite')} href="#favorite">
                                <i className="fas fa-box fa-fw me-3"></i>最愛功能 <i className="fas fa-chevron-down float-end"></i>
                            </a>
                            <Collapse in={openMenus['favorite']}>
                                <div id="favorite">
                                    <a href="#" className="list-group-item list-group-item-action py-2 ps-5">最愛1</a>
                                    <a href="#" className="list-group-item list-group-item-action py-2 ps-5">最愛2</a>
                                </div>
                            </Collapse> 
                            */}

                            <a className="list-group-item list-group-item-action py-3" onClick={(e) => toggleMenu(e, 'personnel')} href="#personnel">
                                <i className="fas fa-box fa-fw me-3"></i>人事資料管理 <i className="fas fa-chevron-down float-end"></i>
                            </a>
                            <Collapse in={openMenus['personnel']}>
                                <div id="personnel">
                                    <Link to="/personnel/index" className="list-group-item list-group-item-action py-2 ps-5">員工基本資料</Link>
                                    <Link to="/personnel/attendance" className="list-group-item list-group-item-action py-2 ps-5">出勤管理</Link>
                                    <Link to="/personnel/change" className="list-group-item list-group-item-action py-2 ps-5">人事異動</Link>
                                    <Link to="/personnel/salary" className="list-group-item list-group-item-action py-2 ps-5">薪資資料</Link>
                                </div>
                            </Collapse>

                            <a className="list-group-item list-group-item-action py-3" onClick={(e) => toggleMenu(e, 'customer')} href="#customer">
                                <i className="fas fa-box fa-fw me-3"></i>客戶與案件管理 <i className="fas fa-chevron-down float-end"></i>
                            </a>
                            <Collapse in={openMenus['customer']}>
                                <div id="customer">
                                    <Link to="/customer/index" className="list-group-item list-group-item-action py-2 ps-5">客戶資料</Link>
                                    <Link to="/case/index" className="list-group-item list-group-item-action py-2 ps-5">案件資料</Link>
                                    <Link to="/case/survey" className="list-group-item list-group-item-action py-2 ps-5">勘查清單</Link>
                                    <Link to="/case/quote" className="list-group-item list-group-item-action py-2 ps-5">生成報價單</Link>
                                    <Link to="/case/quote-mgr" className="list-group-item list-group-item-action py-2 ps-5">報價管理</Link>
                                </div>
                            </Collapse>

                            <a className="list-group-item list-group-item-action py-3" onClick={(e) => toggleMenu(e, 'schedule')} href="#schedule">
                                <i className="fas fa-box fa-fw me-3"></i>車輛與人員排程 <i className="fas fa-chevron-down float-end"></i>
                            </a>
                            <Collapse in={openMenus['schedule']}>
                                <div id="schedule">
                                    <Link to="/resource" className="list-group-item list-group-item-action py-2 ps-5">資源管控</Link>
                                    <Link to="/task/start" className="list-group-item list-group-item-action py-2 ps-5">任務發起</Link>
                                    <Link to="/task/calendar" className="list-group-item list-group-item-action py-2 ps-5">任務排程</Link>
                                    <Link to="/task/dispatch" className="list-group-item list-group-item-action py-2 ps-5">任務派發</Link>
                                    <Link to="/task/notify" className="list-group-item list-group-item-action py-2 ps-5">資訊通知</Link>
                                </div>
                            </Collapse>

                            <a className="list-group-item list-group-item-action py-3" onClick={(e) => toggleMenu(e, 'case')} href="#case">
                                <i className="fas fa-box fa-fw me-3"></i>搬家作業 <i className="fas fa-chevron-down float-end"></i>
                            </a>
                            <Collapse in={openMenus['case']}>
                                <div id="case">
                                    <Link to="/Report/Search" className="list-group-item list-group-item-action py-2 ps-5">作業查詢</Link>
                                    <Link to="/Report/Progress" className="list-group-item list-group-item-action py-2 ps-5">進度回報</Link>
                                </div>
                            </Collapse>

                            <a className="list-group-item list-group-item-action py-3" onClick={(e) => toggleMenu(e, 'complaint')} href="#complaint">
                                <i className="fas fa-box fa-fw me-3"></i>客訴反饋 <i className="fas fa-chevron-down float-end"></i>
                            </a>
                            <Collapse in={openMenus['complaint']}>
                                <div id="complaint">
                                    <Link to="/complaint/process" className="list-group-item list-group-item-action py-2 ps-5">客訴處理</Link>
                                    <Link to="/complaint/record" className="list-group-item list-group-item-action py-2 ps-5">客訴紀錄</Link>
                                </div>
                            </Collapse>

                            <a className="list-group-item list-group-item-action py-3" onClick={(e) => toggleMenu(e, 'other')} href="#other">
                                <i className="fas fa-box fa-fw me-3"></i>其他功能 <i className="fas fa-chevron-down float-end"></i>
                            </a>
                            <Collapse in={openMenus['other']}>
                                <div id="other">
                                    <Link to="/bulletin" className="list-group-item list-group-item-action py-2 ps-5">公佈欄</Link>
                                    <Link to="/document" className="list-group-item list-group-item-action py-2 ps-5">文件中心</Link>
                                </div>
                            </Collapse>
                        </div>
                    </div>
                </Offcanvas>
            </header>

            {/* 中間功能區 */}
            <div className="container-fluid maincontainer" style={{ paddingTop: '56px' }}>
                <main role="main" className="pb-3 mainvw">
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default MainLayout;
