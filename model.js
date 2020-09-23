const fs = require('fs');
const DATABASE = 'data.json';

class Database {
    constructor() {
        this.data = this.loadData();
    }

    loadData() {
        const path = `${__dirname}/${DATABASE}`;
        const json = fs.readFileSync(path, 'utf-8');
        return JSON.parse(json);
    }

    getEntry(id) {
        console.log(this.data);
        return this.data.find(item => item.id == id);
    }

    getList() {
        return this.data.map(item => {
            return {
                id: item.id,
                name: item.productName,
                image: item.image,
                screen: item.screen,
                cpu: item.cpu,
                price: item.price
            };
        });
    }
}

module.exports = {
    Database: Database
};
