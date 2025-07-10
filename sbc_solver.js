/**
 * SBC Requirements Solver
 * Analyzes Squad Building Challenge requirements and provides optimal solutions
 */

class SBCSolver {
    constructor() {
        this.playerDatabase = {
            leagues: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'],
            nations: ['England', 'Spain', 'Italy', 'Germany', 'France', 'Brazil', 'Argentina'],
            rarityValues: {
                'bronze': { min: 45, max: 64, cost: 150 },
                'silver': { min: 65, max: 74, cost: 400 },
                'gold': { min: 75, max: 99, cost: 800 }
            }
        };
    }

    /**
     * Main function to solve SBC requirements
     * @param {Object} sbcRequirements - The SBC challenge requirements
     * @returns {Object} - Solution with players, cost, and strategy
     */
    solveSBCRequirements(sbcRequirements) {
        try {
            console.log('🔍 Analyzing SBC Requirements:', sbcRequirements);
            
            // Validate input
            if (!this.validateRequirements(sbcRequirements)) {
                throw new Error('Invalid SBC requirements provided');
            }

            // Parse requirements
            const parsedReqs = this.parseRequirements(sbcRequirements);
            
            // Generate solution
            const solution = this.generateSolution(parsedReqs);
            
            // Optimize solution
            const optimizedSolution = this.optimizeSolution(solution, parsedReqs);
            
            console.log('✅ SBC Solution Generated:', optimizedSolution);
            return optimizedSolution;
            
        } catch (error) {
            console.error('❌ Error solving SBC requirements:', error.message);
            return { error: error.message, success: false };
        }
    }

    /**
     * Validates SBC requirements structure
     * @param {Object} requirements 
     * @returns {boolean}
     */
    validateRequirements(requirements) {
        if (!requirements || typeof requirements !== 'object') {
            return false;
        }

        const requiredFields = ['players', 'chemistry'];
        return requiredFields.every(field => field in requirements);
    }

    /**
     * Parses and normalizes SBC requirements
     * @param {Object} requirements 
     * @returns {Object}
     */
    parseRequirements(requirements) {
        const parsed = {
            squadSize: requirements.players || 11,
            minChemistry: requirements.chemistry || 100,
            minRating: requirements.rating || 75,
            maxCost: requirements.maxCost || 50000,
            constraints: {
                leagues: requirements.leagues || [],
                nations: requirements.nations || [],
                clubs: requirements.clubs || [],
                rarities: requirements.rarities || [],
                positions: requirements.positions || {}
            },
            special: {
                maxSameLeague: requirements.maxSameLeague || null,
                maxSameNation: requirements.maxSameNation || null,
                maxSameClub: requirements.maxSameClub || null,
                minDifferentLeagues: requirements.minDifferentLeagues || null,
                minDifferentNations: requirements.minDifferentNations || null
            }
        };

        return parsed;
    }

    /**
     * Generates initial solution based on requirements
     * @param {Object} parsedReqs 
     * @returns {Object}
     */
    generateSolution(parsedReqs) {
        const solution = {
            squad: [],
            totalCost: 0,
            totalChemistry: 0,
            totalRating: 0,
            strategy: [],
            warnings: []
        };

        // Define formation and positions
        const formation = this.selectOptimalFormation(parsedReqs);
        solution.formation = formation;

        // Fill positions
        for (let i = 0; i < parsedReqs.squadSize; i++) {
            const position = formation.positions[i] || 'SUB';
            const playerSuggestion = this.findOptimalPlayer(position, parsedReqs, solution.squad);
            
            if (playerSuggestion) {
                solution.squad.push(playerSuggestion);
                solution.totalCost += playerSuggestion.cost;
            }
        }

        // Calculate chemistry and rating
        solution.totalChemistry = this.calculateChemistry(solution.squad, parsedReqs);
        solution.totalRating = this.calculateSquadRating(solution.squad);

        return solution;
    }

    /**
     * Selects optimal formation based on requirements
     * @param {Object} parsedReqs 
     * @returns {Object}
     */
    selectOptimalFormation(parsedReqs) {
        const formations = {
            '4-3-3': {
                positions: ['GK', 'LB', 'CB', 'CB', 'RB', 'CM', 'CM', 'CM', 'LW', 'ST', 'RW'],
                chemistryBonus: 5
            },
            '4-4-2': {
                positions: ['GK', 'LB', 'CB', 'CB', 'RB', 'LM', 'CM', 'CM', 'RM', 'ST', 'ST'],
                chemistryBonus: 3
            },
            '3-5-2': {
                positions: ['GK', 'CB', 'CB', 'CB', 'LM', 'CM', 'CM', 'CM', 'RM', 'ST', 'ST'],
                chemistryBonus: 4
            }
        };

        // Select formation that maximizes chemistry potential
        return formations['4-3-3']; // Default to most popular
    }

    /**
     * Finds optimal player for a position
     * @param {string} position 
     * @param {Object} parsedReqs 
     * @param {Array} currentSquad 
     * @returns {Object}
     */
    findOptimalPlayer(position, parsedReqs, currentSquad) {
        const player = {
            position: position,
            rating: this.calculateRequiredRating(parsedReqs, currentSquad),
            league: this.selectOptimalLeague(parsedReqs, currentSquad),
            nation: this.selectOptimalNation(parsedReqs, currentSquad),
            club: this.selectOptimalClub(parsedReqs, currentSquad),
            rarity: this.selectOptimalRarity(parsedReqs),
            cost: 0,
            chemistry: 0
        };

        // Calculate cost based on rarity and rating
        player.cost = this.estimatePlayerCost(player);
        
        return player;
    }

    /**
     * Calculates required rating for remaining slots
     * @param {Object} parsedReqs 
     * @param {Array} currentSquad 
     * @returns {number}
     */
    calculateRequiredRating(parsedReqs, currentSquad) {
        if (currentSquad.length === 0) {
            return parsedReqs.minRating;
        }

        const currentTotal = currentSquad.reduce((sum, player) => sum + player.rating, 0);
        const remainingSlots = parsedReqs.squadSize - currentSquad.length;
        const requiredTotal = parsedReqs.minRating * parsedReqs.squadSize;
        const requiredForRemaining = requiredTotal - currentTotal;

        return Math.max(parsedReqs.minRating - 5, Math.ceil(requiredForRemaining / remainingSlots));
    }

    /**
     * Selects optimal league considering constraints
     * @param {Object} parsedReqs 
     * @param {Array} currentSquad 
     * @returns {string}
     */
    selectOptimalLeague(parsedReqs, currentSquad) {
        const constraints = parsedReqs.constraints;
        
        if (constraints.leagues.length > 0) {
            return constraints.leagues[0];
        }

        // Count current leagues
        const leagueCounts = {};
        currentSquad.forEach(player => {
            leagueCounts[player.league] = (leagueCounts[player.league] || 0) + 1;
        });

        // Find most common league for chemistry
        const mostCommonLeague = Object.keys(leagueCounts).reduce((a, b) => 
            leagueCounts[a] > leagueCounts[b] ? a : b, this.playerDatabase.leagues[0]);

        return mostCommonLeague;
    }

    /**
     * Selects optimal nation considering constraints
     * @param {Object} parsedReqs 
     * @param {Array} currentSquad 
     * @returns {string}
     */
    selectOptimalNation(parsedReqs, currentSquad) {
        const constraints = parsedReqs.constraints;
        
        if (constraints.nations.length > 0) {
            return constraints.nations[0];
        }

        // Similar logic to league selection
        const nationCounts = {};
        currentSquad.forEach(player => {
            nationCounts[player.nation] = (nationCounts[player.nation] || 0) + 1;
        });

        const mostCommonNation = Object.keys(nationCounts).reduce((a, b) => 
            nationCounts[a] > nationCounts[b] ? a : b, this.playerDatabase.nations[0]);

        return mostCommonNation;
    }

    /**
     * Selects optimal club considering constraints
     * @param {Object} parsedReqs 
     * @param {Array} currentSquad 
     * @returns {string}
     */
    selectOptimalClub(parsedReqs, currentSquad) {
        const constraints = parsedReqs.constraints;
        
        if (constraints.clubs.length > 0) {
            return constraints.clubs[0];
        }

        return 'Manchester City'; // Default popular club
    }

    /**
     * Selects optimal rarity based on requirements
     * @param {Object} parsedReqs 
     * @returns {string}
     */
    selectOptimalRarity(parsedReqs) {
        const constraints = parsedReqs.constraints;
        
        if (constraints.rarities.length > 0) {
            return constraints.rarities[0];
        }

        // Select based on rating requirements
        if (parsedReqs.minRating >= 85) return 'gold';
        if (parsedReqs.minRating >= 75) return 'silver';
        return 'bronze';
    }

    /**
     * Estimates player cost based on attributes
     * @param {Object} player 
     * @returns {number}
     */
    estimatePlayerCost(player) {
        const baseRarity = this.playerDatabase.rarityValues[player.rarity] || this.playerDatabase.rarityValues.bronze;
        let cost = baseRarity.cost;

        // Adjust for rating
        const ratingMultiplier = Math.max(1, (player.rating - 70) / 10);
        cost *= ratingMultiplier;

        // Adjust for position (GK and popular positions cost more)
        const positionMultipliers = {
            'GK': 1.2,
            'ST': 1.3,
            'CAM': 1.2,
            'CM': 1.1,
            'CB': 1.0,
            'LB': 1.0,
            'RB': 1.0
        };
        
        cost *= positionMultipliers[player.position] || 1.0;

        return Math.round(cost);
    }

    /**
     * Calculates squad chemistry
     * @param {Array} squad 
     * @param {Object} parsedReqs 
     * @returns {number}
     */
    calculateChemistry(squad, parsedReqs) {
        let totalChemistry = 0;

        squad.forEach((player, index) => {
            let playerChemistry = 0;

            // Position chemistry (10 points for correct position)
            playerChemistry += 10;

            // League links
            const leagueLinks = squad.filter(p => p !== player && p.league === player.league).length;
            playerChemistry += Math.min(leagueLinks * 2, 8);

            // Nation links
            const nationLinks = squad.filter(p => p !== player && p.nation === player.nation).length;
            playerChemistry += Math.min(nationLinks * 1, 6);

            // Club links
            const clubLinks = squad.filter(p => p !== player && p.club === player.club).length;
            playerChemistry += Math.min(clubLinks * 3, 12);

            player.chemistry = Math.min(playerChemistry, 10);
            totalChemistry += player.chemistry;
        });

        return Math.round(totalChemistry);
    }

    /**
     * Calculates overall squad rating
     * @param {Array} squad 
     * @returns {number}
     */
    calculateSquadRating(squad) {
        if (squad.length === 0) return 0;
        
        const totalRating = squad.reduce((sum, player) => sum + player.rating, 0);
        return Math.round(totalRating / squad.length);
    }

    /**
     * Optimizes the solution to improve cost/chemistry ratio
     * @param {Object} solution 
     * @param {Object} parsedReqs 
     * @returns {Object}
     */
    optimizeSolution(solution, parsedReqs) {
        // Check if requirements are met
        const meetsRequirements = this.checkRequirements(solution, parsedReqs);
        
        if (!meetsRequirements.success) {
            solution.warnings.push('Solution does not meet all requirements');
            solution.strategy.push('Consider increasing budget or relaxing constraints');
        }

        // Add optimization strategies
        solution.strategy.push('Use loyalty glitch for +1 chemistry per player');
        solution.strategy.push('Consider position change cards if needed');
        solution.strategy.push('Check market for price fluctuations');

        if (solution.totalCost > parsedReqs.maxCost) {
            solution.strategy.push('Reduce player ratings to lower cost');
            solution.warnings.push(`Solution exceeds budget by ${solution.totalCost - parsedReqs.maxCost} coins`);
        }

        if (solution.totalChemistry < parsedReqs.minChemistry) {
            solution.strategy.push('Focus on same league/nation links');
            solution.warnings.push(`Chemistry ${solution.totalChemistry} below required ${parsedReqs.minChemistry}`);
        }

        return solution;
    }

    /**
     * Checks if solution meets all requirements
     * @param {Object} solution 
     * @param {Object} parsedReqs 
     * @returns {Object}
     */
    checkRequirements(solution, parsedReqs) {
        const checks = {
            chemistry: solution.totalChemistry >= parsedReqs.minChemistry,
            rating: solution.totalRating >= parsedReqs.minRating,
            cost: solution.totalCost <= parsedReqs.maxCost,
            squadSize: solution.squad.length === parsedReqs.squadSize
        };

        const success = Object.values(checks).every(check => check);
        
        return { success, checks };
    }

    /**
     * Quick solver for common SBC types
     * @param {string} sbcType 
     * @returns {Object}
     */
    quickSolve(sbcType) {
        const commonSBCs = {
            'daily_bronze': {
                players: 11,
                chemistry: 95,
                rating: 65,
                maxCost: 5000,
                rarities: ['bronze']
            },
            'daily_silver': {
                players: 11,
                chemistry: 95,
                rating: 70,
                maxCost: 8000,
                rarities: ['silver']
            },
            'daily_gold': {
                players: 11,
                chemistry: 95,
                rating: 75,
                maxCost: 12000,
                rarities: ['gold']
            },
            '82_plus_pick': {
                players: 11,
                chemistry: 95,
                rating: 82,
                maxCost: 15000
            },
            '84_plus_upgrade': {
                players: 11,
                chemistry: 95,
                rating: 84,
                maxCost: 25000
            }
        };

        const requirements = commonSBCs[sbcType];
        if (!requirements) {
            return { error: `Unknown SBC type: ${sbcType}`, success: false };
        }

        return this.solveSBCRequirements(requirements);
    }

    /**
     * Gets market suggestions for the solution
     * @param {Object} solution 
     * @returns {Array}
     */
    getMarketSuggestions(solution) {
        const suggestions = [];

        solution.squad.forEach(player => {
            suggestions.push({
                position: player.position,
                searchFilters: {
                    league: player.league,
                    nation: player.nation,
                    rating: `${player.rating-2}-${player.rating+2}`,
                    maxPrice: player.cost
                },
                alternatives: [
                    `Try ${player.position} from ${player.league}`,
                    `Consider ${player.nation} players`,
                    `Look for ${player.rarity} cards`
                ]
            });
        });

        return suggestions;
    }
}

// Main function to solve SBC requirements
function solveSBCRequirements(requirements) {
    const solver = new SBCSolver();
    return solver.solveSBCRequirements(requirements);
}

// Quick solve function for common SBCs
function quickSolveSBC(sbcType) {
    const solver = new SBCSolver();
    return solver.quickSolve(sbcType);
}

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SBCSolver, solveSBCRequirements, quickSolveSBC };
}

// Example usage:
/*
// Solve a custom SBC
const customSBC = {
    players: 11,
    chemistry: 100,
    rating: 84,
    maxCost: 30000,
    leagues: ['Premier League'],
    nations: ['England', 'Spain'],
    minDifferentLeagues: 3
};

const solution = solveSBCRequirements(customSBC);
console.log('SBC Solution:', solution);

// Quick solve common SBCs
const dailySilver = quickSolveSBC('daily_silver');
console.log('Daily Silver Solution:', dailySilver);
*/

console.log('✅ SBC Requirements Solver loaded successfully!');