import axios from "axios";
import { useEffect, useLayoutEffect, useState } from "react";

import { Button, Flex, Table } from "antd";

const ALl = (prop) => {
  const [role, setRole] = useState("");
  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);
  const columns = [
    {
      title: "Căn hộ",
      dataIndex: "apartment_name",
      key: "apartment_name",
    },
    {
      title: "Chủ căn hộ",
      dataIndex: "owner",
      key: "owner",
      render: (item) =>
        (role == "admin") | (role == "manager") ? item : "xxxxxxxx",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
      render: (item) =>
        (role == "admin") | (role == "manager") ? item : "xxxxxxxx",
    },
    {
      title: "Giá bán",
      dataIndex: "sale_price",
      key: "sale_ price",
    },
    {
      title: "Giá thuê",
      dataIndex: "rental_price",
      key: "rental_price",
    },
    {
      title: "Thông tin bất động sản",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => (
        <>
          <p>
            - {record.area}m<sup>2</sup> - {record.project.project_name} -{" "}
            {record.balcony_direction.balcony_direction_name} -{" "}
            {record.bedrooms}
            PN
          </p>
          <p>- {record.notes}</p>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (item) => (
        <>
          <Flex gap="small" wrap>
            <Button type="primary" onClick={() => actionRequest(item)}>
              Yêu cầu
            </Button>
            <Button
              type="primary"
              style={{ backgroundColor: "rgb(217 5 255)" }}
              onClick={() => {
                prop.changeOn();
                prop.changeId(item);
              }}
            >
              Hình ảnh
            </Button>
            <Button
              type="primary"
              style={{ backgroundColor: "rgb(250, 173, 20)" }}
              onClick={() => {
                prop.changeOpen();
                prop.changeId(item);
              }}
            >
              Sửa
            </Button>
            <Button type="primary" danger on onClick={() => onDelete(item)}>
              Xoá
            </Button>
          </Flex>
        </>
      ),
    },
  ];

  const actionRequest = (id) => {
    axios
      .post("http://localhost:3001/request", { id: id })
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  };

  const onDelete = (id) => {
    prop.changeLoading();
    axios
      .post("http://localhost:3001/delete", { id: id })
      .then((res) => prop.changeLoading())
      .catch((e) => console.log(e));
  };

  return (
    <Table columns={columns} dataSource={prop.data} loading={prop.isLoading} />
  );
};

export default ALl;
