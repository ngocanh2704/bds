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
import { mutate } from "swr";

const ModalFurnished = (prop) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = () => {
    var values = form.getFieldsValue();
    values.id = prop.id;
    var urlCreate = "https://connecthome.vn/furnished/create";
    var urlEdit = "https://connecthome.vn/furnished/edit";
    axios
      .post(prop.id ? urlEdit : urlCreate, values)
      .then((res) => {
        mutate('https://connecthome.vn/furnished')
        prop.hideModal();
        prop.isLoading(),
          messageApi.open({
            type: "success",
            content: res.data.message,
          });

      })
      .catch((e) => {
        // messageApi.open({
        //   type: "warning",
        //   content: e.response.data.message,
        // });
        console.log(e)
      });
  };

  const getDetailProject = (id) => {
    axios
      .post("https://connecthome.vn/furnished/detail", { id: id })
      .then((res) => {
        console.log(res)
        form.setFieldsValue({
          furnished_name: res.data.data.furnished_name
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
        title={prop.id ? "Sửa nội thất" : "Thêm nội thất"}
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
            <Form.Item label="Nội thất" name="furnished_name">
              <Input />
            </Form.Item>
          </Form>
        </>
      </Modal>
    </>
  );
};

export default ModalFurnished;
