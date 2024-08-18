"use client";
import { Inter } from "next/font/google";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const { Header, Content, Footer, Sider } = Layout;

const inter = Inter({ subsets: ["latin"] });

const DynamicSide =dynamic(()=>import('./side'))
const DynamicHead = dynamic(()=>import('./head'))

const DasboardLayout = ({ children }) => {
  const [jwt, setJwt] = useState("");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // useEffect(() => {
  //   if (localStorage.getItem("jwt")) {
  //     setJwt(localStorage.getItem("jwt"));
  //   }
  // }, []);

  return (
    <Layout
          style={{
            minHeight: "100vh",
          }}
          hasSider
        >
      <DynamicSide />
      <Layout>
        <DynamicHead /> 
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DasboardLayout;
