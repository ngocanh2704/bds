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
import axios from "axios";

const ModalStatus = (prop) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = () => {
    var values = form.getFieldsValue();
    values.id = prop.id;
    var urlCreate = "https://api.connecthome.vn/balconyDirection/create";
    var urlEdit = "https://api.connecthome.vn/balconyDirection/edit";
    axios
      .post(prop.id ? urlEdit : urlCreate, values)
      .then((res) => {
        prop.hideModal();
        prop.isLoading(),
          messageApi.open({
            type: "success",
            content: res.data.message,
          });
      })
      .catch((e) => {
        messageApi.open({
          type: "warning",
          content: e.response.data.message,
        });
      });
  };

  const getDetailProject = (id) => {
    axios
      .post("https://api.connecthome.vn/balconyDirection/detail", { id: id })
      .then((res) => {
        console.log(res.data)
        form.setFieldsValue({
            balcony_direction_name: res.data.data.balcony_direction_name
        });
      })
      .catch((e) => console.log(e));
  };

  const changDataForOptions = () => {
    if (prop.id) {
      getDetailProject(prop.id);
    } else {
      form.resetFields();
    }
  };
  return (
    <>
      {contextHolder}
      <Modal
        title={prop.id ? "Sửa hướng ban công" : "Thêm hướng ban công"}
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
            <Form.Item label="Hướng" name="balcony_direction_name">
              <Input />
            </Form.Item>
          </Form>
        </>
      </Modal>
    </>
  );
};

export default ModalStatus;
