import axios from "axios";
import { useEffect, useLayoutEffect, useState } from "react";

import { Button, Flex, Table, Tag, Switch } from "antd";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import useSWR, { mutate } from "swr";
import { useDispatch, useSelector } from "react-redux";
import { actBanApartment, actChangeStatusApartment, actRequestApartment, banApartment } from "@/actions/actionApartment";

const config = {
  headers: { Authorization: `Bearer ${getCookie("token")}` },
};

const fetcher = (url) => axios.get(url, config).then((res) => res.data);
const Sale = (prop) => {
  const [role, setRole] = useState("");
  const dispatch = useDispatch();
  const getData = () => dispatch(actBanApartment());
  const onChangeStatus = (values) => dispatch(actChangeStatusApartment(values));
  const actionRequest = (id) => dispatch(actRequestApartment(id));
  const loading = useSelector(state=>state.apartment.isLoading)
  const handleDelete = (id) => dispatch(actDeleteApartment(id))
  useEffect(() => {
    getData();
  }, []);

  const data = useSelector((state) => state.apartment.data);

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

  const spliceString = (text) => {
    var text = text.charAt(text.lenght);
    return text + "x";
  };
  useEffect(() => {
    setRole(getCookie("role"));
    // getData();
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
      key: "sale_price",
      render: (item) =>
        item ? `${item}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : 0,
    },
    {
      title: "Giá thuê",
      dataIndex: "rental_price",
      key: "rental_price",
      render: (item) =>
        item ? `${item}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : 0,
    },
    {
      title: "Thông tin bất động sản",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => (
        <>
          <p>
            - {record.project?.project_name}-{record.area}m<sup>2</sup> -{" "}
            {record.bedrooms}PN -{" "}
            {record.balcony_direction?.balcony_direction_name}
          </p>
          <p>- {record.properties?.property_name}</p>
          <p>- {record.furnished?.furnished_name}</p>
          <p>- {record.notes}</p>
        </>
      ),
      responsive: ["sm"],
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => (
        <>
          <Flex gap="small" wrap>
            {role == "staff" ? (
              ""
            ) : (
              <Switch
                checked={record.status}
                onClick={() => onChangeStatus(record)}
              ></Switch>
            )}

            <Button type="primary" onClick={() => actionRequest(record._id)}>
              Yêu cầu
            </Button>
            {record.image[0] == undefined ? (
              <Button
                type="primary"
                style={{ backgroundColor: "#bfbfbf" }}
                onClick={() => {
                  prop.changeOn();
                  prop.changeId(record._id);
                }}
              >
                Hình ảnh
              </Button>
            ) : (
              <Button
                type="primary"
                style={{ backgroundColor: "rgb(217 5 255)" }}
                onClick={() => {
                  prop.changeOn();
                  prop.changeId(record._id);
                }}
              >
                Hình ảnh
              </Button>
            )}

            {(role == "admin") | (role == "manager") ? (
              <>
                <Button
                  type="primary"
                  style={{ backgroundColor: "rgb(250, 173, 20)" }}
                  onClick={() => {
                    prop.changeOpen();
                    prop.changeId(record._id);
                  }}
                >
                  Sửa
                </Button>
                <Button
                  type="primary"
                  danger
                  on
                  onClick={() => handleDelete(record._id)}
                >
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

  return (
    <Table
      rowSelection={{
        ...rowSelection,
      }}
      loading={loading}
      columns={columns}
      dataSource={data}
      rowKey={(record) => record._id}
      size="small"
      pagination={{
        defaultPageSize: 20,
        pageSizeOptions: [20, 30, 40, 50],
        showSizeChanger: true,
      }}
    />
  );
};

export default Sale;
