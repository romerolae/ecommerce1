const productDOM = document.querySelector('.products__center');
const cartDOM = document.querySelector('.cart');
const cartCenter = document.querySelector('.cart__center');
const openCart = document.querySelector('.cart__icon');
const closeCart = document.querySelector('.close__cart');
const overlay = document.querySelector('.cart__overlay');
const cartTotal = document.querySelector('.cart__total');
const clearCartBtn = document.querySelector('.clear__cart');
const totalItems = document.querySelector('.item__total');
const details = document.getElementById('details');

let cart = [];
let buttonDOM = [];

class UI {
	detailProduct(id) {
		const filterData = products.filter((item) => item.id == id);
		let result = '';
		filterData.forEach((product) => {
			result += `
			<article class="detail-grid">
				<img src=${product.image} alt="${product.title}" class="img-fluid">
				<div class="detail-content">
					<h3>${product.title}</h3>
					<div class="rating">
						<span>
							<i class="bx bxs-star"></i>
						</span>
						<span>
							<i class="bx bxs-star"></i>
						</span>
						<span>
							<i class="bx bxs-star"></i>
						</span>
						<span>
							<i class="bx bxs-star"></i>
						</span>
						<span>
							<i class="bx bx-star"></i>
						</span>
					</div>
						<p class="price"><b>Precio: </b> $${product.price}</p>
						<p class="description">
							<b>Descripcion: </b> <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta quae ad ex sint expedita perspiciatis odit eligendi! Et quia ex aperiam dolorum sunt omnis maiores. Repudiandae delectus iste exercitationem vel?</span>
						</p>
						<p class="description">
							<span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque voluptates consequuntur in assumenda odit hic, aut cupiditate dolorem aspernatur! Quibusdam iusto magnam vero maxime quisquam voluptatibus minima aliquam molestias, iure ratione commodi, reiciendis quasi.</span>
						</p>

						<div class="bottom">
							<div class="btn__group">
								<button class="btn addToCart" data-id=${product.id}>Add to Cart</button>
							</div>
						</div>
				</div>
			</article>
			`;
		});
		details.innerHTML = result;
	}

	renderProducts(products) {
		let result = '';
		products.forEach((product) => {
			result += `
			<div class="product">
					<div class="image__container">
						<img
						src="${product.image}"
						alt="">
					</div>
					<div class="products__footer">
						<h1>${product.title}</h1>
						<div class="rating">
							<span>
								<i class="bx bxs-star"></i>
							</span>
							<span>
								<i class="bx bxs-star"></i>
							</span>
							<span>
								<i class="bx bxs-star"></i>
							</span>
							<span>
								<i class="bx bxs-star"></i>
							</span>
							<span>
								<i class="bx bxs-star"></i>
							</span>
						</div>
						<div class="price">${product.price}</div>
					</div>
					<div class="bottom">
						<div class="btn__group">
							<button class="btn addToCart" data-id=${product.id}>Add to Cart</button>
							<a href="product-details.html?id=${product.id}" class="btn view">View</a>
						</div>
					</div>
				</div>
            `;
		});
		productDOM.innerHTML = result;
	}

	getButtons() {
		const buttons = [...document.querySelectorAll('.addToCart')];
		buttonDOM = buttons;
		buttons.forEach((button) => {
			const id = button.dataset.id;
			const inCart = cart.find((item) => item.id === parseInt(id, 10));

			if (inCart) {
				button.innerHTML = 'In Cart';
				button.disabled = true;
			}
			button.addEventListener('click', (e) => {
				e.preventDefault();
				e.target.innerHTML = 'In cart';
				e.target.disabled = true;

				// Get products to the cart
				const cartItem = { ...Storage.getProducts(id), quantity: 1 };

				// We added products to the cart
				cart = [...cart, cartItem];

				//We kept the cart to the localstorage
				Storage.saveCart(cart);
				// Set Cart values
				this.setItemValues(cart);
				this.addToCartItem(cartItem);
				// Show to the cart
			});
		});
	}

	setItemValues(cart) {
		let tempTotal = 0;
		let itemTotal = 0;
		cart.map((item) => {
			tempTotal += item.price * item.quantity;
			itemTotal += item.quantity;
		});
		cartTotal.innertext = parseFloat(tempTotal.toFixed(2));
		totalItems.innertext = itemTotal;
	}

	addToCartItem({ image, price, title, id }) {
		const div = document.createElement('div');
		div.classList.add('cart__item');

		div.innerHTML = `
			<img src=${image} alt=${title}>
		<div>
			<h3>${title}</h3>
			<p class="price">$${price}</p>
		</div>
		<div>
			<span class="increase" data-id=${id}>
				<i class="bx bxs-up-arrow"></i>
			</span>
			<p class="item__quantity">1</p>
			<span class="decrease" data-id=${id}>
				<i class="bx bxs-down-arrow"></i>
			</span>
		</div>
		<div>
			<span class="remove__item" data-id=${id}>
				<i class="bx bx-trash"></i>
			</span>
		</div>
		`;
		cartCenter.appendChild(div);
	}
	show() {
		cartDOM.classList.add('show');
		overlay.classList.add('show');
	}
	hide() {
		cartDOM.classList.remove('show');
		overlay.classList.remove('show');
	}
	setAPP() {
		cart = Storage.getCart();
		this.setItemValues(cart);
		this.populate(cart);
		openCart.addEventListener('click', this.show);
		closeCart.addEventListener('click', this.hide);
	}
	populate(cart) {
		cart.forEach((item) => this.addToCartItem(item));
	}
	cartLogic() {
		clearCartBtn.addEventListener('click', () => {
			this.clearCart();
			this.hide();
		});

		cartCenter.addEventListener('click', (e) => {
			const target = e.target.closest('span');
			const targetElement = target.classList.contains('remove__item');
			console.log(target);
			console.log(targetElement);
			if (!target) return;
			if (targetElement) {
				const id = parseInt(target.dataset.id);
				this.removeItem(id);
				cartCenter.removeChild(target.parentElement.parentElement);
			} else if (target.classList.contains('increase')) {
				const id = parseInt(target.dataset.id, 10);
				let tempItem = cart.find((item) => item.id === id);
				tempItem.quantity++;
				Storage.saveCart(cart);
				this.setItemValues(cart);
				target.nextElementSibling.innerText = tempItem.quantity;
			} else if (target.classList.contains('decrease')) {
				const id = parseInt(target.dataset.id, 10);
				let tempItem = cart.find((item) => item.id === id);
				tempItem.quantity--;

				if (tempItem.quantity > 0) {
					Storage.saveCart(cart);
					this.setItemValues(cart);
					target.previousElementSibling.innerText = tempItem.quantity;
				} else {
					this.removeItem(id);
					cartCenter.removeChild(target.parentElement.parentElement);
				}
			}
		});
	}

	clearCart() {
		const cartItems = cart.map((item) => item.id);
		cartItems.forEach((id) => this.removeItem(id));

		while (cartCenter.children.length > 0) {
			cartCenter.removeChild(cartCenter.children[0]);
		}
	}
	removeItem(id) {
		cart = cart.filter((item) => item.id !== id);
		this.setItemValues(cart);
		Storage.saveCart(cart);
		let button = this.singleButton(id);
		if (button) {
			button.disabled = false;
			button.innerText = 'Add to Cart';
		}
	}
	singleButton(id) {
		return buttonDOM.find((button) => parseInt(button.dataset.id) === id);
	}
}

class Storage {
	static saveProduct(obj) {
		localStorage.setItem('products', JSON.stringify(obj));
	}
	static saveCart(cart) {
		localStorage.setItem('cart', JSON.stringify(cart));
	}
	static getProducts(id) {
		const product = JSON.parse(localStorage.getItem('products'));
		return product.find((product) => product.id === parseFloat(id, 10));
	}
	static getCart() {
		return localStorage.getItem('cart')
			? JSON.parse(localStorage.getItem('cart'))
			: [];
	}
}

class Products {
	async getProducts() {
		try {
			const result = await fetch('products.json');
			const data = await result.json();
			const products = data.items;
			return products;
		} catch (err) {
			console.log(err);
		}
	}
}

let category = '';
let products = [];

function categoryValue() {
	const ui = new UI();

	category = document.getElementById('category').value;
	if (category.length > 0) {
		const product = products.filter((regx) => regx.category === category);
		ui.renderProducts(product);
		ui.getButtons();
	} else {
		ui.renderProducts(products);
		ui.getButtons();
	}
}

const query = new URLSearchParams(window.location.search);
let id = query.get('id');

document.addEventListener('DOMContentLoaded', async () => {
	const productslist = new Products();
	const ui = new UI();

	ui.setAPP();

	products = await productslist.getProducts();
	if (id) {
		ui.detailProduct(id);
		Storage.saveProduct(products);
		ui.getButtons();
		ui.cartLogic();
	} else {
		ui.renderProducts(products);
		Storage.saveProduct(products);
		ui.getButtons();
		ui.cartLogic();
	}
});
