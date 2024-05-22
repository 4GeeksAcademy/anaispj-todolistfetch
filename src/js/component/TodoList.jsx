import React, { useEffect, useState } from "react";

export const TodoList = () => {
    const [tarea, setTarea] = useState([]);
    const [nuevaTarea, setNuevaTarea] = useState('');
    const [edit, setEdit] = useState(false);
    const [currentTarea, setCurrentTarea] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        if (tarea.trim() !== '') {
            const nuevaTask = {
                label: tarea,
                is_done: false
            }
            addTarea(nuevaTask)
            // setTarea([...tarea, nuevaTarea]);
        } else {
            setTarea('');
        }
    }

    const handleEditTarea = async (event) => {
        event.preventDefault();
        const dataToSend = {
            label: currentTarea.label,
            is_done: currentTarea.is_done
        }
        const uri = `https://playground.4geeks.com/todo/todos/${currentTarea.id}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        };
        const response = await fetch(uri, options)
        if (!response.ok) {
            console.log('Error', response.status, response.statusText);
            return;
        }
        const data = await response.json()
        console.log('respuesta del PUT', data);
        traerTarea()
        setCurrentTarea({})
        setEdit(false)
    }

    const editTarea = (item) => {
        setCurrentTarea(item);
        setEdit(true)
        console.log('Edit tarea', item)
    }




    // Metodo GET
    async function traerTarea() {
        const response = await fetch("https://playground.4geeks.com/todo/users/anais");
        const data = await response.json();
        if (!response.ok) {
            console.log('Puto error', response.status, response.statusText);
            return;
        }
        setTarea(data.todos);
        console.log('Data', data);
    }

    // Metodo POST
    async function crearTarea() {
        const todoNew = {
            label: nuevaTarea,
            is_done: false,
        }
        const options = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(todoNew)
        }
        const response = await fetch("https://playground.4geeks.com/todo/todos/anais", options);
        setNuevaTarea('');
        traerTarea();

    }

    // Metodo DELETE

    const deleteTask = async (item) => {
        console.log(item)
        const uri = `https://playground.4geeks.com/todo/todos/${item.id}`;
        const options = {
            method: 'DELETE'
        };
        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log('Error', response.status, response.statusText);
            return;
        }
        traerTarea()
        // const data = await response.json()
    }

    // async function deleteTarea(id) {
    //     const options = {
    //         method: 'DELETE',
    //     }
    //     const response = await fetch("https://playground.4geeks.com/todo/todos/" + id, options);
    //     if (!response) {
    //         //Tratamos el error
    //         console.log('Error', response.status);
    //         return
    //     }
    //     const data = await response.json();
    //     console.log(data);

    //     traerTarea();

    // }

    useEffect(() => {
        traerTarea();
    }, [])

    console.log('TAREA', tarea);




    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1"
                        className="form-label text-secondary">
                        <strong>Añadir tarea:</strong></label>
                    <input value={nuevaTarea}
                        onChange={(event) => setNuevaTarea(event.target.value)}
                        type="text"
                        className="form-control"
                        id="exampleInputEmail1"
                        placeholder="Añade una tarea..."
                    />
                </div>
                <button className="mb-3" onClick={() => crearTarea()}>Crear tarea</button>
            </form>
            <form onSubmit={handleEditTarea}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1"
                        className="form-label text-success">
                        <strong>Editar tarea:</strong></label>
                    <input value={currentTarea.label}
                        onChange={(event) => setCurrentTarea({ ...currentTarea, label: event.target.value })}
                        type="text"
                        className="form-control"
                        id="exampleInputEmail1"
                        placeholder="Añade una tarea..."
                    />
                </div>
                <div className="m-3 form-check text-start">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" 
                                            checked={currentTarea.is_done}
                                            onChange={(event) => setCurrentTarea({ ...currentTarea, is_done: event.target.checked })}
                    />
                        <label className="form-check-label" htmlFor="exampleCheck1">
                            Completed</label>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
    
            <ul className="list-group mt-3">
                {tarea.map((item, id) => <li key={id} className="list-group-item d-flex justify-content-between hidden-icon">
                    {item.label}
                    <div>
                        <span onClick={() => editTarea(item)} className="me-2">
                            <i className="fas fa-edit text-sucess"></i>
                        </span>
                        <span onClick={() => deleteTask(item)}>
                            <i className="fas fa-trash text-secondary"></i>
                        </span>
                    </div>
                </li>)}
                <li className="list-group-item bg-light text-end text-secondary"><small>{tarea.length} items left</small></li>

            </ul>
        </div>
    )
}

{/* <input
    type="text"
    value={nuevaTarea}
    placeholder="Escribe una nueva tarea..."
    onChange={(event) => setNuevaTarea(event.target.value)}
>
</input> */}