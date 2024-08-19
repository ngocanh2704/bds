"use client";

import { Button, Flex, Table, message } from "antd";
import axios from "axios";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import dynamic from "next/dynamic";
import { getCookie } from "cookies-next";

const config = {
  headers: { Authorization: `Bearer ${getCookie("token")}` },
};
const fetcher = (url) => axios.get(url, config).then((res) => res.data);

const DynamicModal = dynamic(() => import("./ModalUser"));

const User = () => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const { data, error, isLoading } = useSWR(
    "http://localhost:3001/user",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const columns = [
    {
      title: "Tài khoản",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Nhân viên",
      dataIndex: "employee_ID",
      key: "employee_ID",
      render: (item) => (item ? Object.values(item)[2] : null),
    },
    {
      title: "Email",
      dataIndex: "employee_ID",
      key: "employee_ID",
      render: (item) => (item ? Object.values(item)[1] : null),
    },
    {
      title: "Kích hoạt",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (item) => (
        <Flex gap="small" wrap>
          <Button
            type="primary"
            style={{ backgroundColor: "rgb(250, 173, 20)" }}
            onClick={() => {
              setOpen(true), setId(item);
            }}
          >
            Sửa
          </Button>
          <Button type="primary" danger onClick={() => onDelete(item)}>
            Xoá
          </Button>
        </Flex>
      ),
    },
  ];

  const changeOpen = () => {
    setOpen(false);
  };

  const onDelete = (id) => {
    axios
      .post("http://localhost:3001/user/delete", { id: id })
      .then((res) => {
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
      mutate("http://localhost:3001/user")
      });
  };

  console.log(data?.user)

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
          // changDataForOptions();
          setId("");
        }}
        style={{ marginBottom: 20 }}
      >
        Thêm mới
      </Button>
      <DynamicModal
        open={open}
        employee={data?.dataEmployee}
        hideModal={() => changeOpen()}
        id={id}
      />
      <Table columns={columns} dataSource={data?.user} loading={isLoading} />
    </>
  );
};

export default User;
