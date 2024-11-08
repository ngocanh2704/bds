import axios from "axios";
import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Button,
  Flex,
  Table,
  Input,
  Form,
  Space,
  Tag,
  message,
  Popconfirm,
} from "antd";
import { deleteCookie, getCookie } from "cookies-next";
import useSWR, { mutate } from "swr";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  actApproveApartment,
  actDeleteRequestApproveApartment,
  actFecthRequestApartment,
} from "@/actions/actionApartment";

const config = {
  headers: { Authorization: `Bearer ${getCookie("token")}` },
};
const fetcher = (url) => axios.get(url, config).then((res) => res.data);

const Request = forwardRef(function Request(prop, ref) {
  const [role, setRole] = useState("");
  // const [data, setData] = useState([])
  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();
  const getData = () => dispatch(actFecthRequestApartment());
  const actionRequest = (id) => dispatch(actApproveApartment(id));
  const handleDelete = (id) => dispatch(actDeleteRequestApproveApartment(id));
  const loading = useSelector((state) => state.apartment.isLoading);
  const data = useSelector((state) => state.apartment.data);

  useEffect(() => {
    getData();
  }, []);

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
  }, []);

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

  const confirm = (id) => {
    // message.success("Click on Yes");
    handleDelete(id);
    message.success("Căn hộ đã được xoá thành công.");
    getData();
  };

  const cancel = (e) => {
    message.error("Bạn đã huỷ thao tác.");
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
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
      sorter: {
        compare: (a, b) => a.sale_price - b.sale_price,
        multiple: 1,
      },
    },
    {
      title: "Giá thuê",
      dataIndex: "rental_price",
      key: "rental_price",
      render: (item) =>
        item ? `${item}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : 0,
      sorter: {
        compare: (a, b) => a.rental_price - b.rental_price,
        multiple: 2,
      },
    },
    {
      title: "Thông tin bất động sản",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => (
        <>
          <p>
            - {record.area}m<sup>2</sup> - {record.project?.project_name} -{" "}
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
      render: (text, record, index) => (
        <>
          <Flex gap="small" wrap>
            {(role == "admin") | (role == "manager") ? (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    actionRequest(record.id);
                    messageApi.open({
                      type: "success",
                      content: "Đã duyệt yêu cầu thành công",
                    });
                  }}
                >
                  Duyệt yêu cầu
                </Button>
                <Popconfirm
                  title="Xoá yêu cầu"
                  description={`Bạn có muốn xoá yêu cầu?`}
                  onConfirm={() => confirm(record.id)}
                  onCancel={cancel}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="primary" danger>
                    Xoá
                  </Button>
                </Popconfirm>
              </>
            ) : (
              ""
            )}

            {record.image.length == 0 ? (
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
          </Flex>
        </>
      ),
    },
  ];

  // const actionRequest = (id) => {
  //   axios
  //     .post("https://api.connecthome.vn/apartment/approve-data", {
  //       id: id,
  //       user: getCookie("user"),
  //     })
  //     .then((res) => {
  //       // getData()
  //     })
  //     .catch((e) => console.log(e));
  // };

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
      {contextHolder}
      <Table
        rowSelection={{
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record) => record.id}
        size="small"
        pagination={{
          defaultPageSize: 20,
          pageSizeOptions: [20, 30, 40, 50],
          showSizeChanger: true,
        }}
      />
    </>
  );
});

export default Request;
