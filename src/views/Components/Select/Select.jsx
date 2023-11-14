import { Typography } from "@mui/material";
import React from "react";
import Select from "react-select";

const CustomSelect = ({
  id,
  value,
  label,
  isDisabled,
  placeholder,
  options,
  onChange,
  touched,
  error,
  loading,
  ...otherProps
}) => {
  const isError = touched && error;

  const placeholderStyle = isError ? { color: "#d32f2f" } : {};
  return (
    <>
      <Select
        {...otherProps} // other props like multi searchable etc
        id={id}
        isLoading={loading}
        placeholder={placeholder}
        isSearchable={true}
        value={value}
        label={label}
        isDisabled={isDisabled}
        options={options}
        onChange={onChange}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            fontFamily: "Roboto",
            background: state.isDisabled ? "#e0e0e0" : "transparent",
            borderColor: touched && error ? "red" : "rgba(0, 0, 0, 0.2)",
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            zIndex: 9999,
            fontFamily: "Roboto",
            fontSize: "16px",
          }),
          placeholder: (baseStyles) => ({
            ...baseStyles,
            ...placeholderStyle,
          }),
        }}
      />
      {error && (
        <Typography pl={1} color='error' variant='caption' className="Mui-error">
          {error ? error : null}
        </Typography>
      )}
    </>
  );
};

export default CustomSelect;
