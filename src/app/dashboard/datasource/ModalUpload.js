"use client";
import { Modal, Upload, Image, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { getCookie } from "cookies-next";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const ModalUpload = (prop) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const afterOpenChange = () => {
    getDetailApartment(prop.id);
  };

  const getDetailApartment = (id) => {
    axios
      .post("https://connecthome.vn/apartment/detail", { id: id })
      .then((res) => {
        var detail = res.data.detail.image;
        var arr = [];
        if (detail) {
          detail.forEach((element) => {
            var item = { url: "https://connecthome.vn" + element };
            arr.push(item);
          });
        }
        setFileList(arr);
      })
      .catch((e) => console.log(e));
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
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
  );

  const customRequest = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    var formData = new FormData();
    formData.append("id", prop.id);
    formData.append("file", file);
    axios
      .post("https://connecthome.vn/apartment/upload", formData, config)
      .then((res) => {
        onSuccess("Ok");
        // setFileList(res.data.image)
        var arr = [];
        if (res.data.image) {
          res.data.image.forEach((element) => {
            var item = { url: "https://connecthome.vn" + element };
            arr.push(item);
          });
        }
        setFileList(arr);
        mutate("https://connecthome.vn/apartment");
      })
      .catch((e) => {
        onError({ e });
        console.log(e);
      });
  };

  const onRemove = (item) => {
    if (getCookie("role") != "staff") {
      var str = item.url;
      str = str.slice(str.search("d/") + 2);
      axios
        .post("https://connecthome.vn/apartment/delete-image", {
          id: prop.id,
          name: str,
        })
        .then((res) => mutate("https://connecthome.vn/apartment"))
        .catch((e) => console.log(e));
    } else {
      messageApi.open({
        type: "error",
        content: "Bạn không được xoá.",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Thêm hình ảnh"
        open={prop.open}
        onCancel={prop.hideModal}
        onClose={prop.hideModal}
        onOk={prop.hideModal}
        width={700}
        afterOpenChange={afterOpenChange}
        keyboard={true}
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          customRequest={customRequest}
          onRemove={onRemove}
          onDownload={(file)=> {
            console.log(file)
          }}
          showUploadList={{showDownloadIcon: true}}
        >
          {fileList.length >= 10 ? null : uploadButton}
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{
              display: "none",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
            alt="..."
          />
        )}
      </Modal>
    </>
  );
};

export default ModalUpload;
