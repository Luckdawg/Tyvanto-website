CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`productPrice` decimal(10,2) NOT NULL,
	`quantity` int NOT NULL,
	`lineTotal` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(50) NOT NULL,
	`userId` int,
	`stripePaymentIntentId` varchar(100),
	`stripeCustomerId` varchar(100),
	`status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
	`subtotal` decimal(10,2) NOT NULL,
	`tax` decimal(10,2) DEFAULT '0',
	`shipping` decimal(10,2) DEFAULT '0',
	`total` decimal(10,2) NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(20),
	`shippingStreet` varchar(255),
	`shippingCity` varchar(100),
	`shippingState` varchar(100),
	`shippingZip` varchar(20),
	`shippingCountry` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`),
	CONSTRAINT `orders_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`imageUrl` varchar(500),
	`sku` varchar(100),
	`stock` int NOT NULL DEFAULT 999,
	`active` int NOT NULL DEFAULT 1,
	`stripeProductId` varchar(100),
	`stripePriceId` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_sku_unique` UNIQUE(`sku`)
);
