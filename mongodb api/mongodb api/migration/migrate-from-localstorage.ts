import { projectsService } from '../services/projects.service';
import { storiesService } from '../services/stories.service';
import { tasksService } from '../services/tasks.service';
import { usersService } from '../services/users.service';

interface LocalStorageProject {
    id: string;
    name: string;
    description: string;
}

interface LocalStorageStory {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    projectId: string;
    createdAt: string;
    state: 'todo' | 'doing' | 'done';
    ownerId: string;
}

interface LocalStorageTask {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    storyId: string;
    estimatedTime: number;
    state: 'todo' | 'doing' | 'done';
    createdAt: string;
    startDate?: string;
    endDate?: string;
    assignedUserId?: string;
}

interface LocalStorageUser {
    id: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'developer' | 'devops';
}

class MigrationService {
    
    static async migrateFromLocalStorage(localStorageData: {
        projects: LocalStorageProject[];
        stories: LocalStorageStory[];
        tasks: LocalStorageTask[];
        users: LocalStorageUser[];
    }) {
        console.log('🚀 Rozpoczynam migrację danych z localStorage do MongoDB...');
        
        try {
            // 1. Migracja użytkowników
            console.log('📋 Migracja użytkowników...');
            const userIdMapping = await this.migrateUsers(localStorageData.users);
            
            // 2. Migracja projektów
            console.log('📁 Migracja projektów...');
            const projectIdMapping = await this.migrateProjects(localStorageData.projects);
            
            // 3. Migracja historyjek
            console.log('📖 Migracja historyjek...');
            const storyIdMapping = await this.migrateStories(
                localStorageData.stories, 
                projectIdMapping, 
                userIdMapping
            );
            
            // 4. Migracja zadań
            console.log('✅ Migracja zadań...');
            await this.migrateTasks(
                localStorageData.tasks, 
                storyIdMapping, 
                userIdMapping
            );
            
            console.log('🎉 Migracja zakończona pomyślnie!');
            console.log(`Zmigrowano:`);
            console.log(`- ${localStorageData.users.length} użytkowników`);
            console.log(`- ${localStorageData.projects.length} projektów`);
            console.log(`- ${localStorageData.stories.length} historyjek`);
            console.log(`- ${localStorageData.tasks.length} zadań`);
            
        } catch (error) {
            console.error('❌ Błąd podczas migracji:', error);
            throw error;
        }
    }
    
    private static async migrateUsers(users: LocalStorageUser[]): Promise<Map<string, string>> {
        const idMapping = new Map<string, string>();
        
        for (const user of users) {
            try {
                // ✅ FIX: Dodaj brakujące pola createdAt i updatedAt
                const userData = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}@company.com`,
                    role: user.role,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                
                const newId = await usersService.createUser(userData);
                idMapping.set(user.id, newId);
                console.log(`✓ Użytkownik ${user.firstName} ${user.lastName} zmigrowany`);
            } catch (error) {
                console.error(`✗ Błąd migracji użytkownika ${user.firstName} ${user.lastName}:`, error);
            }
        }
        
        return idMapping;
    }
    
    private static async migrateProjects(projects: LocalStorageProject[]): Promise<Map<string, string>> {
        const idMapping = new Map<string, string>();
        
        for (const project of projects) {
            try {
                // ✅ FIX: Dodaj brakujące pola createdAt i updatedAt
                const projectData = {
                    name: project.name,
                    description: project.description,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                
                const newId = await projectsService.createProject(projectData);
                idMapping.set(project.id, newId);
                console.log(`✓ Projekt "${project.name}" zmigrowany`);
            } catch (error) {
                console.error(`✗ Błąd migracji projektu "${project.name}":`, error);
            }
        }
        
        return idMapping;
    }
    
    private static async migrateStories(
        stories: LocalStorageStory[], 
        projectIdMapping: Map<string, string>,
        userIdMapping: Map<string, string>
    ): Promise<Map<string, string>> {
        const idMapping = new Map<string, string>();
        
        for (const story of stories) {
            try {
                const newProjectId = projectIdMapping.get(story.projectId);
                const newOwnerId = userIdMapping.get(story.ownerId);
                
                if (!newProjectId) {
                    console.error(`✗ Nie znaleziono nowego ID projektu dla historyjki "${story.name}"`);
                    continue;
                }
                
                if (!newOwnerId) {
                    console.error(`✗ Nie znaleziono nowego ID właściciela dla historyjki "${story.name}"`);
                    continue;
                }
                
                // ✅ FIX: Dodaj brakujące pola createdAt i updatedAt
                const storyData = {
                    name: story.name,
                    description: story.description,
                    priority: story.priority,
                    projectId: newProjectId,
                    state: story.state,
                    ownerId: newOwnerId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                
                const newId = await storiesService.createStory(storyData);
                idMapping.set(story.id, newId);
                console.log(`✓ Historyjka "${story.name}" zmigrowana`);
            } catch (error) {
                console.error(`✗ Błąd migracji historyjki "${story.name}":`, error);
            }
        }
        
        return idMapping;
    }
    
    private static async migrateTasks(
        tasks: LocalStorageTask[], 
        storyIdMapping: Map<string, string>,
        userIdMapping: Map<string, string>
    ): Promise<void> {
        for (const task of tasks) {
            try {
                const newStoryId = storyIdMapping.get(task.storyId);
                
                if (!newStoryId) {
                    console.error(`✗ Nie znaleziono nowego ID historyjki dla zadania "${task.name}"`);
                    continue;
                }
                
                const newAssignedUserId = task.assignedUserId 
                    ? userIdMapping.get(task.assignedUserId) 
                    : undefined;
                
                if (task.assignedUserId && !newAssignedUserId) {
                    console.error(`✗ Nie znaleziono nowego ID użytkownika dla zadania "${task.name}"`);
                    continue;
                }
                
                // ✅ FIX: Dodaj brakujące pola createdAt i updatedAt
                const taskData = {
                    name: task.name,
                    description: task.description,
                    priority: task.priority,
                    storyId: newStoryId,
                    estimatedTime: task.estimatedTime,
                    state: task.state,
                    assignedUserId: newAssignedUserId,
                    startDate: task.startDate ? new Date(task.startDate) : undefined,
                    endDate: task.endDate ? new Date(task.endDate) : undefined,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                
                await tasksService.createTask(taskData);
                console.log(`✓ Zadanie "${task.name}" zmigrowane`);
            } catch (error) {
                console.error(`✗ Błąd migracji zadania "${task.name}":`, error);
            }
        }
    }
    
    // Pomocnicza metoda do eksportu danych z localStorage (do użycia w przeglądarce)
    static generateLocalStorageExportScript(): string {
        return `
// Uruchom ten skrypt w konsoli przeglądarki aby wyeksportować dane z localStorage
function exportLocalStorageData() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const stories = JSON.parse(localStorage.getItem('stories') || '[]');
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const exportData = {
        projects,
        stories,
        tasks,
        users,
        exportDate: new Date().toISOString()
    };
    
    // Zapisz do pliku
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'localStorage-export-' + new Date().toISOString().slice(0,10) + '.json';
    link.click();
    
    URL.revokeObjectURL(url);
    
    console.log('Dane wyeksportowane!', exportData);
    return exportData;
}

// Wywołaj funkcję
exportLocalStorageData();
        `;
    }
}

export default MigrationService;