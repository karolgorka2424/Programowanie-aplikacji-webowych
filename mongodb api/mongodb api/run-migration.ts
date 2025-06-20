import MigrationService from './migration/migrate-from-localstorage';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
    try {
        // Sprawdź czy istnieje plik z eksportem localStorage
        const exportPath = path.join(__dirname, 'localStorage-export.json');
        
        if (!fs.existsSync(exportPath)) {
            console.log('❌ Nie znaleziono pliku localStorage-export.json');
            console.log('💡 Uruchom następujący skrypt w konsoli przeglądarki:');
            console.log(MigrationService.generateLocalStorageExportScript());
            return;
        }
        
        // Wczytaj dane z pliku
        const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
        
        console.log('📂 Znaleziono plik eksportu localStorage');
        console.log(`📅 Data eksportu: ${exportData.exportDate}`);
        console.log(`📊 Zawiera:`);
        console.log(`   - ${exportData.projects?.length || 0} projektów`);
        console.log(`   - ${exportData.stories?.length || 0} historyjek`);
        console.log(`   - ${exportData.tasks?.length || 0} zadań`);
        console.log(`   - ${exportData.users?.length || 0} użytkowników`);
        
        // Potwierdź migrację
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        // ✅ FIX: Dodaj typ dla parametru answer
        rl.question('Czy chcesz kontynuować migrację? (y/n): ', async (answer: string) => {
            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                await MigrationService.migrateFromLocalStorage(exportData);
            } else {
                console.log('❌ Migracja anulowana');
            }
            rl.close();
        });
        
    } catch (error) {
        console.error('❌ Błąd podczas migracji:', error);
    }
}

// Uruchom migrację jeśli wywołano bezpośrednio
if (require.main === module) {
    runMigration();
}