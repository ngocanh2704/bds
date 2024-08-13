"use client";
import { Button, Flex, Table, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import ModalBalconyDirection from "./ModalBalconyDirection.js";

const BalconyDirection = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const columns = [
    {
      title: "Hướng ban công",
      dataIndex: "balcony_direction_name",
      key: "balcony_direction_name",
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
            onClick={()=>{
                setOpen(true), setId(item);
            }}
          >
            Sửa
          </Button>
          <Button type="primary" danger onClick={()=>{onDelete(item)}}>
            Xoá
          </Button>
        </Flex>
      ),
    },
  ];

  const changeLoading = () => {
    setIsLoading(true);
  };

  const changeOpen = () => {
    setOpen(false);
  };

  const getData = () => {
    axios
      .get("https://api.connecthome.vn/balconyDirection")
      .then((res) => {
        console.log(res)
        setData(res.data.data);
        setIsLoading(false)
      })
      .catch((e) => console.log(e));
  };

  const onDelete = (id) => {
    axios
      .post("https://api.connecthome.vn/balconyDirection/delete", { id: id })
      .then((res) => {
        messageApi.open({
          type: "success",
          content: res.data.message,
        }),
          setIsLoading(true);
      });
  };

  useEffect(() => {
    getData();
  }, [isLoading]);
  return (
    <>
      <Button type="primary" style={{ marginBottom: 20 }} onClick={()=>{
            setOpen(true);
            setId("");
      }}>
        Thêm mới
      </Button>
      <ModalBalconyDirection
        open={open}
        hideModal={() => changeOpen()}
        isLoading={() => changeLoading()}
        id={id}
      />
      <Table columns={columns} dataSource={data} isLoading={isLoading} />
    </>
  );
};

export default BalconyDirection;