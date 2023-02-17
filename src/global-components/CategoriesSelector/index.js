import { PlusOutlined } from "@ant-design/icons";
import { Button, Tag, Tooltip, Checkbox, Modal } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import CATEGORY_API from "../../api/category";
import { STATUS_FAIL } from "../../constants/api";
import "./style.scss";

const CategoriesSeletor = ({ defaultItems = [], onSubmit, defaultChecked }) => {
  const [categories, setCategories] = useState([]);
  const [totalCategories, setTotalCategories] = useState(
    defaultItems.map((item) => ({
      label: item.name,
      value: item._id,
    }))
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleClose = (removedTag) => {
    const tagsRest = totalCategories.filter(
      (tag) => tag.value !== removedTag.value
    );
    setTotalCategories(tagsRest);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleSave = () => {
    setTotalCategories(selectedCategories);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const onChange = (checkedValues) => {
    const selectedObjects = checkedValues.map((item) =>
      categories.find((el) => el.value === item)
    );

    setSelectedCategories([...selectedObjects]);
  };

  useEffect(async () => {
    const response = await CATEGORY_API.getAllCategory();
    console.log(response)
    if (response.status === STATUS_FAIL) return console.log(response.message);

    setCategories(
      response.data.map((item) => ({
        label: item.name,
        value: item._id,
      }))
    );
  }, []);

  useEffect(() => {
    onSubmit && onSubmit(totalCategories);
  }, [totalCategories]);

  return (
    <div id="tags">
      <div className="tags-list">
        {totalCategories.map((tag, index) => (
          <Tag
            className="edit-tag"
            key={tag.value}
            closable={index !== -1}
            onClose={() => handleClose(tag)}
          >
            {tag.label}
          </Tag>
        ))}
        <Button
          onClick={handleShowModal}
          icon={<PlusOutlined />}
          type="primary"
        >
          Thêm thể loại
        </Button>
        <Modal
          title="Thêm chủ đề"
          centered
          visible={showModal}
          onOk={handleSave}
          onCancel={handleCancel}
          destroyOnClose
        >
          <Checkbox.Group
            options={categories}
            onChange={onChange}
            defaultValue={defaultChecked?.map((item) => item.value)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CategoriesSeletor;
