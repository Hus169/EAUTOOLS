/**
 * SBC Solver Examples
 * Demonstrates how to use the SBC Requirements Solver for various challenges
 */

// Import the solver (if using in Node.js environment)
// const { solveSBCRequirements, quickSolveSBC } = require('./sbc_solver.js');

// Example 1: Daily Bronze Upgrade SBC
console.log('🟫 === DAILY BRONZE UPGRADE EXAMPLE ===');
const dailyBronzeResult = quickSolveSBC('daily_bronze');
console.log('Bronze SBC Solution:', dailyBronzeResult);

// Example 2: Daily Silver Upgrade SBC  
console.log('\n🥈 === DAILY SILVER UPGRADE EXAMPLE ===');
const dailySilverResult = quickSolveSBC('daily_silver');
console.log('Silver SBC Solution:', dailySilverResult);

// Example 3: Custom 84+ Player Pick SBC
console.log('\n⭐ === CUSTOM 84+ PLAYER PICK EXAMPLE ===');
const custom84Plus = {
    players: 11,
    chemistry: 100,
    rating: 84,
    maxCost: 25000,
    leagues: ['Premier League', 'La Liga'],
    nations: ['England', 'Spain', 'Brazil'],
    minDifferentLeagues: 2
};

const custom84Result = solveSBCRequirements(custom84Plus);
console.log('84+ Player Pick Solution:', custom84Result);

// Example 4: League-Specific SBC (Premier League)
console.log('\n⚽ === PREMIER LEAGUE SPECIFIC SBC ===');
const premierLeagueSBC = {
    players: 11,
    chemistry: 95,
    rating: 83,
    maxCost: 20000,
    leagues: ['Premier League'],
    minDifferentClubs: 8,
    maxSameClub: 2
};

const plResult = solveSBCRequirements(premierLeagueSBC);
console.log('Premier League SBC Solution:', plResult);

// Example 5: Nation-based SBC (Brazil)
console.log('\n🇧🇷 === BRAZIL NATION SBC ===');
const brazilSBC = {
    players: 11,
    chemistry: 100,
    rating: 85,
    maxCost: 40000,
    nations: ['Brazil'],
    minDifferentLeagues: 4,
    maxSameLeague: 4
};

const brazilResult = solveSBCRequirements(brazilSBC);
console.log('Brazil Nation SBC Solution:', brazilResult);

// Example 6: Mixed Requirements SBC
console.log('\n🔀 === MIXED REQUIREMENTS SBC ===');
const mixedSBC = {
    players: 11,
    chemistry: 100,
    rating: 86,
    maxCost: 50000,
    leagues: ['Premier League', 'La Liga', 'Serie A'],
    nations: ['England', 'Spain', 'Italy', 'Brazil', 'Argentina'],
    minDifferentLeagues: 3,
    minDifferentNations: 5,
    maxSameClub: 2,
    rarities: ['gold']
};

const mixedResult = solveSBCRequirements(mixedSBC);
console.log('Mixed Requirements SBC Solution:', mixedResult);

// Example 7: Low Budget Bronze Challenge
console.log('\n💰 === LOW BUDGET BRONZE CHALLENGE ===');
const budgetBronze = {
    players: 11,
    chemistry: 95,
    rating: 60,
    maxCost: 3000,
    rarities: ['bronze'],
    leagues: ['EFL Championship', 'MLS']
};

const budgetResult = solveSBCRequirements(budgetBronze);
console.log('Budget Bronze Challenge Solution:', budgetResult);

// Example 8: High-End Icon SBC Requirements
console.log('\n💎 === HIGH-END ICON SBC EXAMPLE ===');
const iconSBC = {
    players: 11,
    chemistry: 100,
    rating: 88,
    maxCost: 200000,
    minDifferentLeagues: 5,
    minDifferentNations: 8,
    maxSameClub: 1,
    specialCards: ['TOTW', 'Promo']
};

const iconResult = solveSBCRequirements(iconSBC);
console.log('Icon SBC Solution:', iconResult);

// Utility function to display solution summary
function displaySolutionSummary(solution, sbcName) {
    console.log(`\n📊 === ${sbcName.toUpperCase()} SUMMARY ===`);
    
    if (solution.error) {
        console.log('❌ Error:', solution.error);
        return;
    }

    console.log(`Squad Size: ${solution.squad?.length || 0}/11`);
    console.log(`Total Chemistry: ${solution.totalChemistry}/100`);
    console.log(`Squad Rating: ${solution.totalRating}`);
    console.log(`Estimated Cost: ${solution.totalCost?.toLocaleString()} coins`);
    console.log(`Formation: ${solution.formation?.name || 'Not specified'}`);
    
    if (solution.warnings?.length > 0) {
        console.log('\n⚠️ Warnings:');
        solution.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    if (solution.strategy?.length > 0) {
        console.log('\n💡 Strategy Tips:');
        solution.strategy.forEach(tip => console.log(`  - ${tip}`));
    }
    
    console.log('\n👥 Squad Breakdown:');
    solution.squad?.forEach((player, index) => {
        console.log(`  ${index + 1}. ${player.position} - ${player.rating} rated ${player.nation} from ${player.league} (~${player.cost} coins)`);
    });
}

// Display summaries for key examples
displaySolutionSummary(dailySilverResult, 'Daily Silver Upgrade');
displaySolutionSummary(custom84Result, '84+ Player Pick');
displaySolutionSummary(mixedResult, 'Mixed Requirements SBC');

// Quick testing function for multiple SBC types
function testAllQuickSBCs() {
    console.log('\n🧪 === TESTING ALL QUICK SBC TYPES ===');
    
    const sbcTypes = [
        'daily_bronze',
        'daily_silver', 
        'daily_gold',
        '82_plus_pick',
        '84_plus_upgrade'
    ];
    
    sbcTypes.forEach(type => {
        console.log(`\nTesting ${type}:`);
        const result = quickSolveSBC(type);
        
        if (result.error) {
            console.log(`  ❌ ${result.error}`);
        } else {
            console.log(`  ✅ Rating: ${result.totalRating}, Chemistry: ${result.totalChemistry}, Cost: ${result.totalCost}`);
        }
    });
}

// Run the quick tests
testAllQuickSBCs();

// Performance testing
function performanceTest() {
    console.log('\n⚡ === PERFORMANCE TEST ===');
    
    const testSBC = {
        players: 11,
        chemistry: 100,
        rating: 85,
        maxCost: 30000
    };
    
    const startTime = performance.now();
    
    // Run solver 10 times
    for (let i = 0; i < 10; i++) {
        solveSBCRequirements(testSBC);
    }
    
    const endTime = performance.now();
    const avgTime = (endTime - startTime) / 10;
    
    console.log(`Average solve time: ${avgTime.toFixed(2)}ms`);
    console.log(`Solutions per second: ${(1000 / avgTime).toFixed(1)}`);
}

// Run performance test (comment out if performance object not available)
// performanceTest();

console.log('\n✅ All SBC solver examples completed!');
console.log('\n📝 Usage Tips:');
console.log('1. Use quickSolveSBC() for common daily challenges');
console.log('2. Use solveSBCRequirements() for custom requirements');
console.log('3. Check warnings and strategy tips in the solution');
console.log('4. Adjust maxCost based on current market prices');
console.log('5. Consider chemistry links when building your squad');