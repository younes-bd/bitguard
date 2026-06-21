const fs = require('fs');
const path = require('path');

const frontendDir = 'frontend/src';

function replaceInFile(filepath) {
    const content = fs.readFileSync(filepath, 'utf8');
    let newContent = content;
    
    // Update ErpDashboard references -> AccountingDashboard
    newContent = newContent.replace(/ErpDashboard/g, 'AccountingDashboard');
    newContent = newContent.replace(/ErpReportPage/g, 'AccountingReportPage');
    newContent = newContent.replace(/ErpSettings/g, 'SysadminSettings');
    
    // Update generic imports
    newContent = newContent.replace(/'apps\/erp\/pages\/dashboards\/ErpDashboard'/g, "'apps/accounting/pages/dashboards/AccountingDashboard'");
    newContent = newContent.replace(/'apps\/erp\/pages\/dashboards\/ErpReportPage'/g, "'apps/accounting/pages/AccountingReportPage'");
    
    // Replace other apps/erp paths broadly
    newContent = newContent.replace(/'apps\/erp\/pages\/accounting\/([^']+)'/g, "'apps/accounting/pages/accounting/$1'");
    newContent = newContent.replace(/'apps\/erp\/pages\/billing\/([^']+)'/g, "'apps/billing/pages/billing/$1'");
    newContent = newContent.replace(/'apps\/erp\/pages\/vendors\/([^']+)'/g, "'apps/purchase/pages/vendors/$1'");
    newContent = newContent.replace(/'apps\/erp\/pages\/([^']+)'/g, "'apps/accounting/pages/$1'");
    newContent = newContent.replace(/apps\/erp/g, 'apps/accounting'); // Fallback

    if (newContent !== content) {
        fs.writeFileSync(filepath, newContent, 'utf8');
        console.log(`Updated ${filepath}`);
    }
}

function walkSync(currentDirPath, callback) {
    if (!fs.existsSync(currentDirPath)) return;
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile() && (filePath.endsWith('.js') || filePath.endsWith('.jsx'))) {
            callback(filePath);
        } else if (stat.isDirectory() && name !== 'node_modules') {
            walkSync(filePath, callback);
        }
    });
}

walkSync(frontendDir, replaceInFile);
console.log('Done updating frontend erp paths.');
