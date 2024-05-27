import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "../types/todo";
import { createTodo, deleteTodo, updateTodo } from "./api";

export function userCreateTodo(){
    
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: Todo) => createTodo(data),
        //onMutate will run before the function
        onMutate: () => {
            console.log("mutate");
        },

        //if there was an error
        onError: () => {
            console.log("error");
        },

        //if it completes
        onSuccess: () => {
            console.log("success");
        },

        //runs at the end of the function
        onSettled: async (_, error) => {
            console.log("settled");
            if(error){
                console.log(error);
            } else {
                await queryClient.invalidateQueries({queryKey: ["todos"]});
            }
        }
    })
}

export function useUpdateTodo(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Todo) => updateTodo(data),
        onSettled: async(_, error, variables) => {
            if (error){
                console.log(error);
            } else {
                await queryClient.invalidateQueries({queryKey: ["todos"]});
                await queryClient.invalidateQueries({queryKey: ["todo", {id: variables.id}]});
            }
        }
    })
}

export function useDeleteTodo(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteTodo(id),

        onSuccess: () => {
            console.log("deleted");
        },

        onSettled: async (_, error) => {
            if (error){
                console.log(error);
            } else {
                await queryClient.invalidateQueries({queryKey: ["todos"]});
            }
        }
    })
}