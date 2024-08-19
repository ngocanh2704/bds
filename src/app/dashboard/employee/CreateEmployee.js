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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { mutate } from "swr";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const CreateEmployee = (prop) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [data, setData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [detail, setDetail] = useState([]);
  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  const dateFormat = "DD/MM/YYYY";
  const onFinish = () => {
    var values = form.getFieldsValue();
    console.log(values)
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("cccd_image", file);
    });
    formData.append(
      "employee_name",
      values.employee_name ? values.employee_name : ""
    );
    formData.append("start_date", values.start_date ? values.start_date : "");
    formData.append("gender", values.gender == true ? true : false);
    formData.append(
      "phone_number",
      values.phone_number ? values.phone_number : ""
    );
    formData.append(
      "email_address",
      values.email_address ? values.email_address : ""
    );
    formData.append("dob", values.dob ? values.dob : "");
    formData.append(
      "employment_status_id",
      (values.employment_status_id ? values.employment_status_id : data[0]?.value)
    );
    prop.id ? formData.append('id',prop.id) : null
    var urlCreate = "https://cors-iht.onrender.com/https://api.connecthome.vn/employee/create";
    var urlEdit = "https://cors-iht.onrender.com/https://api.connecthome.vn/employee/edit";
    axios
      .post(prop.id ? urlEdit : urlCreate, formData, {
        headers: {
          "Content-Type": "multipart/formdata",
        },
      })
      .then((res) => {
        prop.hideModal()
        // prop.isLoading();
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
        mutate('https://cors-iht.onrender.com/https://api.connecthome.vn/employee')
      })
      .catch((e) => {
        messageApi.open({
          type: "warning",
          content: e.response.data.message,
        });
      });
  };

  const getDetailEmployee = (id) => {
    axios
      .post("https://cors-iht.onrender.com/https://api.connecthome.vn/employee/detail", { id: id })
      .then((res) => {
        form.setFieldsValue({
          employee_name: res.data.employee.employee_name,
          gender: res.data.employee.gender,
          phone_number: res.data.employee.phone_number,
          email_address: res.data.employee.email_address,
          dob: res.data.employee.dob ?moment(res.data.employee.dob): null,
          start_date: res.data.employee.start_date? moment(res.data.employee.start_date): null,
          employment_status_id: res.data.employee.employment_status_id,
          cccd_image: [
            { url: "https://cors-iht.onrender.com/https://api.connecthome.vn" + res.data.employee.cccd_image },
          ],
        });
      })
      .catch((e) => console.log(e));
  };

  const changDataForOptions = () => {
    if (prop.id) {
      getDetailEmployee(prop.id);
    } else {
      form.resetFields();
    }
    var array = [];
    prop.status.forEach((element) => {
      array.push({
        value: element._id,
        label: element.Employment_Status_Name,
      });
    });
    console.log(array)
    setData(array);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={prop.id ? "Sửa nhân viên":"Thêm mới nhân viên" }
        open={prop.open}
        onOk={onFinish}
        onCancel={prop.hideModal}
        onClose={prop.hideModal}
        width={700}
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
              maxWidth: 1000,
            }}
            form={form}
          >
            <Form.Item label="Họ và tên" name="employee_name">
              <Input />
            </Form.Item>
            <Form.Item label="Ngày bắt đầu làm việc" name="start_date">
              <DatePicker style={{ width: 150 }} format={dateFormat} />
            </Form.Item>
            <Form.Item label="Giới tính" name="gender">
              <Select
                style={{ width: 150 }}
                options={[
                  { value: true, label: "Nam" },
                  { value: false, label: "Nữ" },
                ]}
                defaultValue={{ value: true, label: "Nam" }}
              ></Select>
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone_number">
              <InputNumber style={{ width: 150 }} />
            </Form.Item>
            <Form.Item label="Email" name="email_address">
              <Input />
            </Form.Item>
            <Form.Item label="Ngày sinh" name="dob">
              <DatePicker style={{ width: 150 }} format={dateFormat} />
            </Form.Item>
            <Form.Item
              label="Tình trạng công việc"
              name="employment_status_id"
            >
              <Select
                style={{ width: 150 }}
                options={data}
              ></Select>
            </Form.Item>
            <Form.Item
              label="Upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              name="cccd_image"
            >
              <Upload
                listType="picture-card"
                {...props}
                fileList={fileList}
                maxCount={1}
              >
                <button
                  style={{
                    border: 0,
                    background: "none",
                  }}
                  type="button"
                >
                  <PlusOutlined />
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </button>
              </Upload>
            </Form.Item>
          </Form>
        </>
      </Modal>
    </>
  );
};
export default CreateEmployee;
