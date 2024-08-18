"use client";
import { Button, Flex, Layout, theme } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import Link from "next/link";

const { Header } = Layout;

const Head = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const onClick = () => {
    deleteCookie("token");
    deleteCookie("user");
    deleteCookie("role");
  };
  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <Flex justify="flex-end" align="center">
        {/* <Button type="primary" style={{ marginTop: 14, marginRight: 10 }} onClick={() => useRouter().push('/login')}>
          <LogoutOutlined />
        </Button> */}
        <Link href={"/login"} style={{ marginRight: 10 }} onClick={onClick}>
          <Button type="primary">
            <LogoutOutlined />
          </Button>
        </Link>
      </Flex>
    </Header>
  );
};

export default Head;
