// Billing system functionality
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('items-table')) {
        initBillingSystem();
    }
});

function initBillingSystem() {
    // Product list
    const billingProducts = [
        { id: 1, name: "Tempered Glass" },
        { id: 2, name: "Mirror Glass" },
        { id: 3, name: "Frosted Glass" },
        { id: 4, name: "Laminated Glass" },
        { id: 5, name: "Decorative Glass" }
    ];

    let items = [createEmptyItem()];
    let editIndex = null;

    function createEmptyItem() {
        return {
            product: '',
            dimensions: '',
            thickness: '',
            qty: 1,
            price: '',
            webBilling: '',
            other: '',
            total: 0
        };
    }

    function renderItemsTable() {
        const tbody = document.getElementById('items-table');
        tbody.innerHTML = '';
        items.forEach((item, idx) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <select class="item-product w-full border border-gray-300 rounded px-2 py-1" data-idx="${idx}">
                        <option value="">Select Product</option>
                        ${billingProducts.map(p => `<option value="${p.name}" ${item.product === p.name ? 'selected' : ''}>${p.name}</option>`).join('')}
                    </select>
                </td>
                <td>
                    <input type="text" class="item-dimensions w-full border border-gray-300 rounded px-2 py-1" value="${item.dimensions}" data-idx="${idx}">
                </td>
                <td>
                    <input type="text" class="item-thickness w-full border border-gray-300 rounded px-2 py-1" value="${item.thickness}" data-idx="${idx}">
                </td>
                <td>
                    <input type="number" min="1" class="item-qty w-full border border-gray-300 rounded px-2 py-1" value="${item.qty}" data-idx="${idx}">
                </td>
                <td>
                    <input type="number" min="0" class="item-price w-full border border-gray-300 rounded px-2 py-1" value="${item.price}" data-idx="${idx}">
                </td>
                <td>
                    <input type="text" class="item-webBilling w-full border border-gray-300 rounded px-2 py-1" value="${item.webBilling}" data-idx="${idx}">
                </td>
                <td>
                    <input type="text" class="item-other w-full border border-gray-300 rounded px-2 py-1" value="${item.other}" data-idx="${idx}">
                </td>
                <td class="item-total">${item.total.toFixed(2)}</td>
                <td>
                    ${items.length > 1 ? `<button class="remove-item text-red-500" data-idx="${idx}"><i class="fas fa-trash"></i></button>` : ''}
                </td>
            `;
            tbody.appendChild(row);
        });
        attachInputListeners();
        attachRemoveListeners();
        recalculateTotals();
    }

    function attachInputListeners() {
        document.querySelectorAll('#items-table input, #items-table select').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = +e.target.dataset.idx;
                const field = e.target.className.split(' ')[0].replace('item-', '');
                items[idx][field] = e.target.value;
                if (field === 'qty' || field === 'price') {
                    items[idx].qty = parseFloat(items[idx].qty) || 1;
                    items[idx].price = parseFloat(items[idx].price) || 0;
                    items[idx].total = items[idx].qty * items[idx].price;
                }
                recalculateTotals(); // Only update totals, don't re-render table
            });
        });
    }

    function attachRemoveListeners() {
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = +e.currentTarget.dataset.idx;
                items.splice(idx, 1);
                renderItemsTable();
            });
        });
    }

    function recalculateTotals() {
        let subtotal = 0;
        items.forEach(item => {
            item.total = (parseFloat(item.qty) || 1) * (parseFloat(item.price) || 0);
            subtotal += item.total;
        });
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    }

    document.getElementById('add-item').addEventListener('click', () => {
        items.push(createEmptyItem());
        renderItemsTable();
    });

    renderItemsTable();

    // --- SUBMIT HANDLER ---
    document.getElementById('submit-items').addEventListener('click', () => {
        const grid = document.getElementById('submitted-items-grid');
        grid.innerHTML = '';
        items.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = "bg-white border border-gray-300 rounded-lg p-4 shadow mb-4 flex flex-col";
            card.innerHTML = `
                <div class="grid grid-cols-2 gap-2 mb-2">
                    <div><span class="font-semibold">Product:</span> ${item.product}</div>
                    <div><span class="font-semibold">Dimensions:</span> ${item.dimensions}</div>
                    <div><span class="font-semibold">Thickness:</span> ${item.thickness}</div>
                    <div><span class="font-semibold">Qty:</span> ${item.qty}</div>
                    <div><span class="font-semibold">Price:</span> ${item.price}</div>
                    <div><span class="font-semibold">Web Billing:</span> ${item.webBilling}</div>
                    <div><span class="font-semibold">Other:</span> ${item.other}</div>
                    <div><span class="font-semibold">Total:</span> ${item.total.toFixed(2)}</div>
                </div>
                <div class="flex space-x-2 mt-2">
                    <button class="edit-item bg-blue-500 text-white px-3 py-1 rounded" data-idx="${idx}">Edit</button>
                    <button class="delete-item bg-red-500 text-white px-3 py-1 rounded" data-idx="${idx}">Delete</button>
                </div>
            `;
            grid.appendChild(card);
        });
        document.getElementById('submitted-items-table').classList.remove('hidden');
        attachCardListeners();
    });

    // --- CARD EDIT/DELETE HANDLERS ---
    function attachCardListeners() {
        document.querySelectorAll('.delete-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = +e.target.dataset.idx;
                items.splice(idx, 1);
                document.getElementById('submit-items').click();
                renderItemsTable();
            });
        });
        document.querySelectorAll('.edit-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = +e.target.dataset.idx;
                // Load item back to the table for editing
                const item = items[idx];
                items = [Object.assign({}, item)];
                renderItemsTable();
                document.getElementById('submitted-items-table').classList.add('hidden');
            });
        });
    }
}

// Close preview modal
document.getElementById('close-preview')?.addEventListener('click', function() {
    document.getElementById('preview-modal').classList.add('hidden');
});

// Save bill button
// (Removed duplicate declaration)

// Preview bill button
document.getElementById('preview-bill').addEventListener('click', function() {
    previewBill();
});

// Print bill button
document.getElementById('print-bill')?.addEventListener('click', function() {
    window.print();
});

// Download bill button
document.getElementById('download-bill')?.addEventListener('click', function() {
    downloadBillAsPDF();
});

// Generate PDF button
document.getElementById('generate-pdf')?.addEventListener('click', function() {
    generatePDF();
});

// Generate Excel button
document.getElementById('generate-excel')?.addEventListener('click', function() {
    generateExcel();
});

// Add first empty item by default
addNewItem();

// Add item button
document.getElementById('add-item').addEventListener('click', function() {
    addNewItem();
});

// Apply discount button
document.getElementById('apply-discount').addEventListener('click', function() {
    applyDiscount();
});

// Save bill button
const saveBtn = document.getElementById('save-bill');
if (saveBtn) saveBtn.addEventListener('click', saveBill);

// Preview bill button
document.getElementById('preview-bill').addEventListener('click', function() {
    previewBill();
});

// Print bill button
document.getElementById('print-bill')?.addEventListener('click', function() {
    window.print();
});

// Download bill button
document.getElementById('download-bill')?.addEventListener('click', function() {
    downloadBillAsPDF();
});

// Generate PDF button
document.getElementById('generate-pdf')?.addEventListener('click', function() {
    generatePDF();
});

// Generate Excel button
document.getElementById('generate-excel')?.addEventListener('click', function() {
    generateExcel();
});

// Close preview modal
document.getElementById('close-preview')?.addEventListener('click', function() {
    document.getElementById('preview-modal').classList.add('hidden');
});

// Add new item to the bill
function addNewItem() {
    const itemId = Date.now(); // Unique ID for each item
    const newItem = {
        id: itemId,
        product: '',
        width: '',
        height: '',
        thickness: '6mm',
        quantity: 1,
        price: 0,
        total: 0
    };
    
    items.push(newItem);
    renderItems();
    
    // Focus on the first input of the new row
    const newRow = document.querySelector(`tr[data-id="${itemId}"]`);
    if (newRow) {
        const firstInput = newRow.querySelector('input, select');
        if (firstInput) firstInput.focus();
    }
}

// Render all items in the table
function renderItems() {
    const tableBody = document.getElementById('items-table');
    tableBody.innerHTML = '';
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-100';
        row.dataset.id = item.id;
        
        row.innerHTML = `
            <td class="py-4">
                <select class="product-select w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Product</option>
                    ${billingProducts.map(p => `<option value="${p.id}" ${item.product === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                </select>
            </td>
            <td class="py-4">
                <div class="flex space-x-2">
                    <input type="number" placeholder="W" class="dimension-input w-16 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" value="${item.width}">
                    <span class="flex items-center">x</span>
                    <input type="number" placeholder="H" class="dimension-input w-16 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" value="${item.height}">
                </div>
            </td>
            <td class="py-4">
                <select class="thickness-select w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="6mm" ${item.thickness === '6mm' ? 'selected' : ''}>6mm</option>
                    <option value="8mm" ${item.thickness === '8mm' ? 'selected' : ''}>8mm</option>
                    <option value="10mm" ${item.thickness === '10mm' ? 'selected' : ''}>10mm</option>
                    <option value="12mm" ${item.thickness === '12mm' ? 'selected' : ''}>12mm</option>
                </select>
            </td>
            <td class="py-4">
                <input type="number" min="1" class="quantity-input w-20 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" value="${item.quantity}">
            </td>
            <td class="py-4">
                <input type="number" step="0.01" min="0" class="price-input w-24 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" value="${item.price.toFixed(2)}">
            </td>
            <td class="py-4 font-medium">$${item.total.toFixed(2)}</td>
            <td class="py-4">
                <button class="remove-item text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
        
        // Add event listeners to the new row
        setupItemEventListeners(row, item.id);
    });
    
    calculateTotals();
}

// Setup event listeners for an item row
function setupItemEventListeners(row, itemId) {
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    // Product select change
    row.querySelector('.product-select').addEventListener('change', function() {
        const productId = this.value;
        const product = billingProducts.find(p => p.id.toString() === productId);
        
        if (product) {
            items[itemIndex].product = product.id;
            items[itemIndex].price = product.price;
            items[itemIndex].total = product.price * items[itemIndex].quantity;
            renderItems();
        } else {
            items[itemIndex].product = '';
            items[itemIndex].price = 0;
            items[itemIndex].total = 0;
            renderItems();
        }
    });
    
    // Dimension inputs change
    row.querySelectorAll('.dimension-input').forEach(input => {
        input.addEventListener('change', function() {
            if (this.placeholder === 'W') {
                items[itemIndex].width = this.value;
            } else {
                items[itemIndex].height = this.value;
            }
            
            // Calculate area if both dimensions are provided
            if (items[itemIndex].width && items[itemIndex].height) {
                const area = parseFloat(items[itemIndex].width) * parseFloat(items[itemIndex].height);
                items[itemIndex].quantity = area;
                renderItems();
            }
        });
    });
    
    // Thickness select change
    row.querySelector('.thickness-select').addEventListener('change', function() {
        items[itemIndex].thickness = this.value;
        
        // Adjust price based on thickness
        const product = billingProducts.find(p => p.id === items[itemIndex].product);
        if (product) {
            let price = product.price;
            
            // Thicker glass costs more
            if (this.value === '8mm') price *= 1.2;
            else if (this.value === '10mm') price *= 1.4;
            else if (this.value === '12mm') price *= 1.6;
            
            items[itemIndex].price = price;
            items[itemIndex].total = price * items[itemIndex].quantity;
            renderItems();
        }
    });
    
    // Quantity input change
    row.querySelector('.quantity-input').addEventListener('change', function() {
        items[itemIndex].quantity = parseFloat(this.value) || 1;
        items[itemIndex].total = items[itemIndex].price * items[itemIndex].quantity;
        renderItems();
    });
    
    // Price input change
    row.querySelector('.price-input').addEventListener('change', function() {
        items[itemIndex].price = parseFloat(this.value) || 0;
        items[itemIndex].total = items[itemIndex].price * items[itemIndex].quantity;
        renderItems();
    });
    
    // Remove item button
    row.querySelector('.remove-item').addEventListener('click', function() {
        items = items.filter(item => item.id !== itemId);
        renderItems();
    });
}

// Calculate and update totals
function calculateTotals() {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Apply discount
function applyDiscount() {
    const discountCode = document.getElementById('discount-code').value;
    let discount = 0;
    
    // Simple discount codes
    if (discountCode === 'GLASS10') discount = 10;
    else if (discountCode === 'GLASS20') discount = 20;
    
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = subtotal * (discount / 100);
    const tax = (subtotal - discountAmount) * 0.08;
    const total = subtotal - discountAmount + tax;
    
    document.getElementById('discount').textContent = `-$${discountAmount.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    if (discount > 0) {
        alert(`Discount applied: ${discount}% off`);
    } else {
        alert('Invalid or no discount code applied');
    }
}

// Save bill
function saveBill() {
    const customerName = document.getElementById('customer-name')?.value || '';
    const customerEmail = document.getElementById('customer-email')?.value || '';
    const customerPhone = document.getElementById('customer-phone')?.value || '';
    const customerAddress = document.getElementById('customer-address')?.value || '';
    const notes = document.getElementById('notes')?.value || '';

    // Only keep items with a selected product and valid quantity/price
    const validItems = (window.items || []).filter(item => item.product && item.quantity > 0 && item.price > 0);

    if (!customerName || !customerPhone || !customerAddress || validItems.length === 0) {
        alert('Please fill in all required fields and add at least one valid item');
        return;
    }

    // Add product name to each item before saving
    const billingProducts = [
        { id: 1, name: "Tempered Glass", price: 45, unit: "sq.ft" },
        { id: 2, name: "Mirror Glass", price: 35, unit: "sq.ft" },
        { id: 3, name: "Frosted Glass", price: 55, unit: "sq.ft" },
        { id: 4, name: "Laminated Glass", price: 60, unit: "sq.ft" },
        { id: 5, name: "Decorative Glass", price: 75, unit: "sq.ft" }
    ];
    const itemsWithNames = validItems.map(item => {
        const prod = billingProducts.find(p => p.id === item.product);
        return {
            ...item,
            name: prod ? prod.name : 'Custom Product'
        };
    });

    const bill = {
        customer: { name: customerName, email: customerEmail, phone: customerPhone, address: customerAddress },
        items: itemsWithNames,
        subtotal: parseFloat(document.getElementById('subtotal')?.textContent.replace('$', '') || '0'),
        tax: parseFloat(document.getElementById('tax')?.textContent.replace('$', '') || '0'),
        discount: parseFloat(document.getElementById('discount')?.textContent.replace('$', '') || '0'),
        total: parseFloat(document.getElementById('total')?.textContent.replace('$', '') || '0'),
        notes: notes,
        date: new Date().toISOString(),
        paid: false
    };

    // Save to localStorage
    const bills = JSON.parse(localStorage.getItem('glassBills') || '[]');
    bills.push(bill);
    localStorage.setItem('glassBills', JSON.stringify(bills));

    alert('Bill saved successfully!');
    window.location.href = 'dashboard.html';
}

// Preview bill
function previewBill() {
    console.log('previewBill called'); // Debug log
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerAddress = document.getElementById('customer-address').value;
    
    if (!customerName || !customerPhone || !customerAddress || items.length === 0) {
        alert('Please fill in all required fields and add at least one item');
        return;
    }
    
    const subtotal = parseFloat(document.getElementById('subtotal').textContent.replace('$', ''));
    const tax = parseFloat(document.getElementById('tax').textContent.replace('$', ''));
    const discount = parseFloat(document.getElementById('discount').textContent.replace('$', '')) || 0;
    const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));
    
    // Generate bill preview HTML
    let itemsHtml = '';
    items.forEach(item => {
        const product = billingProducts.find(p => p.id === item.product) || { name: 'Custom Product' };
        itemsHtml += `
            <tr class="border-b border-gray-200">
                <td class="py-3">${product.name}</td>
                <td class="py-3">${item.width} x ${item.height}</td>
                <td class="py-3">${item.thickness}</td>
                <td class="py-3">${item.quantity}</td>
                <td class="py-3">$${item.price.toFixed(2)}</td>
                <td class="py-3 font-medium">$${item.total.toFixed(2)}</td>
            </tr>
        `;
    });
    
    const previewContent = `
        <div class="p-6">
            <div class="flex justify-between items-start mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-blue-600">Maa Glass</h1>
                    <p class="text-gray-600">123 Glass Avenue, Suite 100</p>
                    <p class="text-gray-600">San Francisco, CA 94107</p>
                    <p class="text-gray-600">+1 (555) 123-4567</p>
                </div>
                <div class="text-right">
                    <h2 class="text-xl font-bold">INVOICE</h2>
                    <p class="text-gray-600">Date: ${new Date().toLocaleDateString()}</p>
                    <p class="text-gray-600">Invoice #: GL-${Math.floor(1000 + Math.random() * 9000)}</p>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 class="font-bold text-gray-700 mb-2">Bill To:</h3>
                    <p class="text-gray-800">${customerName}</p>
                    ${customerEmail ? `<p class="text-gray-600">${customerEmail}</p>` : ''}
                    <p class="text-gray-600">${customerPhone}</p>
                    <p class="text-gray-600">${customerAddress}</p>
                </div>
            </div>
            
            <div class="mb-8 overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="pb-2 text-left text-gray-700">Product</th>
                            <th class="pb-2 text-left text-gray-700">Dimensions</th>
                            <th class="pb-2 text-left text-gray-700">Thickness</th>
                            <th class="pb-2 text-left text-gray-700">Qty</th>
                            <th class="pb-2 text-left text-gray-700">Price</th>
                            <th class="pb-2 text-left text-gray-700">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
            </div>
            
            <div class="flex justify-end">
                <div class="w-full md:w-1/3">
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-700">Subtotal:</span>
                            <span>$${subtotal.toFixed(2)}</span>
                        </div>
                        ${discount > 0 ? `
                        <div class="flex justify-between">
                            <span class="text-gray-700">Discount:</span>
                            <span class="text-red-600">-$${discount.toFixed(2)}</span>
                        </div>
                        ` : ''}
                        <div class="flex justify-between">
                            <span class="text-gray-700">Tax (8%):</span>
                            <span>$${tax.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between border-t border-gray-200 pt-3 font-bold text-lg">
                            <span>Total:</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-12 pt-6 border-t border-gray-200">
                <p class="text-gray-600 text-sm">Thank you for your business. Payment is due within 15 days.</p>
                <p class="text-gray-600 text-sm mt-2">Please make checks payable to Maa Glass Inc.</p>
            </div>
        </div>
    `;
    
    document.getElementById('bill-preview-content').innerHTML = previewContent;
    document.getElementById('preview-modal').classList.remove('hidden');
}

// Generate PDF
function generatePDF() {
    // In a real app, you would use jsPDF to generate a proper PDF
    alert('PDF generation would be implemented here with jsPDF');
}

// Generate Excel
function generateExcel() {
    // In a real app, you would use SheetJS to generate an Excel file
    alert('Excel generation would be implemented here with SheetJS');
}

// Download bill as PDF
function downloadBillAsPDF() {
    // In a real app, you would use jsPDF to generate and download a PDF
    alert('PDF download would be implemented here with jsPDF');
}