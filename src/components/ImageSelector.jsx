import React, { forwardRef, useImperativeHandle } from "react";

const ImageSelector = forwardRef((props, ref) => {
  const { onChange, multiple } = props;

  useImperativeHandle(ref, () => ({
    value: null, // Para resetear
  }));

  return (
    <input
      type="file"
      accept="image/*"
      onChange={onChange} // Usar onChange como prop
      multiple={multiple}
      style={{ display: "block" }}
    />
  );
});

export default ImageSelector;
