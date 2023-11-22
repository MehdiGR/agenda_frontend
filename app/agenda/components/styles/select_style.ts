// Default style select
export const selectDefaultStyle = {
  control: (provided: any) => ({
    ...provided,
    border: "1px solid #D1D5DB",
    borderRadius: "0.375rem",
    fontSize: "16px",
    width: "100%",
  }),
};

export const selectHourStyles = {
  control: (provided: any) => ({
    ...provided,
    fontSize: "16px",
    width: "60px",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#383838",
    width: "10px",
    marginRight: "5px",
    transform: "scale(1.3)",
    padding: "0",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none",
  }),
  menu: (provided: any) => ({
    ...provided,
    width: "200px",
  }),
};
