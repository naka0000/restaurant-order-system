class OrderManager {
    constructor(webhookUrl, sheetId) {
        this.webhookUrl = webhookUrl;
        this.sheetId = sheetId;
        this.sheetName = 'Orders';
    }

    async addOrder(orderData) {
        try {
            const data = {
                id: orderData.id || this.generateOrderId(),
                timestamp: orderData.timestamp,
                tableNumber: orderData.tableNumber,
                menuItems: orderData.menuItems,
                specialNotes: orderData.specialNotes || '',
                status: orderData.status || '受付'
            };

            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('注文追加エラー:', error);
            throw error;
        }
    }

    async getOrders() {
        try {
            const response = await fetch(
                `${this.baseUrl}/${this.sheetId}/values/${this.sheetName}?key=${this.apiKey}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.values || data.values.length === 0) {
                return [];
            }

            const headers = data.values[0];
            const rows = data.values.slice(1);

            return rows.map(row => ({
                id: row[0] || '',
                timestamp: row[1] || '',
                tableNumber: row[2] || '',
                menuItems: row[3] || '',
                specialNotes: row[4] || '',
                status: row[5] || '受付'
            }));
        } catch (error) {
            console.error('注文取得エラー:', error);
            throw error;
        }
    }

    async updateOrderStatus(orderId, newStatus) {
        try {
            const orders = await this.getOrders();
            const orderIndex = orders.findIndex(order => order.id == orderId);
            
            if (orderIndex === -1) {
                throw new Error('注文が見つかりません');
            }

            const rowIndex = orderIndex + 2;
            const range = `${this.sheetName}!F${rowIndex}`;

            const response = await fetch(
                `${this.baseUrl}/${this.sheetId}/values/${range}?valueInputOption=RAW&key=${this.apiKey}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        values: [[newStatus]]
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('ステータス更新エラー:', error);
            throw error;
        }
    }

    generateOrderId() {
        return Date.now().toString();
    }

    async initializeSheet() {
        try {
            const headers = [['注文ID', '日時', 'テーブル', '注文内容', '特記事項', 'ステータス']];
            
            const response = await fetch(
                `${this.baseUrl}/${this.sheetId}/values/${this.sheetName}!A1:F1?valueInputOption=RAW&key=${this.apiKey}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        values: headers
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('シート初期化エラー:', error);
            throw error;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrderManager;
}