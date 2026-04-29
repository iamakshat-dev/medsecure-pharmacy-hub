CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    role ENUM('manufacturer','distributor','pharmacy'),
    public_key TEXT,
    private_key TEXT
);

CREATE TABLE medicines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    manufacturer_id INT,
    FOREIGN KEY (manufacturer_id) REFERENCES users(id)
);

CREATE TABLE batches (
    batch_id VARCHAR(100) PRIMARY KEY,
    medicine_id INT,
    quantity INT,
    manufacture_date DATE,
    expiry_date DATE,
    current_owner INT,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id)
);

CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    batch_id VARCHAR(100),
    action ENUM('CREATE','TRANSFER'),
    from_actor_id INT NULL,
    to_actor_id INT NULL,
    quantity_snapshot INT,
    remarks VARCHAR(255) NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id),
    FOREIGN KEY (from_actor_id) REFERENCES users(id),
    FOREIGN KEY (to_actor_id) REFERENCES users(id)
);

CREATE TABLE blockchain (
    id INT AUTO_INCREMENT PRIMARY KEY,
    batch_id VARCHAR(100),
    data_hash VARCHAR(256),
    previous_hash VARCHAR(256),
    current_hash VARCHAR(256),
    actor_id INT,
    signature TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
