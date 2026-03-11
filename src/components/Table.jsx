// table for testing
import React from 'react';

const Table = ({ items, selectedItem, setSelectedItem, onEdit }) => { //should be functional?
  if (!items.length) return <p>No items found.</p>;

  return (
    <table className="table table-striped table-bordered">
      <thead className="table-light">
        <tr>
          <th>Item ID</th>
          <th>Type</th>
          <th>Description</th>
          <th>Brand</th>
          <th>Property No.</th>
          <th>Acquisition Date</th>
          <th>Cost</th>
          <th>Memorandum</th>
          <th>District</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr
            key = { item.Index_ID }
            onClick = { () => setSelectedItem( item ) }
            onDoubleClick = { () => onEdit( item ) }
            className = { selectedItem?.Index_ID === item.Index_ID ? "table-primary" : "" }
            style = {{ cursor : "pointer" }}
          >
            <td>{item.Index_ID || "N/A"}</td>
            <td>{item.Type || "N/A"}</td>
            <td>{item.Property_Description || "N/A"}</td>
            <td>{item.Brand || "N/A"}</td>
            <td>{item.Property_Number || "N/A"}</td>
            <td>{item.Acquisition_Date || "N/A"}</td>
            <td>{item.Acquisition_Cost || "N/A"}</td>
            <td>{item.Memorandum_Receipt || "N/A"}</td>
            <td>{item.District || "N/A"}</td>
            <td>{item.Equipment_Location || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;