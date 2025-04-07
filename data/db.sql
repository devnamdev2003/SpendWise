create database spendwise;
use spendwise;
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(255),
    color VARCHAR(20)
);
CREATE TABLE expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    category_id INT,
    subcategory VARCHAR(100),
    date DATE NOT NULL,
    time TIME,
    note TEXT,
    payment_mode VARCHAR(50),
    location VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE
    SET NULL ON UPDATE CASCADE
);
INSERT INTO categories (category_id, name, icon, color)
VALUES (1, 'Food & Drinks', '🍔', '#f94144'),
    (2, 'Groceries', '🥦', '#f3722c'),
    (3, 'Shopping', '🛍️', '#f9844a'),
    (4, 'Bills & Utilities', '💡', '#f9c74f'),
    (5, 'Entertainment', '🎬', '#90be6d'),
    (6, 'Health', '💊', '#43aa8b'),
    (7, 'Education', '🎓', '#577590'),
    (8, 'Subscriptions', '📺', '#277da1'),
    (9, 'Travel', '✈️', '#8e44ad'),
    (10, 'Rent', '🏠', '#34495e'),
    (11, 'Family & Friends', '👨‍👩‍👧‍👦', '#3498db'),
    (12, 'Miscellaneous', '📌', '#bdc3c7'),
    (13, 'Gifts', '🎁', '#c0392b');
INSERT INTO expenses (
        amount,
        category_id,
        subcategory,
        date,
        time,
        note,
        payment_mode,
        location
    )
VALUES (
        250.00,
        1,
        'Dinner at restaurant',
        '2024-11-07',
        '19:30:00',
        'Treated friends to dinner at BBQ Nation',
        'Credit Card',
        'Mumbai'
    ),
    (
        1200.50,
        11,
        'Monthly rent',
        '2024-10-07',
        '10:00:00',
        'April rent paid to landlord',
        'Bank Transfer',
        'Pune'
    ),
    (
        75.00,
        2,
        'Fruits & vegetables',
        '2024-09-07',
        '17:15:00',
        'Bought groceries from local market',
        'Cash',
        'Delhi'
    ),
    (
        60.00,
        5,
        'Electricity bill',
        '2024-08-07',
        '09:45:00',
        'March electricity bill payment',
        'UPI',
        'Bangalore'
    ),
    (
        500.00,
        4,
        'Online shopping',
        '2024-12-07',
        '14:00:00',
        'Bought T-shirt and shoes on Amazon',
        'Debit Card',
        'Kolkata'
    ),
    (
        180.00,
        3,
        'Cab ride',
        '2025-01-04',
        '22:10:00',
        'Ola ride from airport to home',
        'UPI',
        'Hyderabad'
    ),
    (
        300.00,
        6,
        'Movie & snacks',
        '2025-04-07',
        '20:00:00',
        'Watched movie with popcorn combo',
        'Cash',
        'Chennai'
    ),
    (
        2000.00,
        12,
        'Stock investment',
        '2025-04-07',
        '13:30:00',
        'Invested in Tata Motors shares',
        'Net Banking',
        'Online'
    ),
    (
        150.00,
        7,
        'Pharmacy',
        '2025-04-07',
        '11:20:00',
        'Bought cough syrup and vitamins',
        'Cash',
        'Jaipur'
    ),
    (
        999.99,
        9,
        'Netflix yearly subscription',
        '2025-04-07',
        '08:00:00',
        'Renewed Netflix premium plan',
        'Credit Card',
        'Online'
    );
truncate table expenses;
truncate table categories;
drop table categories;
delete from categories;
select *
from categories;
select *
from expenses;
drop table expenses;
SELECT c.category_id,
    c.name,
    c.icon,
    c.color,
    COUNT(e.expense_id) AS expense_count
FROM categories c
    LEFT JOIN expenses e ON c.category_id = e.category_id
GROUP BY c.category_id,
    c.name,
    c.icon,
    c.color
ORDER BY expense_count DESC,
    c.name;