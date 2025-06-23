// Dashboard functionality with charts and export
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        // Load user data
        const userName = localStorage.getItem('userName') || 'User';
        const userNameSpan = document.getElementById('user-name');
        if (userNameSpan) userNameSpan.textContent = userName;

        // Load bills from localStorage
        let bills = [];
        if (!localStorage.getItem('glassBills') || JSON.parse(localStorage.getItem('glassBills')).length === 0) {
            bills = [];
        } else {
            bills = JSON.parse(localStorage.getItem('glassBills'));
        }
        renderOrdersTable(bills);
        
        // Update stats
        updateStats(bills);
        
        // Initialize charts
        initCharts(bills);
        
        // Setup export buttons
        document.getElementById('export-pdf').addEventListener('click', () => exportToPDF(bills));
        document.getElementById('export-excel').addEventListener('click', () => exportToExcel(bills));
        
        // Chart year selector
        document.getElementById('chart-year').addEventListener('change', function() {
            initCharts(bills, this.value);
        });
    }
});

// Render orders table
function renderOrdersTable(bills) {
    const tableBody = document.getElementById('orders-table');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (!bills || bills.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="py-4 text-center text-gray-500">No orders found.</td></tr>`;
        return;
    }

    bills.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentBills = bills.slice(0, 10);

    recentBills.forEach((bill, index) => {
        const products = bill.items.map(item => `${item.name} (${item.quantity})`).join(', ');
        const status = bill.paid ? 'Paid' : 'Pending';
        const date = new Date(bill.date).toLocaleDateString();
        const total = bill.total ? `$${bill.total.toFixed(2)}` : '$0.00';

        const row = document.createElement('tr');
        row.className = 'border-b border-gray-100 hover:bg-gray-50';
        row.innerHTML = `
            <td class="py-3">${bills.length - index}</td>
            <td class="py-3">${bill.customer.name}</td>
            <td class="py-3">${date}</td>
            <td class="py-3">${products}</td>
            <td class="py-3">${status}</td>
            <td class="py-3">${total}</td>
            <td class="py-3">
                <button class="view-order text-blue-600 hover:underline" data-index="${bills.length - index - 1}">View</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.view-order').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.id;
            const bill = bills.find(b => b.date === orderId);
            if (bill) {
                showOrderDetails(bill);
            }
        });
    });
    
    document.querySelectorAll('.print-order').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.id;
            // In a real app, you would print the order
            alert('Print order: ' + orderId);
        });
    });
}

// Show order details modal
function showOrderDetails(bill) {
    // Create a simple modal to show order details
    const modalContent = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Order Details</h3>
                    <button class="close-modal text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="mb-4">
                    <h4 class="font-semibold">Customer:</h4>
                    <p>${bill.customer.name}</p>
                    <p>${bill.customer.email}</p>
                    <p>${bill.customer.phone}</p>
                    <p>${bill.customer.address}</p>
                </div>
                <div class="mb-4">
                    <h4 class="font-semibold">Order Date:</h4>
                    <p>${new Date(bill.date).toLocaleString()}</p>
                </div>
                <table class="w-full mb-4">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="pb-2 text-left">Product</th>
                            <th class="pb-2 text-left">Dimensions</th>
                            <th class="pb-2 text-left">Qty</th>
                            <th class="pb-2 text-left">Price</th>
                            <th class="pb-2 text-left">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bill.items.map(item => `
                            <tr class="border-b border-gray-100">
                                <td class="py-2">${item.name || `Product ${item.product}`}</td>
                                <td class="py-2">${item.width || ''} x ${item.height || ''} ${item.thickness ? `(${item.thickness})` : ''}</td>
                                <td class="py-2">${item.quantity}</td>
                                <td class="py-2">$${item.price.toFixed(2)}</td>
                                <td class="py-2">$${item.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="flex justify-end">
                    <button class="close-modal bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Add close event
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Update stats cards
function updateStats(bills) {
    const currentOrders = bills.filter(bill => !bill.paid).length;
    const completedOrders = bills.filter(bill => bill.paid).length;
    const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
    
    document.getElementById('current-orders').textContent = currentOrders;
    document.getElementById('completed-orders').textContent = completedOrders;
    document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
}

// Initialize charts
function initCharts(bills, year = '2024') {
    // Destroy previous charts if they exist
    if (window.ordersChart && typeof window.ordersChart.destroy === 'function') {
        window.ordersChart.destroy();
    }
    if (window.productsChart && typeof window.productsChart.destroy === 'function') {
        window.productsChart.destroy();
    }

    // Monthly Orders Chart
    const ordersCanvas = document.getElementById('ordersChart');
    if (!ordersCanvas) return; // Prevent error if not found
    const ordersCtx = ordersCanvas.getContext('2d');
    
    // Filter bills by selected year
    const yearlyBills = bills.filter(bill => {
        const billYear = new Date(bill.date).getFullYear().toString();
        return billYear === year;
    });
    
    // Group bills by month
    const monthlyData = Array(12).fill(0);
    yearlyBills.forEach(bill => {
        const month = new Date(bill.date).getMonth();
        monthlyData[month]++;
    });
    
    window.ordersChart = new Chart(ordersCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Orders',
                data: monthlyData,
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    // Products Chart
    const productsCanvas = document.getElementById('productsChart');
    if (!productsCanvas) return; // Prevent error if not found
    const productsCtx = productsCanvas.getContext('2d');
    
    // Count products sold
    const productCounts = {};
    bills.forEach(bill => {
        bill.items.forEach(item => {
            const productName = item.name || `Product ${item.product}`;
            productCounts[productName] = (productCounts[productName] || 0) + item.quantity;
        });
    });
    
    window.productsChart = new Chart(productsCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(productCounts),
            datasets: [{
                data: Object.values(productCounts),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(236, 72, 153, 0.7)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(236, 72, 153, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Export to PDF
function exportToPDF(bills) {
    alert('Generating PDF export...');
    
    // Simulate PDF generation
    setTimeout(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('Maa Glass - Orders Report', 15, 20);
        
        // Add date
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 30);
        
        // Add table headers
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Order #', 15, 45);
        doc.text('Customer', 50, 45);
        doc.text('Date', 100, 45);
        doc.text('Total', 150, 45);
        doc.text('Status', 180, 45);
        
        // Add order data
        doc.setFont(undefined, 'normal');
        let y = 55;
        
        bills.forEach((bill, index) => {
            const orderDate = new Date(bill.date);
            const orderNumber = `GL-${orderDate.getFullYear()}-${1000 + index}`;
            const formattedDate = orderDate.toLocaleDateString();
            const status = bill.paid ? 'Completed' : 'Processing';
            
            doc.text(orderNumber, 15, y);
            doc.text(bill.customer.name, 50, y);
            doc.text(formattedDate, 100, y);
            doc.text(`$${bill.total.toFixed(2)}`, 150, y);
            doc.text(status, 180, y);
            
            y += 10;
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
        });
        
        // Add summary
        const currentOrders = bills.filter(bill => !bill.paid).length;
        const completedOrders = bills.filter(bill => bill.paid).length;
        const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
        
        doc.setFontSize(14);
        doc.text('Summary', 15, y + 10);
        doc.setFontSize(12);
        doc.text(`Total Orders: ${bills.length}`, 15, y + 20);
        doc.text(`Current Orders: ${currentOrders}`, 15, y + 30);
        doc.text(`Completed Orders: ${completedOrders}`, 15, y + 40);
        doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 15, y + 50);
        
        // Save the PDF
        doc.save('Maa Glass-orders-report.pdf');
    }, 1000);
}

// Export to Excel
function exportToExcel(bills) {
    alert('Generating Excel export...');
    
    setTimeout(() => {
        // Prepare data
        const data = [
            ['Order #', 'Customer', 'Date', 'Products', 'Total', 'Status']
        ];
        
        bills.forEach((bill, index) => {
            const orderDate = new Date(bill.date);
            const orderNumber = `GL-${orderDate.getFullYear()}-${1000 + index}`;
            const formattedDate = orderDate.toLocaleDateString();
            const productCount = bill.items.length;
            const status = bill.paid ? 'Completed' : 'Processing';
            
            data.push([
                orderNumber,
                bill.customer.name,
                formattedDate,
                productCount,
                bill.total.toFixed(2),
                status
            ]);
        });
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');
        
        // Add summary sheet
        const currentOrders = bills.filter(bill => !bill.paid).length;
        const completedOrders = bills.filter(bill => bill.paid).length;
        const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
        
        const summaryData = [
            ['Metric', 'Value'],
            ['Total Orders', bills.length],
            ['Current Orders', currentOrders],
            ['Completed Orders', completedOrders],
            ['Total Revenue', totalRevenue.toFixed(2)]
        ];
        
        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
        
        // Save the Excel file
        XLSX.writeFile(wb, 'Maa Glass-orders.xlsx');
    }, 1000);
}