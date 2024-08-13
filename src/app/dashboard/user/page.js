"use client";

import { Button, Flex, Table, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import ModalUser from "./ModalUser";

const User = () => {
  const [data, setData] = useState([]);
  const [dataEmploye, setDataEmployee] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [jwt, setJwt] = useState('')

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
      render: (item) => item ? Object.values(item)[2] : null,
    },
    {
      title: "Email",
      dataIndex: "employee_ID",
      key: "employee_ID",
      render: (item) => item ? Object.values(item)[1] : null,
    },
    {
      title: "Kích hoạt",
      dataIndex: "status",
      key: "status",
      render: (item) => <>{item == true ? "Kích hoạt" : "Tắt"}</>,
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
          <Button type="primary" danger onClick={() => onDelete(item)}>
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

  const onDelete = (id) => {
    axios
      .post("https://api.connecthome.vn/user/delete", { id: id })
      .then((res) => {
        messageApi.open({
          type: "success",
          content: res.data.message,
        }),
          setIsLoading(true);
      });
  };

  useEffect(() => {
    const getData = () => {
      axios
        .get("https://api.connecthome.vn/user",{
          headers:{
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        })
        .then((res) => {
          console.log(res)
          setDataEmployee(res.data.dataEmployee)
          setData(res.data.user);
          setIsLoading(false);
        })
        .catch((e) => console.log(e));
    };
    getData();
  }, [isLoading]);
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
      <ModalUser
        open={open}
        employee={dataEmploye}
        hideModal={() => changeOpen()}
        id={id}
        isLoading={() => changeLoading()}
      />
      <Table columns={columns} dataSource={data} loading={isLoading} />
    </>
  );
};

export default User;
