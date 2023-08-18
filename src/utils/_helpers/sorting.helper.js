/* eslint-disable prettier/prettier */
export const sortingHelper = async (bookingData, columnKey, nextSortDirection) => {
    let sortDataType = typeof bookingData[0][columnKey];
    const sortedData = [...bookingData].sort((a, b) => {
        const aValue = a[columnKey];
        const bValue = b[columnKey];
        switch (sortDataType) {
            case 'number':
                return nextSortDirection === 'ascending' ? aValue - bValue : bValue - aValue;
            case 'string':
                return nextSortDirection === 'ascending' ? aValue?.localeCompare(bValue) : bValue?.localeCompare(aValue);
            case 'object': // Assuming the data type is Date
                return nextSortDirection === 'ascending' ? aValue?.getTime() - bValue?.getTime() : bValue?.getTime() - aValue?.getTime();
            default:
                return 0; // Return 0 for unknown data types or if sortKey is not found
        }
    });
    return await sortedData;
};
