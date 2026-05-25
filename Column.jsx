import { useState } from "react"
import { Droppable } from "@hello-pangea/dnd"
import TaskCard from "./TaskCard"

export default function Column({ column, tasks, onAddTask, onDeleteTask }) {
  const [input, setInput] = useState("")

  function handleAdd() {
    if (!input.trim()) return
    onAddTask(column.id, input.trim())
    setInput("")
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 w-80 flex flex-col gap-3 border border-slate-800/80 shadow-2xl">
      <div className="flex justify-between items-center px-1">
        <h2 className="font-bold text-sm text-slate-300 tracking-wide uppercase">
          {column.title}
        </h2>
        <span className="text-xs font-bold bg-slate-800 border border-slate-700/60 text-slate-400 px-2.5 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2.5 min-h-[250px] rounded-xl p-1 transition-all duration-200 ${
              snapshot.isDraggingOver ? "bg-slate-800/40 ring-1 ring-indigo-500/30" : ""
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onDelete={() => onDeleteTask(task.id, column.id)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="flex gap-2 mt-2 pt-2 border-t border-slate-800/60">
        <input
          className="flex-1 text-xs rounded-xl px-3 py-2 border border-slate-800 bg-slate-950 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          placeholder="New task content..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white font-bold text-sm px-3.5 rounded-xl hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/20"
        >
          +
        </button>
      </div>
    </div>
  )
}