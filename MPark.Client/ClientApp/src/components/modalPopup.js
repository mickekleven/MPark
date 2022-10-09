import React, { Component, useState } from "react";
import ReactDOM from "react-dom";

export default function ModalPopup({ header, isOpen, children, subTitle, onHandleModal, isScrolling = true }) {
  if (!isOpen) return null;

  const scroll = isScrolling ? "modale-scroll" : "";

  return ReactDOM.createPortal(
    <div className="modale-backdrop anim-from-top fade-in-short">
      <div onClick={(e) => onHandleModal(e)} className="modale-close-x">
        X
      </div>

      <div className={`modale-main ${scroll}`}>
        <div className="modale-header">
          <h3>{header}</h3>
          <p>{subTitle}</p>
        </div>

        <div className="modale-body">{children}</div>

        <div className="modale-footer"></div>
      </div>
    </div>,
    document.getElementById("portal")
  );
}
