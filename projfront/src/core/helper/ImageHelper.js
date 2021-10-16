/** @format */

import React from "react";
import { API } from "../../backend";

const ImageHelper = ({ product }) => {
  const imageulr = product
    ? `${API}/product/photo/${product._id}`
    : "https://www.demilked.com/magazine/wp-content/uploads/2015/02/creative-funny-smart-tshirt-designs-ideas-15.jpg";
  return (
    <div className="rounded border border-success p-2">
      <img
        src={imageulr}
        alt="photo"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
        className="mb-3 rounded"
      />
    </div>
  );
};

export default ImageHelper;
