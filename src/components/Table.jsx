// table for testing
import React from 'react';

const Table = ({ items }) => {
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
          <tr key={item.Index_ID}>
            <td>{item.Index_ID}</td>
            <td>{item.Type}</td>
            <td>{item.Property_Description}</td>
            <td>{item.Brand}</td>
            <td>{item.Property_Number}</td>
            <td>{item.Acquisition_Date}</td>
            <td>{item.Acquisition_Cost}</td>
            <td>{item.Memorandum_Receipt}</td>
            <td>{item.District}</td>
            <td>{item.Location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;