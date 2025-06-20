// mongodb api/mongodb api/seed.ts
import { projectsService } from './services/projects.service';
import { storiesService } from './services/stories.service';
import { tasksService } from './services/tasks.service';
import { usersService } from './services/users.service';

async function seedDatabase() {
    try {
        console.log('🌱 Seedowanie bazy danych...');
        
        // 1. Tworzenie użytkowników
        console.log('👥 Tworzenie użytkowników...');
        // ✅ FIX: Dodaj createdAt i updatedAt
        const adminId = await usersService.createUser({
            firstName: 'Jan',
            lastName: 'Kowalski',
            email: 'jan.kowalski@company.com',
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        const dev1Id = await usersService.createUser({
            firstName: 'Anna',
            lastName: 'Nowak',
            email: 'anna.nowak@company.com',
            role: 'developer',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        const dev2Id = await usersService.createUser({
            firstName: 'Piotr',
            lastName: 'Wiśniewski',
            email: 'piotr.wisniewski@company.com',
            role: 'developer',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        const devops1Id = await usersService.createUser({
            firstName: 'Katarzyna',
            lastName: 'Wójcik',
            email: 'katarzyna.wojcik@company.com',
            role: 'devops',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        // 2. Tworzenie projektów
        console.log('📁 Tworzenie projektów...');
        // ✅ FIX: Dodaj createdAt i updatedAt
        const project1Id = await projectsService.createProject({
            name: 'System zarządzania projektami',
            description: 'Aplikacja webowa do zarządzania projektami, zadaniami i zespołami',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        const project2Id = await projectsService.createProject({
            name: 'E-commerce Platform',
            description: 'Platforma handlowa z panelem administratora i systemem płatności',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        // 3. Tworzenie historyjek
        console.log('📖 Tworzenie historyjek...');
        // ✅ FIX: Dodaj createdAt i updatedAt
        const story1Id = await storiesService.createStory({
            name: 'System logowania użytkowników',
            description: 'Implementacja bezpiecznego systemu logowania z JWT',
            priority: 'high',
            projectId: project1Id,
            state: 'doing',
            ownerId: adminId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        const story2Id = await storiesService.createStory({
            name: 'Kanban board',
            description: 'Interaktywna tablica Kanban do zarządzania zadaniami',
            priority: 'high',
            projectId: project1Id,
            state: 'todo',
            ownerId: adminId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        const story3Id = await storiesService.createStory({
            name: 'Koszyk zakupowy',
            description: 'Funkcjonalność dodawania produktów do koszyka i składania zamówień',
            priority: 'medium',
            projectId: project2Id,
            state: 'todo',
            ownerId: adminId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        // 4. Tworzenie zadań
        console.log('✅ Tworzenie zadań...');
        
        // Zadania dla Story 1
        // ✅ FIX: Dodaj createdAt i updatedAt
        await tasksService.createTask({
            name: 'Implementacja JWT auth',
            description: 'Stworzenie middleware do weryfikacji tokenów JWT',
            priority: 'high',
            storyId: story1Id,
            estimatedTime: 8,
            state: 'doing',
            assignedUserId: dev1Id,
            startDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        await tasksService.createTask({
            name: 'Formularz logowania',
            description: 'Frontend - komponenty formularza logowania i rejestracji',
            priority: 'high',
            storyId: story1Id,
            estimatedTime: 4,
            state: 'done',
            assignedUserId: dev2Id,
            startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dni temu
            endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // wczoraj
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        await tasksService.createTask({
            name: 'Konfiguracja bazy danych',
            description: 'Stworzenie tabel użytkowników i sesji',
            priority: 'medium',
            storyId: story1Id,
            estimatedTime: 3,
            state: 'todo',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        // Zadania dla Story 2
        await tasksService.createTask({
            name: 'Komponenty Kanban',
            description: 'Stworzenie komponentów React dla tablicy Kanban',
            priority: 'high',
            storyId: story2Id,
            estimatedTime: 12,
            state: 'todo',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        await tasksService.createTask({
            name: 'Drag & Drop',
            description: 'Implementacja przeciągania zadań między kolumnami',
            priority: 'medium',
            storyId: story2Id,
            estimatedTime: 6,
            state: 'todo',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        // Zadania dla Story 3
        await tasksService.createTask({
            name: 'API koszyka',
            description: 'Endpointy do zarządzania koszykiem zakupowym',
            priority: 'medium',
            storyId: story3Id,
            estimatedTime: 5,
            state: 'todo',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        console.log('🎉 Seedowanie zakończone pomyślnie!');
        console.log('📊 Utworzono:');
        console.log('   - 4 użytkowników');
        console.log('   - 2 projekty');
        console.log('   - 3 historyjki');
        console.log('   - 6 zadań');
        
    } catch (error) {
        console.error('❌ Błąd podczas seedowania:', error);
    }
}

// Uruchom seeder jeśli wywołano bezpośrednio
if (require.main === module) {
    seedDatabase();
}

export default seedDatabase;