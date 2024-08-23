import axios from "axios";
import { useEffect, useLayoutEffect, useState } from "react";

import { Button, Flex, Table } from "antd";

const Buy = (prop) => {
  const [data, setData] = useState([]);
  const getData = () => {
    axios
      .get("https://api.connecthome.vn/khoretal")
      .then((res) => setData(res.data.data))
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    getData()
  }, [prop.data]);
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
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
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
      render: (text, record, index) => (
        <>
          <Flex gap="small" wrap>
            <Button type="primary">Yêu cầu</Button>
            {record.image[0] == undefined ? <Button
              type="primary"
              style={{ backgroundColor: "#bfbfbf" }}
              onClick={() => {
                prop.changeOn();
                prop.changeId(record._id);
              }}
            >
              Hình ảnh
            </Button> : <Button
              type="primary"
              style={{ backgroundColor: "rgb(217 5 255)" }}
              onClick={() => {
                prop.changeOn();
                prop.changeId(record._id);
              }}
            >
              Hình ảnh
            </Button>}
            <Button
              type="primary"
              style={{ backgroundColor: "rgb(250, 173, 20)" }}
            >
              Sửa
            </Button>
            <Button type="primary" danger>
              Xoá
            </Button>
          </Flex>
        </>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} size="small" />;
};

export default Buy;
