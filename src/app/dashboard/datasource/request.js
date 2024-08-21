import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Button, Flex, Table, Input, Form, Space, Tag } from "antd";
import { deleteCookie, getCookie } from "cookies-next";
import useSWR, { mutate } from "swr";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";

const config = {
  headers: { Authorization: `Bearer ${getCookie("token")}` },
};
const fetcher = (url) => axios.get(url, config).then((res) => res.data);

const Request = (prop) => {
  const [role, setRole] = useState("");

  const { data, error, isLoading } = useSWR(
    `https://api.connecthome.vn/apartment/request`,
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

  const spliceString = (text) => {
    var text = text.charAt(text.lenght);
    return text + "x";
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
      prop.yeuCauDongLoat(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  useEffect(() => {
    setRole(getCookie("role"));
  }, []);

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
      title: "Căn hộ",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => (
        //đỏ #ff4d4f, xanh rgb(88 206 79),
        <Tag
          style={{ fontSize: "small", backgroundColor: record.color }}
          bordered={false}
        >
          {record.building?.building_name +
            ((role == "admin") | (role == "manager")
              ? record?.floor
              : spliceString(record?.floor)) +
            record.axis?.axis_name}
        </Tag>
      ),
    },
    {
      title: "Chủ căn hộ",
      dataIndex: "owner",
      key: "owner",
      render: (item) =>
        item
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
      render: (item) =>
        item
    },
    {
      title: "Giá bán",
      dataIndex: "sale_price",
      key: "sale_ price",
      render: (item) =>
        item ? `${item}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "",
    },
    {
      title: "Giá thuê",
      dataIndex: "rental_price",
      key: "rental_price",
      render: (item) =>
        item ? `${item}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "",
    },
    {
      title: "Thông tin bất động sản",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => (
        <>
          <p>
            - {record.area}m<sup>2</sup> - {record.project.project_name} -{" "}
            {record.balcony_direction?.balcony_direction_name} -{" "}
            {record.bedrooms}
            PN
          </p>
          <p>- {record.notes}</p>
          <p>- {record.properties?.property_name}</p>
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
            {(role == "admin") | (role == "manager") ? (
              <Button type="primary" onClick={() => actionRequest(item)}>
                Duyệt yêu cầu
              </Button>
            ) : (
              ""
            )}

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
            {(role == "admin") | (role == "manager") ? (
              <>
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
              </>
            ) : (
              ""
            )}
          </Flex>
        </>
      ),
    },
  ];

  const actionRequest = (id) => {
    axios
      .post("https://api.connecthome.vn/apartment/approve-data", {
        id: id,
        user: getCookie("user"),
      })
      .then((res) => {
        mutate("https://api.connecthome.vn/apartment/request");
      })
      .catch((e) => console.log(e));
  };

  const onDelete = (id) => {
    axios
      .post("https://api.connecthome.vn/delete", { id: id })
      .then((res) => {
        mutate("https://api.connecthome.vn/apartment");
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      {/* <Search style={{ marginBottom: 20 }} /> */}
      <Table
        rowSelection={{
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data?.data}
        loading={isLoading}
        rowKey={(record) => record._id}
      />
    </>
  );
};

export default Request;
