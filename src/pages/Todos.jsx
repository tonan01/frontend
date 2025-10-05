import { useState, useEffect } from 'react';
import { getTodos, createTodo, deleteTodo } from '../api/todoService';

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await getTodos();
                setTodos(response.data);
            } catch (error) {
                console.error("Failed to fetch todos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTodos();
    }, []);

    const handleAddTodo = async (e) => {
        e.preventDefault();
        try {
            const newTodo = { title, description: "..." };
            const response = await createTodo(newTodo);
            setTodos([...todos, response.data]);
            setTitle('');
        } catch (error) {
            console.error("Failed to add todo", error);
        }
    };
    
    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id);
            setTodos(todos.filter(todo => todo.id !== id));
        } catch(error) {
            console.error("Failed to delete todo", error);
        }
    }

    if (loading) return <p>Loading todos...</p>;

    return (
        <div>
            <h2>My Todos</h2>
            <form onSubmit={handleAddTodo}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New todo title"
                    required
                />
                <button type="submit">Add Todo</button>
            </form>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {todo.title}
                        <button onClick={() => handleDeleteTodo(todo.id)} style={{marginLeft: '10px'}}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Todos;