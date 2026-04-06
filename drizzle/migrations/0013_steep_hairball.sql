CREATE TABLE `quote_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(255) NOT NULL,
	`jobTitle` varchar(255),
	`phone` varchar(50),
	`productInterest` varchar(100) NOT NULL,
	`useCase` text,
	`estimatedNodes` int,
	`estimatedAgents` int,
	`estimatedMonthlyBudget` varchar(50),
	`status` enum('new','contacted','qualified','closed') NOT NULL DEFAULT 'new',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quote_leads_id` PRIMARY KEY(`id`)
);
