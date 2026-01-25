
// Test script to verify AI endpoints
async function testEndpoints() {
    try {
        console.log("Testing Pricing Suggestions...");
        const response1 = await fetch('http://localhost:4000/api/ai/pricing-suggestions');
        const pricing = await response1.json();
        console.log("Pricing Status:", response1.status);
        console.log("Pricing Data Preview:", JSON.stringify(pricing, null, 2).substring(0, 200) + "...");

        console.log("\nTesting Inventory Forecast...");
        const response2 = await fetch('http://localhost:4000/api/ai/inventory-forecast');
        const forecast = await response2.json();
        console.log("Forecast Status:", response2.status);
        console.log("Forecast Data Preview:", JSON.stringify(forecast, null, 2).substring(0, 200) + "...");

    } catch (error) {
        console.error("Test Failed:", error);
    }
}

testEndpoints();
