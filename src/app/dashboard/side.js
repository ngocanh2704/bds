import { Button, Layout, Menu } from "antd";
import { useState } from "react";
import {
  DesktopOutlined,
  LogoutOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { getCookie } from "cookies-next";

const { Sider } = Layout;
const Side = () => {
  const [collapsed, setCollapsed] = useState(false);
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const itemsAdminManager = [
    getItem("Người dùng", "sub1", <PieChartOutlined />, [
      getItem(<Link href="/dashboard/employee">Nhân viên</Link>, "1"),
      getItem(<Link href="/dashboard/user">Tài khoản</Link>, "2"),
    ]),
    getItem("Sale", "sub2", <DesktopOutlined />, [
      getItem(<Link href="/dashboard/project">Dự án</Link>, "3"),
      getItem(<Link href="/dashboard/building">Toà</Link>, "4"),
      getItem(<Link href="/dashboard/property">Loại BDS</Link>, "5"),
      getItem(<Link href="/dashboard/status">Trạng thái </Link>, "6"),
      getItem(<Link href="/dashboard/axis">Trục căn hộ</Link>, "7"),
      getItem(<Link href="/dashboard/furnished">Nội thất</Link>, "8"),
      getItem(
        <Link href="/dashboard/balconydirection">Hướng ban công</Link>,
        "9"
      ),
      getItem(<Link href="/dashboard/datasource">Data Nguồn</Link>, "10"),
      getItem(<Link href="/dashboard/customer">Khách hàng</Link>, "11"),
    ]),
  ];

  const itmesStaff = [
    getItem("Sale", "sub2", <DesktopOutlined />, [
      getItem(<Link href="/dashboard/datasource">Data Nguồn</Link>, "10"),
    ]),
  ];
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div
        className="demo-logo-vertical"
        style={{
          height: 32,
          margin: 16,
          background: "rgba(255,255,255,.2)",
          borderRadius: 6,
        }}
      ><p style={{ fontSize: 'large', color: 'white', marginLeft: 55 }}>{getCookie('name')}</p></div>
      <Menu
        theme="dark"
        defaultSelectedKeys={["10"]}
        mode="inline"
        items={getCookie('role') == 'staff' ? itmesStaff : itemsAdminManager}
        activeKey={["10"]}
        defaultOpenKeys={["sub2"]}
      />
    </Sider>
  );
};

export default Side;
