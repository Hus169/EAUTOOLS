# SBC Requirements Solver

A comprehensive JavaScript function that solves EA Sports FC Ultimate Team Squad Building Challenge (SBC) requirements by analyzing constraints and providing optimal squad solutions.

## Features

🔍 **Smart Analysis**: Automatically analyzes SBC requirements and constraints  
⚡ **Quick Solve**: Pre-built solutions for common daily SBCs  
💰 **Cost Optimization**: Estimates player costs and optimizes for budget  
🧪 **Chemistry Calculation**: Calculates optimal chemistry links between players  
📊 **Multiple Formations**: Supports various formations (4-3-3, 4-4-2, 3-5-2)  
🎯 **Constraint Handling**: Handles league, nation, club, and rating requirements  

## Quick Start

### Basic Usage

```javascript
// Load the solver
// <script src="sbc_solver.js"></script>

// Quick solve common SBCs
const dailySilver = quickSolveSBC('daily_silver');
console.log(dailySilver);

// Custom SBC requirements
const customSBC = {
    players: 11,
    chemistry: 100,
    rating: 84,
    maxCost: 25000,
    leagues: ['Premier League', 'La Liga'],
    nations: ['England', 'Spain', 'Brazil']
};

const solution = solveSBCRequirements(customSBC);
console.log(solution);
```

## API Reference

### `solveSBCRequirements(requirements)`

Main function to solve custom SBC requirements.

**Parameters:**
- `requirements` (Object): SBC challenge requirements

**Required Fields:**
- `players` (number): Number of players in squad (usually 11)
- `chemistry` (number): Minimum chemistry required (0-100)

**Optional Fields:**
- `rating` (number): Minimum squad rating (60-99)
- `maxCost` (number): Maximum budget in coins
- `leagues` (Array): Required leagues
- `nations` (Array): Required nations  
- `clubs` (Array): Required clubs
- `rarities` (Array): Required card rarities ['bronze', 'silver', 'gold']
- `minDifferentLeagues` (number): Minimum different leagues
- `minDifferentNations` (number): Minimum different nations
- `maxSameLeague` (number): Maximum players from same league
- `maxSameClub` (number): Maximum players from same club

**Returns:**
```javascript
{
    squad: [Player...],           // Array of player objects
    totalCost: 15000,            // Estimated total cost
    totalChemistry: 100,         // Calculated chemistry
    totalRating: 84,             // Squad rating
    formation: {...},            // Formation used
    strategy: [String...],       // Strategy tips
    warnings: [String...],       // Warnings if requirements not met
    success: true                // Whether solution is valid
}
```

### `quickSolveSBC(sbcType)`

Quick solver for common SBC types.

**Supported Types:**
- `'daily_bronze'` - Daily Bronze Upgrade (65 rating, 95 chemistry)
- `'daily_silver'` - Daily Silver Upgrade (70 rating, 95 chemistry)  
- `'daily_gold'` - Daily Gold Upgrade (75 rating, 95 chemistry)
- `'82_plus_pick'` - 82+ Player Pick (82 rating, 95 chemistry)
- `'84_plus_upgrade'` - 84+ Upgrade (84 rating, 95 chemistry)

## Examples

### Daily Silver Upgrade
```javascript
const solution = quickSolveSBC('daily_silver');
// Generates 70-rated squad with 95 chemistry using silver players
```

### Premier League SBC
```javascript
const plSBC = {
    players: 11,
    chemistry: 95,
    rating: 83,
    maxCost: 20000,
    leagues: ['Premier League'],
    minDifferentClubs: 8,
    maxSameClub: 2
};

const solution = solveSBCRequirements(plSBC);
```

### Brazil Nation SBC
```javascript
const brazilSBC = {
    players: 11,
    chemistry: 100,
    rating: 85,
    nations: ['Brazil'],
    minDifferentLeagues: 4,
    maxCost: 40000
};

const solution = solveSBCRequirements(brazilSBC);
```

### High-End Icon SBC
```javascript
const iconSBC = {
    players: 11,
    chemistry: 100,
    rating: 88,
    maxCost: 200000,
    minDifferentLeagues: 5,
    minDifferentNations: 8,
    maxSameClub: 1
};

const solution = solveSBCRequirements(iconSBC);
```

## Solution Object Structure

### Player Object
```javascript
{
    position: 'ST',              // Player position
    rating: 84,                  // Player rating
    league: 'Premier League',    // Player league
    nation: 'England',           // Player nation
    club: 'Manchester City',     // Player club
    rarity: 'gold',             // Card rarity
    cost: 2500,                 // Estimated cost
    chemistry: 10               // Individual chemistry
}
```

### Strategy Tips
The solver provides helpful strategy tips:
- "Use loyalty glitch for +1 chemistry per player"
- "Consider position change cards if needed"
- "Check market for price fluctuations"
- "Focus on same league/nation links"
- "Reduce player ratings to lower cost"

## Chemistry Calculation

Chemistry is calculated based on:
- **Position Links**: 10 points for correct position
- **League Links**: 2 points per same-league player (max 8)
- **Nation Links**: 1 point per same-nation player (max 6)  
- **Club Links**: 3 points per same-club player (max 12)
- **Maximum**: 10 chemistry per player, 110 total for squad

## Cost Estimation

Player costs are estimated based on:
- Base rarity costs (Bronze: 150, Silver: 400, Gold: 800)
- Rating multipliers (higher rating = higher cost)
- Position multipliers (ST/CAM cost more than defenders)
- Market dynamics (popular leagues/nations cost more)

## Integration with Your Userscript

To integrate with your existing EA Sports FC userscript:

```javascript
// Add to your userscript
function autoSolveSBC() {
    // Detect SBC requirements from page
    const requirements = detectSBCRequirements();
    
    // Solve using our function
    const solution = solveSBCRequirements(requirements);
    
    // Apply solution to transfer market search
    if (solution.success) {
        solution.squad.forEach(player => {
            searchTransferMarket(player);
        });
    }
}

function detectSBCRequirements() {
    // Parse SBC requirements from EA web app DOM
    const rating = parseInt(document.querySelector('.rating-requirement')?.textContent);
    const chemistry = parseInt(document.querySelector('.chemistry-requirement')?.textContent);
    // ... extract other requirements
    
    return { players: 11, rating, chemistry };
}
```

## Tips for Best Results

1. **Budget Flexibility**: Set `maxCost` 10-20% higher than your actual budget
2. **Chemistry Priority**: Aim for 95+ chemistry for most SBCs
3. **Market Timing**: Check solutions during low-traffic hours for better prices
4. **Loyalty Bonus**: Use players from your club for +1 chemistry each
5. **Position Changes**: Consider position change consumables for better chemistry

## Contributing

The solver can be extended with:
- Real-time market price integration
- Player database improvements  
- Additional formation support
- Advanced constraint handling
- Machine learning optimization

## License

This project is open source and available under the MIT License.