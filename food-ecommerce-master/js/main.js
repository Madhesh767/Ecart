// =============================
// BACK TO TOP BUTTON
// =============================
let backToTopBtn = document.querySelector('.back-to-top');

window.onscroll = () => {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.style.display = 'none';
    }
};

// =============================
// TOP NAV MENU ACTIVE STATE
// =============================
let menuItems = document.getElementsByClassName('menu-item');
Array.from(menuItems).forEach((item) => {
    item.onclick = () => {
        let currMenu = document.querySelector('.menu-item.active');
        currMenu.classList.remove('active');
        item.classList.add('active');
    };
});

// =============================
// FOOD CATEGORY FILTER
// =============================
let foodMenuList = document.querySelector('.food-item-wrap');
let foodCategory = document.querySelector('.food-category');
let categories = foodCategory.querySelectorAll('button');

Array.from(categories).forEach((item) => {
    item.onclick = (e) => {
        let currCat = foodCategory.querySelector('button.active');
        currCat.classList.remove('active');
        e.target.classList.add('active');
        foodMenuList.className = 'food-item-wrap ' + e.target.getAttribute('data-food-type');
    };
});

// =============================
// SCROLL ANIMATIONS
// =============================
let scroll = window.requestAnimationFrame || function(callback) { window.setTimeout(callback, 1000 / 60); };
let elToShow = document.querySelectorAll('.play-on-scroll');

function isElInViewPort(el) {
    let rect = el.getBoundingClientRect();
    return (
        (rect.top <= 0 && rect.bottom >= 0) ||
        (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight)) ||
        (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
    );
}

function loop() {
    elToShow.forEach((item) => {
        if (isElInViewPort(item)) {
            item.classList.add('start');
        } else {
            item.classList.remove('start');
        }
    });
    scroll(loop);
}
loop();

// =============================
// MOBILE NAVIGATION
// =============================
let bottomNavItems = document.querySelectorAll('.mb-nav-item');
let bottomMove = document.querySelector('.mb-move-item');

bottomNavItems.forEach((item, index) => {
    item.onclick = () => {
        let crrItem = document.querySelector('.mb-nav-item.active');
        crrItem.classList.remove('active');
        item.classList.add('active');
        bottomMove.style.left = index * 25 + '%';
    };
});

// =============================
// CART SYSTEM
// =============================
document.addEventListener("DOMContentLoaded", function () {
    let cart = [];
    const cartCount = document.getElementById("cartCount");
    const cartPanel = document.getElementById("cartPanel");
    const cartItemsDiv = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const closeCart = document.getElementById("closeCart");
    const checkoutBtn = document.getElementById("checkoutBtn");

    // MODAL ELEMENTS
    const cartModal = document.getElementById("cartModal");
    const modalProductImage = document.getElementById("modalProductImage");
    const modalProductName = document.getElementById("modalProductName");
    const modalProductDesc = document.getElementById("modalProductDesc");
    const modalProductPrice = document.getElementById("modalProductPrice");
    const modalWeight = document.getElementById("modalWeight");
    const modalQuantity = document.getElementById("modalQuantity");
    const confirmAddToCart = document.getElementById("confirmAddToCart");
    const closeModal = document.getElementById("closeModal");

    // CHECKOUT MODAL ELEMENTS
    const checkoutModal = document.getElementById("checkoutModal");
    const confirmCheckout = document.getElementById("confirmCheckout");
    const cancelCheckout = document.getElementById("cancelCheckout");

    // SUCCESS POPUP ELEMENT
    const successPopup = document.getElementById("successPopup");
    const closeSuccess = document.getElementById("closeSuccess");

    let currentProduct = {};

    // OPEN PRODUCT MODAL
    document.querySelectorAll(".cart-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            const itemWrap = this.closest(".food-item");
            const itemInfo = this.closest(".item-info");

            const productName = itemInfo.querySelector("h3").innerText.trim();
            const productPrice = parseFloat(itemInfo.querySelector("span").innerText.replace(/[₹$]/g, ""));
            const productImg = itemWrap.querySelector(".img-holder").style.backgroundImage
                .replace('url("', '').replace('")', '');
            const productDesc = `Fresh & organic ${productName}, packed with nutrition!`;

            currentProduct = {
                name: productName,
                basePrice: productPrice, // per 1 kg
                image: productImg,
                description: productDesc,
            };

            modalProductName.textContent = currentProduct.name;
            modalProductDesc.textContent = currentProduct.description;
            modalProductImage.src = currentProduct.image;
            modalWeight.value = 1;
            modalQuantity.value = 1;
            modalProductPrice.textContent = currentProduct.basePrice.toFixed(2);

            cartModal.style.display = "flex";
        });
    });

    // UPDATE PRICE WHEN WEIGHT CHANGES
    modalWeight.addEventListener("change", function () {
        const selectedWeight = parseFloat(this.value);
        modalProductPrice.textContent = (currentProduct.basePrice * selectedWeight).toFixed(2);
    });

    // ADD TO CART
    confirmAddToCart.addEventListener("click", function () {
        const qty = parseInt(modalQuantity.value);
        const weight = parseFloat(modalWeight.value);
        const itemTotal = currentProduct.basePrice * weight * qty;

        const cartItem = {
            name: currentProduct.name,
            image: currentProduct.image,
            weight: weight,
            quantity: qty,
            pricePerKg: currentProduct.basePrice,
            total: itemTotal,
        };

        cart.push(cartItem);
        updateCart();
        cartModal.style.display = "none";
    });

    closeModal.addEventListener("click", () => (cartModal.style.display = "none"));
    cartModal.addEventListener("click", (e) => {
        if (e.target === cartModal) cartModal.style.display = "none";
    });

    // UPDATE CART PANEL
    function updateCart() {
        cartCount.textContent = cart.length;
        cartItemsDiv.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.total;
            cartItemsDiv.innerHTML += `
                <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #ddd; padding:5px 0;">
                    <img src="${item.image}" style="width:40px; height:40px; border-radius:5px;">
                    <div style="flex:1; margin-left:10px;">
                        <strong>${item.name}</strong><br>
                        <small>${item.weight} Kg x${item.quantity}</small>
                    </div>
                    <div>₹${item.total.toFixed(2)}</div>
                    <button onclick="removeCartItem(${index})" 
                            style="background:red; color:#fff; border:none; border-radius:3px; padding:2px 6px; cursor:pointer;">
                        X
                    </button>
                </div>
            `;
        });

        cartTotal.textContent = total.toFixed(2);
    }

    // REMOVE CART ITEM
    window.removeCartItem = function (index) {
        cart.splice(index, 1);
        updateCart();
    };

    // TOGGLE CART PANEL
    document.querySelector(".cart-header").addEventListener("click", function () {
        cartPanel.style.right = cartPanel.style.right === "0px" ? "-400px" : "0px";
    });

    closeCart.addEventListener("click", () => (cartPanel.style.right = "-400px"));

    // =============================
    // CHECKOUT & EMAILJS INTEGRATION
    // =============================
    checkoutBtn.addEventListener("click", () => {
        checkoutModal.style.display = "flex";
    });

    cancelCheckout.addEventListener("click", () => {
        checkoutModal.style.display = "none";
    });

    confirmCheckout.addEventListener("click", function () {
        const nameInput = document.getElementById("customerName");
        const phoneInput = document.getElementById("customerPhone");
        const nameError = document.getElementById("nameError");
        const phoneError = document.getElementById("phoneError");

        let valid = true;

        // Reset validation styles
        nameInput.style.border = "1px solid #ccc";
        phoneInput.style.border = "1px solid #ccc";
        nameError.style.display = "none";
        phoneError.style.display = "none";

        if (nameInput.value.trim() === "") {
            nameInput.style.border = "1px solid red";
            nameError.style.display = "block";
            valid = false;
        }

        if (phoneInput.value.trim() === "") {
            phoneInput.style.border = "1px solid red";
            phoneError.style.display = "block";
            valid = false;
        }

        if (!valid) return;

        const cartDetails = cart.map(
            item => `${item.name} - ${item.weight} Kg x ${item.quantity} = ₹${item.total.toFixed(2)}`
        ).join("\n");

        const totalPrice = cart.reduce((sum, item) => sum + item.total, 0).toFixed(2);

        emailjs.send("service_j76mppc", "template_bq793c4", {
            user_name: nameInput.value.trim(),
            user_phone: phoneInput.value.trim(),
            cart_details: cartDetails,
            total_price: totalPrice
        })
        .then(function() {
            checkoutModal.style.display = "none";
            cart = [];
            updateCart();
            successPopup.style.display = "flex"; // ✅ Show success message popup
        }, function(error) {
            console.error(error);
            alert("Failed to send order. ❌");
        });
    });

    // CLOSE SUCCESS POPUP
    closeSuccess.addEventListener("click", () => {
        successPopup.style.display = "none";
    });
});
