import axios from "axios";
import { useEffect, useState, useRef } from "react";
import {
  Button,
  Flex,
  Table,
  Switch,
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
  actChangeStatusApartment,
  actDeleteApartment,
  actFetchApartment,
  actRequestApartment,
  actSearchApartment,
  setSelectedRows,
} from "@/actions/actionApartment";
import moment from "moment";
import compareAndAddArrays from "@/ultil/compareAndAddarrays";

const config = {
  headers: { Authorization: `Bearer ${getCookie("token")}` },
};
const fetcher = (url) => axios.get(url, config).then((res) => res.data);

const ALl = (prop) => {
  const [role, setRole] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);

  // useEffect(()=>{
  //   prop.search.length == 0 ? setDataAll(data) : setDataAll(prop.search)
  // },[prop.search])
  const dispatch = useDispatch();
  const onChangeStatus = (values) => dispatch(actChangeStatusApartment(values));
  const actionRequest = (id) => dispatch(actRequestApartment(id));
  const dataApartment = useSelector((state) => state.apartment.data);
  const loading = useSelector((state) => state.apartment.isLoading);
  const total_page = useSelector((state) => state.apartment.total_page);
  const chechSearch = useSelector((state) => state.apartment.search);
  const valuesSearch = useSelector((state) => state.apartment.values);
  const keySearch = useSelector((state) => state.apartment.key);
  const curPage = useSelector((state) => state.apartment.page);
  const selectedRow = useSelector((state) => state.apartment.selectedRows);
  const handleDelete = (id) => dispatch(actDeleteApartment(id));
  const getApartment = (page) => dispatch(actFetchApartment(page));
  const searchApartment = (values, key, page) =>
    dispatch(actSearchApartment(values, key, page));
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
  useEffect(() => {
    if (prop.search.length != 0) {
      setData(prop.search);
    }
  }, [prop.search]);

  const spliceString = (text) => {
    var text = text.charAt(text.lenght);
    return text + "x";
  };

  const rowSelection = {
    selectedRowKeys: useSelector((state) => state.apartment.selectedRows),
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch(setSelectedRows(selectedRowKeys,selectedRows));
      prop.yeuCauDongLoat(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
    preserveSelectedRowKeys: true
  };

  useEffect(() => {
    setRole(getCookie("role"));
  }, []);

  const confirm = (id) => {
    // message.success("Click on Yes");
    handleDelete(id);
    message.success("Căn hộ đã được xoá thành công.");
    chechSearch == true
      ? searchApartment(valuesSearch, keySearch, page)
      : getApartment(page);
  };
  const cancel = (e) => {
    message.error("Bạn đã huỷ thao tác.");
  };

  const changeStatus = (record) => {
    onChangeStatus(record);
    chechSearch == true
      ? searchApartment(valuesSearch, keySearch, page)
      : getApartment(page);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      // key: "_id",
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
          <p>
            -{" "}
            {record.user_id?.employee_ID?.employee_name ? record.user_id?.employee_ID?.employee_name +
              " đã cập nhật ngày " +
              moment(record.updatedAt).format("DD/MM/YYYY") : ''}
          </p>
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
            {role == "staff" ? (
              ""
            ) : (
              <Switch
                checked={record.status}
                onClick={() => {
                  changeStatus(record);
                }}
              ></Switch>
            )}
            <Button
              type="primary"
              onClick={() => {
                actionRequest(record._id),
                  messageApi.open({
                    type: "success",
                    content: "Đã yêu cầu thành công",
                  });
              }}
            >
              Yêu cầu
            </Button>
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
                {/* <Button
                  type="primary"
                  danger
                  on
                  onClick={() => {
                    // onDelete(record._id)
                    // handleDelete(record._id);
                  }}
                >
                  Xoá
                </Button> */}
                <Popconfirm
                  title="Xoá căn hộ"
                  description={`Bạn có muốn xoá căn hộ?`}
                  onConfirm={() => confirm(record._id)}
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
          </Flex>
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      hidden: true,
    },
  ]

  return (
    <>
      {/* <Search style={{ marginBottom: 20 }} /> */}
      {contextHolder}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataApartment}
        loading={loading}
        rowKey={(record) => record._id}
        size="small"
        onChange={(pagination) => {
          setPage(pagination.current);
          chechSearch == true
            ? searchApartment(valuesSearch, keySearch, pagination.current)
            : getApartment(pagination.current);
        }}
        pagination={{
          defaultPageSize: 50,
          total: total_page,
          showSizeChanger: false,
          current: curPage == undefined ? 1 : page,
        }}
      />
    </>
  );
};

export default ALl;
