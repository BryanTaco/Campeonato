document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('team1Display')) {
        loadTeamsForResults();
        calculateProbabilitiesWithPermutations();
    }
});

let teams = {
    team1: { name: '', players: [] },
    team2: { name: '', players: [] }
};

function addPlayer(teamId) {
    const playersContainer = document.getElementById(teamId);
    const playerInput = document.createElement('div');
    playerInput.className = 'player-input';
    playerInput.innerHTML = `
        <input type="text" placeholder="Nombre del jugador" class="player-name" required>
        <input type="number" placeholder="Habilidad (1-100)" min="1" max="100" class="player-skill" required>
        <button class="remove-player" onclick="removePlayer(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    playersContainer.appendChild(playerInput);
}

function removePlayer(button) {
    const playerInput = button.parentElement;
    if (document.querySelectorAll('.player-input').length > 1) {
        playerInput.remove();
    } else {
        alert('Cada equipo debe tener al menos un jugador.');
    }
}

function saveTeams() {
    const team1Name = document.getElementById('team1Name').value.trim();
    const team2Name = document.getElementById('team2Name').value.trim();
    
    if (!team1Name || !team2Name) {
        alert('Por favor, ingresa nombres para ambos equipos.');
        return;
    }
    
    teams.team1.name = team1Name;
    teams.team1.players = [];
    const team1Players = document.querySelectorAll('#team1Players .player-input');
    
    const team1Names = new Set();
    for (const player of team1Players) {
        const name = player.querySelector('.player-name').value.trim();
        const skill = parseInt(player.querySelector('.player-skill').value);
        
        if (!name || isNaN(skill)) {
            alert('Por favor, completa todos los campos de los jugadores correctamente.');
            return;
        }
        
        if (skill < 1 || skill > 100) {
            alert('La habilidad debe estar entre 1 y 100.');
            return;
        }
        
        if (team1Names.has(name)) {
            alert(`El nombre "${name}" está repetido en el Equipo Local.`);
            return;
        }
        
        team1Names.add(name);
        teams.team1.players.push({ name, skill });
    }
    
    teams.team2.name = team2Name;
    teams.team2.players = [];
    const team2Players = document.querySelectorAll('#team2Players .player-input');
    
    const team2Names = new Set();
    const allNames = new Set([...team1Names]);
    for (const player of team2Players) {
        const name = player.querySelector('.player-name').value.trim();
        const skill = parseInt(player.querySelector('.player-skill').value);
        
        if (!name || isNaN(skill)) {
            alert('Por favor, completa todos los campos de los jugadores correctamente.');
            return;
        }
        
        if (skill < 1 || skill > 100) {
            alert('La habilidad debe estar entre 1 y 100.');
            return;
        }
        
        if (team2Names.has(name)) {
            alert(`El nombre "${name}" está repetido en el Equipo Visitante.`);
            return;
        }
        
        if (allNames.has(name)) {
            alert(`El nombre "${name}" ya existe en el otro equipo.`);
            return;
        }
        
        team2Names.add(name);
        allNames.add(name);
        teams.team2.players.push({ name, skill });
    }
    
    if (teams.team1.players.length === 0 || teams.team2.players.length === 0) {
        alert('Cada equipo debe tener al menos un jugador.');
        return;
    }
    
    localStorage.setItem('footballTeams', JSON.stringify(teams));
    window.location.href = 'results.html';
}

function loadTeamsForResults() {
    const savedTeams = localStorage.getItem('footballTeams');
    if (savedTeams) {
        teams = JSON.parse(savedTeams);
        
        document.getElementById('team1NameDisplay').textContent = teams.team1.name;
        document.getElementById('probTeam1Name').textContent = teams.team1.name;
        
        const team1PlayersDisplay = document.getElementById('team1PlayersDisplay');
        team1PlayersDisplay.innerHTML = '';
        
        let team1TotalSkill = 0;
        teams.team1.players.forEach(player => {
            team1TotalSkill += player.skill;
            const playerElement = document.createElement('div');
            playerElement.className = 'player';
            playerElement.innerHTML = `
                <span class="player-name">${player.name}</span>
                <span class="player-skill">${player.skill}</span>
            `;
            team1PlayersDisplay.appendChild(playerElement);
        });
        
        document.getElementById('team1TotalSkill').textContent = team1TotalSkill;
        document.getElementById('team1PlayerCount').textContent = teams.team1.players.length;
        
        document.getElementById('team2NameDisplay').textContent = teams.team2.name;
        document.getElementById('probTeam2Name').textContent = teams.team2.name;
        
        const team2PlayersDisplay = document.getElementById('team2PlayersDisplay');
        team2PlayersDisplay.innerHTML = '';
        
        let team2TotalSkill = 0;
        teams.team2.players.forEach(player => {
            team2TotalSkill += player.skill;
            const playerElement = document.createElement('div');
            playerElement.className = 'player';
            playerElement.innerHTML = `
                <span class="player-name">${player.name}</span>
                <span class="player-skill">${player.skill}</span>
            `;
            team2PlayersDisplay.appendChild(playerElement);
        });
        
        document.getElementById('team2TotalSkill').textContent = team2TotalSkill;
        document.getElementById('team2PlayerCount').textContent = teams.team2.players.length;
    }
}

function generatePermutations(players, k) {
    const result = [];
    
    function backtrack(current) {
        if (current.length === k) {
            result.push([...current]);
            return;
        }
        
        for (let i = 0; i < players.length; i++) {
            if (!current.includes(players[i])) {
                current.push(players[i]);
                backtrack(current);
                current.pop();
            }
        }
    }
    
    backtrack([]);
    return result;
}

function calculateProbabilitiesWithPermutations() {
    const team1Players = teams.team1.players;
    const team2Players = teams.team2.players;
    
    const permutationSize = Math.min(
        5, 
        Math.min(team1Players.length, team2Players.length)
    );
    
    const team1Permutations = generatePermutations(team1Players, permutationSize);
    const team2Permutations = generatePermutations(team2Players, permutationSize);
    
    let team1Wins = 0;
    let team2Wins = 0;
    let draws = 0;
    const totalMatches = team1Permutations.length * team2Permutations.length;
    
    for (const perm1 of team1Permutations) {
        for (const perm2 of team2Permutations) {
            const team1Skill = perm1.reduce((sum, player) => sum + player.skill, 0);
            const team2Skill = perm2.reduce((sum, player) => sum + player.skill, 0);
            
            if (team1Skill > team2Skill) {
                team1Wins++;
            } else if (team2Skill > team1Skill) {
                team2Wins++;
            } else {
                draws++;
            }
        }
    }
    
    const team1Percent = Math.round((team1Wins / totalMatches) * 100);
    const team2Percent = Math.round((team2Wins / totalMatches) * 100);
    const drawPercent = 100 - team1Percent - team2Percent;
    
    document.getElementById('team1Percent').textContent = `${team1Percent}%`;
    document.getElementById('team2Percent').textContent = `${team2Percent}%`;
    
    document.getElementById('team1Bar').style.width = `${team1Percent}%`;
    document.getElementById('team2Bar').style.width = `${team2Percent}%`;
    
    console.log(`Total de permutaciones equipo 1: ${team1Permutations.length}`);
    console.log(`Total de permutaciones equipo 2: ${team2Permutations.length}`);
    console.log(`Total de partidos simulados: ${totalMatches}`);
    console.log(`Victorias equipo 1: ${team1Wins} (${team1Percent}%)`);
    console.log(`Victorias equipo 2: ${team2Wins} (${team2Percent}%)`);
    console.log(`Empates: ${draws} (${drawPercent}%)`);
    
    updatePermutationsInfo(team1Permutations.length, team2Permutations.length, totalMatches);
}

function updatePermutationsInfo(perm1Count, perm2Count, totalMatches) {
    const permutationsInfo = document.createElement('div');
    permutationsInfo.className = 'permutations-info';
    permutationsInfo.innerHTML = `
        <h3><i class="fas fa-calculator"></i> Análisis de Permutaciones</h3>
        <p>Permutaciones equipo local: <strong>${perm1Count}</strong></p>
        <p>Permutaciones equipo visitante: <strong>${perm2Count}</strong></p>
        <p>Total de combinaciones evaluadas: <strong>${totalMatches}</strong></p>
    `;
    
    const probabilityResult = document.querySelector('.probability-result');
    probabilityResult.insertBefore(permutationsInfo, probabilityResult.lastElementChild);
}

function recalculate() {
    const oldInfo = document.querySelector('.permutations-info');
    if (oldInfo) oldInfo.remove();
    
    calculateProbabilitiesWithPermutations();
    
    document.getElementById('team1Bar').classList.remove('animated');
    document.getElementById('team2Bar').classList.remove('animated');
    void document.getElementById('team1Bar').offsetWidth;
    void document.getElementById('team2Bar').offsetWidth;
    document.getElementById('team1Bar').classList.add('animated');
    document.getElementById('team2Bar').classList.add('animated');
}
