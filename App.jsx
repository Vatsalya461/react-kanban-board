import { useState } from "react"
import { DragDropContext } from "@hello-pangea/dnd"
import Column from "./Column"

const initialData = {
  columns: {
    "col-1": { id: "col-1", title: "To Do",       taskIds: ["task-1", "task-2"] },
    "col-2": { id: "col-2", title: "In Progress",  taskIds: ["task-3"] },
    "col-3": { id: "col-3", title: "Done",         taskIds: [] },
  },
  tasks: {
    "task-1": { id: "task-1", content: "Design homepage layout",  priority: "high" },
    "task-2": { id: "task-2", content: "Configure client routing", priority: "medium" },
    "task-3": { id: "task-3", content: "Build responsive nav bar", priority: "low" },
  },
  columnOrder: ["col-1", "col-2", "col-3"],
}

export default function App() {
  const [data, setData] = useState(initialData)

  function handleAddTask(columnId, content) {
    const newTaskId = `task-${Date.now()}`
    const newTask = { id: newTaskId, content, priority: "medium" }

    setData({
      ...data,
      tasks: { ...data.tasks, [newTaskId]: newTask },
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          taskIds: [...data.columns[columnId].taskIds, newTaskId],
        },
      },
    })
  }

  function handleDeleteTask(taskId, columnId) {
    const newTaskIds = data.columns[columnId].taskIds.filter(id => id !== taskId)
    const newTasks = { ...data.tasks }
    delete newTasks[taskId]

    setData({
      ...data,
      tasks: newTasks,
      columns: {
        ...data.columns,
        [columnId]: { ...data.columns[columnId], taskIds: newTaskIds },
      },
    })
  }

  function onDragEnd(result) {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const start = data.columns[source.droppableId]
    const finish = data.columns[destination.droppableId]

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      setData({
        ...data,
        columns: { ...data.columns, [start.id]: { ...start, taskIds: newTaskIds } },
      })
      return
    }

    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)

    setData({
      ...data,
      columns: {
        ...data.columns,
        [start.id]: { ...start, taskIds: startTaskIds },
        [finish.id]: { ...finish, taskIds: finishTaskIds },
      },
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 selection:bg-indigo-500 selection:text-white">
      <header className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Workspace Kanban
        </h1>
        <p className="text-sm text-slate-500 mt-2 font-medium">Manage, track, and streamline your engineering sprints.</p>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex justify-center gap-6 overflow-x-auto items-start max-w-7xl mx-auto px-4">
          {data.columnOrder.map(columnId => {
            const column = data.columns[columnId]
            const tasks = column.taskIds.map(taskId => data.tasks[taskId])

            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
              />
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}