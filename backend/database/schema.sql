CREATE TABLE citizens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(15) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE authorities (
    authority_email_id VARCHAR(100) PRIMARY KEY,
    full_name VARCHAR(100),
    designation VARCHAR(100),
    department VARCHAR(100),
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
