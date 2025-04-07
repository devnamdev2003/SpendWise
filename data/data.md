
## 💡 `Expenses` Table 

| Column           | Type        | Description                                               |
| ---------------- | ----------- | --------------------------------------------------------- |
| `expense_id`     | INT (PK)    | Unique ID                                                 |
| **`amount` **        | DECIMAL     | Amount spent                                              |
| **`category_id`**    | INT (FK)    | Link to category                                          |
| **`subcategory`**    | VARCHAR     | (Optional) More specific info, e.g., ‘Lunch’ under ‘Food’ |
| **`date` **          | DATE        | Date of expense                                           |
| **`time`**           | TIME        | Time of expense (optional)                                |
| `note`           | TEXT        | Optional description or reason                            |
| **`payment_mode` **  | VARCHAR     | e.g., Cash, UPI, Credit Card                              |
| **`location` **      | VARCHAR     | Where the money was spent (optional)                      |
| `receipt_image`  | TEXT/URL    | Link to uploaded receipt or base64 image                  |
| `is_recurring`   | BOOLEAN     | Is this a recurring expense?                              |
| `currency`       | VARCHAR(10) | e.g., INR, USD, EUR, etc.                                 |
| `recurring_type` | VARCHAR     | daily/weekly/monthly/yearly (if recurring)                |
| `is_bill_paid`   | BOOLEAN     | Useful for tracking due bills (optional)                  |
| `created_at`     | DATETIME    | Timestamp                                                 |
| `updated_at`     | DATETIME    | Last modification time                                    |


---

### 📂 2. `Categories` Table

| Column        | Type     | Description                      |
| ------------- | -------- | -------------------------------- |
| `category_id` | INT (PK) | Unique ID                        |
| `name`        | VARCHAR  | e.g., Food, Travel, Bills        |
| `icon`        | VARCHAR  | (Optional) Icon for the UI       |
| `color`       | VARCHAR  | (Optional) Color code for charts |

---

## 🧠 Relationships (Simplified)

```
Categories   1 ---- * Expenses
```

---

## 📄 Example Table Data

### 🔹 `Categories`
| `category_id` | `name`            | `icon` | `color` |
| ------------- | ----------------- | ------ | ------- |
| 1             | Food & Drinks     | 🍔      | #f94144 |
| 2             | Groceries         | 🥦      | #f3722c |
| 3             | Transportation    | 🚗      | #f8961e |
| 4             | Shopping          | 🛍️      | #f9844a |
| 5             | Bills & Utilities | 💡      | #f9c74f |
| 6             | Entertainment     | 🎬      | #90be6d |
| 7             | Health            | 💊      | #43aa8b |
| 8             | Education         | 🎓      | #577590 |
| 9             | Subscriptions     | 📺      | #277da1 |
| 10            | Travel            | ✈️      | #8e44ad |
| 11            | Rent              | 🏠      | #34495e |
| 12            | Investments       | 📈      | #2ecc71 |
| 13            | Donations         | ❤️      | #e74c3c |
| 14            | Pets              | 🐶      | #d35400 |
| 15            | Family & Friends  | 👨‍👩‍👧‍👦      | #3498db |
| 16            | Loan EMI          | 🏦      | #9b59b6 |
| 17            | Insurance         | 📄      | #1abc9c |
| 18            | Maintenance       | 🛠️      | #7f8c8d |
| 19            | Miscellaneous     | 📌      | #bdc3c7 |
| 20            | Savings           | 💰      | #27ae60 |
| 21            | Gifts             | 🎁      | #c0392b |

---