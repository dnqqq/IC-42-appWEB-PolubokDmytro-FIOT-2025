CREATE TABLE Roles (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone VARCHAR(20),
    PasswordHash VARCHAR(255) NOT NULL
);

CREATE TABLE UserRoles (
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE
);

CREATE TABLE Clients (
    UserId INT PRIMARY KEY,
    Address VARCHAR(255) NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
        ON DELETE CASCADE
);

CREATE TABLE Couriers (
    UserId INT PRIMARY KEY,
    TransportType VARCHAR(50) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
        ON DELETE CASCADE
);

CREATE TABLE Restaurants (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Address VARCHAR(255) NOT NULL
);

CREATE TABLE MenuCategories (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    RestaurantId INT NOT NULL,
    FOREIGN KEY (RestaurantId) REFERENCES Restaurants(Id)
        ON DELETE CASCADE
);

CREATE TABLE Dishes (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
    Photo TEXT,
    Description TEXT,
    IsAvailable BOOLEAN DEFAULT TRUE,
    CategoryId INT NOT NULL,
    FOREIGN KEY (CategoryId) REFERENCES MenuCategories(Id)
        ON DELETE CASCADE
);

CREATE TABLE Orders (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    ClientId INT NOT NULL,
    CourierId INT NULL,
    TotalPrice DECIMAL(10,2) NOT NULL CHECK (TotalPrice >= 0),
    Status VARCHAR(50) NOT NULL,
    FOREIGN KEY (ClientId) REFERENCES Clients(UserId)
        ON DELETE CASCADE,
    FOREIGN KEY (CourierId) REFERENCES Couriers(UserId)
        ON DELETE SET NULL
);

CREATE TABLE OrderItems (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    OrderId INT NOT NULL,
    DishId INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    FOREIGN KEY (OrderId) REFERENCES Orders(Id)
        ON DELETE CASCADE,
    FOREIGN KEY (DishId) REFERENCES Dishes(Id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_dishes_category ON Dishes(CategoryId);
CREATE INDEX idx_orderitems_order ON OrderItems(OrderId);
CREATE INDEX idx_orders_client ON Orders(ClientId);
CREATE INDEX idx_menucategories_restaurant ON MenuCategories(RestaurantId);

INSERT INTO Roles (Name) VALUES
('Client'), ('Courier'), ('Manager'), ('Admin');

INSERT INTO Users (Name, Email, Phone, PasswordHash) VALUES
('Іван Клієнт', 'ivan@mail.com', '123456789', 'hash1'),
('Петро Курєр', 'petro@mail.com', '987654321', 'hash2'),
('Олег Менеджер', 'manager@mail.com', NULL, 'hash3'),
('Адміністратор', 'admin@mail.com', NULL, 'hash4');

INSERT INTO UserRoles VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

INSERT INTO Clients VALUES (1, 'м. Київ, вул. Хрещатик 10');

INSERT INTO Couriers VALUES (2, 'Bicycle', 'Available');

INSERT INTO Restaurants (Name, Address) VALUES
('Pizza House', 'вул. Смачна 5');

INSERT INTO MenuCategories (Name, RestaurantId) VALUES
('Піца', 1),
('Напої', 1);

INSERT INTO Dishes (Name, Price, Description, IsAvailable, CategoryId) VALUES
('Маргарита', 120.00, 'Класична піца', TRUE, 1),
('Пепероні', 150.00, 'Гостра піца', TRUE, 1),
('Кока-кола', 35.00, '500 мл', TRUE, 2);

INSERT INTO Orders (ClientId, CourierId, TotalPrice, Status) VALUES
(1, 2, 155.00, 'Delivered');

INSERT INTO OrderItems (OrderId, DishId, Quantity) VALUES
(1, 1, 1),
(1, 3, 1);