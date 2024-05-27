import { SubmitHandler, useForm } from "react-hook-form";
import { useDeleteTodo, useUpdateTodo, userCreateTodo } from "../services/mutations";
import { useTodos, useTodosIds } from "../services/queries"
import { Todo } from "../types/todo";

export default function Todos(){
    const todosIdsQuery = useTodosIds();
    const todosQueries = useTodos(todosIdsQuery.data);

    const createToDoMutation = userCreateTodo();
    const updateTodoMutation = useUpdateTodo();
    const deleteTotoMutation = useDeleteTodo();

    const {register, handleSubmit} = useForm<Todo>();

    const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
        createToDoMutation.mutate(data);
    }

    const handleMarkAsDoneSubmit = (data: Todo | undefined) => {
        if (data) {
            updateTodoMutation.mutate({...data, checked: true});
        }
    }

    const handleDeleteTodo = async (id: number) => {
        await deleteTotoMutation.mutateAsync(id);
        console.log("success");
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
                <h4>New Todo:</h4>
                <input placeholder="Tittle" {...register("title")}/>
                <br/>
                <input placeholder="Description" {...register("description")}/>
                <br/>
                <input type="submit" disabled={createToDoMutation.isPending} value={createToDoMutation.isPending ? "Creating..." : "Create Todo"}/>
            </form>


            {todosIdsQuery.data?.map((id) => (
                <p key={id}>id: {id}</p>
            ))}

            <ul>
                {todosQueries.map(({data}) => (
                    <li key={data?.id}>
                        <div>
                            Id: {data?.id}
                        </div>
                        <span>
                            <strong>Title: </strong> {data?.title}, {" "}
                            <strong>Description:</strong> {data?.description}
                        </span>
                        <div>
                            <button onClick={() => handleMarkAsDoneSubmit(data)} disabled={data?.checked}>
                                {data?.checked ? "Done" : "Mark as done"}
                            </button>
                            {data && data?.id && (
                                <button onClick={() => handleDeleteTodo(data.id!)}>Delete</button>
                            )}
                            
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}