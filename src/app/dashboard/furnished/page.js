"use client";
import { Button, Flex, Table, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { deleteCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { redirect, useRouter } from "next/navigation";
import ModalFurnished from "./ModalFurnished";

const config = {
  headers: { Authorization: `Bearer ${getCookie("token")}` },
};
const fetcher = (url) => axios.get(url, config).then((res) => res.data);

const Furnished = () => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const { data, error, isLoading } = useSWR(
    `https://api.connecthome.vn/furnished`,
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
        mutate("https://api.connecthome.vn/furnished");
        redirect("/login");
      }
    }
  }, [isLoading]);

  const { push } = useRouter();

  useEffect(() => {
    var role = getCookie("role");
    if (role == "staff") {
      push("/dashboard/datasource");
    }
  }, []);

  const columns = [
    {
      title: "Nội thất",
      dataIndex: "furnished_name",
      key: "furnished_name",
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
    axios.post("https://api.connecthome.vn/furnished/delete", { id: id }).then((res) => {
      mutate("https://api.connecthome.vn/furnished");
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
      <ModalFurnished open={open} hideModal={() => changeOpen()} id={id} />
      <Table columns={columns} dataSource={getCookie("role") == "staff" ? []:data?.data} isLoading={isLoading} size="small" />
    </>
  );
};

export default Furnished;
