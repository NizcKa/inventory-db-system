// inventory table
import React from 'react';

const Table = ({
  items,
  selectedItem,
  setSelectedItem,
  onEdit,
  deleteMode = false,
  selectedForDelete = [],
  onToggleSelect,
  onSort,
  sortConfig = () => {}
}) => {

	// handles sorting arrow
	const getSortArrow = (columnKey) => {
		if (sortConfig.key !== columnKey || !sortConfig.direction) return '⇵'; // neutral
		return sortConfig.direction === 'asc' ? '▲' : '▼';
	};

	const formatDate = (dateStr) => {
	if (!dateStr) return "N/A";

	const parts = dateStr.split('-');

	if (parts.length === 1) {
		return parts[0];
	}

	if (parts.length === 2) {
		return `${parts[1]}-${parts[0]}`; // MM-YYYY
	}

	if (parts.length === 3) {
		const [year, month, day] = parts;
		return `${month}-${day}-${year}`; // MM-DD-YYYY
	}

	// fallback
	return dateStr;
	};

  	if (!items.length) return <p>No items found.</p>;

	return (
	<div className="table-responsive">
		<table className="table table-striped table-sm text-center align-middle fs-6">
			<thead className="table-light">
				<tr>
					{deleteMode && <th>Select</th>}
					<th>Item ID</th>
					<th>Type</th>
					<th>Description</th>
					<th>Brand</th>
					<th>Property No.</th>
					<th
						className="text-center align-middle"
						style={{ cursor: 'pointer', userSelect: 'none' }}
						onClick={() => onSort('Acquisition_Date')}
					>
						Acquisition Date {getSortArrow('Acquisition_Date')}
					</th>
					<th
						className="text-center align-middle"
						style={{ cursor: 'pointer', userSelect: 'none' }}
						onClick={() => onSort('Acquisition_Cost')}
					>
						Cost {getSortArrow('Acquisition_Cost')} 
					</th>
					<th>Memorandum</th>
					<th>District</th>
					<th>Location</th>
				</tr>
			</thead>
			<tbody>
				{items.map(item => (
				<tr
					key={item.Index_ID}
					onClick={() => !deleteMode && setSelectedItem(item)}
					onDoubleClick={() => !deleteMode && onEdit(item)}
					className={selectedItem?.Index_ID === item.Index_ID ? "table-primary" : ""}
					style={{ cursor: deleteMode ? "default" : "pointer" }}
					scope="row"
				>
					{deleteMode && (
					<td>
						<input
						type="checkbox"
						checked={selectedForDelete.includes(item.Index_ID)}
						onChange={() => onToggleSelect(item.Index_ID)}
						/>
					</td>
					)}

					<td>{item.Index_ID || "N/A"}</td>
					<td>{item.Type || "N/A"}</td>
					<td>{item.Property_Description || "N/A"}</td>
					<td>{item.Brand || "N/A"}</td>
					<td>{item.Property_Number || "N/A"}</td>
					<td>{item.Acquisition_Date ? formatDate(item.Acquisition_Date) : "N/A"}</td>

					<td>
					{item.Acquisition_Cost
						? new Intl.NumberFormat("en-PH", {
							style: "currency",
							currency: "PHP",
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						}).format(item.Acquisition_Cost)
						: "N/A"}
					</td>

					<td>{item.Memorandum_Receipt || "N/A"}</td>
					<td>{item.District || "N/A"}</td>
					<td>{item.Equipment_Location || "N/A"}</td>
				</tr>
				))}
			</tbody>
		</table>
	</div>
	);
};

export default Table;