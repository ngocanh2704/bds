"use client";
import { Flex, Table, Button } from "antd";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);
const DynamicModalProperty = dynamic(() => import("./ModalProperty"));
const Property = () => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const { data, error, isLoading } = useSWR(
    `https://connecthome.vn/property`,
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
        redirect("/login");
      }
    }
  }, [isLoading]);

  const onDelete = (id) => {
    axios
      .post("https://connecthome.vn/property/delete", { id: id })
      .then((res) => {
        mutate("https://connecthome.vn/property");
      });
  };

  const changeOpen = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "Loại",
      dataIndex: "property_name",
      key: "property_name",
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (record) => {
        return (
          <Flex gap={"small"} wrap>
            <Button
              type="primary"
              style={{ backgroundColor: "rgb(250, 173, 20)" }}
              onClick={() => {
                setOpen(true), setId(record);
              }}
            >
              Sửa
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                onDelete(record);
              }}
            >
              Xoá
            </Button>
          </Flex>
        );
      },
    },
  ];

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
      <DynamicModalProperty
        open={open}
        hideModal={() => changeOpen()}
        id={id}
      />
      <Table columns={columns} dataSource={data?.data} loading={isLoading} size="small" />
    </>
  );
};

export default Property;
