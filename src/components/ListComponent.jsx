import { useState, useEffect, useCallback } from "react";
import { CiTrash } from "react-icons/ci";
import { FaPencilAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ListComponent() {
    const [value, setValue] = useState("");
    const [groceries, setGroceries] = useState(JSON.parse(localStorage.getItem("groceries")));
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    useEffect(() => {
        const storedGroceries = JSON.parse(localStorage.getItem("groceries"));
        setGroceries(storedGroceries);
    }, []);
    useEffect(() => {
        localStorage.setItem("groceries", JSON.stringify(groceries));
    }, [groceries]);
    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (!value.trim()) {
                toast.error("Veuillez entrer un article valide.", {
                    position: "top-center",
                    theme: "dark",
                });
                return;
            }

            if (isEditing) {
                setGroceries((prev) =>
                    prev.map((grocery) => {
                        console.log(grocery)
                        return grocery.id === editId ? { ...grocery, value } : grocery
            })
                );
                setIsEditing(false);
                setEditId(null);
                toast.success("Article modifié avec succès.", {
                    position: "top-center",
                    theme: "dark",
                });
            } else {
                const newGrocery = { id: Date.now().toString(), value, checked: false };
                setGroceries((prev) => [...prev, newGrocery]);
                toast.success(`Vous avez ajouté ${value} à votre liste.`, {
                    position: "top-center",
                    theme: "dark",
                });
            }
            setValue("");
        },
        [value, isEditing, editId]
    );
    const handleEdit = useCallback(
        (id) => {
            const itemToEdit = groceries.find((grocery) => grocery.id === id);
            setIsEditing(true);
            setEditId(id);
            setValue(itemToEdit.value);
        },
        [groceries]
    );
    const handleDelete = useCallback((id) => {
        setGroceries((prev) => prev.filter((grocery) => grocery.id !== id));
        toast.info("Article supprimé.", {
            position: "top-center",
            theme: "dark",
        });
    }, []);
    const toggleChecked = useCallback(
        (id) => {
            setGroceries((prev) =>
                prev.map((grocery) =>
                    grocery.id === id ? { ...grocery, checked: !grocery.checked } : grocery
                )
            );
        },
        []
    );
    const clearList = useCallback(() => {
        if (window.confirm("Êtes-vous sûr de vouloir vider la liste ?")) {
            setGroceries([]);
            toast.info("Liste vidée.", {
                position: "top-center",
                theme: "dark",
            });
        }
    }, []);

    return (
        <>
            <ToastContainer />
            <section className="section-center bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
                <form className="grocery-form mb-6" onSubmit={handleSubmit}>
                    <h3 className="text-primary-900 mb-6 text-center text-xl font-semibold">
                        Liste de courses
                    </h3>
                    <div className="form-control flex justify-center items-center mb-4">
                        <input
                            type="text"
                            id="grocery"
                            placeholder="Ex: oeufs"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="p-2 pl-4 bg-gray-100 rounded-l-lg border border-transparent text-gray-500 focus:outline-none flex-1"
                        />
                        <button
                            type="submit"
                            className="submit-btn bg-primary-200 border-none flex-none px-4 py-2 text-sm text-black rounded-r-lg transition-colors hover:bg-primary-400 hover:text-white"
                        >
                            {isEditing ? "Modifier" : "Ajouter"}
                        </button>
                    </div>
                </form>
                {groceries.length > 0 && (
                    <div className="grocery-container">
                        <div className="grocery-list space-y-4">
                            {groceries.map((grocery) => (
                                <div
                                    key={grocery.id}
                                    className="grocery-item flex justify-between items-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                                >
                                    <input
                                        type="checkbox"
                                        checked={grocery.checked}
                                        onChange={() => toggleChecked(grocery.id)}
                                        className="mr-2"
                                    />
                                    <p
                                        className={`title text-gray-800 ${
                                            grocery.checked ? "line-through text-gray-400" : ""
                                        }`}
                                    >
                                        {grocery.value}
                                    </p>
                                    <div className="btn-container flex space-x-1">
                                        <button
                                            type="button"
                                            className="edit-btn text-green-400 hover:text-green-600 transition"
                                            onClick={() => handleEdit(grocery.id)}
                                        >
                                            <FaPencilAlt />
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-btn text-red-400 hover:text-red-600 transition"
                                            onClick={() => handleDelete(grocery.id)}
                                        >
                                            <CiTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="clear-btn mt-5 mx-auto block text-red-400 hover:text-red-600 transition"
                            onClick={clearList}
                        >
                            Vider la liste
                        </button>
                    </div>
                )}
            </section>
        </>
    );
}

export default ListComponent;
