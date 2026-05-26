import { Draggable } from "@hello-pangea/dnd"

export default function TaskCard({ task, index, onDelete }) {
  // Map specific priority colors cleanly
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high": 
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "medium": 
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default: 
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-800/80 flex flex-col gap-3 cursor-grab transition-all group duration-200 ${
            snapshot.isDragging 
              ? "shadow-2xl bg-slate-800 border-indigo-500 rotate-1 scale-[1.02]" 
              : "hover:border-slate-700 hover:bg-slate-900/90 hover:-translate-y-0.5"
          }`}
        >
          <div className="flex justify-between items-start gap-3">
            <p className="text-xs font-medium text-slate-300 leading-relaxed break-words flex-1">
              {task.content}
            </p>
            <button 
              onClick={onDelete} 
              className="text-slate-600 hover:text-rose-400 text-sm font-bold opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all px-1"
              title="Delete Task"
            >
              ✕
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md border ${getPriorityStyles(task.priority)}`}>
              {task.priority || "medium"}
            </span>
            <span className="text-[10px] text-slate-600 font-mono">#{task.id.slice(-4)}</span>
          </div>
        </div>
      )}
    </Draggable>
  )
}