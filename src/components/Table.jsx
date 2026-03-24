// inventory table
import React from 'react';

const Table = ({
  items,
  fieldDefs,
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

		return dateStr;
	};

  	if (!items.length) return <p>No items found.</p>;

	return (
		<div className="table-responsive">
			<table className="table table-striped table-sm text-center align-middle table-font">

				<thead className="table-light">
					<tr>
						{deleteMode && <th>Select</th>}

						{fieldDefs.map(field => (
							<th
								key={field.key}
								className={`text-center align-middle ${field.sortable ? "sortable" : ""}`}
								onClick={field.sortable ? () => onSort(field.key) : undefined}
							>
								{field.label}
								{field.sortable ? ` ${getSortArrow(field.key)}` : ""}
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{items.map(item => (
						<tr
							key={item.Index_ID}
							onClick={() => !deleteMode && setSelectedItem(item)}
							onDoubleClick={() => !deleteMode && onEdit(item)}
							className={`
								${selectedItem?.Index_ID === item.Index_ID ? "table-primary" : ""}
								${deleteMode ? "row-default" : "row-clickable"}
							`}
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

						{fieldDefs.map(field => {
							let value = item[field.key];

							if (field.key === "Acquisition_Date") {
								value = value ? formatDate(value) : "N/A";
							}

							if (field.key === "Acquisition_Cost") {
								value = value
									? new Intl.NumberFormat("en-PH", {
										style: "currency",
										currency: "PHP",
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									}).format(value)
									: "N/A";
							}

							return <td key={field.key}>{value || "N/A"}</td>;
						})}
						</tr>
					))}
				</tbody>
				
			</table>
		</div>
	);
};

export default Table;