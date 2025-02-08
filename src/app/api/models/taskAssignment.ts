import mongoose from 'mongoose';

const taskAssignmentSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TaskAssignment =
  mongoose.models.TaskAssignment ||
  mongoose.model('TaskAssignment', taskAssignmentSchema);

export default TaskAssignment;
