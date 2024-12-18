"use client";

import { Button, Flex, Table, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import dynamic from "next/dynamic";
import { getCookie } from "cookies-next";
import { redirect, useRouter } from "next/navigation";

const config = {
  headers: { Authorization: `Bearer ${getCookie("token")}` },
};
const fetcher = (url) => axios.get(url, config).then((res) => res.data);

const DynamicModal = dynamic(() => import("./ModalUser"));

const User = () => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const { push } = useRouter();

  useEffect(() => {
    var role = getCookie("role");
    if (role == "staff") {
      push("/dashboard/datasource");
    }
  }, []);

  const { data, error, isLoading } = useSWR(
    "https://api.connecthome.vn/user",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      title: "Tài khoản",
      dataIndex: "rname",
      key: "username",
    },
    {
      title: "Quyền",
      dataIndex: "role",
      key: "role",
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
      render: (item) => (item == true ? "Kích hoạt" : "Tắt"),
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
          {(getCookie("role") == "manager") | getCookie("role" == "staff") ? (
            ""
          ) : (
            <Button type="primary" danger onClick={() => onDelete(item)}>
              Xoá
            </Button>
          )}
        </Flex>
      ),
    },
  ];

  const changeOpen = () => {
    setOpen(false);
  };

  const onDelete = (id) => {
    axios.post("https://api.connecthome.vn/user/delete", { id: id }).then((res) => {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      mutate("https://api.connecthome.vn/user");
    });
  };

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
      <Table
        columns={columns}
        dataSource={getCookie("role") == "staff" ? [] : data?.user}
        loading={isLoading}
        size="small"
        pagination={{
          defaultPageSize: 20,
          pageSizeOptions: [20, 30, 40, 50],
          showSizeChanger: true,
        }}
      />
    </>
  );
};

export default User;
