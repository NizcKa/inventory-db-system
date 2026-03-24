// inventory functions hook
import { useState } from "react";

const useInventory = (setInventory) => {
    const [message, setMessage] = useState("");

    // converts empty string entries to null
    const normalizeFormData = (data) => {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                if (typeof value === "string") {
                    const trimmed = value.trim();
                    return [key, trimmed === "" ? null : trimmed.toUpperCase()];
                }
                return [key, value];
            })
        );
    };

    // refresh inventory
    const loadItems = async () => {
        try {
            const items = await globalThis.electron.getAllItems();
            setInventory(items);
        } catch (err) {
            console.error("Failed to fetch inventory:", err);
        }
    };

    // add items to inventory
    const addItem = async (formData, setFormData, fieldDefs) => {
        try {
            const normalizedData = normalizeFormData(formData);

            const itemId = await globalThis.electron.generateNextItemId(
                formData.Type
            );

            const newItem = {
                ...normalizedData,
                Index_ID: itemId,
            };

            await globalThis.electron.addItem(newItem);

            await loadItems();

            setMessage("Item Added Successfully!");
            setFormData({});
            setTimeout(() => setMessage(""), 2500);
        } catch (err) {
            console.error("Failed to add item:", err);
        }
    };

    // update item details of specified id in inventory
    const updateItem = async (formData, setOriginalData) => {
        try {
            const normalizedData = normalizeFormData(formData);

            await globalThis.electron.updateItem(normalizedData);

            await loadItems();

            setOriginalData({ ...normalizedData });
            
            setMessage("Item Saved Successfully!");
            setTimeout(() => setMessage(""), 2500);
        } catch (err) {
            console.error("Failed to update item:", err);
        }
    };

    // delete array of items based on ids
    const deleteItems = async (ids) => {
        try {
            for (const id of ids) {
                await globalThis.electron.deleteItem(id);
            }
        await loadItems();
        } catch (err) {
            console.error("Failed to delete items:", err);
        }
    };

    return {
        message,
        setMessage,
        loadItems,
        addItem,
        updateItem,
        deleteItems,
    };
};

export default useInventory;