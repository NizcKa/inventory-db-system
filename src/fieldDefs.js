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
    { label: "District", 
      key: "District",
      options: [
        "DR. SANTIAGO LACDAO MEMORIAL HEALTH CENTER",
        "ADMIN DIVISION",
        "SANITATION DIVISION",
        "NORTH DISTRICT HEALTH CENTER",
        "SOUTH DISTRICT HEALTH CENTER",
        "EAST DISTRICT HEALTH CENTER",
        "WEST DISTRICT HEALTH CENTER"
      ]
    },
    { label: "Location", key: "Equipment_Location" },
  ];