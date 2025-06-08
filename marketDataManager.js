// This object will store market data, keyed by market name.
const marketDataStore = {};

// Function to update market data and dropdown (placeholder - needs integration)
export function updateMarketData(market, data) {
    console.log(`updateMarketData received data for market: ${market}`, data);
    if (!marketDataStore[market]) {
        marketDataStore[market] = [];
        // Removed dynamic dropdown population as it's now hardcoded in index.html
    }
    
    // Add timestamp to the data
    const dataWithTimestamp = {
        ...data,
        timestamp: new Date().getTime()
    };
    
    marketDataStore[market].push(dataWithTimestamp);
    console.log(`Data for ${market} updated. Total entries: ${marketDataStore[market].length}`);
    
    // Clean up old records
    cleanupOldRecords(market);
}

// Function to clean up records older than 1 hour and 30 minutes
function cleanupOldRecords(market) {
    if (!marketDataStore[market]) return;
    
    const currentTime = new Date().getTime();
    const oneHourThirtyMinutes = 90 * 60 * 1000; // 90 minutes in milliseconds
    
    // Filter out records older than 1 hour and 30 minutes
    marketDataStore[market] = marketDataStore[market].filter(record => {
        return (currentTime - record.timestamp) <= oneHourThirtyMinutes;
    });
}

// Function to generate CSV content
function generateCsv(data) {
    if (!data || data.length === 0) {
        return '';
    }

    // Assuming data entries have the same structure
    const headers = ['Timestamp', 'Price', 'Last Digit', '0%', '1%', '2%', '3%', '4%', '5%', '6%', '7%', '8%', '9%'];
    const rows = data.map(entry => {
        const timestamp = new Date(entry.timestamp).toLocaleString();
        const values = [timestamp, entry.price, entry.lastDigit, ...entry.percentages];
        return values.join(',');
    });

    return [headers.join(','), ...rows].join('\n');
}

// Function to download the CSV file
function downloadCsv(filename, csvString) {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { // Feature detection
        // Browsers that support HTML5 download attribute
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Event listener for the download button
document.getElementById('download-data-button').addEventListener('click', () => {
    const marketDropdown = document.getElementById('market-dropdown');
    const selectedMarket = marketDropdown.value;

    console.log('Download button clicked.');
    console.log('Selected Market:', selectedMarket);
    console.log('Current marketDataStore state:', marketDataStore);

    if (!selectedMarket) {
        alert('Please select a market to download data.');
        return;
    }

    const dataToDownload = marketDataStore[selectedMarket];
    if (!dataToDownload || dataToDownload.length === 0) {
        alert(`No data available for ${selectedMarket}.`);
        return;
    }

    const csvContent = generateCsv(dataToDownload);
    const filename = `${selectedMarket}_market_data.csv`;
    downloadCsv(filename, csvContent);
});

// Note: You need to call the updateMarketData function from your existing logic
// that populates the market data table. Pass the market name and the data object.
// Example call: updateMarketData('Volatility 100 Index', { price: '...', lastDigit: '...', percentages: [...] }); 