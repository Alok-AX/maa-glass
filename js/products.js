// Sample product data
const products = [
    {
        id: 1,
        name: "Tempered Glass",
        category: "tempered",
        price: 45,
        unit: "sq.ft",
        description: "Safety glass that is four times stronger than regular glass. When broken, it shatters into small, blunt pieces that are less likely to cause injury.",
        image: "images/product.webp",
        specs: [
            "Thickness: 6mm, 8mm, 10mm, 12mm",
            "Strength: 4x regular glass",
            "Safety: Shatters into small pieces",
            "Applications: Shower doors, table tops, partitions"
        ]
    },
    {
        id: 2,
        name: "Mirror Glass",
        category: "mirror",
        price: 35,
        unit: "sq.ft",
        description: "High-quality mirrors with various backing options. Perfect for bathrooms, dressing rooms, and decorative applications.",
        image: "images/product.webp",
        specs: [
            "Thickness: 4mm, 6mm",
            "Backing: Standard silver, copper-free",
            "Edgework: Polished, beveled options",
            "Applications: Bathrooms, dressing rooms"
        ]
    },
    {
        id: 3,
        name: "Frosted Glass",
        category: "frosted",
        price: 55,
        unit: "sq.ft",
        description: "Privacy glass with an elegant frosted finish that diffuses light while maintaining brightness in the space.",
        image: "images/product.webp",
        specs: [
            "Thickness: 5mm, 6mm, 8mm",
            "Finish: Acid-etched, sandblasted",
            "Light Transmission: 50-70%",
            "Applications: Office partitions, shower doors"
        ]
    },
    {
        id: 4,
        name: "Laminated Glass",
        category: "laminated",
        price: 60,
        unit: "sq.ft",
        description: "Safety glass that holds together when shattered, consisting of two or more layers bonded with an interlayer.",
        image: "images/product.webp",
        specs: [
            "Thickness: 6.38mm, 8.38mm, 10.38mm",
            "Interlayer: PVB, SGP, EVA",
            "Security: Burglar and impact resistant",
            "Applications: Storefronts, skylights"
        ]
    },
    {
        id: 5,
        name: "Decorative Glass",
        category: "decorative",
        price: 75,
        unit: "sq.ft",
        description: "Artistic glass with various patterns, textures, and colors for aesthetic applications.",
        image: "images/product.webp",
        specs: [
            "Thickness: 6mm, 8mm",
            "Options: Patterned, textured, colored",
            "Custom Designs: Available",
            "Applications: Doors, partitions, feature walls"
        ]
    },
    {
        id: 6,
        name: "Tinted Glass",
        category: "tempered",
        price: 50,
        unit: "sq.ft",
        description: "Glass with a colored tint that reduces glare and heat from sunlight while maintaining visibility.",
        image: "images/product.webp",
        specs: [
            "Thickness: 6mm, 8mm, 10mm",
            "Colors: Bronze, gray, blue, green",
            "UV Protection: Blocks 99% UV rays",
            "Applications: Windows, facades"
        ]
    }
];

// Initialize products on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('products-container')) {
        renderProducts(products);
        setupProductFilters();
    }
    
    // Setup product modal if exists
    if (document.getElementById('product-modal')) {
        setupProductModal();
    }
});

// Render products to the page
function renderProducts(productsToRender) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300';
        productElement.dataset.category = product.category;
        
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4 line-clamp-2">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-blue-600 font-bold">$${product.price}/${product.unit}</span>
                    <button class="view-details text-blue-600 hover:text-blue-800 font-medium" data-id="${product.id}">View Details</button>
                </div>
            </div>
        `;
        
        container.appendChild(productElement);
    });
    
    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            openProductModal(productId);
        });
    });
}

// Setup product filters
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.product-filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-200', 'hover:bg-gray-300');
            });
            
            this.classList.remove('bg-gray-200', 'hover:bg-gray-300');
            this.classList.add('bg-blue-600', 'text-white');
            
            // Filter products
            const filter = this.dataset.filter;
            if (filter === 'all') {
                renderProducts(products);
            } else {
                const filteredProducts = products.filter(product => product.category === filter);
                renderProducts(filteredProducts);
            }
        });
    });
}

// Setup product modal
function setupProductModal() {
    const modal = document.getElementById('product-modal');
    const closeModal = document.getElementById('close-modal');
    
    closeModal.addEventListener('click', function() {
        modal.classList.add('hidden');
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

// Open product modal with product details
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('modal-product-description').textContent = product.description;
    document.getElementById('modal-product-price').textContent = `$${product.price}`;
    document.getElementById('modal-product-unit').textContent = `per ${product.unit}`;
    
    // Set specifications
    const specsList = document.getElementById('modal-product-specs');
    specsList.innerHTML = '';
    product.specs.forEach(spec => {
        const li = document.createElement('li');
        li.className = 'flex items-start';
        li.innerHTML = `<i class="fas fa-check text-green-500 mr-2 mt-1"></i><span>${spec}</span>`;
        specsList.appendChild(li);
    });
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Setup thumbnail click events
    document.querySelectorAll('#product-modal img:not(#modal-product-image)').forEach(thumb => {
        thumb.addEventListener('click', function() {
            document.getElementById('modal-product-image').src = this.src;
        });
    });
    
    // Setup add to cart button
    document.getElementById('add-to-cart').addEventListener('click', function() {
        const quantity = document.getElementById('quantity').value;
        const thickness = document.getElementById('thickness').value;
        
        alert(`Added to cart: ${quantity} ${product.unit} of ${product.name} (${thickness})`);
    });
    
    // Setup request quote button
    document.getElementById('request-quote').addEventListener('click', function() {
        alert('Quote request submitted! Our team will contact you shortly.');
    });
}