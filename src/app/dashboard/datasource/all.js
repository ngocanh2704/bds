import axios from "axios";
import { useEffect, useState,useRef } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Table, Input, Form, Space } from "antd";
import Highlighter from 'react-highlight-words';


const ALl = (prop) => {
  const { Search } = Input;

  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [dataAll, setDataAll] = useState([]);

  const [selectionType, setSelectionType] = useState("checkbox");

  useEffect(() => {
    var jwt = "";
    if (typeof window !== "undefined") {
      jwt = localStorage.getItem("jwt") || "";
    }
    const getData = () => {
      axios
        .get("https://api.connecthome.vn/apartment", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((res) => {
          setDataAll(res.data.data);
          setIsLoading(false);
        })
        .catch((e) => {
          redirect("/login");
        });
    };
    getData();
  }, [isLoading]);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => {
        return <>{index}</>;
      },
    },
    {
      title: "Căn hộ",
      dataIndex: "apartment_name",
      key: "apartment_name",
      ...getColumnSearchProps('apartment_name')
    },
    {
      title: "Chủ căn hộ",
      dataIndex: "owner",
      key: "owner",
      render: (item) =>
        (role == "admin") | (role == "manager") ? item : "xxxxxxxx",
      ...getColumnSearchProps('owner')
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
      render: (item) =>
        (role == "admin") | (role == "manager") ? item : "xxxxxxxx",
      ...getColumnSearchProps('phone_number')
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
      .post("https://api.connecthome.vn/request", { id: id })
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  };

  const onDelete = (id) => {
    prop.changeLoading();
    axios
      .post("https://api.connecthome.vn/delete", { id: id })
      .then((res) => prop.changeLoading())
      .catch((e) => console.log(e));
  };

  

  return (
    <>
      {/* <Search style={{ marginBottom: 20 }} /> */}
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataAll}
        loading={isLoading}
      />
    </>
  );
};

export default ALl;
