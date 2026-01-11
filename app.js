class DartGame {
    constructor() {
        this.gameType = 501;
        this.players = [];
        this.currentPlayerIndex = 0;
        this.currentTurnDarts = [];
        this.gameHistory = this.loadHistory();
        this.playerList = this.loadPlayerList();
        this.currentMode = 'single'; // single, double, triple
        this.gameStarted = false;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Game type selection
        document.querySelectorAll('.game-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.game-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.gameType = parseInt(e.target.dataset.game);
            });
        });

        // Number of players selection
        const numPlayersSelect = document.getElementById('numPlayers');
        if (numPlayersSelect) {
            numPlayersSelect.addEventListener('change', (e) => {
                this.generatePlayerInputs(parseInt(e.target.value));
            });
        } else {
            // If element doesn't exist yet, wait for DOM
            setTimeout(() => {
                const select = document.getElementById('numPlayers');
                if (select) {
                    select.addEventListener('change', (e) => {
                        this.generatePlayerInputs(parseInt(e.target.value));
                    });
                }
            }, 100);
        }

        // Start game
        document.getElementById('startGame').addEventListener('click', () => {
            const playerNames = this.getAllPlayerNames();
            
            if (playerNames.length < 2) {
                alert('Please enter at least 2 player names');
                return;
            }
            
            // Check for duplicate names
            const uniqueNames = new Set(playerNames);
            if (uniqueNames.size !== playerNames.length) {
                alert('All players must have different names');
                return;
            }
            
            // Check for empty names
            if (playerNames.some(name => !name.trim())) {
                alert('Please enter all player names');
                return;
            }
            
            this.startGame(playerNames);
        });

        // Mode selection (Single/Double/Triple)
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentMode = e.target.dataset.mode;
                this.updateModeIndicator();
            });
        });

        // Number buttons - auto-add on click
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const number = parseInt(e.target.dataset.value);
                const multiplier = this.getCurrentMultiplier();
                this.addDartImmediate(number, multiplier);
            });
        });

        // Special buttons (Bull, Miss)
        document.querySelectorAll('.special-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const number = parseInt(e.target.dataset.value);
                const multiplier = parseInt(e.target.dataset.multiplier);
                this.addDartImmediate(number, multiplier);
            });
        });

        // End turn
        document.getElementById('endTurn').addEventListener('click', () => {
            this.endTurn();
        });

        // Undo dart
        document.getElementById('undoDart').addEventListener('click', () => {
            this.undoDart();
        });

        // New game
        document.getElementById('newGame').addEventListener('click', () => {
            if (confirm('Start a new game? Current game will be lost.')) {
                this.resetGame();
            }
        });

        // View history
        document.getElementById('viewHistory').addEventListener('click', () => {
            this.showHistory();
        });

        // Close modals
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('historyModal').style.display = 'none';
        });

        document.getElementById('playAgain').addEventListener('click', () => {
            this.playAgain();
        });

        document.getElementById('newGameFromWin').addEventListener('click', () => {
            this.resetGame();
        });

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            const historyModal = document.getElementById('historyModal');
            const gameOverModal = document.getElementById('gameOverModal');
            if (e.target === historyModal) {
                historyModal.style.display = 'none';
            }
            if (e.target === gameOverModal) {
                gameOverModal.style.display = 'none';
            }
        });
    }

    generatePlayerInputs(numPlayers) {
        const container = document.getElementById('playersInputGroup');
        container.innerHTML = '';
        
        for (let i = 1; i <= numPlayers; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'player-select-wrapper';
            
            const label = document.createElement('label');
            label.className = 'select-label';
            label.textContent = `Quick Select (optional):`;
            label.setAttribute('for', `player${i}Select`);
            
            const select = document.createElement('select');
            select.id = `player${i}Select`;
            select.className = 'player-select';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- Select Previous Player --';
            select.appendChild(defaultOption);
            
            // Populate with previous players
            this.playerList.forEach(player => {
                const option = document.createElement('option');
                option.value = player;
                option.textContent = player;
                select.appendChild(option);
            });
            
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `player${i}Name`;
            input.placeholder = `Player ${i} Name`;
            input.required = true;
            
            // Add event listener for dropdown
            select.addEventListener('change', (e) => {
                if (e.target.value !== '') {
                    input.value = e.target.value;
                    input.focus();
                }
            });
            
            wrapper.appendChild(label);
            wrapper.appendChild(select);
            wrapper.appendChild(input);
            container.appendChild(wrapper);
        }
    }

    getAllPlayerNames() {
        const numPlayers = parseInt(document.getElementById('numPlayers').value);
        const names = [];
        for (let i = 1; i <= numPlayers; i++) {
            const input = document.getElementById(`player${i}Name`);
            if (input) {
                names.push(input.value.trim());
            }
        }
        return names.filter(name => name);
    }

    populatePlayerSelects() {
        // This is now handled in generatePlayerInputs
    }

    getCurrentMultiplier() {
        if (this.currentMode === 'double') return 2;
        if (this.currentMode === 'triple') return 3;
        return 1;
    }

    updateModeIndicator() {
        const modeText = this.currentMode.charAt(0).toUpperCase() + this.currentMode.slice(1);
        document.getElementById('inputMode').textContent = `${modeText} Mode`;
    }

    startGame(playerNames) {
        // Add players to list if new
        playerNames.forEach(name => {
            if (!this.playerList.includes(name)) {
                this.playerList.push(name);
            }
        });
        this.savePlayerList();
        
        // Initialize players
        this.players = playerNames.map(name => ({
            name: name,
            score: this.gameType,
            dartsThrown: 0,
            history: []
        }));
        
        this.currentPlayerIndex = 0;
        this.currentTurnDarts = [];
        this.currentMode = 'single';
        this.gameStarted = true;
        
        // Reset mode buttons
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('singleMode').classList.add('active');
        
        document.getElementById('playerSetup').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        
        this.generateScoreDisplay();
        this.updateDisplay();
        this.updateModeIndicator();
    }

    generateScoreDisplay() {
        const container = document.getElementById('scoreDisplay');
        container.innerHTML = '';
        
        this.players.forEach((player, index) => {
            const scoreDiv = document.createElement('div');
            scoreDiv.className = 'player-score';
            scoreDiv.id = `player${index + 1}Score`;
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'player-name';
            nameDiv.id = `displayPlayer${index + 1}Name`;
            nameDiv.textContent = player.name;
            
            const scoreValueDiv = document.createElement('div');
            scoreValueDiv.className = 'score-value';
            scoreValueDiv.id = `score${index + 1}`;
            scoreValueDiv.textContent = this.gameType;
            
            const dartsDiv = document.createElement('div');
            dartsDiv.className = 'darts-thrown';
            dartsDiv.id = `darts${index + 1}`;
            dartsDiv.textContent = 'Darts: 0';
            
            // Progress bar container
            const progressContainer = document.createElement('div');
            progressContainer.className = 'progress-container';
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.id = `progress${index + 1}`;
            progressBar.style.width = '0%';
            const progressText = document.createElement('div');
            progressText.className = 'progress-text';
            progressText.id = `progressText${index + 1}`;
            progressText.textContent = '0% to win';
            progressContainer.appendChild(progressBar);
            progressContainer.appendChild(progressText);
            
            // Win probability
            const winProbDiv = document.createElement('div');
            winProbDiv.className = 'win-probability';
            winProbDiv.id = `winProb${index + 1}`;
            winProbDiv.textContent = 'Calculating...';
            
            scoreDiv.appendChild(nameDiv);
            scoreDiv.appendChild(scoreValueDiv);
            scoreDiv.appendChild(dartsDiv);
            scoreDiv.appendChild(progressContainer);
            scoreDiv.appendChild(winProbDiv);
            container.appendChild(scoreDiv);
        });
    }

    calculateDartScore(number, multiplier) {
        if (number === 0) return 0;
        if (number === 25) {
            return multiplier === 2 ? 50 : 25;
        }
        return number * multiplier;
    }

    addDartImmediate(number, multiplier) {
        if (this.currentTurnDarts.length >= 3) {
            return; // Already 3 darts
        }
        
        const currentPlayer = this.players[this.currentPlayerIndex];
        const dartScore = this.calculateDartScore(number, multiplier);
        const newScore = currentPlayer.score - dartScore;
        
        // Check for bust
        if (newScore < 0 || (newScore > 0 && newScore < 2)) {
            // Bust - don't add to score, but track it
            this.currentTurnDarts.push({
                number,
                multiplier,
                score: dartScore,
                bust: true
            });
            this.updateTurnHistory();
            setTimeout(() => {
                alert(`BUST! Score would be ${newScore < 0 ? 'negative' : 'less than 2'}. Turn ends.`);
                this.endTurn();
            }, 100);
            return;
        }
        
        // Check if winning (must end on double or bull)
        if (newScore === 0) {
            if (number === 25 && multiplier === 2) {
                // Double bull wins
                this.currentTurnDarts.push({ number, multiplier, score: dartScore, bust: false });
                this.updateTurnHistory();
                setTimeout(() => {
                    this.endTurn();
                    this.gameWon();
                }, 100);
                return;
            } else if (multiplier === 2) {
                // Double wins
                this.currentTurnDarts.push({ number, multiplier, score: dartScore, bust: false });
                this.updateTurnHistory();
                setTimeout(() => {
                    this.endTurn();
                    this.gameWon();
                }, 100);
                return;
            } else {
                // Can't win without double
                this.currentTurnDarts.push({
                    number,
                    multiplier,
                    score: dartScore,
                    bust: true
                });
                this.updateTurnHistory();
                setTimeout(() => {
                    alert('BUST! Must finish on a double or double bull. Turn ends.');
                    this.endTurn();
                }, 100);
                return;
            }
        }
        
        // Valid dart
        this.currentTurnDarts.push({
            number,
            multiplier,
            score: dartScore,
            bust: false
        });
        
        const oldScore = currentPlayer.score;
        currentPlayer.score = newScore;
        currentPlayer.dartsThrown++;
        
        // Show witty comment
        this.showWittyComment(dartScore, newScore, oldScore);
        
        // Reset to single mode after adding dart (prevents accidental inputs)
        this.resetToSingleMode();
        
        this.updateTurnHistory();
        this.updateDisplayWithAnimation(oldScore, newScore);
        
        // Auto-end turn after 3 darts
        if (this.currentTurnDarts.length >= 3) {
            setTimeout(() => {
                this.endTurn();
            }, 500);
        }
    }

    resetToSingleMode() {
        this.currentMode = 'single';
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('singleMode').classList.add('active');
        this.updateModeIndicator();
    }

    undoDart() {
        if (this.currentTurnDarts.length === 0) {
            return;
        }
        
        const lastDart = this.currentTurnDarts.pop();
        const currentPlayer = this.players[this.currentPlayerIndex];
        
        if (!lastDart.bust) {
            currentPlayer.score += lastDart.score;
            currentPlayer.dartsThrown--;
        }
        
        this.updateTurnHistory();
        this.updateDisplay();
    }

    endTurn() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        
        // Save turn history
        if (this.currentTurnDarts.length > 0) {
            currentPlayer.history.push([...this.currentTurnDarts]);
        }
        
        // Switch players
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
        this.currentTurnDarts = [];
        
        // Reset to single mode
        this.resetToSingleMode();
        
        this.updateTurnHistory();
        this.updateDisplay();
    }

    updateDisplay() {
        this.updateDisplayWithAnimation();
    }

    updateDisplayWithAnimation(oldScore = null, newScore = null) {
        const currentPlayer = this.players[this.currentPlayerIndex];
        
        // Update all player scores
        this.players.forEach((player, index) => {
            const nameEl = document.getElementById(`displayPlayer${index + 1}Name`);
            const scoreEl = document.getElementById(`score${index + 1}`);
            const dartsEl = document.getElementById(`darts${index + 1}`);
            const scoreDiv = document.getElementById(`player${index + 1}Score`);
            const progressBar = document.getElementById(`progress${index + 1}`);
            const progressText = document.getElementById(`progressText${index + 1}`);
            const winProbEl = document.getElementById(`winProb${index + 1}`);
            
            if (nameEl) nameEl.textContent = player.name;
            if (dartsEl) dartsEl.textContent = `Darts: ${player.dartsThrown}`;
            
            // Animate score change
            if (scoreEl) {
                if (oldScore !== null && index === this.currentPlayerIndex && oldScore !== player.score) {
                    scoreEl.classList.add('score-change');
                    setTimeout(() => {
                        scoreEl.textContent = player.score;
                        scoreEl.classList.remove('score-change');
                    }, 100);
                } else {
                    scoreEl.textContent = player.score;
                }
            }
            
            // Update progress bar
            const progress = ((this.gameType - player.score) / this.gameType) * 100;
            if (progressBar) {
                progressBar.style.width = `${Math.min(progress, 100)}%`;
            }
            if (progressText) {
                progressText.textContent = `${Math.round(progress)}% to win`;
            }
            
            // Calculate and display win probability
            if (winProbEl) {
                const winProb = this.calculateWinProbability(player.name, player.score);
                winProbEl.textContent = `${winProb}% win chance`;
            }
            
            // Highlight active player
            if (scoreDiv) {
                scoreDiv.classList.toggle('active', this.currentPlayerIndex === index);
            }
        });
        
        // Update current player indicator
        document.getElementById('currentPlayerName').textContent = currentPlayer.name;
        
        // Update darts remaining
        const dartsRemaining = 3 - this.currentTurnDarts.length;
        document.getElementById('dartsRemaining').textContent = dartsRemaining;
        
        // Show winning options if close
        this.showWinningOptions(currentPlayer.score);
    }

    calculateWinProbability(playerName, currentScore) {
        // Get player's historical performance
        const playerGames = this.gameHistory.filter(game => {
            if (game.players) {
                return game.players.some(p => p.name === playerName);
            }
            return game.winner === playerName || game.loser === playerName;
        });
        
        // Factor in current position
        const scores = this.players.map(p => p.score).sort((a, b) => a - b);
        const position = scores.indexOf(currentScore);
        const totalPlayers = this.players.length;
        
        if (playerGames.length === 0) {
            // No history, base on score position
            if (totalPlayers === 1) return 100;
            return Math.round((1 - position / (totalPlayers - 1)) * 100);
        }
        
        // Calculate average darts per game
        let totalDarts = 0;
        let gamesPlayed = 0;
        let wins = 0;
        
        playerGames.forEach(game => {
            if (game.players) {
                const playerData = game.players.find(p => p.name === playerName);
                if (playerData) {
                    totalDarts += playerData.darts;
                    gamesPlayed++;
                    if (game.winner === playerName) wins++;
                }
            } else {
                if (game.winner === playerName) {
                    totalDarts += game.winnerDarts;
                    wins++;
                } else {
                    totalDarts += game.loserDarts;
                }
                gamesPlayed++;
            }
        });
        
        const avgDarts = totalDarts / gamesPlayed;
        const winRate = wins / gamesPlayed;
        
        const positionFactor = totalPlayers > 1 ? (1 - position / (totalPlayers - 1)) * 0.3 : 0.3;
        
        // Factor in current performance
        const currentPlayer = this.players.find(p => p.name === playerName);
        if (currentPlayer && currentPlayer.dartsThrown > 0 && currentScore < this.gameType) {
            const pointsScored = this.gameType - currentScore;
            const dartsPerPoint = currentPlayer.dartsThrown / pointsScored;
            const expectedDartsPerPoint = avgDarts / (this.gameType / 3);
            const performanceFactor = Math.min(1, expectedDartsPerPoint / dartsPerPoint) * 0.3;
            
            // Combine factors
            let probability = (winRate * 0.4 + positionFactor + performanceFactor) * 100;
            probability = Math.max(0, Math.min(100, Math.round(probability)));
            return probability;
        }
        
        // Fallback calculation
        let probability = (winRate * 0.5 + positionFactor) * 100;
        probability = Math.max(0, Math.min(100, Math.round(probability)));
        return probability;
    }

    showWittyComment(dartScore, newScore, oldScore) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const comment = this.getWittyComment(dartScore, newScore, oldScore);
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        const toastText = document.createElement('div');
        toastText.className = 'toast-text';
        toastText.textContent = comment;
        toast.appendChild(toastText);
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('slide-out');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    getWittyComment(dartScore, newScore, oldScore) {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const scoreDiff = oldScore - newScore;
        const isClose = newScore <= 170;
        const isVeryClose = newScore <= 50;
        
        // High score comments
        if (dartScore >= 60) {
            const highScoreComments = [
                "🎯 Bullseye! That's how you do it!",
                "🔥 On fire! Keep it up!",
                "💪 That's what I'm talking about!",
                "⚡ Lightning strike!",
                "🌟 Absolutely brilliant!",
                "🚀 You're unstoppable!",
                "💎 Pure precision!",
                "🎪 Showstopper!"
            ];
            return highScoreComments[Math.floor(Math.random() * highScoreComments.length)];
        }
        
        // Triple comments
        if (dartScore >= 40 && dartScore < 60) {
            const tripleComments = [
                "🎯 Nice triple! Getting closer!",
                "🔥 Heating up!",
                "💪 Solid shot!",
                "⚡ Good momentum!",
                "🌟 That's the way!",
                "🎪 Keep the pressure on!",
                "💎 Quality dart!",
                "🚀 Building up nicely!"
            ];
            return tripleComments[Math.floor(Math.random() * tripleComments.length)];
        }
        
        // Close to winning
        if (isVeryClose) {
            const closeComments = [
                "🎯 Almost there! Finish strong!",
                "🔥 So close you can taste it!",
                "💪 One more good turn!",
                "⚡ The finish line is in sight!",
                "🌟 Almost time to celebrate!",
                "🎪 The crowd is on their feet!",
                "💎 This is it!",
                "🚀 Victory is near!"
            ];
            return closeComments[Math.floor(Math.random() * closeComments.length)];
        }
        
        // Close but not very close
        if (isClose) {
            const gettingCloseComments = [
                "🎯 Getting into finishing range!",
                "🔥 Warming up for the finish!",
                "💪 Good position!",
                "⚡ Strategy time!",
                "🌟 Plan your finish!",
                "🎪 The endgame begins!",
                "💎 Smart play!",
                "🚀 Almost in the zone!"
            ];
            return gettingCloseComments[Math.floor(Math.random() * gettingCloseComments.length)];
        }
        
        // Low score comments
        if (dartScore <= 20) {
            const lowScoreComments = [
                "🎯 Every point counts!",
                "🔥 Steady progress!",
                "💪 Keep chipping away!",
                "⚡ Slow and steady!",
                "🌟 Building the foundation!",
                "🎪 Patience is key!",
                "💎 Consistency wins!",
                "🚀 Small steps, big goals!"
            ];
            return lowScoreComments[Math.floor(Math.random() * lowScoreComments.length)];
        }
        
        // Miss comments
        if (dartScore === 0) {
            const missComments = [
                "🎯 Shake it off! Next one!",
                "🔥 No worries, you got this!",
                "💪 Everyone misses sometimes!",
                "⚡ Reset and refocus!",
                "🌟 Next dart is the one!",
                "🎪 Happens to the best!",
                "💎 Bounce back strong!",
                "🚀 Keep your head up!"
            ];
            return missComments[Math.floor(Math.random() * missComments.length)];
        }
        
        // Default comments
        const defaultComments = [
            "🎯 Good shot!",
            "🔥 Keep going!",
            "💪 Nice one!",
            "⚡ On track!",
            "🌟 Well done!",
            "🎪 Keep it up!",
            "💎 Solid!",
            "🚀 Good dart!"
        ];
        return defaultComments[Math.floor(Math.random() * defaultComments.length)];
    }

    showWinningOptions(score) {
        const optionsDiv = document.getElementById('winningOptions');
        const optionsList = document.getElementById('optionsList');
        
        if (score > 170) {
            optionsDiv.style.display = 'none';
            return;
        }
        
        const options = this.calculateWinningOptions(score);
        
        if (options.length === 0) {
            optionsDiv.style.display = 'none';
            return;
        }
        
        optionsDiv.style.display = 'block';
        optionsList.innerHTML = options.map(opt => 
            `<span class="option-tag">${opt}</span>`
        ).join('');
    }

    calculateWinningOptions(score) {
        const options = [];
        
        // Check for single dart finishes (must be double)
        if (score <= 40 && score % 2 === 0) {
            const double = score / 2;
            if (double <= 20) {
                options.push(`D${double}`);
            }
        }
        
        // Check for double bull finish
        if (score === 50) {
            options.push('Double Bull');
        }
        
        // Check for two dart finishes
        for (let first = 1; first <= 20; first++) {
            for (let firstMult = 1; firstMult <= 3; firstMult++) {
                const firstScore = first * firstMult;
                const remaining = score - firstScore;
                
                if (remaining > 0 && remaining <= 40 && remaining % 2 === 0) {
                    const double = remaining / 2;
                    if (double <= 20) {
                        const firstStr = firstMult === 1 ? `${first}` : firstMult === 2 ? `D${first}` : `T${first}`;
                        options.push(`${firstStr} + D${double}`);
                    }
                }
                
                // Double bull
                if (remaining === 50) {
                    const firstStr = firstMult === 1 ? `${first}` : firstMult === 2 ? `D${first}` : `T${first}`;
                    options.push(`${firstStr} + Double Bull`);
                }
            }
        }
        
        // Check for triple + double bull
        for (let triple = 1; triple <= 20; triple++) {
            const remaining = score - (triple * 3);
            if (remaining === 50) {
                options.push(`T${triple} + Double Bull`);
            }
        }
        
        // Remove duplicates and sort
        return [...new Set(options)].slice(0, 10);
    }

    updateTurnHistory() {
        const historyDiv = document.getElementById('currentTurnDarts');
        const totalDiv = document.getElementById('turnTotal');
        
        if (this.currentTurnDarts.length === 0) {
            historyDiv.innerHTML = '<em style="color: #999;">No darts thrown yet</em>';
            totalDiv.textContent = '';
            return;
        }
        
        let turnTotal = 0;
        historyDiv.innerHTML = this.currentTurnDarts.map(dart => {
            let display = '';
            if (dart.number === 0) {
                display = 'Miss';
            } else if (dart.number === 25) {
                display = dart.multiplier === 2 ? 'DB' : 'SB';
            } else {
                const ringName = dart.multiplier === 1 ? '' : dart.multiplier === 2 ? 'D' : 'T';
                display = `${ringName}${dart.number}`;
            }
            
            if (!dart.bust) {
                turnTotal += dart.score;
            }
            
            const bustClass = dart.bust ? ' style="opacity: 0.5; text-decoration: line-through; background: #dc3545;"' : '';
            return `<span class="dart-tag"${bustClass}>${display} (${dart.score})</span>`;
        }).join('');
        
        totalDiv.textContent = turnTotal > 0 ? `Turn Total: ${turnTotal}` : '';
    }

    gameWon() {
        const winner = this.players[this.currentPlayerIndex];
        const otherPlayers = this.players.filter((p, i) => i !== this.currentPlayerIndex);
        
        // Save to history
        const gameRecord = {
            date: new Date().toISOString(),
            gameType: this.gameType,
            numPlayers: this.players.length,
            winner: winner.name,
            winnerScore: winner.score,
            winnerDarts: winner.dartsThrown,
            players: this.players.map(p => ({
                name: p.name,
                score: p.score,
                darts: p.dartsThrown
            }))
        };
        
        this.gameHistory.push(gameRecord);
        this.saveHistory();
        
        // Show game over modal
        let message = `${winner.name} wins! (${winner.dartsThrown} darts)\n\n`;
        message += `Final Scores:\n`;
        this.players.forEach(p => {
            message += `${p.name}: ${p.score} (${p.dartsThrown} darts)\n`;
        });
        document.getElementById('winnerMessage').innerHTML = message.replace(/\n/g, '<br>');
        document.getElementById('gameOverModal').style.display = 'flex';
    }

    playAgain() {
        document.getElementById('gameOverModal').style.display = 'none';
        const playerNames = this.players.map(p => p.name);
        this.startGame(playerNames);
    }

    resetGame() {
        document.getElementById('gameOverModal').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'none';
        document.getElementById('playerSetup').style.display = 'block';
        document.getElementById('numPlayers').value = '2';
        this.generatePlayerInputs(2);
        this.gameStarted = false;
    }

    showHistory() {
        const historyList = document.getElementById('historyList');
        const playerStats = document.getElementById('playerStats');
        
        // Calculate player statistics
        const stats = {};
        this.gameHistory.forEach(game => {
            if (game.players) {
                // New format with multiple players
                game.players.forEach(player => {
                    if (!stats[player.name]) {
                        stats[player.name] = { wins: 0, games: 0, totalDarts: 0 };
                    }
                    stats[player.name].games++;
                    stats[player.name].totalDarts += player.darts;
                    if (player.name === game.winner) {
                        stats[player.name].wins++;
                    }
                });
            } else {
                // Old format (backward compatibility)
                if (!stats[game.winner]) {
                    stats[game.winner] = { wins: 0, games: 0, totalDarts: 0 };
                }
                if (!stats[game.loser]) {
                    stats[game.loser] = { wins: 0, games: 0, totalDarts: 0 };
                }
                stats[game.winner].wins++;
                stats[game.winner].games++;
                stats[game.winner].totalDarts += game.winnerDarts;
                stats[game.loser].games++;
                stats[game.loser].totalDarts += game.loserDarts;
            }
        });
        
        // Display stats
        if (Object.keys(stats).length === 0) {
            playerStats.innerHTML = '<p>No game history yet.</p>';
        } else {
            playerStats.innerHTML = Object.entries(stats)
                .sort((a, b) => b[1].wins - a[1].wins)
                .map(([name, stat]) => {
                    const avgDarts = stat.games > 0 ? (stat.totalDarts / stat.games).toFixed(1) : 0;
                    const winRate = stat.games > 0 ? ((stat.wins / stat.games) * 100).toFixed(0) : 0;
                    return `
                        <div class="player-stat-item">
                            <strong>${name}</strong><br>
                            Wins: ${stat.wins} | Games: ${stat.games} | Win Rate: ${winRate}% | Avg Darts: ${avgDarts}
                        </div>
                    `;
                }).join('');
        }
        
        // Display game history
        if (this.gameHistory.length === 0) {
            historyList.innerHTML = '<p>No games played yet.</p>';
        } else {
            historyList.innerHTML = this.gameHistory.slice().reverse().map(game => {
                const date = new Date(game.date);
                let playersInfo = '';
                if (game.players) {
                    playersInfo = game.players.map(p => `${p.name} (${p.score})`).join(' vs ');
                } else {
                    playersInfo = `${game.winner} vs ${game.loser}`;
                }
                return `
                    <div class="history-item">
                        <h4>${playersInfo}</h4>
                        <p><strong>Winner:</strong> ${game.winner} (${game.winnerDarts || game.players?.find(p => p.name === game.winner)?.darts || 0} darts)</p>
                        <p><strong>Game:</strong> ${game.gameType} | Players: ${game.numPlayers || 2}</p>
                        <p><strong>Date:</strong> ${date.toLocaleDateString()} ${date.toLocaleTimeString()}</p>
                    </div>
                `;
            }).join('');
        }
        
        document.getElementById('historyModal').style.display = 'flex';
    }

    saveHistory() {
        localStorage.setItem('dartGameHistory', JSON.stringify(this.gameHistory));
    }

    loadHistory() {
        const saved = localStorage.getItem('dartGameHistory');
        return saved ? JSON.parse(saved) : [];
    }

    savePlayerList() {
        localStorage.setItem('dartPlayerList', JSON.stringify(this.playerList));
    }

    loadPlayerList() {
        const saved = localStorage.getItem('dartPlayerList');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new DartGame();
    // Initialize player inputs after DOM is ready
    game.generatePlayerInputs(2);
});
