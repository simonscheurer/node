const state = {};

class ListView {
    constructor() {
        this.container = document.querySelector('.cards-container');
    }

    renderList(items) {
        this.container.innerHTML = "";
        items.forEach(item => {
            const html = this.createListItem(item);
            this.container.insertAdjacentHTML("beforeend", html);
        });
    }

    showList(visible) {
        this.container.style.visibility = visible ? "visible" : "hidden";
    }

    createListItem(item) {
        return `
            <figure class="card">
                <div class="card__hero">
                    <img src="img/${item.image}" alt="${item.name}" class="card__img">
                </div>
                <h2 class="card__name">${item.name}</h2>
                <p class="card__detail"><span class="emoji-left">🖥</span> ${item.screen}</p>
                <p class="card__detail"><span class="emoji-left">🧮</span> ${item.cpu}</p>
                <div class="card__footer">
                    <p class="card__price">$${item.price}</p>
                    <a href="#${item.id}" class="card__link">Check it out <span class="emoji-right">👉</span></a>
                </div>
            </figure>`;
    }
}

class ListModel {
    constructor() {}

    async getList() {
        const response = await fetch('/api/products');
        return await response.json();
    }
}

class DetailView {
    constructor() {
        this.container = document.querySelector('.laptop');
    }

    renderDetail(item) {
        this.hideDetail();
        const html = this.createDetail(item);
        this.container.insertAdjacentHTML("beforeend", html);
    }

    hideDetail() {
        this.container.innerHTML = "";
    }

    createDetail(item) {
        return `
            <p class="laptop__price">${item.price}</p>
            <a href="#" class="laptop__back"><span class="emoji-left">👈</span>Back</a>
            <div class="laptop__hero">
                <img src="img/${item.image}" alt="${item.productName}" class="laptop__img">
            </div>
            <h2 class="laptop__name">${item.productName}</h2>
            <div class="laptop__details">
                <p><span class="emoji-left">🖥</span> ${item.screen}</p>
                <p><span class="emoji-left">🧮</span> ${item.cpu}</p>
                <p><span class="emoji-left">💾</span> ${item.storage}</p>
                <p><span class="emoji-left">📦</span> ${item.ram}</p>
            </div>
            <p class="laptop__description">
                ${item.description}
            </p>
            <p class="laptop__source">Source: <a href="https://www.techradar.com/news/mobile-computing/laptops/best-laptops-1304361"
                    target="_blank">https://www.techradar.com/news/mobile-computing/laptops/best-laptops-1304361</a></p>
            <a href="#" class="laptop__link">Buy now for $${item.price} <span class="emoji-right">🥳 😍</span></a>`;
    }
}

class DetailModel {
    constructor() {}

    async getDetail(id) {
        const response = await fetch('/api/detail?id=' + id);
        return await response.json();
    }
}

class ListController {
    constructor() {
        this.addHandlers();
    }

    addHandlers() {
        window.addEventListener("hashchange", event => {
            if (location.hash && location.hash !== "#") {
                const id = location.hash.substring(1);
                state.view.showList(false);
                this.showDetail(id);
            }
            else {
                state.detailView.hideDetail();
                state.view.showList(true);
            }
        });
    }

    async showDetail(id) {
        const item = await state.detailModel.getDetail(id);
        console.log(item);
        state.detailView.renderDetail(item);
        window.scrollTo(0, 0);
    }

    async showList() {
        const list = await state.model.getList();
        console.log(list);
        state.view.renderList(list);
    }
}


function init() {
    state.model = new ListModel();
    state.view = new ListView();
    state.detailModel = new DetailModel();
    state.detailView = new DetailView();

    state.controller = new ListController();
    state.controller.showList();
}

init();

