  // definition of fields to render
  export const fieldDefs = [
    { label: "Type", 
      key: "Type", 
      options: ["ICT EQUIPMENT", "OFFICE EQUIPMENT"],  // dropdown options
      searchable: true,
      required: true 
    },
    
    { label: "Description", 
      key: "Property_Description", 
      searchable: true,
      required: true 
    },

    { label: "Brand", 
      key: "Brand", 
      searchable: true 
    },

    { label: "Property Number", 
      key: "Property_Number", 
      searchable: true 
    },

    { label: "Acquisition Date", 
      key: "Acquisition_Date", 
      type: "date", 
      partialDate: true 
    },

    { label: "Cost", 
      key: "Acquisition_Cost", 
      type: "number",
    },

    { label: "Memorandum", 
      key: "Memorandum_Receipt", 
    },

    { label: "District", 
      key: "District",
      options: [
        "DR. SANTIAGO LACDAO MEMORIAL HEALTH CENTER",
        "ADMIN DIVISION",
        "SANITATION DIVISION",
        "NORTH SUPER HEALTH CENTER",
        "SOUTH DISTRICT HEALTH CENTER",
        "EAST DISTRICT HEALTH CENTER",
        "WEST DISTRICT HEALTH CENTER"
      ],
      searchable: true, 
      required: true 
    },

    { label: "Location", 
      key: "Equipment_Location" 
    },
  ];