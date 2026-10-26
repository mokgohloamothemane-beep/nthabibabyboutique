// ==========================================
// 1. LIGHTBOX GALLERY
// ==========================================
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:1000; justify-content:center; align-items:center; cursor:pointer;';
const lightboxImg = document.createElement('img');
lightboxImg.style.cssText = 'max-width:90%; max-height:90%; border-radius:10px;';
lightbox.appendChild(lightboxImg);
document.body.appendChild(lightbox);

lightbox.addEventListener('click', () => { lightbox.style.display = 'none'; });

function initializeLightbox() {
    document.querySelectorAll('.gallery-img').forEach(image => {
        image.style.cursor = 'pointer';
        image.removeEventListener('click', openLightbox);
        image.addEventListener('click', openLightbox);
    });
}
function openLightbox(e) {
    lightbox.style.display = 'flex';
    lightboxImg.src = e.target.src;
}

// ==========================================
// 2. PRODUCTS & SEARCH
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById('product-list');

    // Ensure your images match these names exactly
    const productsData = [
        { id: 1, name: "Polka Dot Baby Dress", price: 250.00, image: "images/baby-dress.jpg", desc: "Beautiful pink dress with black polka dots." },
        { id: 2, name: "Blue Baby Booties", price: 120.00, image: "images/baby-shoes.jpg", desc: "Soft blue booties with ribbon ties." },
        { id: 3, name: "Pastel Baby Onesies", price: 180.00, image: "images/baby-clothes.jpg", desc: "Comfortable everyday onesies in pastel colors." },
        { id: 4, name: "Baby Shower Gift Set", price: 350.00, image: "images/gift-set.jpg", desc: "A perfect gift set for new parents." }
    ];

    function displayProducts(products) {
        if (!productList) return; 
        productList.innerHTML = ""; 

        if (products.length === 0) {
            productList.innerHTML = "<p style='width:100%; color:#D98A92;'>No products found matching your search.</p>";
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card product';

            // The onerror shows a placeholder if the image path is broken
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="gallery-img" onerror="this.src='https://placehold.co/180x180/FDE8E9/D98A92?text=Image+Not+Found';">
                <h3>${product.name}</h3>
                <p>${product.desc}</p>
                <p><strong>R${product.price.toFixed(2)}</strong></p>
                <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
            `;
            productList.appendChild(card);
        });
        initializeLightbox(); 
    }

    displayProducts(productsData);

    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.addEventListener('keyup', (e) => {
            const searchString = e.target.value.toLowerCase().trim();
            const filteredProducts = productsData.filter(p => 
                p.name.toLowerCase().includes(searchString) || p.desc.toLowerCase().includes(searchString)
            );
            displayProducts(filteredProducts);
        });
    }
});

// ==========================================
// 3. SHOPPING CART LOGIC
// ==========================================
let cart = JSON.parse(localStorage.getItem('nthabiCart')) || [];

function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    saveCart();
    alert(name + " added to cart!");
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        saveCart();
        renderCart();
    }
}

function clearCart() {
    if(confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        saveCart();
        renderCart();
    }
}

function saveCart() {
    localStorage.setItem('nthabiCart', JSON.stringify(cart));
}

function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (!cartContainer) return; 

    cartContainer.innerHTML = "";
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p style='text-align:center;'>Your cart is currently empty.</p>";
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;
            
            cartContainer.innerHTML += `
                <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #ccc; padding:10px; background: white; border-radius: 10px; margin-bottom: 10px;">
                    <img src="${item.image}" alt="${item.name}" style="width:60px; height:60px; object-fit:cover; border-radius:5px;">
                    <div style="flex-grow:1; padding-left:15px;">
                        <strong>${item.name}</strong><br>
                        R${item.price.toFixed(2)} x ${item.quantity}
                    </div>
                    <div>
                        <button onclick="updateQuantity(${item.id}, -1)" style="padding: 5px 10px; margin:0;">-</button>
                        <button onclick="updateQuantity(${item.id}, 1)" style="padding: 5px 10px; margin:0;">+</button>
                    </div>
                </div>
            `;
        });
    }

    if(cartCount) cartCount.innerText = count;
    if(cartTotal) cartTotal.innerText = total.toFixed(2);
}

document.addEventListener("DOMContentLoaded", renderCart);