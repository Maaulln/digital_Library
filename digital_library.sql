-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 26, 2025 at 01:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `my_library`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `isbn` varchar(20) NOT NULL,
  `publication_year` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `available` tinyint(2) NOT NULL DEFAULT 0,
  `stock` int(11) NOT NULL DEFAULT 0,
  `content` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `category`, `isbn`, `publication_year`, `description`, `cover_image`, `available`, `stock`, `content`) VALUES
(1, 'To Kill a Mockingbird', 'Harper Lee', 'Fiction', '9780061120084', 1960, 'To Kill a Mockingbird is set in the fictional town of Maycomb, Alabama, during the Great Depression (1929–39). The story centres on Jean Louise (“Scout”) Finch, an unusually intelligent girl who ages from six to nine years old during the novel. She and her brother, Jeremy Atticus (“Jem”), are raised by their widowed father, Atticus Finch. Atticus is a well-known and respected lawyer. He teaches his children to be empathetic and just, always leading by example.\n\nWhen Tom Robinson, one of the town’s Black residents, is falsely accused of raping Mayella Ewell, a young white woman, Atticus agrees to defend him despite threats from the community. Although Atticus presents a defense that gives a more plausible interpretation of the evidence—that Mayella was attacked by her father, Bob Ewell—Tom is convicted. He is later killed while trying to escape custody. The children, meanwhile, play out their own miniaturized drama. Scout and Jem become especially interested in the town recluse, Arthur (“Boo”) Radley, who interacts with them by leaving them small gifts in a tree. On Halloween, when Bob Ewell tries to attack Scout and Jem, Boo intervenes and saves them. Boo ultimately kills Ewell. The sheriff, however, decides to tell the community that Ewell’s death was an accident.', 'To_Kill_A_Mockingbird.jpg', 1, 8, 'Mockingbird.pdf'),
(2, '1984', 'George Orwell', 'Fiction', '9780451524935', 1949, 'George Orwell’s 1984 is a chilling portrayal of a dystopian future where totalitarianism reigns and independent thought is a crime. In a world under constant surveillance by Big Brother, Winston Smith dares to question the oppressive regime and search for truth and freedom.\\n\\nHaunting and powerful, this prophetic novel explores themes of censorship, propaganda, and identity, making it as relevant today as when it was first published. A landmark work of fiction, 1984 remains a powerful warning against the dangers of unchecked political power.', '1984.jpg', 1, 9, '1984.pdf'),
(3, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', '9780743273565', 1925, 'F. Scott Fitzgerald’s The Great Gatsby is a dazzling portrait of the Roaring Twenties—a world of glamour, wealth, and illusion. Narrated by the observant Nick Carraway, the novel tells the tragic story of Jay Gatsby, a mysterious millionaire driven by love and longing for the elusive Daisy Buchanan.\\n\\nSet against a backdrop of jazz, opulence, and social decay, this timeless classic explores themes of ambition, identity, and the American Dream. Lyrical and haunting, The Great Gatsby is a poignant critique of a world where dreams are as fragile as they are seductive.', 'The_Great_Gatsby.jpg', 1, 10, NULL),
(4, 'Pride and Prejudice', 'Jane Austen', 'Fiction', '9780141439518', 1813, 'Jane Austen’s Pride and Prejudice is a witty and romantic tale of love, manners, and misunderstanding. Set in the English countryside, it follows the spirited Elizabeth Bennet as she navigates family pressures, societal expectations, and her evolving feelings for the proud and mysterious Mr. Darcy.\\n\\nFilled with sharp dialogue, unforgettable characters, and keen social commentary, this beloved classic explores how first impressions can be misleading—and how love can bloom in the most unexpected ways.', 'pride_and_prejudice.jpeg', 1, 10, 'pride_and_prejudice.pdf'),
(5, 'The Hobbit', 'J.R.R. Tolkien', 'Fantasy', '9780547928227', 1937, 'The cover of The Hobbit typically features a richly illustrated depiction of Middle-earth, emphasizing the natural landscapes and mythical tone of the story. One of the most iconic versions showcases the Misty Mountains in the background, rolling green hills in the foreground, and the winding path that symbolizes Bilbo Baggins’ journey. The art is often bordered with Elvish-style patterns or runes, adding a sense of ancient lore. The title “The Hobbit” is usually centered in a bold, elegant font, often accompanied by the author’s name beneath. The color palette is earthy and subdued—greens, browns, and greys—reflecting the natural and adventurous essence of the tale.', 'The_Hobbit.jpg', 1, 10, 'The_Hobbit.pdf'),
(6, 'A Brief History of Time', 'Stephen Hawking', 'Science', '9780553380163', 1988, 'Stephen Hawking’s A Brief History of Time takes readers on a journey through the mysteries of the universe—from the Big Bang to black holes, from time travel to the nature of space and time itself. Written with clarity and wit, Hawking makes complex scientific ideas accessible to everyone.\\n\\nBlending cosmology, physics, and philosophy, this groundbreaking book challenges us to think about our place in the universe and the fundamental laws that govern it. A modern classic, it continues to inspire curiosity and wonder in readers around the world.', 'A_Brief_History Of_Time.jpg', 1, 10, NULL),
(7, 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'History', '9780062316097', 2011, 'In Sapiens, Yuval Noah Harari explores the sweeping history of the human species—from the emergence of Homo sapiens in the Stone Age to the scientific and technological revolutions of the modern world. With bold insights and thought-provoking questions, Harari examines how biology, culture, and economics have shaped human societies.\\n\\nBlending history, science, and philosophy, this international bestseller challenges everything we thought we knew about what it means to be human. Sapiens is a gripping, eye-opening journey through our past that helps us understand who we are—and where we might be headed.', 'Sapiens- A_Brief_History_of_Humankind.jpg', 1, 10, NULL),
(8, 'The Alchemist', 'Paulo Coelho', 'Fiction', '9780062315007', 1988, 'A novel about following your dreams.', 'The_Alchemist.jpeg', 1, 10, NULL),
(9, 'The Catcher in the Rye', 'J.D. Salinger', 'Fiction', '9780316769488', 1951, 'J.D. Salinger’s The Catcher in the Rye is a poignant and unforgettable coming-of-age novel. Narrated by the cynical yet vulnerable teenager Holden Caulfield, the story captures his struggles with identity, alienation, and the painful transition from childhood to adulthood.\\n\\nFilled with sharp wit and raw emotion, this classic explores themes of innocence, loss, and the search for meaning in a confusing world. A timeless voice for generations of readers, Holden’s story remains as relevant and compelling today as when it was first published.', 'The_Catcher_in_the_Rye.jpeg', 1, 10, NULL),
(10, 'The Lord of the Rings', 'J.R.R. Tolkien', 'Fantasy', '9780618640157', 1954, 'J.R.R. Tolkien’s The Lord of the Rings is an epic tale of adventure, friendship, and the struggle between good and evil. Follow Frodo Baggins and the Fellowship as they embark on a perilous journey to destroy the One Ring, a source of unimaginable power that threatens to enslave Middle-earth.\\n\\nRich with unforgettable characters, breathtaking landscapes, and profound themes of courage and sacrifice, this timeless trilogy has captivated readers for generations and remains a cornerstone of fantasy literature.', 'The_Lord_of_the_Rings.jpg', 1, 10, NULL),
(11, 'Into The Ice', 'Houghton Mifflin', 'Non-Fiction', '9780395830130', 1998, 'Alien and wild, the far north has the powerful allure of the unknown, a call explorers have heeded for hundreds of years. First came the search for a route through the polar icecap to the rich lands of Asia. The Northeast and Northwest Passages were painstakingly traced. Then the race was on to one of the remotest points on earth - the North Pole. The desire for knowledge, wealth, adventure, and fame fueled expedition after expedition. Some Arctic explorers met with success and celebrity; others found madness and death; a few simply disappeared. Into the Ice, graced with majestic acrylic paintings, traces the slow unveiling of the secrets of this mysterious and forbidding frozen region.', 'Into_The_Ice.jpg', 1, 10, NULL),
(12, 'Beach Read', 'Emily Henry', 'Romance', '9781984806734', 2020, 'A romance writer who no longer believes in love and a literary writer stuck in a rut engage in a summer-long challenge that may just upend everything they believe about happily ever afters.\\r\\nWikipedia\\r\\n\\r\\nJanuary Andrews is a successful romance novelist who, after the death of her father and the discovery of his secret affair, is struggling with writer\\\'s block. She retreats to her father\\\'s beach house to find inspiration and runs into Augustus Everett, her college rival and acclaimed literary fiction author. Both facing creative slumps, they strike a deal: January will write literary fiction, and Gus will pen a romance novel. As they immerse themselves in each other\\\'s worlds, their playful competition leads to unexpected revelations and a story neither of them could have predicted.', 'Beach Read.jpg', 1, 10, NULL),
(13, 'Good Girl, Bad Blood', 'Holly Jackson', 'Mystery', '9781405297752', 2020, 'Pip is not a detective anymore.\nWith the help of Ravi Singh, she released a true-crime podcast about the murder case they solved together last year. The podcast has gone viral, yet Pip insists her investigating days are behind her.\n\nBut she will have to break that promise when someone she knows goes missing. Jamie Reynolds has disappeared, on the very same night the town hosted a memorial for the sixth-year anniversary of the deaths of Andie Bell and Sal Singh.\n\nThe police won\'t do anything about it. And if they won\'t look for Jamie then Pip will, uncovering more of her town\'s dark secrets along the way... and this time everyone is listening. But will she find him before it\'s too late?', 'Good Girl, Bad Blood.jpg', 1, 10, 'Good_Girl_Bad_Blood_-_Holly_Jackson.pdf'),
(14, 'The Plot', 'Jean Hanff Korelitz', 'Mystery', '9781250790767', 2021, 'Jacob Finch Bonner, once a promising novelist, now teaches in a third-rate MFA program and struggles with his fading career. When a student shares a compelling plot idea, Jacob is envious but dismissive. Years later, learning that the student died without publishing the story, Jacob seizes the opportunity to write the novel himself. The book becomes a bestseller, but as Jacob basks in his success, he receives anonymous messages accusing him of theft. As the threats escalate, Jacob embarks on a quest to uncover the truth behind the story he claimed as his own, leading to a chilling revelation. The Plot is a gripping tale of ambition, deception, and the consequences of our choices.', 'The_Plot.jpg', 1, 10, NULL),
(15, 'The Diary of Young Girl', 'Anne Frank', 'Biography', '9780553296983', 1947, 'The Diary of a Young Girl is one of the most poignant and widely read firsthand accounts of the Holocaust. Written by Anne Frank, a Jewish teenager in hiding during the Nazi occupation of the Netherlands, the diary chronicles her life from June 1942 to August 1944.\n\nAnne received the diary as a gift on her 13th birthday, just weeks before her family went into hiding in a concealed annex above her father’s office in Amsterdam. Over two years, she documented her fears, dreams, and the daily struggles of eight people living in confinement—including her family, the van Pels family, and Fritz Pfeffer. Her entries reveal her intellectual curiosity, budding romance with Peter van Pels, and her profound reflections on war, human nature, and hope.\n\nTragically, the group was betrayed in August 1944 and deported to concentration camps. Anne died of typhus in Bergen-Belsen in early 1945, just weeks before liberation. Her father, Otto Frank, the sole survivor, published her diary in 1947, fulfilling her dream of becoming a writer.\n\nThe book has since been translated into 70+ languages, adapted into plays and films, and remains a testament to resilience and the horrors of persecution. Modern editions include previously omitted passages about Anne’s sexuality and conflicts with her mother.', 'Diary_of_Young_Girl.jpg', 1, 10, NULL),
(16, 'The Girl with the Dragon Tattoo', 'Stieg Larsson', 'Mystery', '9780307269751', 2004, 'A spellbinding blend of murder mystery, corporate intrigue, and psychological suspense.\n\nDisgraced journalist Mikael Blomkvist is hired by wealthy industrialist Henrik Vanger to solve the decades-old disappearance of his niece, Harriet. The case leads Blomkvist to a remote island where the Vanger family’s darkest secrets lie buried—a labyrinth of lies, violence, and Nazi ties.\n\nEnter Lisbeth Salander, a pierced, tattooed genius hacker with a troubled past and a fierce will to survive. As their paths collide, the two uncover a trail of shocking corruption and brutality—but the truth they seek may put their own lives in deadly peril.\n\nWith over 100 million copies sold worldwide, Stieg Larsson’s The Girl with the Dragon Tattoo is a global phenomenon that birthed the iconic Lisbeth Salander and redefined the crime thriller genre.\n', 'The Girl With The Dragon Tattoo.jpg', 1, 10, NULL),
(17, 'Astrophysics for People in a Hurry', ' Hurry	Neil deGrasse Tyson', 'Science', '9780393609394', 2017, '\"The universe is under no obligation to make sense to you.\" —Neil deGrasse Tyson\n\nWhat happens when you fall into a black hole? How did the Big Bang really work? Is there life beyond Earth?\n\nIn Astrophysics for People in a Hurry, renowned astrophysicist Neil deGrasse Tyson breaks down the cosmos into bite-sized, brilliantly clear lessons. From quarks to quantum mechanics, dark matter to the multiverse, this book is your ultimate guide to the universe—no PhD required.\n\nPerfect for busy minds craving cosmic wonder, Tyson’s witty, engaging style turns complex science into a thrilling journey. Whether you’re a curious beginner or a seasoned stargazer, you’ll finish this book looking at the night sky—and reality itself—in a whole new way.\n', 'Astrophysics for People in a Hurry.jpg', 1, 10, NULL),
(18, 'The Gene: An Intimate History', 'Siddhartha Mukherjee', 'Science', '9781501170713', 2016, '\"A magnificent story of the quest to decipher the master code of life.\"\n\nGenes shape our bodies, our diseases, even our identities. But what is a gene? How does it work? And what happens when it goes wrong?\n\nPulitzer Prize-winning author Siddhartha Mukherjee weaves science, history, and personal narrative into a gripping exploration of genetics—from Mendel’s peas to CRISPR’s gene-editing revolution. Through breakthroughs and ethical dilemmas, The Gene reveals how DNA’s secrets have transformed medicine, sparked controversies, and redefined what it means to be human.\n', 'The Gene.jpg', 1, 10, NULL),
(19, 'The Hidden Life of Trees: What They Feel, How They Communicate', 'Peter Wohlleben', 'Science', '9781771642484', 2016, 'In this revelatory exploration, German forester Peter Wohlleben unveils the astonishing social networks of forests, demonstrating how trees communicate through fungal networks, nurture their young, share resources, and even remember environmental threats. Blending cutting-edge science with poetic observation, the book transforms our understanding of these silent giants, revealing a complex world where trees form alliances, care for their sick, and create thriving ecosystems. With over 3 million copies sold worldwide, this groundbreaking work will forever change how you perceive the natural world around you.', 'The Hidden Life Of Trees.jpg', 1, 10, NULL),
(20, 'Rudy', 'GINA S. NOER', 'History', '9786022911111', 2020, 'Rudy: The Visionary’s Youthful Journey is a heartfelt biographical novel that tells the inspiring story of B.J. Habibie, Indonesia’s third president, during his formative years. Written by Gina S. Noer and based on personal stories shared by Habibie himself, the book offers a rare glimpse into the lesser-known chapters of his life.\n\nSet against the backdrop of World War II and Indonesia’s early independence, young Rudy overcomes childhood fears—especially his fear of airplanes—and turns them into an unshakable determination to build his nation\'s aerospace industry. Through discipline, resilience, and an unwavering love for his country, Rudy transforms from a curious boy into a visionary with dreams far bigger than himself.\n\nThis book captures not only the challenges and academic pressures he faced but also the emotional struggles, family values, and early sparks of love that shaped his character. It’s a powerful tale of passion, purpose, and patriotism that continues to inspire generations of Indonesians to dream boldly and serve their nation.', 'Rudy.jpg', 1, 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `borrowings`
--

CREATE TABLE `borrowings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `borrow_date` datetime NOT NULL,
  `due_date` datetime NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `status` enum('active','overdue','returned') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrowings`
--

INSERT INTO `borrowings` (`id`, `user_id`, `book_id`, `borrow_date`, `due_date`, `return_date`, `status`) VALUES
(1, 2, 10, '2025-05-02 09:19:05', '2025-05-16 09:19:05', '2025-05-02 09:20:46', 'returned'),
(2, 2, 10, '2025-05-07 19:57:28', '2025-05-21 19:57:28', '2025-05-07 19:57:33', 'returned'),
(3, 1, 1, '2025-05-15 09:45:10', '2025-05-29 09:45:10', '2025-05-15 10:10:57', 'returned'),
(4, 1, 12, '2025-05-15 10:11:05', '2025-05-29 10:11:05', '2025-05-16 08:16:38', 'returned'),
(5, 2, 12, '2025-05-16 06:54:10', '2025-05-30 06:54:10', '2025-05-16 06:54:17', 'returned'),
(6, 1, 2, '2025-05-16 09:13:42', '2025-05-30 09:13:42', '2025-05-16 09:34:45', 'returned'),
(7, 1, 1, '2025-05-16 09:31:40', '2025-05-30 09:31:40', '2025-05-16 09:34:44', 'returned'),
(8, 1, 3, '2025-05-16 09:34:09', '2025-05-30 09:34:09', '2025-05-16 09:34:44', 'returned'),
(9, 1, 4, '2025-05-16 09:39:15', '2025-05-30 09:39:15', '2025-05-16 09:39:45', 'returned'),
(10, 2, 1, '2025-05-19 12:31:53', '2025-06-02 12:31:53', '2025-05-19 12:35:15', 'returned'),
(11, 2, 1, '2025-05-19 12:36:02', '2025-06-02 12:36:02', '2025-05-19 12:37:33', 'returned'),
(12, 3, 1, '2025-05-19 12:42:00', '2025-06-02 12:42:00', '2025-05-22 08:14:40', 'returned'),
(13, 2, 1, '2025-05-19 12:42:21', '2025-06-02 12:42:21', '2025-05-22 12:07:25', 'returned'),
(14, 4, 1, '2025-05-19 12:43:08', '2025-06-02 12:43:08', NULL, 'returned'),
(15, 2, 2, '2025-05-22 08:10:41', '2025-05-21 08:10:41', '2025-05-22 08:11:52', 'returned'),
(16, 1, 13, '2025-05-22 09:14:41', '2025-06-05 09:14:41', '2025-05-22 09:29:37', 'returned'),
(17, 1, 12, '2025-05-22 09:28:43', '2025-06-05 09:28:43', '2025-05-22 09:29:38', 'returned'),
(18, 1, 14, '2025-05-22 09:34:06', '2025-06-05 09:34:06', '2025-05-22 09:34:34', 'returned'),
(19, 2, 2, '2025-05-22 12:07:40', '2025-05-21 12:07:40', '2025-05-22 12:09:15', 'returned'),
(20, 2, 2, '2025-05-23 07:40:18', '2025-06-06 07:40:18', NULL, 'active'),
(21, 2, 1, '2025-05-23 07:57:24', '2025-06-06 07:57:24', NULL, 'active'),
(22, 5, 1, '2025-05-23 08:47:36', '2025-05-22 08:47:36', '2025-05-23 09:20:28', 'returned'),
(23, 5, 2, '2025-05-23 09:20:56', '2025-05-22 09:20:56', '2025-05-23 09:22:58', 'returned'),
(24, 5, 1, '2025-05-23 09:20:59', '2025-05-22 09:20:59', '2025-05-23 09:22:51', 'returned');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `borrowing_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_type` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `transaction_status` varchar(50) DEFAULT 'pending',
  `status` enum('pending','success','failure','challenge') DEFAULT 'pending',
  `snap_token` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `user_id`, `borrowing_id`, `amount`, `payment_type`, `transaction_id`, `transaction_status`, `status`, `snap_token`, `created_at`, `updated_at`) VALUES
(1, 'FINE-1747876312213-1-15', 1, 15, 2000.00, 'QRIS', NULL, 'success', 'success', NULL, '2025-05-22 08:11:52', '2025-05-22 08:11:52'),
(2, 'FINE-1747890554434-1-19', 1, 19, 2000.00, 'QRIS', NULL, 'success', 'success', NULL, '2025-05-22 12:09:14', '2025-05-22 12:09:15'),
(3, 'FINE-1747966826954-1-22', 1, 22, 2000.00, 'QRIS', NULL, 'success', 'success', NULL, '2025-05-23 09:20:26', '2025-05-23 09:20:28'),
(4, 'FINE-1747966971103-1-24', 1, 24, 2000.00, 'QRIS', NULL, 'success', 'success', NULL, '2025-05-23 09:22:51', '2025-05-23 09:22:51'),
(5, 'FINE-1747966978793-1-23', 1, 23, 2000.00, 'QRIS', NULL, 'success', 'success', NULL, '2025-05-23 09:22:58', '2025-05-23 09:22:58');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','member') NOT NULL DEFAULT 'member',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `active`, `created_at`) VALUES
(1, 'Admin User', 'admin@library.com', 'admin123', 'admin', 1, '2025-05-02 09:13:14'),
(2, 'Udin pradana', 'udin@gmail.com', 'udin123', 'member', 1, '2025-05-02 09:18:28'),
(3, 'asep', 'asep@gmail.com', 'asep123', 'member', 1, '2025-05-19 12:41:40'),
(4, 'Adit', 'adit@gmail.com', 'adit123', 'member', 1, '2025-05-19 12:42:52'),
(5, 'Ahmad Fikri Ramadhan', 'a.fikri17102005@gmail.com', 'fikrihebat', 'member', 1, '2025-05-23 08:00:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `isbn` (`isbn`);

--
-- Indexes for table `borrowings`
--
ALTER TABLE `borrowings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_borrowings_user_id` (`user_id`),
  ADD KEY `idx_borrowings_book_id` (`book_id`),
  ADD KEY `idx_borrowings_status` (`status`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `borrowing_id` (`borrowing_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `borrowings`
--
ALTER TABLE `borrowings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `borrowings`
--
ALTER TABLE `borrowings`
  ADD CONSTRAINT `borrowings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `borrowings_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`borrowing_id`) REFERENCES `borrowings` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
