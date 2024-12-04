"use client";
import { Button, Flex, Table, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import ModalProject from "./ModalProject";
import { redirect, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

const Project = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const columns = [
    {
      title: "Dự án",
      dataIndex: "project_name",
      key: "project_name",
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
          <Button type="primary" danger onClick={() => { onDelete(item) }}>
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
      .post("https://api.connecthome.vn/project/delete", { id: id })
      .then((res) => {
        messageApi.open({
          type: "success",
          content: res.data.message,
        }),
          setIsLoading(true);
      })
  };

  const getData = () => {
    axios
      .get("https://api.connecthome.vn/project", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      .then((res) => {
        setData(res.data.data);
        setIsLoading(false)
      })
      .catch((e) => {
        redirect('/login')
      });
  };

  useEffect(() => {
    getData();
  }, [isLoading]);

  const { push } = useRouter();

  useEffect(() => {
    var role = getCookie("role");
    if (role == "staff") {
      push("/dashboard/datasource");
    }
  }, []);
  return (
    <>
      {contextHolder}
      <Button type="primary" style={{ marginBottom: 20 }} onClick={() => {
        setOpen(true);
        setId("");
      }}>
        Thêm mới
      </Button>
      <ModalProject
        open={open}
        hideModal={() => changeOpen()}
        isLoading={() => changeLoading()}
        id={id}
      />
      <Table columns={columns} dataSource={getCookie("role") == "staff" ? []:data} isLoading={isLoading} size="small" />
    </>
  );
};

export default Project;
