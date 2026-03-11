  // definition of fields to render
  export const fieldDefs = [
    { label: "Description", key: "Property_Description" },
    { label: "Brand", key: "Brand" },
    { label: "Property Number", key: "Property_Number" },
    { 
      label: "Type", 
      key: "Type", 
      options: ["ICT EQUIPMENT", "OFFICE EQUIPMENT"]  // dropdown options
    },
    { label: "Acquisition Date", key: "Acquisition_Date", type: "date" },
    { label: "Cost", key: "Acquisition_Cost", type: "number" },
    { label: "Memorandum", key: "Memorandum_Receipt" },
    { label: "District", key: "District" },
    { label: "Location", key: "Equipment_Location" },
  ];