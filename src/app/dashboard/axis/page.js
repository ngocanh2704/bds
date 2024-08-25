"use client";
import { Button, Flex, Table, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import ModalAxis from "./ModalAxis";
import useSWR, { mutate } from "swr";
import { deleteCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";

const config = {
  headers: { Authorization: `Bearer ${getCookie("token")}` },
};
const fetcher = (url) => axios.get(url, config).then((res) => res.data);

const Axis = () => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const { data, error, isLoading } = useSWR(
    `http://localhost:3001/axis`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    var token = getCookie("token");
    const currentTime = Date.now() / 1000;
    if (token == undefined) {
      redirect("/login");
    } else {
      if (jwtDecode(token).exp < currentTime) {
        deleteCookie("token");
        mutate("http://localhost:3001/employee");
        redirect("/login");
      }
    }
  }, [isLoading]);

  const columns = [
    {
      title: "Trục",
      dataIndex: "axis_name",
      key: "axis_name",
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
          <Button
            type="primary"
            danger
            onClick={() => {
              onDelete(item);
            }}
          >
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
    axios.post("http://localhost:3001/axis/delete", { id: id }).then((res) => {
      mutate("http://localhost:3001/axis");
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
    });
  };

  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => {
          setOpen(true);
          setId("");
        }}
      >
        Thêm mới
      </Button>
      <ModalAxis open={open} hideModal={() => changeOpen()} id={id} />
      <Table columns={columns} dataSource={data?.data} isLoading={isLoading} size="small" />
    </>
  );
};

export default Axis;
