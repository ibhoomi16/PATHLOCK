import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  Card,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  Alert,
  CircularProgress,
  Chip,
  Paper,
} from '@mui/material';
import { Add, Delete, Edit, ArrowBack, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { projectService, taskService } from '../../api/services';
import { Task, TaskCreateRequest, TaskUpdateRequest } from '../../types';
import { format } from 'date-fns';

const taskSchema = yup.object().shape({
  title: yup.string().required('Title is required').max(200, 'Title must be less than 200 characters'),
  dueDate: yup.string().optional(),
});

const updateTaskSchema = yup.object().shape({
  title: yup.string().required('Title is required').max(200, 'Title must be less than 200 characters'),
  dueDate: yup.string().optional(),
  isCompleted: yup.boolean().required(),
});

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [error, setError] = useState('');

  const projectId = parseInt(id || '0');

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: createErrors },
    reset: resetCreate,
  } = useForm<TaskCreateRequest>({
    resolver: yupResolver(taskSchema) as any,
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: editErrors },
    reset: resetEdit,
    setValue,
  } = useForm<TaskUpdateRequest>({
    resolver: yupResolver(updateTaskSchema) as any,
  });

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getById(projectId),
    enabled: !!projectId,
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: TaskCreateRequest) => taskService.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      setOpenCreateDialog(false);
      resetCreate();
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create task');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: TaskUpdateRequest }) =>
      taskService.update(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      setOpenEditDialog(false);
      setSelectedTask(null);
      resetEdit();
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update task');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: taskService.toggle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });

  const onCreateSubmit = (data: TaskCreateRequest) => {
    createTaskMutation.mutate(data);
  };

  const onEditSubmit = (data: TaskUpdateRequest) => {
    if (selectedTask) {
      updateTaskMutation.mutate({ taskId: selectedTask.id, data });
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setValue('title', task.title);
    setValue('dueDate', task.dueDate ? task.dueDate.split('T')[0] : '');
    setValue('isCompleted', task.isCompleted);
    setOpenEditDialog(true);
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const handleToggleTask = (taskId: number) => {
    toggleTaskMutation.mutate(taskId);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Alert severity="error">
        Project not found
      </Alert>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {project.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {project.description || 'No description'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Created: {format(new Date(project.createdAt), 'MMM dd, yyyy')}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Add Task
        </Button>
      </Box>

      {project.tasks && project.tasks.length > 0 ? (
        <List>
          {project.tasks.map((task: Task) => (
            <Card key={task.id} sx={{ mb: 2 }}>
              <ListItem>
                <IconButton
                  edge="start"
                  onClick={() => handleToggleTask(task.id)}
                  disabled={toggleTaskMutation.isPending}
                >
                  {task.isCompleted ? (
                    <CheckCircle color="success" />
                  ) : (
                    <RadioButtonUnchecked />
                  )}
                </IconButton>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        textDecoration: task.isCompleted ? 'line-through' : 'none',
                      }}
                    >
                      {task.title}
                    </Typography>
                  }
                  secondary={
                    task.dueDate && (
                      <Chip
                        label={`Due: ${format(new Date(task.dueDate), 'MMM dd, yyyy')}`}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleEditTask(task)}
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={deleteTaskMutation.isPending}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Card>
          ))}
        </List>
      ) : (
        <Alert severity="info">
          No tasks yet. Add your first task to get started!
        </Alert>
      )}

      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Task</DialogTitle>
        <form onSubmit={handleSubmitCreate(onCreateSubmit)}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              margin="normal"
              label="Task Title"
              {...registerCreate('title')}
              error={!!createErrors.title}
              helperText={createErrors.title?.message}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Due Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...registerCreate('dueDate')}
              error={!!createErrors.dueDate}
              helperText={createErrors.dueDate?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createTaskMutation.isPending}>
              {createTaskMutation.isPending ? 'Adding...' : 'Add Task'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <form onSubmit={handleSubmitEdit(onEditSubmit)}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              margin="normal"
              label="Task Title"
              {...registerEdit('title')}
              error={!!editErrors.title}
              helperText={editErrors.title?.message}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Due Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...registerEdit('dueDate')}
              error={!!editErrors.dueDate}
              helperText={editErrors.dueDate?.message}
            />
            <Box sx={{ mt: 2 }}>
              <label>
                <Checkbox {...registerEdit('isCompleted')} />
                Mark as completed
              </label>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={updateTaskMutation.isPending}>
              {updateTaskMutation.isPending ? 'Updating...' : 'Update Task'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProjectDetail;
