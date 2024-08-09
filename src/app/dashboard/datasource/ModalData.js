import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import axios from "axios";
import moment from "moment";

const ModalData = (prop) => {
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;
  const [data, setData] = useState([]);
  const [dataProject, setDataProject] = useState([]);
  const [dataAxis, setDataAxis] = useState([]);
  const [dataBalcon, setDataBalcon] = useState([]);
  const [dataStatus, setDataStatus] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const dateFormat = "DD/MM/YYYY";
  const onFinish = async () => {
    var values = form.getFieldsValue();
    console.log(values);
    console.log(values.available);
    values.available_from = values.available[0];
    values.available_until = values.available[1];
    if (prop.id) {
      values.id = prop.id
    }
    var urlEdit = 'http://14.169.150.105:3001/apartment/edit'
    var urlCreate = 'http://14.169.150.105:3001/apartment/create'
    axios
      .post(prop.id ? urlEdit : urlCreate, values)
      .then((res) => {
        prop.hideModal()
      })
      .catch((e) => console.log(e));
  };

  const getDataProject = () => {
    axios
      .get("http://14.169.150.105:3001/project")
      .then((res) => {
        var array = [];
        res.data.data.forEach((item) => {
          array.push({
            value: item._id,
            label: item.project_name,
          });
        });
        setDataProject(array);
      })
      .catch((e) => console.log(e));
  };

  const getDataAxis = () => {
    axios
      .get("http://14.169.150.105:3001/axis")
      .then((res) => {
        var array = [];
        res.data.data.forEach((item) => {
          array.push({
            value: item._id,
            label: item.axis_name,
          });
        });
        setDataAxis(array);
      })
      .catch((e) => console.log(e));
  };

  const getDataBalcon = () => {
    axios
      .get("http://14.169.150.105:3001/balconyDirection")
      .then((res) => {
        var array = [];
        res.data.data.forEach((item) => {
          array.push({
            value: item._id,
            label: item.balcony_direction_name,
          });
        });
        setDataBalcon(array);
      })
      .catch((e) => console.log(e));
  };
  const getDataStatus = () => {
    axios
      .get("http://14.169.150.105:3001/status")
      .then((res) => {
        var array = [];
        res.data.data.forEach((item) => {
          array.push({
            value: item._id,
            label: item.status_name,
          });
        });
        setDataStatus(array);
      })
      .catch((e) => console.log(e));
  };

  const getDetailApartment = (id) => {
    axios
      .post("http://14.169.150.105:3001/apartment/detail", { id: id })
      .then((res) => {
        var detail = res.data.detail
        var available = [moment(detail.available_from),moment(detail.available_until)]
        form.setFieldsValue({
          project: res.data.detail.project._id,
          apartment_name: detail.apartment_name,
          floor: detail.floor,
          axis: detail.axis._id,
          owner: detail.owner,
          phone_number: detail.phone_number,
          property: detail.property,
          area: detail.area,
          bedrooms: detail.bedrooms,
          bathrooms: detail.bathrooms,
          sale_price: detail.sale_price,
          rental_price: detail.rental_price,
          furnished: detail.furnished,
          balconies: detail.balconies,
          balcony_direction: detail.balcony_direction._id,
          last_updated: moment(detail.last_updated),
          status: detail.status._id,
          notes: detail.notes,
          available: available
        })
       })
      .catch((e) => console.log(e));
  };

  const changDataForOptions = () => {
    if (prop.id) {
      getDetailApartment(prop.id);
    } else {
      form.resetFields();
    }
    getDataProject();
    getDataAxis();
    getDataBalcon();
    getDataStatus();
  };
  return (
    <>
      {contextHolder}
      <Modal
        title={prop.id ? "Sửa thông tin căn hộ" : "Thêm căn hộ mới"}
        open={prop.open}
        onOk={onFinish}
        onCancel={prop.hideModal}
        onClose={prop.hideModal}
        width={1300}
        // afterOpenChange={changDataForOptions}
        afterOpenChange={() => {
          changDataForOptions();
        }}
      >
        <>
          <Form
            labelCol={{
              span: 7,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            // disabled={componentDisabled}
            style={{
              maxWidth: 1300,
            }}
            form={form}
          >
            <Row>
              <Col span={12}>
                <Form.Item label="Dự án" name="project">
                  <Select options={dataProject}></Select>
                </Form.Item>
                <Form.Item label="Tên căn hộ" name="apartment_name">
                  <Input />
                </Form.Item>
                <Form.Item label="Tầng" name="floor">
                  <Input />
                </Form.Item>
                <Form.Item label="Trục căn hộ" name="axis">
                  <Select options={dataAxis}></Select>
                </Form.Item>
                <Form.Item label="Chủ căn hộ" name="owner">
                  <Input />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phone_number">
                  <Input />
                </Form.Item>
                <Form.Item label="Loại bất động sản" name="property">
                  <Input />
                </Form.Item>
                <Form.Item label="Diện tích" name="area">
                  <Input />
                </Form.Item>
                <Form.Item label="Số phòng ngủ" name="bedrooms">
                  <Input />
                </Form.Item>
                <Form.Item label="Số phòng vệ sinh" name="bathrooms">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Giá bán" name="sale_price">
                  <InputNumber
                    style={{ width: 150 }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item label="Giá cho thuê" name="rental_price">
                  <InputNumber
                    style={{ width: 150 }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item label="Cho thuê" name="available">
                  <RangePicker format={dateFormat} />
                </Form.Item>
                <Form.Item label="Nội thất" name="furnished">
                  <Select
                    options={[
                      { value: true, label: "Full nội thất" },
                      { value: false, label: "Cơ bản" },
                    ]}
                    defaultValue={true}
                  ></Select>
                </Form.Item>
                <Form.Item label="Số ban công" name="balconies">
                  <Input />
                </Form.Item>
                <Form.Item label="Hướng ban công" name="balcony_direction">
                  <Select options={dataBalcon}></Select>
                </Form.Item>
                <Form.Item
                  label="Thời gian cập nhật căn hộ"
                  name="last_updated"
                >
                  <DatePicker format={dateFormat} />
                </Form.Item>
                <Form.Item label="Trạng thái" name="status">
                  <Select options={dataStatus} defaultValue={data[0]}></Select>
                </Form.Item>
                <Form.Item label="Ghi chú" name="notes">
                  <TextArea />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      </Modal>
    </>
  );
};

export default ModalData;
