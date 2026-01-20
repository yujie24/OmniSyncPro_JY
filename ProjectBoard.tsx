
import React from 'react';
import { Task } from '../types';
import { Plus, MoreVertical, Circle, Clock, CheckCircle2, Calendar as CalendarIcon, User as UserIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ProjectBoardProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (id: string, updated: Partial<Task>) => void;
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({ tasks, onAddTask, onUpdateTask }) => {
  const stats = [
    { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length, color: '#94a3b8' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#3b82f6' },
    { name: 'Done', value: tasks.filter(t => t.status === 'done').length, color: '#22c55e' },
  ];

  const columns = [
    { id: 'todo', label: 'To Do', icon: Circle, color: 'text-gray-400' },
    { id: 'in-progress', label: 'In Progress', icon: Clock, color: 'text-blue-500' },
    { id: 'done', label: 'Done', icon: CheckCircle2, color: 'text-green-500' },
  ];

  const handleAddNew = (status: Task['status']) => {
    const title = prompt('Task title:');
    if (!title) return;
    
    const owner = prompt('Responsible person (Name):', 'John Appleseed');
    const dueDate = prompt('Due Date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);

    onAddTask({
      id: Date.now().toString(),
      title,
      status,
      priority: 'medium',
      owner: owner || 'Unassigned',
      dueDate: dueDate || undefined
    });
  };

  const isOverdue = (dateStr?: string) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) < today;
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden bg-[#F2F2F7]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-1 tracking-tight text-[#1C1C1E]">Project Management</h1>
          <p className="text-gray-500 font-medium">Coordinate with your team and track deadlines</p>
        </div>
        
        <div className="w-48 h-24 hidden sm:block">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={30}
                outerRadius={50}
                paddingAngle={5}
                dataKey="value"
              >
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {columns.map(col => (
          <div key={col.id} className="bg-white/40 rounded-3xl flex flex-col overflow-hidden border border-gray-200/50 shadow-sm">
            <div className="p-4 flex justify-between items-center bg-white/60 border-b border-gray-100 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <col.icon className={`h-4 w-4 ${col.color}`} />
                <span className="font-bold text-xs uppercase tracking-wider text-gray-600">{col.label}</span>
                <span className="ml-2 bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-500 border border-gray-100">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>
              <button 
                onClick={() => handleAddNew(col.id as any)} 
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-400 hover:text-gray-900"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
                  <div className="flex justify-between mb-3">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                      task.priority === 'high' ? 'bg-red-50 text-red-500' :
                      task.priority === 'medium' ? 'bg-blue-50 text-blue-500' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {task.priority}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-50 rounded">
                      <MoreVertical className="h-3 w-3 text-gray-400" />
                    </button>
                  </div>
                  
                  <p className="text-sm font-bold text-[#1C1C1E] mb-4 line-clamp-2 leading-snug">{task.title}</p>
                  
                  <div className="flex flex-col gap-2 pt-3 border-t border-gray-50">
                    <div className="flex items-center justify-between">
                      {task.dueDate && (
                        <div className={`flex items-center gap-1.5 ${isOverdue(task.dueDate) && col.id !== 'done' ? 'text-red-500' : 'text-gray-400'}`}>
                          <CalendarIcon className="h-3 w-3" />
                          <span className="text-[10px] font-bold">
                            {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1.5 ml-auto">
                        <span className="text-[10px] font-medium text-gray-500">{task.owner}</span>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] text-white font-bold border-2 border-white shadow-sm">
                          {task.owner?.charAt(0).toUpperCase() || <UserIcon className="h-2 w-2" />}
                        </div>
                      </div>
                    </div>

                    {col.id !== 'done' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateTask(task.id, { status: col.id === 'todo' ? 'in-progress' : 'done' });
                        }}
                        className="w-full mt-1 py-1 text-[9px] text-blue-600 hover:bg-blue-50 rounded-lg font-bold border border-transparent hover:border-blue-100 transition-all text-center uppercase tracking-widest"
                      >
                        Move to {col.id === 'todo' ? 'Progress' : 'Done'} →
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {tasks.filter(t => t.status === col.id).length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Empty</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectBoard;
