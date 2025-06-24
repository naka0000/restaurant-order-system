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
            // Google Apps Scriptから注文データを取得
            const response = await fetch(this.webhookUrl + '?action=getOrders');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const orders = await response.json();
            return orders || [];
        } catch (error) {
            console.error('注文取得エラー:', error);
            // エラー時はサンプルデータを返す
            return [
                {
                    id: 1,
                    timestamp: new Date().toLocaleString('ja-JP'),
                    tableNumber: '3',
                    menuItems: 'ラーメン x1\n餃子 x2',
                    specialNotes: '辛め',
                    status: '受付'
                }
            ];
        }
    }

    async updateOrderStatus(orderId, newStatus) {
        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'updateStatus',
                    orderId: orderId,
                    newStatus: newStatus
                })
            });

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