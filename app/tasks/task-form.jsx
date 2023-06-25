"use client";
import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

export default function TaskForm({ session }) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [newtodo, setNewtodo] = useState(null);
  const user = session?.user;

  const getTasks = useCallback(async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("todos")
        .select(`*`)
        .eq("user_id", user?.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log(data);
        setTodos(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getTasks();
  }, [user, getTasks]);

  async function insertTodo({ newtodo }) {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("todos")
        .insert([{ user_id: user?.id, task: newtodo, is_complete: false }]);

      if (error) throw error;
      alert("Task updated!");
    } catch (error) {
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Link href={"/account"}>Account</Link>
      <div>
        {todos.length > 0 ? (
          <h1>Here are your todos:</h1>
        ) : (
          <h1>No Todos found</h1>
        )}
      </div>
      <div>
        {todos.map((todo) => (
          <div key={todo.id}>{todo.task}</div>
        ))}
      </div>
      <div className="form-widget">
        <div>
          <label htmlFor="todo">Todo</label>
          <input
            id="todo"
            type="text"
            value={newtodo || ""}
            onChange={(e) => setNewtodo(e.target.value)}
          />
        </div>
        <div>
          <button
            className="button primary block"
            onClick={() => insertTodo({ newtodo })}
            disabled={loading}
          >
            {loading ? "Loading ..." : "Update"}
          </button>
        </div>

        <div>
          <form action="/auth/signout" method="post">
            <button className="button block" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
