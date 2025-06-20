import express, { Request, Response } from 'express';
import cors from 'cors';
import { projectsService } from './services/projects.service';
import { storiesService } from './services/stories.service';
import { tasksService } from './services/tasks.service';
import { usersService } from './services/users.service';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// ================= PROJECTS ENDPOINTS =================
app.get('/api/projects', async (req: Request, res: Response) => {
    try {
        const projects = await projectsService.getProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania projektów' });
    }
});

// ✅ FIX: Poprawna składnia Express handler
app.get('/api/projects/:id', async (req: Request, res: Response) => {
    try {
        const project = await projectsService.getProject(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Projekt nie znaleziony' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania projektu' });
    }
});

app.post('/api/projects', async (req: Request, res: Response) => {
    try {
        const projectId = await projectsService.createProject(req.body);
        res.status(201).json({ id: projectId });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas tworzenia projektu' });
    }
});

// ✅ FIX: Poprawna składnia Express handler
app.put('/api/projects/:id', async (req: Request, res: Response) => {
    try {
        const success = await projectsService.replaceProject(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ error: 'Projekt nie znaleziony' });
        }
        res.json({ message: 'Projekt zaktualizowany' });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas aktualizacji projektu' });
    }
});

// ✅ FIX: Poprawna składnia Express handler
app.patch('/api/projects/:id', async (req: Request, res: Response) => {
    try {
        const success = await projectsService.updateProject(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ error: 'Projekt nie znaleziony' });
        }
        res.json({ message: 'Projekt zaktualizowany' });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas aktualizacji projektu' });
    }
});

// ✅ FIX: Poprawna składnia Express handler
app.delete('/api/projects/:id', async (req: Request, res: Response) => {
    try {
        const success = await projectsService.deleteProject(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Projekt nie znaleziony' });
        }
        res.json({ message: 'Projekt usunięty' });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas usuwania projektu' });
    }
});

app.get('/api/projects/search/:term', async (req: Request, res: Response) => {
    try {
        const projects = await projectsService.searchProjects(req.params.term);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas wyszukiwania projektów' });
    }
});

// ================= STORIES ENDPOINTS =================
app.get('/api/stories', async (req: Request, res: Response) => {
    try {
        const stories = await storiesService.getStories();
        res.json(stories);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania historyjek' });
    }
});

// ✅ FIX: Poprawna składnia Express handler
app.get('/api/stories/:id', async (req: Request, res: Response) => {
    try {
        const story = await storiesService.getStory(req.params.id);
        if (!story) {
            return res.status(404).json({ error: 'Historyjka nie znaleziona' });
        }
        res.json(story);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania historyjki' });
    }
});

app.post('/api/stories', async (req: Request, res: Response) => {
    try {
        const storyId = await storiesService.createStory(req.body);
        res.status(201).json({ id: storyId });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas tworzenia historyjki' });
    }
});

// ✅ FIX: Poprawna składnia Express handler
app.put('/api/stories/:id', async (req: Request, res: Response) => {
    try {
        const success = await storiesService.replaceStory(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ error: 'Historyjka nie znaleziona' });
        }
        res.json({ message: 'Historyjka zaktualizowana' });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas aktualizacji historyjki' });
    }
});

// ✅ FIX: Poprawna składnia Express handler
app.delete('/api/stories/:id', async (req: Request, res: Response) => {
    try {
        const success = await storiesService.deleteStory(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Historyjka nie znaleziona' });
        }
        res.json({ message: 'Historyjka usunięta' });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas usuwania historyjki' });
    }
});

app.get('/api/projects/:projectId/stories', async (req: Request, res: Response) => {
    try {
        const stories = await storiesService.getStoriesByProjectId(req.params.projectId);
        res.json(stories);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania historyjek projektu' });
    }
});

// ================= TASKS ENDPOINTS =================
app.get('/api/tasks', async (req: Request, res: Response) => {
    try {
        const tasks = await tasksService.getTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania zadań' });
    }
});

// ✅ FIX: Poprawna składnia Express handler
app.get('/api/tasks/:id', async (req: Request, res: Response) => {
    try {
        const task = await tasksService.getTask(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Zadanie nie znalezione' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania zadania' });
    }
});

app.post('/api/tasks', async (req: Request, res: Response) => {
    try {
        const taskId = await tasksService.createTask(req.body);
        res.status(201).json({ id: taskId });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas tworzenia zadania' });
    }
});

app.put('/api/tasks/:id', async (req: Request, res: Response) => {
    try {
        const success = await tasksService.replaceTask(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ error: 'Zadanie nie znalezione' });
        }
        res.json({ message: 'Zadanie zaktualizowane' });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas aktualizacji zadania' });
    }
});

app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
    try {
        const success = await tasksService.deleteTask(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Zadanie nie znalezione' });
        }
        res.json({ message: 'Zadanie usunięte' });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas usuwania zadania' });
    }
});

app.get('/api/projects/:projectId/tasks', async (req: Request, res: Response) => {
    try {
        const tasks = await tasksService.getTasksByProjectId(req.params.projectId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania zadań projektu' });
    }
});

app.get('/api/stories/:storyId/tasks', async (req: Request, res: Response) => {
    try {
        const tasks = await tasksService.getTasksByStoryId(req.params.storyId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania zadań historyjki' });
    }
});

// ✅ FIX: Poprawna składnia Express handler
app.patch('/api/tasks/:id/assign', async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const success = await tasksService.assignUserToTask(req.params.id, userId);
        if (!success) {
            return res.status(404).json({ error: 'Zadanie nie znalezione' });
        }
        res.json({ message: 'Użytkownik przypisany do zadania' });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas przypisywania użytkownika' });
    }
});

// ✅ FIX: Poprawna składnia Express handler
app.patch('/api/tasks/:id/complete', async (req: Request, res: Response) => {
    try {
        const success = await tasksService.completeTask(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Zadanie nie znalezione' });
        }
        res.json({ message: 'Zadanie zakończone' });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas kończenia zadania' });
    }
});

// ================= USERS ENDPOINTS =================
app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const users = await usersService.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania użytkowników' });
    }
});

app.get('/api/users/assignable', async (req: Request, res: Response) => {
    try {
        const users = await usersService.getAssignableUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania użytkowników do przypisania' });
    }
});

app.listen(port, () => {
    console.log(`MongoDB API Server listening on port ${port}`);
    console.log('Available endpoints:');
    console.log('- GET /api/projects');
    console.log('- GET /api/stories');
    console.log('- GET /api/tasks');
    console.log('- GET /api/users');
});