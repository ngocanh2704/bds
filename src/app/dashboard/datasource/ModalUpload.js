"use client";
import { Modal, Upload, Image, message, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { getCookie } from "cookies-next";
import { saveAs } from "file-saver";

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
      .post("https://api.connecthome.vn/apartment/detail", { id: id })
      .then((res) => {
        var detail = res.data.detail.image;
        var arr = [];
        if (detail) {
          detail.forEach((element) => {
            var item = { url: "https://api.connecthome.vn" + element };
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
  // const handleChange = ({fileList: newFileList}) =>setFileList(newFileList);
  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const beforeUpload = (file) => {
    setFileList([...fileList, file]);
    return false;
  };

  const handleUpload = () => {
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    var arr = [];
    var formData = new FormData();
    if (fileList.length > 0) {
      fileList.forEach((item) => {
        if(item.originFileObj){
          formData.append("files", item.originFileObj)
        }
      });
      formData.append("id", prop.id);
      axios
        .post("https://api.connecthome.vn/apartment/upload", formData, config)
        .then((res) => {
          mutate("https://api.connecthome.vn/apartment");
        })
        .catch((e) => {
          console.log(e);
        });
    }
    prop.hideModal();

  };

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

  //   const customRequest = async (options) => {
  //     const { onSuccess, onError, file, onProgress } = options;
  //     const config = {
  //       headers: { "content-type": "multipart/form-data" },
  //       onUploadProgress: (event) => {
  //         const percent = Math.floor((event.loaded / event.total) * 100);
  //         setProgress(percent);
  //         if (percent === 100) {
  //           setTimeout(() => setProgress(0), 1000);
  //         }
  //         onProgress({ percent: (event.loaded / event.total) * 100 });
  //       },
  //     };
  //     fileList.forEach(item=>{
  //     var formData = new FormData();
  //     formData.append("id", prop.id);
  //     formData.append("file", item.originFileObj);
  //     axios
  //       .post("https://api.connecthome.vn/apartment/upload", formData, config)
  //       .then((res) => {
  //         onSuccess("Ok");
  //         var arr = []
  //         // console.log(res.data.image.length)
  //         if (res.data.image) {
  //           res.data.image.forEach((element) => {
  //             var item2 = { url: "https://api.connecthome.vn" + element };
  //             arr.push(item2);
  //             setFileList([]);
  //           });
  //         }
  //         setFileList(arr);
  //     mutate("https://api.connecthome.vn/apartment");
  //       })
  //       .catch((e) => {
  //         onError({ e });
  //         console.log(e);
  //       });
  // // console.log()
  //     })
  //   };

  const onRemove = (item) => {
    if (getCookie("role") != "staff") {
      var str = item.url;
      str = str.slice(str.search("d/") + 2);
      axios
        .post("https://api.connecthome.vn/apartment/delete-image", {
          id: prop.id,
          name: str,
        })
        .then((res) => mutate("https://api.connecthome.vn/apartment"))
        .catch((e) => console.log(e));
    } else {
      messageApi.open({
        type: "error",
        content: "Bạn không được xoá.",
      });
    }
  };

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const downloadImage = async () => {
    fileList.forEach(async item => {
      const nameSplit = item.url.split('/')
      const duplicateName = nameSplit.pop()
      saveAs(item.url,duplicateName)
      await sleep(1000);
    })
    prop.hideModal()
  }

  return (
    <>
      {contextHolder}
      <Modal
        title="Thêm hình ảnh"
        open={prop.open}
        onCancel={prop.hideModal}
        cancelText={'Huỷ'}
        onClose={prop.hideModal}
        onOk={handleUpload}
        okText={'Lưu'}
        width={700}
        afterOpenChange={afterOpenChange}
        keyboard={true}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <Button onClick={() => downloadImage() }>Tải hình ảnh</Button>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          beforeUpload={beforeUpload}
          onPreview={handlePreview}
          onChange={handleChange}
          // customRequest={customRequest}
          onRemove={onRemove}
          multiple
        >
          {fileList.length >= 20 ? null : uploadButton}
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
