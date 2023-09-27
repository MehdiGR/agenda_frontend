-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 27, 2023 at 07:28 PM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `agenda_admin`
--

-- --------------------------------------------------------

--
-- Table structure for table `detail_redirectattempts`
--

CREATE TABLE `detail_redirectattempts` (
  `id` int(11) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `attempt_nbr` int(11) NOT NULL,
  `attempt_text` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `detail_redirectattempts`
--

INSERT INTO `detail_redirectattempts` (`id`, `ip`, `attempt_nbr`, `attempt_text`) VALUES
(114, '::1', 1, 'ds'),
(115, '::1', 2, 'dss'),
(116, '::1', 3, 'dsss'),
(117, '::1', 4, 'dsssq'),
(118, '::1', 5, 'dsssqs');

-- --------------------------------------------------------

--
-- Table structure for table `dictionnaire`
--

CREATE TABLE `dictionnaire` (
  `id` int(11) NOT NULL,
  `ref` varchar(255) DEFAULT NULL,
  `label_fr` text DEFAULT NULL,
  `label_en` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `dictionnaire`
--

INSERT INTO `dictionnaire` (`id`, `ref`, `label_fr`, `label_en`) VALUES
(1, 'ref_1', 'tableau de bord', 'dashboard'),
(2, 'ref_2', 'contacts', 'contacts'),
(3, 'ref_3', 'chiffre d\'affaire', 'turnover'),
(4, 'ref_4', 'recettes', 'receipts'),
(5, 'ref_5', 'dépenses', 'expenses'),
(6, 'ref_6', 'tva', 'vat'),
(7, 'ref_7', 'résultat', 'results'),
(8, 'ref_8', 'devis a relancer', 'quote to relaunch'),
(9, 'ref_9', 'creances', 'receivables'),
(10, 'ref_10', 'total ttc', 'total including tax'),
(11, 'ref_11', 'nombre', 'number'),
(12, 'ref_12', 'echues', 'due'),
(13, 'ref_13', 'dettes', 'debts'),
(14, 'ref_14', 'total', 'total'),
(15, 'ref_15', 'les dernieres facture', 'the last bills'),
(16, 'ref_16', 'list documents ventes', 'list of sales documents'),
(17, 'ref_17', 'consultez vos enregistrements de list documents ventes.', 'view your sales document list records.'),
(18, 'ref_18', 'list des documents', 'list of documents'),
(19, 'ref_19', 'nom de client', 'client name'),
(20, 'ref_20', 'client', 'client'),
(21, 'ref_21', 'consultez et gerez vos enregistrements de documents. pour consulter les details d\'un document , cliquez sur son enregistrement.', 'view and manage your document records. to view the details of a document, click on its record.'),
(22, 'ref_22', 'référence', 'reference'),
(23, 'ref_23', 'type document', 'document type'),
(24, 'ref_24', 'numero document', 'document number'),
(25, 'ref_25', 'date', 'date'),
(26, 'ref_26', 'montant ttc', 'amount including tax'),
(27, 'ref_27', 'devis', 'quote'),
(28, 'ref_28', 'bons de commande', 'purchase orders'),
(29, 'ref_29', 'bons de livraison', 'delivery notes'),
(30, 'ref_30', 'bons de retour', 'return slips'),
(31, 'ref_31', 'bons d\'avoir financier', 'financial vouchers'),
(32, 'ref_32', 'facture d\' avoir retour', 'return invoice'),
(33, 'ref_33', 'avoirs', 'assets'),
(34, 'ref_34', 'facture', 'invoice'),
(35, 'ref_35', 'nouveau document', 'new document'),
(36, 'ref_36', 'supprimer', 'delete'),
(37, 'ref_37', 'modifier', 'modify'),
(38, 'ref_38', 'facture de vente', 'sales receipt'),
(39, 'ref_39', 'devis rejete', 'quote rejected'),
(46, 'ref_40', 'bon de commande vente', 'sales order form'),
(47, 'ref_41', 'preparation de livraison', 'preparation for delivery'),
(48, 'ref_42', 'bon de livraison vente', 'sales delivery note'),
(49, 'ref_43', 'bon de retour de vente', 'sales return slip'),
(50, 'ref_44', 'bon d\'avoir financier de vente', 'sale financial voucher'),
(52, 'ref_45', 'facture d\'avoir de vente', 'sales credit note'),
(53, 'ref_46', 'facture de retour de vente', 'sales return invoice'),
(54, 'ref_47', 'preparation de commande', 'order preparation'),
(55, 'ref_48', 'bon de commande d\'achat', 'purchase order'),
(56, 'ref_49', 'bon de reception achat', 'purchase receipt note'),
(57, 'ref_50', 'bon de retour d\'achat', 'purchase return slip'),
(58, 'ref_51', 'bon d\'avoir financier d\'achat', 'voucher for financial purchase'),
(60, 'ref_52', 'facture d\'achat', 'purchase invoice'),
(61, 'ref_53', 'facture d\'avoir d\'achat', 'purchase credit note'),
(62, 'ref_54', 'facture de retour d\'achat', 'purchase return invoice'),
(63, 'ref_55', 'mouvement d\'entrée', 'entry movement'),
(64, 'ref_56', 'mouvement de sortie', 'exit movement'),
(65, 'ref_57', 'mouvement de transform', 'transform movement'),
(66, 'ref_58', 'devis ventes', 'quote sales'),
(67, 'ref_59', 'créez,consulter et gérer les devis que vos clients vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the quotes that your customers send you, especially those that you want to spread over several products'),
(68, 'ref_60', 'nouveau devis', 'new quote'),
(69, 'ref_61', 'montant ht', 'amount without taxes'),
(71, 'ref_62', 'créez,consulter et gérez les bons de commandes que vos clients vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the purchase orders that your customers send to you, especially those that you want to distribute over several products'),
(72, 'ref_63', 'nouveau bon de commande', 'new purchase order'),
(73, 'ref_64', 'créez,consultez et gérez les bons de livraison que vos clients vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the delivery slips that your customers send you, especially those that you want to distribute over several products'),
(74, 'ref_65', 'nouveau bon de livraison', 'new delivery slip'),
(75, 'ref_66', 'créez,consulter et gérer les bons de retour vente que vos clients vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the sales return slips that your customers send you, especially those that you want to distribute over several products'),
(76, 'ref_67', 'nouveau bons retour vente', 'new sales return voucher'),
(77, 'ref_68', 'créez,consulter et gérer les factures que vos clients vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the invoices that your customers send you, especially those that you want to distribute over several products'),
(78, 'ref_69', 'nouvelle facture', 'new invoice'),
(79, 'ref_70', 'nouveau bon avoir financier vente', 'new financial voucher sale'),
(81, 'ref_71', 'créez,consulter et gérer les factures d\'avoir retour ventes que vos clients vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the invoices to have return sales that your customers send you, especially those that you want to distribute over several products'),
(82, 'ref_72', 'nouveau facture avoir retour vente', 'new sales return invoice'),
(83, 'ref_73', 'créez,consulter et gérer les avoirs ventes que vos clients vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the sales credits that your customers send to you, especially those that you want to spread over several products'),
(84, 'ref_74', 'nouveau facture d\'avoir vente', 'new sales credit invoice'),
(85, 'ref_75', 'list documents achats', 'list of purchasing documents'),
(86, 'ref_76', 'bon de reception', 'receipt'),
(87, 'ref_77', 'fournisseur', 'supplier'),
(90, 'ref_78', 'créez,consulter et gérez les bons de reception que vos clients vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the receipts that your customers send you, especially those that you want to distribute over several products'),
(91, 'ref_79', 'nouveau bon reception', 'new receipt voucher'),
(92, 'ref_80', 'créez,consulter et gérer les avoirs achats que vos clients vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the purchase credits that your customers send you, especially those that you want to distribute over several products'),
(93, 'ref_81', 'nouveau bon retour achat', 'new purchase return slips'),
(94, 'ref_82', 'nom de fournisseur', 'supplier name'),
(95, 'ref_83', 'créez,consulter et gérer les factures que vos fournisseurs vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the invoices that your suppliers send you, especially those that you want to distribute over several products'),
(96, 'ref_84', 'créez,consulter et gérez les bons d\'avoir financier achats que vos fournisseurs vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the vouchers to have financial purchases that your suppliers send you, especially those that you want to distribute over several products'),
(97, 'ref_85', 'nouveau bon d\'avoir financier d\'achat', 'new purchase voucher'),
(99, 'ref_86', 'créez,consulter et gérez les facture d\'avoir retour achats que vos fournisseurs vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the invoices to have returned purchases that your suppliers send you, especially those that you want to distribute over several products'),
(100, 'ref_87', 'nouveau facture avoir retour achat', 'new purchase return invoice'),
(101, 'ref_88', 'créez,consulter et gérez les avoirs d\'achats que vos fournisseurs vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the purchase credits that your suppliers send you, especially those that you want to distribute over several products'),
(102, 'ref_89', 'nouveau  avoir d\'achat', 'new credit note'),
(103, 'ref_90', 'créez,consulter et gérer les mouvements d\'entrée que vos clients vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the entry movements that your customers send to you, especially those that you want to distribute over several products'),
(104, 'ref_91', 'nouveau mouvement d\'entrée', 'new entry movement'),
(105, 'ref_92', 'créez,consulter et gérer les mouvements sortie que vos clients vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the output movements that your customers send you, especially those that you want to distribute over several products'),
(106, 'ref_93', 'nouveau mouvement sortie', 'new movement output'),
(107, 'ref_94', 'créez,consulter et gérez les mouvements transforms que vos clients vous envoient,surtout celles que vous voulez repartir sur plusieurs produits', 'create, consult and manage the transformed movements that your customers send you, especially those that you want to distribute over several products'),
(108, 'ref_95', 'nouveau mouvement transform', 'new transform movement'),
(109, 'ref_96', 'enregistrer un nouveau avoir d\'achat que vous avez reçue pour chercher ou créer un nouveau fournisseur commençez a taper dans la case norm', 'save a new purchase credit you received to search or create a new supplier start typing in the norm box'),
(110, 'ref_97', 'réferénce de fournisseur', 'supplier reference'),
(111, 'ref_98', 'enregistrer', 'save'),
(112, 'ref_99', 'affaire', '(affaire)'),
(113, 'ref_100', 'dépôt', 'deposit'),
(114, 'ref_101', 'selectionnez dépôt', 'select deposit'),
(115, 'ref_102', 'produit/service', 'product/service'),
(116, 'ref_103', 'article', 'item'),
(117, 'ref_104', 'prix unitaire', 'unit price'),
(118, 'ref_105', 'taux tva', 'vat rate'),
(119, 'ref_106', 'remise', 'discount'),
(120, 'ref_107', 'prix unitaire net', 'net unit price'),
(121, 'ref_108', 'ttc', 'tax included'),
(122, 'ref_109', 'selectionez tva', 'select vat'),
(123, 'ref_110', 'note', 'note'),
(124, 'ref_111', 'quantité', 'quantity'),
(125, 'ref_112', 'recapitulative tva', 'vat summary'),
(126, 'ref_113', 'tva sur les encaissement', 'vat on receipts'),
(127, 'ref_114', 'imprimer', 'print'),
(128, 'ref_115', 'envoyer', 'send'),
(129, 'ref_116', 'nouveau', 'new'),
(130, 'ref_117', 'annuler', 'cancel'),
(131, 'ref_118', 'selectionez fournisseur', 'select  supplier'),
(132, 'ref_119', 'selectionez un fournisseur', 'select a supplier'),
(133, 'ref_120', 'date document', 'document date'),
(134, 'ref_121', 'date livraison estimee', 'estimated delivery date'),
(136, 'ref_122', 'selectionnez client', 'select client'),
(137, 'ref_123', 'selectionez un client', 'select a client'),
(138, 'ref_124', 'expéditeur', 'sender'),
(139, 'ref_125', 'enregistrer un nouveau avoir vente que vous avez reçue pour chercher ou créer un nouveau client commençez a taper dans la case norm', 'save a new credit memo you received to search or create a new customer start typing in the norm box'),
(140, 'ref_126', 'nouveau bon de avoir financier achat', 'new financial voucher for purchase'),
(142, 'ref_127', 'enregistrer un nouveau bon d\'avoir financier que vous avez reçue pour chercher ou créer un nouveau client commençez a taper dans la case norm', 'save a new financial credit voucher you have received to search or create a new customer start typing in the norm box'),
(144, 'ref_129', 'enregistrer un nouveau bon de livraison que vous avez reçue pour chercher ou créer un nouveau client commençez a taper dans la case norm', 'save a new delivery note you have received to search or create a new customer start typing in the norm box'),
(145, 'ref_130', 'enregistrer un nouveau bon de récéption que vous avez reçue pour chercher ou créer un nouveau fournisseur commençez a taper dans la case norm', 'save a new receipt you received to search or create a new supplier start typing in the norm box'),
(146, 'ref_131', 'enregistrer un nouveau bon de retour que vous avez reçue pour chercher ou créer un nouveau fournisseur commençez a taper dans la case norm', 'save a new return note you received to search or create a new supplier start typing in the standard box'),
(147, 'ref_132', 'enregistrer un nouveau bon de retour que vous avez reçue pour chercher ou créer un nouveau client commençez a taper dans la case norm', 'save a new return slip you received to search or create a new customer start typing in the norm box'),
(148, 'ref_133', 'enregistrer une nouveau devis que vous avez reçue pour rechercher ou créer un nouveau client commençez a taper dans la case norm', 'save a new quote you received to search or create a new customer start typing in the norm box'),
(149, 'ref_134', 'enregistrer une nouvelle facture que vous avez reçue pour rechercher ou créer un nouveau fournisseur commençez a taper dans la case norm', 'save a new invoice you received to search or create a new supplier start typing in the norm box'),
(151, 'ref_135', 'enregistrer un nouveau facture que vous avez reçue pour chercher ou créer un nouveau client commençez a taper dans la case norm', 'save a new invoice you received to search or create a new customer start typing in the norm box'),
(152, 'ref_136', 'nouvelle facture vente', 'new sales invoice'),
(153, 'ref_137', 'nouvelle facture achat', 'new purchase invoice'),
(156, 'ref_138', 'enregistrer un nouveau mouvement d\'entrée que vous avez reçue', 'save a new entry motion you received'),
(157, 'ref_139', 'enregistrer un nouveau mouvement sortie que vous avez reçue', 'record a new motion output you received'),
(158, 'ref_140', 'enregistrer un nouveau mouvement transform que vous avez reçue', 'register a new transform movement you have received'),
(159, 'ref_141', 'enregistrer une nouvelle commande que vous avez reçue pour rechercher ou créer un nouveau fournisseur commençez a taper dans la case norm', 'save a new order you received to search or create a new supplier start typing in the norm box'),
(160, 'ref_142', 'modifier avoir d\'achat', 'modify purchase credit'),
(161, 'ref_143', 'ajouter', 'add'),
(162, 'ref_144', 'modifier avoir vente', 'modify sale credit note'),
(163, 'ref_145', 'plus infos', 'more info'),
(164, 'ref_146', 'modifier bon d\'avoir financier achat', 'modify purchase voucher'),
(165, 'ref_147', 'modifier bon d\'avoir financier vente', 'modify sale voucher'),
(166, 'ref_148', 'modifier bon de commande achat', 'modify purchase order'),
(167, 'ref_149', 'modifier bon de commande vente', 'modify sales order'),
(168, 'ref_150', 'modifier bon de livraison', 'modify delivery note'),
(169, 'ref_151', 'modifier bon de reception', 'modify receipt note'),
(170, 'ref_152', 'modifier bon de retour achat', 'modify purchase return slip'),
(171, 'ref_153', 'modifier bon de retour vente', 'modify sales return note'),
(172, 'ref_154', 'modifier devis rejete', 'modify rejected quote'),
(173, 'ref_155', 'modifier devis', 'modify quote'),
(174, 'ref_156', 'modifier facture d\'achat', 'modify purchase invoice'),
(175, 'ref_157', 'modifier facture d\'avoir retour achat', 'modify purchase return invoice'),
(176, 'ref_158', 'enregistrer une nouvelle facture avoir retour que vous avez reçue pour chercher ou créer un nouveau, fournisseur commençez a taper dans la case norm', 'save a new return invoice that you have received to search or create a new one, start typing in the norm box'),
(177, 'ref_159', 'modifier facture d\'avoir retour vente', 'modify sales return invoice'),
(178, 'ref_160', 'modifier facture vente', 'modify sales invoice'),
(179, 'ref_161', 'modifier mouvement d\'entrée', 'modify entry movement'),
(180, 'ref_162', 'modifier mouvement sortie', 'modify output movement'),
(181, 'ref_163', 'modifier mouvement transform', 'modify movement transform'),
(182, 'ref_164', 'visualiser,modifier ou gérer vos avoirs', 'view, modify or manage your assets'),
(183, 'ref_165', 'parfait! avoirs créer', 'perfect! assets create'),
(184, 'ref_166', 'ajouter autre avoirs', 'add other assets'),
(185, 'ref_167', 'afficher tous les avoirs', 'show all holdings'),
(187, 'ref_168', 'à', 'to'),
(188, 'ref_169', 'date d\'echeance', 'due date'),
(189, 'ref_170', 'prix taux', 'price rate'),
(191, 'ref_171', 'mad', 'mad'),
(192, 'ref_172', 'créer', 'create'),
(194, 'ref_173', 'ajouter un fichier', 'add a file'),
(195, 'ref_174', 'ajouter avoir', 'add credit'),
(196, 'ref_175', 'transforme', 'transform'),
(197, 'ref_176', 'visualiser,modifier ou gérer vos bons de avoir financier', 'view, modify or manage your financial vouchers'),
(198, 'ref_177', 'parfait! bons d\'avoir financier créer', 'perfect! financial vouchers create'),
(199, 'ref_178', 'ajouter autre bons d\'avoir financier', 'add other financial vouchers'),
(200, 'ref_179', 'afficher tous les bons d\'avoir financier', 'view all financial vouchers'),
(202, 'ref_180', 'visualiser,modifier ou gérer vos commandes', 'view, modify or manage your orders'),
(203, 'ref_181', 'parfait! bons de commande créer', 'perfect! create purchase orders'),
(204, 'ref_182', 'ajouter autre bons de commande', 'add other purchase orders'),
(205, 'ref_183', 'afficher tous les bons de commande', 'show all purchase orders'),
(206, 'ref_184', 'visualiser,modifier ou gérer vos bons livraisons', 'view, modify or manage your delivery slips'),
(207, 'ref_185', 'parfait! bons de livraison créer', 'perfect! delivery slips create'),
(208, 'ref_186', 'ajouter autre bons de livraison', 'add other delivery notes'),
(209, 'ref_187', 'afficher tous les bons de livraison', 'show all delivery notes'),
(210, 'ref_188', 'visualiser,modifier ou gérer vos bons de receptions', 'view, modify or manage your receipts'),
(211, 'ref_189', 'parfait! bons de reception créer', 'perfect! receipt slips create'),
(212, 'ref_190', 'ajouter autre bons de reception', 'add other receipts'),
(213, 'ref_191', 'afficher tous les bons de reception', 'show all receipts'),
(214, 'ref_192', 'visualiser,modifier ou gérer vos bons de retour', 'view, modify or manage your return slips'),
(215, 'ref_193', 'parfait! bons de retour créer', 'perfect! create return slips'),
(216, 'ref_194', 'ajouter autre bons de retour', 'add other return slips'),
(217, 'ref_195', 'afficher tous les bons de retour', 'show all return slips'),
(218, 'ref_196', 'visualiser,modifier ou gérer vos devis', 'view, modify or manage your quotes'),
(219, 'ref_197', 'parfait! devis créer', 'perfect! quote create'),
(220, 'ref_198', 'ajouter autre devis', 'add another quote'),
(221, 'ref_199', 'afficher tous les devis rejet??', 'view all rejected quotes'),
(222, 'ref_200', 'afficher tous les devis', 'view all quotes'),
(223, 'ref_201', 'visualiser,modifier ou gérer vos factures d\'avoir retour', 'view, modify or manage your return invoices'),
(224, 'ref_202', 'parfait! facture d\'avoir retour cr??er', 'perfect! return invoice create'),
(225, 'ref_203', 'ajouter autre factures d\'avoir retour', 'add other invoices to have back'),
(226, 'ref_204', 'afficher tous les factures d\'avoir retour', 'show all return invoices'),
(227, 'ref_205', 'visualiser,modifier ou gérer vos factures', 'view, modify or manage your invoices'),
(228, 'ref_206', 'parfait! facture créer', 'perfect! invoice create'),
(229, 'ref_207', 'ajouter autre factures', 'add other invoices'),
(230, 'ref_208', 'afficher tous les facture', 'show all invoices'),
(231, 'ref_209', 'visualiser,modifier ou gérer vos mouvements d\'entrée', 'view, modify or manage your entry movements'),
(232, 'ref_210', 'numero de mouvement', 'movement number'),
(233, 'ref_211', 'visualiser,modifier ou gérer vos mouvements de sortie', 'view, modify or manage your exit movements'),
(234, 'ref_212', 'visualiser,modifier ou gérer vos mouvement transform', 'view, modify or manage your transform movements'),
(235, 'ref_213', 'mark comme refusé', 'mark as denied'),
(236, 'ref_214', 'suivi livraison', 'delivery tracking'),
(237, 'ref_215', 'créez, consultez et gérez vos suivi de livraison de clients. pour consulter les details livraison et les transactions d\'un client, cliquez sur son enregistrement.', 'create, view and manage your customer delivery trackers. to view a customer\'s delivery details and transactions, click on their record.'),
(238, 'ref_216', 'désignation', 'name'),
(239, 'ref_217', 'date expédition', 'shipping date'),
(240, 'ref_218', 'date livraison', 'delivery date'),
(241, 'ref_219', 'action', 'action'),
(242, 'ref_220', 'expédié', 'shipped'),
(243, 'ref_221', 'livré', 'delivered'),
(244, 'ref_222', 'prêt', 'ready'),
(245, 'ref_223', 'selectionez expéditeur', 'select sender'),
(246, 'ref_224', 'état', 'state'),
(247, 'ref_225', 'bon livraison', 'delivery note'),
(249, 'ref_226', 'date prévu', 'scheduled date'),
(250, 'ref_227', 'map x', 'map x'),
(251, 'ref_228', 'map y', 'map y'),
(252, 'ref_229', 'adresse', 'address'),
(253, 'ref_230', 'fermer', 'close'),
(254, 'ref_231', 'informations', 'informations'),
(255, 'ref_232', 'sélectionnez un bon de livraison', 'select a delivery note'),
(256, 'ref_233', 'client infos', 'client infos'),
(257, 'ref_234', 'nom', 'name'),
(258, 'ref_235', 'ville', 'city'),
(259, 'ref_236', 'tel', 'phone'),
(260, 'ref_237', 'commercial', 'commercial'),
(261, 'ref_238', 'zone', 'areas'),
(262, 'ref_239', 'clients', 'clients'),
(263, 'ref_240', 'créez, consultez et gérez vos enregistrements de clients. pour consulter les détails de compte et les transactions d\'un client, cliquez sur son enregistrement', 'create, view and manage your customer records. to view a customer\'s account details and transactions, click on their record'),
(264, 'ref_241', 'ajouter client', 'add client'),
(265, 'ref_242', 'importer/exporter', 'import/export'),
(266, 'ref_243', 'importer', 'import'),
(267, 'ref_244', 'exporter', 'export'),
(268, 'ref_245', 'map', 'map'),
(269, 'ref_246', 'e-mail', 'e-mail'),
(270, 'ref_247', 'ice', 'ice'),
(271, 'ref_248', 'solvabilité', 'solvency'),
(272, 'ref_249', 'code', 'code'),
(273, 'ref_250', 'saisir le code', 'enter the code'),
(274, 'ref_251', 'saisir le nom', 'enter the name'),
(275, 'ref_252', 'saisir la ville', 'enter the city'),
(276, 'ref_253', 'aucun ville trouvé', 'no city found'),
(277, 'ref_254', 'veuillez saisir un email valide', 'please enter a valid email'),
(278, 'ref_255', 'fax', 'fax'),
(279, 'ref_256', 'if', 'if'),
(280, 'ref_257', 'collaborateur', 'collaborater'),
(281, 'ref_258', 'active', 'active'),
(282, 'ref_259', 'plafond', 'limit'),
(283, 'ref_260', 'utilisateur', 'user'),
(284, 'ref_261', 'supprimer client', 'delete client'),
(285, 'ref_262', 'modifier client', 'modify client'),
(286, 'ref_263', 'map client', 'client map'),
(287, 'ref_264', 'historique', 'history'),
(288, 'ref_265', 'historique relation', 'relationship history'),
(289, 'ref_266', 'ajouter historique', 'add history'),
(290, 'ref_267', 'ajouter rdv', 'add appointment'),
(291, 'ref_268', 'rdv', 'appointment'),
(292, 'ref_269', 'appels', 'calls'),
(293, 'ref_270', 'ajouter appels', 'add calls'),
(294, 'ref_271', 'nouveau historique', 'new history'),
(295, 'ref_272', 'modifier historique', 'modify history'),
(296, 'ref_273', 'supprimer historique', 'delete history'),
(297, 'ref_274', 'fournisseurs', 'suppliers'),
(298, 'ref_275', 'créez, consultez et gérez vos enregistrements de fournisseurs. pour consulter les détails de compte et les transactions d\'un fournisseur, cliquez sur son enregistrement', 'create, view and manage your supplier records. to view a supplier\'s account details and transactions, click on their record'),
(299, 'ref_276', 'ajouter fournisseur', 'add supplier'),
(300, 'ref_277', 'supprimer  fournisseur', 'delete supplier'),
(301, 'ref_278', 'prospects', 'prospects'),
(302, 'ref_279', 'créez, consultez et gérez vos enregistrements de prospects. pour consulter les détails de compte et les transactions d\'un prospect, cliquez sur son enregistrement.', 'create, view and manage your lead records. to view a lead\'s account details and transactions, click their record.'),
(303, 'ref_280', 'ajouter prospect', 'add prospect'),
(304, 'ref_281', 'supprimer prospect', 'delete prospect'),
(305, 'ref_282', 'prospect', 'prospect'),
(306, 'ref_283', 'nouveau prospect télé', 'new prospect (tele)'),
(307, 'ref_284', 'sélectionnez un statut', 'select a status'),
(309, 'ref_286', 'jusqu\'au', 'until'),
(310, 'ref_287', 'entre', 'between'),
(311, 'ref_288', 'a partir', 'from'),
(312, 'ref_289', 'le', 'th'),
(313, 'ref_290', 'date début', 'start date'),
(314, 'ref_291', 'date fin', 'end date'),
(315, 'ref_292', 'heure début', 'start time'),
(316, 'ref_293', 'heure fin', 'end time'),
(317, 'ref_294', 'sélectionnez collaborateur', 'select collaborator'),
(318, 'ref_295', 'heure', 'hour'),
(319, 'ref_296', 'commenter', 'comment'),
(320, 'ref_297', 'statut', 'status'),
(321, 'ref_298', 'détail rdv', 'appointment detail'),
(322, 'ref_299', 'appeler', 'call'),
(323, 'ref_300', 'transformer en client', 'transform to client'),
(324, 'ref_301', 'modifier prospect', 'modify prospect'),
(325, 'ref_302', 'map prospects', 'map prospects'),
(326, 'ref_303', 'map prospect', 'map prospect'),
(327, 'ref_304', 'non active', 'inactive'),
(328, 'ref_305', 'nouveau rdv', 'new appointment'),
(329, 'ref_306', 'lieu', 'location'),
(330, 'ref_307', 'avec', 'with'),
(331, 'ref_308', 'pv', '(pv)'),
(332, 'ref_309', 'prospect télé', 'prospect(tele)'),
(333, 'ref_310', 'ajouter appel', 'add call'),
(334, 'ref_311', 'supprimer prospect télé', 'delete prospect (tele)'),
(335, 'ref_312', 'supprimer appel', 'delete call'),
(336, 'ref_313', 'suivi rdv', 'appointment follow-up'),
(337, 'ref_314', 'créez, consultez et gérez vos enregistrements de suivi rdv.', 'create, view and manage your appointment tracking records.'),
(338, 'ref_315', 'clients/prospects', 'clients/prospects'),
(339, 'ref_316', 'tous', 'all'),
(340, 'ref_317', 'articles', 'items'),
(341, 'ref_318', 'créez, consultez et gérez vos enregistrements d\' articles. pour consulter les détails de compte et les transactions d\'une article, cliquez sur son enregistrement', 'create, view and manage your articles records. to view account details and transactions for an item, click its record'),
(342, 'ref_319', 'famille', 'family'),
(343, 'ref_320', 'ajouter article', 'add item'),
(344, 'ref_321', 'intitule', 'title'),
(345, 'ref_322', 'stock réel', 'real stock'),
(346, 'ref_323', 'prix d\'achat', 'purchasing price'),
(347, 'ref_324', 'prix de vente', 'selling price'),
(348, 'ref_325', 'prix ttc', 'all taxes included price'),
(349, 'ref_326', 'créer tout article que votre entreprise achéte ou vente', 'create any item your business buys or sells'),
(350, 'ref_327', 'information sur l\'article', 'item information'),
(351, 'ref_328', 'sélectionnez un type', 'select type'),
(352, 'ref_329', 'stocks', 'inventory'),
(353, 'ref_330', 'entrée et sortie quantités suivies', 'entry and exit quantities tracked'),
(354, 'ref_331', 'produit', 'product'),
(355, 'ref_332', 'quantités non suivies', 'untracked quantities'),
(356, 'ref_333', 'services', 'services'),
(357, 'ref_334', 'service que vous acheter ou vendue', 'service you buy or sell'),
(358, 'ref_335', 'code de l\'article', 'item code'),
(359, 'ref_336', 'nom court ou code', 'short name or code'),
(360, 'ref_337', 'description de l\'article', 'item description'),
(361, 'ref_338', 'categorie', 'category'),
(362, 'ref_339', 'je vends un article', 'i am selling an item'),
(363, 'ref_340', 'nom de prix', 'price name'),
(364, 'ref_341', 'prix', 'price'),
(365, 'ref_342', 'inclus la tva', 'included vat'),
(366, 'ref_343', 'prix marchand', 'market price'),
(367, 'ref_344', 'prix de gros', 'wholesale price'),
(368, 'ref_345', 'compte de vente', 'sales account'),
(369, 'ref_346', 'j\'achete cet article', 'i buy this item'),
(370, 'ref_347', 'fournisseur habituel', 'regular supplier'),
(371, 'ref_348', 'aucun fournisseur trouvé', 'no supplier found'),
(372, 'ref_349', 'description de l\'achat', 'description of purchase'),
(373, 'ref_350', 'compte d\'achat', 'purchase account'),
(374, 'ref_351', 'stock mini', 'minimum inventory'),
(375, 'ref_352', 'quantité de commande', 'order quantity'),
(376, 'ref_353', 'solde d\'ouverture', 'opening balance'),
(377, 'ref_354', 'j\'ai du stock disponible', 'i have stock available'),
(378, 'ref_355', 'quantité initial', 'initial quantity'),
(379, 'ref_356', 'information supplémentaire', 'additional information'),
(380, 'ref_357', 'emplacement', 'location'),
(381, 'ref_358', 'code barre', 'barcode'),
(382, 'ref_359', 'poids', 'weight'),
(383, 'ref_360', 'modifier un artcile', 'modify an item'),
(384, 'ref_361', 'modifier tout article que votre entreprise achéte ou vente', 'edit any item your business buys or sells'),
(385, 'ref_362', 'télécharger photos d\'article', 'upload item pictures'),
(386, 'ref_363', 'télécharger les photos de vous article', 'upload pictures of you item'),
(387, 'ref_364', 'infos article', 'item info'),
(388, 'ref_365', 'modifier article', 'modify item'),
(389, 'ref_366', 'supprimer article', 'delete item'),
(390, 'ref_367', 'photos article', 'item pictures'),
(391, 'ref_368', 'stock commandé', 'inventory ordered'),
(392, 'ref_369', 'stock à terme', 'futures stock'),
(393, 'ref_370', 'stock à résérver', 'stock to reserve'),
(394, 'ref_371', 'lettrage', 'lettering'),
(395, 'ref_372', 'imputer', 'impute'),
(396, 'ref_373', 'non', 'not impute'),
(397, 'ref_374', 'list paiement factures client', 'list payment customer invoices'),
(398, 'ref_375', 'type', 'type'),
(399, 'ref_376', 'détail', 'detail'),
(400, 'ref_377', 'détail facture imputé', 'charged invoice detail'),
(401, 'ref_378', 'infos facture imputé', 'applied invoice info'),
(402, 'ref_379', 'consulter les détails facture imputé', 'view posted invoice details'),
(403, 'ref_380', 'montant', 'amount'),
(404, 'ref_381', 'désimputer', 'discharge'),
(405, 'ref_382', 'ajouter paiement', 'add payment'),
(406, 'ref_383', 'sélectionnez', 'select'),
(407, 'ref_384', 'montant reçu', 'received amount'),
(408, 'ref_385', 'solde restant', 'remaining balance'),
(409, 'ref_386', 'saisir montant', 'enter amount'),
(410, 'ref_387', 'date règlement', 'payment date'),
(411, 'ref_388', 'méthode paiement', 'payment method'),
(412, 'ref_389', 'optionnelle', 'optional'),
(413, 'ref_390', 'date remise', 'discount date'),
(414, 'ref_391', 'enregistrer paiement', 'save payment'),
(415, 'ref_392', 'période', 'period'),
(416, 'ref_393', 'aujourd\'hui', 'today'),
(417, 'ref_394', 'cette semaine', 'this week'),
(418, 'ref_395', 'ce mois-ci', 'this month'),
(419, 'ref_396', 'cette année', 'this year'),
(421, 'ref_398', 'suivi chèques clients', 'tracking customer checks'),
(422, 'ref_399', 'suivi chèques fournisseurs', 'tracking supplier checks'),
(424, 'ref_401', 'inventaire', 'inventory'),
(425, 'ref_402', 'inventaire consultez et gérez vos enregistrements d\'inventaire', 'inventory view and manage your inventory records'),
(426, 'ref_403', 'recalculer stock', 'recalculate stock'),
(427, 'ref_404', 'familles', 'families'),
(428, 'ref_405', 'cmup', 'cmup'),
(429, 'ref_406', 'imprimer excel', 'print excel'),
(430, 'ref_407', 'imprimer pdf', 'print pdf'),
(431, 'ref_408', 'balance clients', 'clients balance'),
(432, 'ref_409', 'inclue bon livraison', 'includes delivery note'),
(433, 'ref_410', 'chercher', 'search'),
(434, 'ref_411', 'total règlement', 'total payment'),
(435, 'ref_412', 'total facture', 'total bill'),
(436, 'ref_413', 'solde', 'balance'),
(437, 'ref_414', 'balance fournisseurs', 'suppliers balance'),
(438, 'ref_415', 'inclue bons réception', 'includes receipt vouchers'),
(439, 'ref_416', 'c.a par client', 'turnover per client'),
(440, 'ref_417', 'consultez vos enregistrements de clients', 'view your customer records'),
(441, 'ref_418', 'total bons livraison', 'total delivery notes'),
(442, 'ref_419', 'c.a par article', 'turnover per item'),
(443, 'ref_420', 'consultez vos enregistrements d\'articles', 'view your item records'),
(444, 'ref_421', 'filtrer', 'filter'),
(445, 'ref_422', 'c.a par affaire', 'turnover by business'),
(446, 'ref_423', 'consultez vos enregistrements d\' affaires', 'view your business records'),
(447, 'ref_424', 'date création', 'creation date'),
(448, 'ref_425', 'total ht', 'total without taxes'),
(449, 'ref_426', 'c.a par mois', 'turnover per month'),
(450, 'ref_427', 'consultez vos enregistrements de c.a par mois', 'view your  records turnover per month by month'),
(451, 'ref_428', 'total ht facture', 'total tax-free invoice'),
(452, 'ref_429', 'mois', 'month'),
(453, 'ref_430', 'créez, consultez et gérez vos enregistrements de familles', 'create, view and manage your family records'),
(454, 'ref_431', 'ajouter famille', 'add family'),
(455, 'ref_432', 'modifier famille', 'modify family'),
(456, 'ref_433', 'saisir l\'intitule', 'enter the title'),
(457, 'ref_434', 'stock', 'stock'),
(458, 'ref_435', 'taux tva achat', 'purchase vat rate'),
(459, 'ref_436', 'taux tva vente', 'sale vat rate'),
(460, 'ref_437', 'unite', 'unity'),
(461, 'ref_438', 'catalogue', 'catalog'),
(462, 'ref_439', 'sélectionnez catalogue', 'select catalog'),
(463, 'ref_440', 'supprimer famille', 'delete family'),
(464, 'ref_441', 'mode paiément', 'payment mode'),
(465, 'ref_442', 'créez, consultez et gérez les modes de paiément', 'create, view and manage payment methods'),
(466, 'ref_443', 'ajouter mode', 'add mode'),
(467, 'ref_444', 'modifier mode paiément', 'modify payment mode'),
(468, 'ref_445', 'supprimer mode paiément', 'delete payment mode'),
(469, 'ref_446', 'mode', 'mode'),
(470, 'ref_447', 'créez, consultez et gérez les catalogues', 'create, view and manage catalogs'),
(471, 'ref_448', 'ajouter catalogue', 'add catalog'),
(472, 'ref_449', 'pere', 'father'),
(473, 'ref_450', 'modifier catalogue', 'modify catalog'),
(474, 'ref_451', 'supprimer catalogue', 'delete catalog'),
(475, 'ref_452', 'collaborateurs', 'collaborators'),
(476, 'ref_453', 'créez, consultez et gérez vos enregistrements de collaborateurs. pour consulter les détails de compte et les transactions d\'un collaborateur, cliquez sur son enregistrement', 'create, view and manage your employee records. to view an employee\'s account details and transactions, click on their record'),
(477, 'ref_454', 'ajouter collaborateur', 'add collaborator'),
(478, 'ref_455', 'prénom', 'first name'),
(479, 'ref_456', 'saisir le prénom', 'enter the first name'),
(480, 'ref_457', 'service', 'service'),
(481, 'ref_458', 'fonction', 'function'),
(482, 'ref_459', 'matricule', 'registration number'),
(483, 'ref_460', 'gsm', 'gsm'),
(484, 'ref_461', 'vendeur', 'seller'),
(485, 'ref_462', 'caissier', 'cashier'),
(486, 'ref_463', 'acheteur', 'buyer'),
(487, 'ref_464', 'rf', 'rf'),
(488, 'ref_465', 'contrôleur', 'controller'),
(489, 'ref_466', 'recouvrement', 'recovery'),
(490, 'ref_467', 'last name', 'nom'),
(491, 'ref_468', 'modifier collaborateur', 'modify collaborator'),
(492, 'ref_469', 'supprimer collaborateur', 'delete collaborator'),
(493, 'ref_470', 'affaires', '(affaires)'),
(495, 'ref_471', 'créez, consultez et gérez vos enregistrements de affaires. pour consulter les détails de compte et les transactions d\'un affaire, cliquez sur son enregistrement', 'create, view and manage your business records. to view account details and transactions for a deal, click on its record'),
(496, 'ref_472', 'ajouter une affaire', 'add a (affaire)'),
(497, 'ref_473', 'chiffre d\'affaire achat', 'purchase turnover'),
(498, 'ref_474', 'chiffre d\'affaire vente', 'sales turnover'),
(499, 'ref_475', 'modifier affaires', 'modify (affaire)'),
(500, 'ref_476', 'supprimer affaire', 'delete (affaire)'),
(501, 'ref_477', 'code d\'affaire', '(affaire) code'),
(502, 'ref_478', 'date accéptation', 'date acceptance'),
(503, 'ref_479', 'saisir le collaborateur', 'enter the collaborator'),
(504, 'ref_480', 'aucun collaborateur trouver', 'no collaborator found'),
(505, 'ref_481', 'créez, consultez et gérez vos enregistrements de services', 'create, view and manage your services records'),
(506, 'ref_482', 'ajouter service', 'add service'),
(507, 'ref_483', 'modifier service', 'modify service'),
(508, 'ref_484', 'supprimer service', 'delete service'),
(509, 'ref_485', 'fonctions', 'functions'),
(510, 'ref_486', 'ajouter fonction', 'add function'),
(511, 'ref_487', 'créez, consultez et gérez vos enregistrements de fonctions', 'create, view and manage your function records'),
(512, 'ref_488', 'supprimer fonction', 'delete function'),
(513, 'ref_489', 'modifier fonction', 'modify function'),
(514, 'ref_490', 'dépôts', 'deposits'),
(515, 'ref_491', 'créez, consultez et gérez vos enregistrements de depots. pour consulter les détails de compte et les transactions d\'un depot, cliquez sur son enregistrement', 'create, view and manage your deposit records. to view account details and transactions for a deposit, click on its record'),
(516, 'ref_492', 'ajouter dépôt', 'add deposit'),
(517, 'ref_493', 'modifier dépôt', 'modify deposit'),
(518, 'ref_494', 'supprimer dépôt', 'delete deposit'),
(519, 'ref_495', 'dépôt principale', 'main deposit'),
(520, 'ref_496', 'créez, consultez et gérez vos enregistrements de expediteurs', 'create, view and manage your sender records'),
(522, 'ref_497', 'ajouter expéditeur', 'add sender'),
(523, 'ref_498', 'contact', 'contact'),
(524, 'ref_499', 'modifier expéditeur', 'modify sender'),
(525, 'ref_500', 'supprimer expéditeur', 'delete sender'),
(526, 'ref_501', 'saisir l\'adresse', 'enter the address'),
(527, 'ref_502', 'saisir contact', 'enter contact'),
(528, 'ref_503', 'saisir numéro  tél', 'enter phone number'),
(529, 'ref_504', 'saisir gsm', 'enter gsm'),
(530, 'ref_505', 'ramassage', 'pickup'),
(531, 'ref_506', 'créez, consultez et gérez vos enregistrements de taux tva', 'create, consult and manage your vat rate records'),
(532, 'ref_507', 'ajouter taux tva', 'add vat rate'),
(533, 'ref_508', 'valeur', 'value'),
(534, 'ref_509', 'déduction', 'deduction'),
(535, 'ref_510', 'supprimer tva', 'delete vat'),
(536, 'ref_511', 'modifier tva', 'modify  vat'),
(537, 'ref_512', 'saisir valeur', 'enter value'),
(538, 'ref_513', 'créez, consultez et gérez les utilisateurs. pour consulter les détails d\'un utilisateur, cliquez sur icon modifier', 'create, view and manage users. to view a user\'s details, click icon edit'),
(539, 'ref_514', 'utilisateurs', 'users'),
(540, 'ref_515', 'login', 'login'),
(541, 'ref_516', 'réinitialiser mot de passe', 'reset password'),
(542, 'ref_517', 'supprimer l\'utilisateur', 'delete user'),
(543, 'ref_518', 'votre licence est  limité, pour effectuer cette operation veuillez supprimer un utilisateur', 'your license is limited, to perform this operation please delete a user'),
(544, 'ref_519', 'ajouter utilisateur', 'add user'),
(545, 'ref_520', 'modifier utilisateur', 'modify user'),
(546, 'ref_521', 'profil', 'profile'),
(547, 'ref_522', 'sociétés', 'companies'),
(548, 'ref_523', 'créez, consultez et gérez vos enregistrements de societes. pour consulter les détails de compte et les transactions d\'une societe, cliquez sur son enregistrement', 'create, view and manage your company records. to view account details and transactions for a company, click on its record'),
(549, 'ref_524', 'ajouter société', 'add company'),
(550, 'ref_525', 'raison', 'raison'),
(551, 'ref_526', 'société', 'company'),
(552, 'ref_527', 'smtp', 'smtp'),
(553, 'ref_528', 'juridique', 'legal'),
(554, 'ref_529', 'saisir fax', 'enter fax'),
(555, 'ref_530', 'pied', '(pied)'),
(556, 'ref_531', 'saisir pied', 'enter (pied)'),
(557, 'ref_532', 'saisir smtp', 'enter smpt'),
(558, 'ref_533', 'saisir login', 'enter login'),
(559, 'ref_534', 'mot de passe', 'password'),
(560, 'ref_535', 'saisir mot de passe', 'enter password'),
(561, 'ref_536', 'port', 'port'),
(562, 'ref_537', 'saisir port', 'enter port'),
(563, 'ref_538', 'saisir if', 'enter if'),
(564, 'ref_539', 'is', 'is'),
(565, 'ref_540', 'saisir is', 'enter is'),
(566, 'ref_541', 'rc', 'rc'),
(567, 'ref_542', 'saisir rc', 'enter rc'),
(568, 'ref_543', 'cnss', 'cnss'),
(569, 'ref_544', 'saisir cnss', 'enter cnss'),
(570, 'ref_545', 'patente', '(patente)'),
(571, 'ref_546', 'saisi patente', 'enter (patente)'),
(572, 'ref_547', 'modifier société', 'modify company'),
(573, 'ref_548', 'créez, consultez et gérez vos enregistrements de profils utilisateurs', 'create, view and manage your user profile records'),
(574, 'ref_549', 'ajouter profil', 'add profile'),
(575, 'ref_550', 'modifier profil', 'modify profile'),
(576, 'ref_551', 'supprimer profil', 'delete profile'),
(577, 'ref_552', 'menu', 'menu'),
(578, 'ref_553', 'menu profil', 'profile menu'),
(579, 'ref_554', 'créez, consultez et gérez vos enregistrements de menu profils utilisateurs', 'create, view and manage your user profile menu records'),
(580, 'ref_555', 'ajouter menu', 'add menu'),
(581, 'ref_556', 'consultation', 'consultation'),
(582, 'ref_557', 'modification', 'modification'),
(583, 'ref_558', 'ajout', 'addition'),
(584, 'ref_559', 'suppression', 'deletion'),
(585, 'ref_560', 'éditer', 'edit'),
(586, 'ref_561', 'editer menu', 'edit menu'),
(587, 'ref_562', 'url', 'url'),
(588, 'ref_563', 'saisir url', 'enter url'),
(589, 'ref_564', 'icon class', 'icon class'),
(590, 'ref_565', 'position', 'position'),
(591, 'ref_566', 'déconnexion', 'logout'),
(592, 'ref_567', 'plafond client', 'client ceiling'),
(593, 'ref_568', 'il y a', 'there are'),
(594, 'ref_569', 'alerts cheque(s) fournisseur', 'supplier check(s) alerts'),
(595, 'ref_570', 'cheques à déposer aujourd\'hui', 'checks to deposit today'),
(596, 'ref_571', 'alerts cheque(s) client', 'client check alerts'),
(597, 'ref_572', 'prix ht', 'price without taxes'),
(599, 'ref_573', 'sélectionnez statut', 'select status'),
(600, 'ref_574', 'exist déja', 'already exists'),
(603, 'ref_575', 'confirmer', 'confirm'),
(604, 'ref_576', 'vous voulez vraiment supprimer', 'you really want to delete'),
(605, 'ref_577', 'une fois supprimé, vous ne pourrez plus le récupérer', 'once deleted, you will not be able to recover it'),
(606, 'ref_578', 'suppression annulé', 'deletion canceled'),
(607, 'ref_579', 'supprimé', 'deleted'),
(608, 'ref_580', 'ajouté avec succès', 'successfully added'),
(609, 'ref_581', 'modifié avec succès', 'successfully modified'),
(610, 'ref_582', 'stock récalculé', 'stock recalculated'),
(611, 'ref_583', 'ne peut pas supprimer', 'can\'t delete'),
(612, 'ref_584', 'vous voulez transformer ce document', 'you want to transform this document'),
(613, 'ref_585', 'impossibilité de suppression ! insuffisance de stock d\'article', 'impossible to delete! shortage of item stock'),
(614, 'ref_586', 'impossibilité de suppression ! le document contient des réglements', 'impossible to delete! the document contains regulations'),
(615, 'ref_587', 'document envoyé', 'document sent'),
(616, 'ref_588', 'e-mail n\'existe pas', 'email does not exist'),
(617, 'ref_589', 'email exist déja', 'email already exists'),
(618, 'ref_590', 'code exist déja', 'code already exists'),
(619, 'ref_591', 'transformé avec succes', 'successfully transformed'),
(620, 'ref_592', 'veuillez sélectionner au moins un document', 'please select at least one document'),
(621, 'ref_593', 'quantité non disponible', 'quantity not available'),
(622, 'ref_594', 'fournisseur à des règlements', 'supplier has regulations'),
(623, 'ref_595', 'client à des règlements', 'client has regulations'),
(624, 'ref_596', 'fournisseur à des documents', 'supplier to documents'),
(625, 'ref_597', 'client à des documents', 'client to documents'),
(626, 'ref_598', 'code client exist déja', 'client code already exists'),
(627, 'ref_599', 'code prospect exist déja', 'prospect code already exists'),
(628, 'ref_600', 'devis rejetés', 'rejected quotes'),
(629, 'ref_601', 'devis en cours', 'current quote'),
(630, 'ref_602', 'devis validés', 'validated quotes'),
(631, 'ref_603', 'factures cette année', 'invoices this year'),
(632, 'ref_604', 'factures année précédente', 'previous year invoices'),
(633, 'ref_605', 'code de famille', 'family code'),
(634, 'ref_606', 'fichier non valide', 'invalid file'),
(635, 'ref_607', 'numéro', 'number'),
(636, 'ref_608', 'impression', 'impression'),
(637, 'ref_609', 'montant du sous-total', 'sub - total amount'),
(638, 'ref_610', 'procéder au paiement', 'proceed to payment'),
(639, 'ref_611', 'code de client', 'code client'),
(640, 'ref_612', 'encoure bl', 'still bl'),
(641, 'ref_613', 'encoure fct', 'still fct'),
(642, 'ref_614', 'code unite', 'unit code'),
(643, 'ref_615', 'code tva achat', 'purchase vat code'),
(644, 'ref_616', 'code tva vente', 'sales tax code'),
(645, 'ref_617', 'code de fournisseur', 'supplier code'),
(646, 'ref_618', 'importer clients', 'import clients'),
(647, 'ref_619', 'ajouter colonnes', 'add columns'),
(648, 'ref_620', 'sélectionnez tout', 'select all'),
(649, 'ref_621', 'sélectionnez excel file', 'select excel file'),
(650, 'ref_622', 'télecharger modèle', 'download template'),
(651, 'ref_623', 'méttre a jour', 'update'),
(652, 'ref_624', 'importer prospects', 'import prospects'),
(653, 'ref_625', 'importer articles', 'import items'),
(654, 'ref_626', 'suivi stock', 'stock tracking'),
(655, 'ref_627', 'tva achat', 'purchase vat'),
(656, 'ref_628', 'tva vente', 'sales vat'),
(657, 'ref_629', 'type article', 'item type'),
(658, 'ref_630', 'fournisseur principale', 'main supplier'),
(659, 'ref_631', 'authentification', 'authentication'),
(660, 'ref_632', 'nom d\'utilisateur', 'username'),
(661, 'ref_633', 'rappeler  de moi', 'remember me'),
(662, 'ref_634', 'mot de passe oublié', 'forgot your password'),
(663, 'ref_635', 'valider', 'validate'),
(664, 'ref_636', 'réinitialiser', 'reset'),
(665, 'ref_637', 'récupérer mot de passe', 'recover password'),
(666, 'ref_638', 'retour', 'return'),
(667, 'ref_639', 'entrez votre e-mail et des instructions vous seront envoyées', 'enter your email and instructions will be sent to you'),
(668, 'ref_640', 'gestion commerciale', 'business management'),
(669, 'ref_641', 'consulter les attachés', 'consult the attaches'),
(670, 'ref_642', 'sélectionner autre fichier', 'select another file'),
(671, 'ref_643', 'supprimer fichier', 'delete file'),
(672, 'ref_644', 'fichiers', 'files'),
(673, 'ref_645', 'tous les fichiers', 'all files'),
(674, 'ref_646', 'list factures', 'list invoices'),
(675, 'ref_647', 'ventes', 'sales'),
(676, 'ref_648', 'achats', 'purchases'),
(677, 'ref_649', 'sélectionnez la facture à imputer', 'select the invoice to charge'),
(678, 'ref_650', 'montant à imputer', 'amount to charge'),
(679, 'ref_651', 'n⁰ piece', 'n⁰ piece'),
(680, 'ref_652', 'ttc facture', 'invoice included'),
(681, 'ref_653', 'réste à payer', 'left to pay'),
(682, 'ref_654', 'montant imputé', 'charged amount'),
(683, 'ref_655', 'icon', 'icon'),
(684, 'ref_656', 'caisse', 'checkout'),
(685, 'ref_657', 'ajouter caisse', 'add checkout'),
(686, 'ref_658', 'point de vente', 'point of sale'),
(687, 'ref_659', 'sélectionnez caisse', 'select checkout'),
(688, 'ref_660', 'ert', 'ert'),
(689, 'ref_661', 'définir par defaut', 'set default'),
(690, 'ref_662', 'saisir désignation', 'enter designation'),
(691, 'ref_663', 'billets', 'tickets'),
(692, 'ref_664', 'détail balance client', 'customer balance detail'),
(693, 'ref_665', 'consultez détail balance d\'un client', 'consult a customer\'s balance detail'),
(694, 'ref_666', 'inclue bons livraison', 'includes delivery notes'),
(695, 'ref_667', 'n° facture', 'invoice no'),
(696, 'ref_668', 'montant facture', 'invoice amount'),
(697, 'ref_669', 'montant du règlement', 'regulations amount'),
(698, 'ref_670', 'détail balance fournisseur', 'supplier balance detail'),
(699, 'ref_671', 'consultez détail balance d\'un fournisseur', 'consult balance details of a supplier'),
(700, 'ref_672', 'largeur', 'width'),
(701, 'ref_673', 'en-tête', 'leading'),
(702, 'ref_674', 'pied de la page', 'footer'),
(703, 'ref_675', 'logo', 'logo'),
(704, 'ref_676', 'valeur unitaire', 'unit value'),
(705, 'ref_677', 'encours', 'in progress'),
(706, 'ref_678', 'payé', 'paid'),
(707, 'ref_679', 'géolocalisation', 'geolocation'),
(708, 'ref_680', 'reste à imputer', 'remains to be imputed'),
(709, 'ref_681', 'total imputé', 'total imputed'),
(710, 'ref_682', 'condition', 'condition'),
(711, 'ref_683', 'montant net ht', 'net amount before tax'),
(712, 'ref_684', 'prestation', 'benefit'),
(713, 'ref_685', 'durée', 'duration'),
(714, 'ref_686', 'etape', 'stage'),
(715, 'ref_687', 'créez, consultez et gérez vos enregistrements d\'etape', 'create, view and manage your stage records'),
(716, 'ref_688', 'ajouter etape', 'add stage'),
(717, 'ref_689', 'saisi durée', 'enter the duration'),
(718, 'ref_690', 'séléctionnez article', 'select product'),
(719, 'ref_691', 'supprimer etape', 'delete stage'),
(720, 'ref_692', 'modifier etape', 'modify stage'),
(721, 'ref_693', 'agenda', 'diary'),
(722, 'ref_694', 'créez, consultez et gérez vos enregistrements d\'agenda', 'create, view and manage your diary records'),
(723, 'ref_695', 'ajouter agenda', 'add diary'),
(724, 'ref_696', 'la prestation comporte plusieurs étapes', 'the service consists of several stages');

-- --------------------------------------------------------

--
-- Table structure for table `historique`
--

CREATE TABLE `historique` (
  `id` int(11) NOT NULL,
  `script` text NOT NULL,
  `date` date NOT NULL,
  `id_version` int(11) NOT NULL,
  `commentaire` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `historique`
--

INSERT INTO `historique` (`id`, `script`, `date`, `id_version`, `commentaire`) VALUES
(1, 'CREATE TABLE vehicle(\n	vehicleId INT NOT NULL,  \n  	make VARCHAR(64), \n  	model VARCHAR(128),\n  	derivative VARCHAR(255),\n  	PRIMARY KEY(vehicleId)\n);', '2023-01-06', 0, ''),
(2, 'drop table  vehicle', '2023-01-06', 0, ''),
(3, 'drop table vehicle', '2023-01-06', 0, ''),
(4, 'CREATE TABLE vehicle( vehicleId INT NOT NULL, make VARCHAR(64), model VARCHAR(128), derivative VARCHAR(255), PRIMARY KEY(vehicleId) );', '2023-01-06', 0, ''),
(5, 'drop table vehicle', '2023-01-06', 0, ''),
(6, 'CREATE TABLE vehicle( vehicleId INT NOT NULL, make VARCHAR(64), model VARCHAR(128), derivative VARCHAR(255), PRIMARY KEY(vehicleId) );', '2023-01-06', 0, ''),
(7, 'create table tutorials_tbl(\n   tutorial_id INT NOT NULL AUTO_INCREMENT,\n   tutorial_title VARCHAR(100) NOT NULL,\n   tutorial_author VARCHAR(40) NOT NULL,\n   submission_date DATE,\n  student_name VARCHAR (255),\n	sex varchar (6),\n	contact int (10),\n   PRIMARY KEY ( tutorial_id )\n);', '2023-01-10', 0, 'test create table'),
(8, 'drop table tutorials_tbl', '2023-01-10', 1, 'drop table tutorial');

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `intitule_fr` varchar(100) DEFAULT NULL,
  `intitule_en` varchar(100) NOT NULL,
  `intitule_ar` varchar(100) NOT NULL,
  `id_parent` int(11) DEFAULT NULL,
  `url` text NOT NULL,
  `icon` varchar(50) NOT NULL,
  `position` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`id`, `intitule_fr`, `intitule_en`, `intitule_ar`, `id_parent`, `url`, `icon`, `position`) VALUES
(1, 'Administration', 'Administration', '', 0, '', 'mdi mdi-key', 12),
(2, 'Utilisateurs', '', '', 1, 'utilisateurs.php', '', 1),
(3, 'Sociétés', '', '', 1, 'societe.php', '', 2),
(4, 'profil', '', '', 1, 'profil.php', '', 3),
(10, 'Structure', 'Structure', '', 0, '', 'mdi mdi-brightness-7', 10),
(11, 'Famille Article', '', '', 10, 'famille.php', '', 1),
(12, 'Mode de Paiement', '', '', 10, 'mode_paiement.php', '', 2),
(15, 'Taux TVA', '', '', 10, 'p_tauxtva.php', '', 10),
(16, 'Collaborateurs', '', '', 10, 'collaborateur.php', '', 4),
(17, 'Affaires', '', '', 10, 'affaire.php', '', 5),
(18, 'Etat', 'state', '', 0, '', 'mdi mdi-file-document', 9),
(19, 'Inventaire', '', '', 18, 'invetaire.php', '', 1),
(20, 'Balance Clients', '', '', 18, 'balance_clients.php', '', 2),
(21, 'Balance Fournisseurs', '', '', 18, 'balance_fournisseurs.php', '', 3),
(22, 'C.A par Client', '', '', 18, 'C.A_Client.php', '', 4),
(23, 'C.A par Article', '', '', 18, 'C.A_Article.php', '', 5),
(24, 'C.A par Affaire', '', '', 18, 'C.A_Affaire.php', '', 6),
(25, 'C.A par Famille', '', '', 18, '#', '', 7),
(26, 'C.A par Période', '', '', 18, '#', '', 8),
(27, 'Règlements', 'Regulations', '', 0, '', 'mdi mdi-bank', 8),
(28, 'Règlements clients', '', '', 27, 'paiement_facture_client.php', '', 1),
(29, 'Règlements Fournisseurs', '', '', 27, 'paiement_facture_fournisseur.php', '', 2),
(30, 'Suivi chèques Clients', '', '', 27, 'suivi_cheque_client.php', '', 3),
(31, 'Suivi chèques Fournisseurs', '', '', 27, 'suivi_cheque_fournisseur.php', '', 4),
(32, 'Articles', 'items', '', 0, 'article.php', 'mdi mdi-barcode-scan', 7),
(33, 'CRM', 'CRM', 'CRM', 0, '', 'mdi mdi-contacts', 6),
(34, 'Clients', '', '', 33, 'clients.php', '', 1),
(35, 'Fournisseurs', '', '', 33, 'fournisseurs.php', '', 2),
(37, 'Stock', 'Stock', '', 0, '', 'mdi mdi-bullseye', 4),
(38, 'Mouvement d\'entrée', '', '', 37, 'mouvement_entree.php', '', 1),
(39, 'Mouvement de sortie', '', '', 37, 'mouvement_sortie.php', '', 2),
(40, 'Achats', 'purshases', '', 0, '', 'mdi mdi-cart-plus', 3),
(41, 'Document en cours', '', '', 40, 'list_documents_achats.php', '', 1),
(42, 'Bon de commande', '', '', 40, 'bon_commande_achat.php', '', 2),
(43, 'Bon de réception', '', '', 40, 'bon_reception.php', '', 3),
(44, 'Bon de retour', '', '', 40, 'bon_retour_achat.php', '', 4),
(45, 'Facture', '', '', 40, 'facture_achat.php', '', 5),
(46, 'Bon d\'avoir financier', '', '', 40, 'bon_avoir_financier_achat.php', '', 6),
(47, 'Avoir retour', '', '', 40, 'facture_avoir_retour_achat.php', '', 7),
(48, 'Avoir', '', '', 40, 'avoir_achat.php', '', 8),
(49, 'Vente', 'Sales', '', 0, '', 'mdi mdi-cart-outline', 2),
(50, 'Document en cours', 'Current Documents', '', 49, 'list_documents_ventes.php', '', 1),
(51, 'Devis', 'Quote', '', 49, 'devis_vente.php', '', 2),
(52, 'Devis rejeté', 'Quote rejected', '', 49, 'devis_vente_rejete.php', '', 3),
(53, 'Bon de commande', 'Purchase Orders', '', 49, 'bon_commande_vente.php', '', 4),
(54, 'Bon de livraison', 'Delivery notes', '', 49, 'bon_livraison.php', '', 5),
(55, 'Bon de retour', 'Return slips', '', 49, 'bon_retour_vente.php', '', 6),
(56, 'Facture', 'Invoices', '', 49, 'facture_vente.php', '', 7),
(57, 'Bon d\'avoir financier', 'financial vouchers	', '', 49, 'bon_avoir_financier_vente.php', '', 8),
(58, 'Avoir retour', 'return invoice', '', 49, 'facture_avoir_retour_vente.php', '', 9),
(59, 'Avoir', 'assets', 'أصول', 49, 'avoir_vente.php', '', 10),
(60, 'Prospect', '', '', 33, 'prospects.php', '', 3),
(61, 'Prospect Télé', '', '', 33, 'prospect_tele.php', '', 4),
(62, 'Planning Rdv', '', '', 33, 'planing_rdv.php', '', 5),
(63, 'Service', '', '', 10, 'services.php', '', 6),
(64, 'Fonction', '', '', 10, 'fonctions.php', '', 7),
(65, 'Suivi Rdv', '', '', 33, 'suivi_rdv.php', '', 6),
(66, 'C.A par mois', '', '', 18, 'C.A_mois.php', '', 9),
(67, 'Statistique devis', '', '', 18, 'statistique_devis.php', '', 10),
(68, 'Tableau de board', 'Dashboard', '', 0, 'index.php', 'mdi mdi-gauge', 1),
(69, 'Dépôts', '', '', 10, 'depots.php', '', 8),
(70, 'Mouvement de transfert', '', '', 37, 'mouvement_transform.php', '', 3),
(71, 'Expéditeurs', '', '', 10, 'expediteurs.php', '', 9),
(72, 'Catalogue', '', '', 10, 'catalogue.php', '', 2),
(83, 'Caisse', 'cash register', '', 0, 'caisse/index.php', 'mdi mdi-cash', 11),
(84, 'caisse', 'checkout', '', 10, 'caisse_crd.php', '', 11),
(85, 'billets', 'tickets', '', 10, 'billets.php', '', 12),
(90, 'etape', 'stage', '', 10, 'etape.php', '', 13),
(91, 'agenda', 'diary', '', 10, 'agenda.php', '', 14);

-- --------------------------------------------------------

--
-- Table structure for table `menuprofil`
--

CREATE TABLE `menuprofil` (
  `id` int(11) NOT NULL,
  `id_menu` int(11) DEFAULT NULL,
  `id_profil` int(11) DEFAULT NULL,
  `consultation` tinyint(1) DEFAULT NULL,
  `ajout` tinyint(1) DEFAULT NULL,
  `modification` tinyint(1) DEFAULT NULL,
  `suppression` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `menuprofil`
--

INSERT INTO `menuprofil` (`id`, `id_menu`, `id_profil`, `consultation`, `ajout`, `modification`, `suppression`) VALUES
(381, 1, 12, 1, 1, 1, 1),
(382, 2, 12, 1, 1, 1, 1),
(383, 3, 12, 1, 1, 1, 1),
(384, 4, 12, 1, 1, 1, 1),
(388, 10, 12, 1, 1, 1, 1),
(389, 11, 12, 1, 1, 1, 1),
(390, 12, 12, 1, 1, 1, 1),
(393, 15, 12, 1, 1, 1, 1),
(394, 16, 12, 1, 1, 1, 1),
(395, 17, 12, 1, 1, 1, 1),
(396, 18, 12, 1, 1, 1, 1),
(397, 19, 12, 1, 1, 1, 1),
(398, 20, 12, 1, 1, 1, 1),
(399, 21, 12, 1, 1, 1, 1),
(400, 22, 12, 1, 1, 1, 1),
(401, 23, 12, 1, 1, 1, 1),
(402, 24, 12, 1, 1, 1, 1),
(403, 25, 12, 1, 1, 1, 1),
(404, 26, 12, 1, 1, 1, 1),
(405, 27, 12, 1, 1, 1, 1),
(406, 28, 12, 1, 1, 1, 1),
(407, 29, 12, 1, 1, 1, 1),
(408, 30, 12, 1, 1, 1, 1),
(409, 31, 12, 1, 1, 1, 1),
(410, 32, 12, 1, 1, 1, 1),
(411, 33, 12, 1, 1, 1, 1),
(412, 34, 12, 1, 1, 1, 1),
(413, 35, 12, 1, 1, 1, 1),
(414, 36, 12, 1, 1, 1, 1),
(415, 37, 12, 1, 1, 1, 1),
(416, 38, 12, 1, 1, 1, 1),
(417, 39, 12, 1, 1, 1, 1),
(418, 40, 12, 1, 1, 1, 1),
(419, 41, 12, 1, 1, 1, 1),
(420, 42, 12, 1, 1, 1, 1),
(421, 43, 12, 1, 1, 1, 1),
(422, 44, 12, 1, 1, 1, 1),
(423, 45, 12, 1, 1, 1, 1),
(424, 46, 12, 1, 1, 1, 1),
(425, 47, 12, 1, 1, 1, 1),
(426, 48, 12, 1, 1, 1, 1),
(427, 49, 12, 1, 1, 1, 1),
(428, 50, 12, 1, 1, 1, 1),
(429, 51, 12, 1, 1, 1, 1),
(430, 52, 12, 1, 1, 1, 1),
(431, 53, 12, 1, 1, 1, 1),
(432, 54, 12, 1, 1, 1, 1),
(433, 55, 12, 1, 1, 1, 1),
(434, 56, 12, 1, 1, 1, 1),
(435, 57, 12, 1, 1, 1, 1),
(436, 58, 12, 1, 1, 1, 1),
(437, 59, 12, 1, 1, 1, 1),
(438, 1, 13, 0, 0, 0, 0),
(439, 2, 13, 1, 1, 1, 1),
(440, 3, 13, 1, 1, 1, 1),
(441, 4, 13, 1, 1, 1, 1),
(445, 10, 13, 1, 1, 1, 1),
(446, 11, 13, 1, 1, 1, 1),
(447, 12, 13, 1, 1, 1, 1),
(450, 15, 13, 1, 1, 1, 1),
(451, 16, 13, 1, 1, 1, 1),
(452, 17, 13, 1, 1, 1, 1),
(453, 18, 13, 0, 0, 0, 0),
(454, 19, 13, 1, 1, 1, 1),
(455, 20, 13, 1, 1, 1, 1),
(456, 21, 13, 1, 1, 1, 1),
(457, 22, 13, 1, 1, 1, 1),
(458, 23, 13, 1, 1, 1, 1),
(459, 24, 13, 1, 1, 1, 1),
(460, 25, 13, 1, 1, 1, 1),
(461, 26, 13, 1, 1, 1, 1),
(462, 27, 13, 1, 1, 1, 1),
(463, 28, 13, 1, 1, 1, 1),
(464, 29, 13, 1, 1, 1, 1),
(465, 30, 13, 1, 1, 1, 1),
(466, 31, 13, 1, 1, 1, 1),
(467, 32, 13, 1, 1, 1, 1),
(468, 33, 13, 1, 1, 1, 1),
(469, 34, 13, 1, 1, 1, 1),
(470, 35, 13, 0, 0, 0, 0),
(471, 36, 13, 1, 1, 1, 1),
(472, 37, 13, 1, 1, 1, 1),
(473, 38, 13, 1, 1, 1, 1),
(474, 39, 13, 1, 1, 1, 1),
(475, 40, 13, 1, 1, 1, 1),
(476, 41, 13, 1, 1, 1, 1),
(477, 42, 13, 1, 1, 1, 1),
(478, 43, 13, 1, 1, 1, 1),
(479, 44, 13, 1, 1, 1, 1),
(480, 45, 13, 1, 1, 1, 1),
(481, 46, 13, 1, 1, 1, 1),
(482, 47, 13, 1, 1, 1, 1),
(483, 48, 13, 1, 1, 1, 1),
(484, 49, 13, 1, 1, 1, 1),
(485, 50, 13, 1, 1, 1, 1),
(486, 51, 13, 1, 1, 1, 1),
(487, 52, 13, 1, 1, 1, 1),
(488, 53, 13, 1, 1, 1, 1),
(489, 54, 13, 1, 1, 1, 1),
(490, 55, 13, 1, 1, 1, 1),
(491, 56, 13, 1, 1, 1, 1),
(492, 57, 13, 1, 1, 1, 1),
(493, 58, 13, 1, 1, 1, 1),
(494, 59, 13, 1, 1, 1, 1),
(495, 60, 12, 1, 1, 1, 1),
(496, 60, 13, 1, 1, 1, 1),
(497, 61, 12, 1, 1, 1, 1),
(498, 61, 13, 1, 1, 1, 1),
(499, 62, 12, 1, 1, 1, 1),
(500, 62, 13, 1, 1, 1, 1),
(501, 63, 12, 1, 1, 1, 1),
(502, 63, 13, 1, 1, 1, 1),
(503, 64, 12, 1, 1, 1, 1),
(504, 64, 13, 1, 1, 1, 1),
(505, 65, 12, 1, 1, 1, 1),
(506, 65, 13, 1, 1, 1, 1),
(507, 66, 12, 1, 1, 1, 1),
(508, 66, 13, 1, 1, 1, 1),
(509, 67, 12, 1, 1, 1, 1),
(510, 67, 13, 1, 1, 1, 1),
(511, 68, 12, 1, 1, 1, 1),
(512, 68, 13, 1, 1, 1, 1),
(576, 69, 12, 1, 1, 1, 1),
(577, 69, 13, 1, 1, 1, 1),
(578, 70, 12, 1, 1, 1, 1),
(579, 70, 13, 1, 1, 1, 1),
(580, 1, 15, 1, 1, 1, 1),
(581, 2, 15, 1, 1, 1, 1),
(582, 3, 15, 1, 1, 1, 1),
(583, 4, 15, 1, 1, 1, 1),
(584, 10, 15, 1, 1, 1, 1),
(585, 11, 15, 1, 1, 1, 1),
(586, 12, 15, 1, 1, 1, 1),
(589, 15, 15, 1, 1, 1, 1),
(590, 16, 15, 1, 1, 1, 1),
(591, 17, 15, 1, 1, 1, 1),
(592, 18, 15, 1, 1, 1, 1),
(593, 19, 15, 1, 1, 1, 1),
(594, 20, 15, 1, 1, 1, 1),
(595, 21, 15, 1, 1, 1, 1),
(596, 22, 15, 1, 1, 1, 1),
(597, 23, 15, 1, 1, 1, 1),
(598, 24, 15, 1, 1, 1, 1),
(599, 25, 15, 1, 1, 1, 1),
(600, 26, 15, 1, 1, 1, 1),
(601, 27, 15, 1, 1, 1, 1),
(602, 28, 15, 1, 1, 1, 1),
(603, 29, 15, 1, 1, 1, 1),
(604, 30, 15, 1, 1, 1, 1),
(605, 31, 15, 1, 1, 1, 1),
(606, 32, 15, 1, 1, 1, 1),
(607, 33, 15, 1, 1, 1, 1),
(608, 34, 15, 1, 1, 1, 1),
(609, 35, 15, 1, 1, 1, 1),
(610, 36, 15, 1, 1, 1, 1),
(611, 37, 15, 1, 1, 1, 1),
(612, 38, 15, 1, 1, 1, 1),
(613, 39, 15, 1, 1, 1, 1),
(614, 40, 15, 1, 1, 1, 1),
(615, 41, 15, 1, 1, 1, 1),
(616, 42, 15, 1, 1, 1, 1),
(617, 43, 15, 1, 1, 1, 1),
(618, 44, 15, 1, 1, 1, 1),
(619, 45, 15, 1, 1, 1, 1),
(620, 46, 15, 1, 1, 1, 1),
(621, 47, 15, 1, 1, 1, 1),
(622, 48, 15, 1, 1, 1, 1),
(623, 49, 15, 1, 1, 1, 1),
(624, 50, 15, 1, 1, 1, 1),
(625, 51, 15, 1, 1, 1, 1),
(626, 52, 15, 1, 1, 1, 1),
(627, 53, 15, 1, 1, 1, 1),
(628, 54, 15, 1, 1, 1, 1),
(629, 55, 15, 1, 1, 1, 1),
(630, 56, 15, 1, 1, 1, 1),
(631, 57, 15, 1, 1, 1, 1),
(632, 58, 15, 1, 1, 1, 1),
(633, 59, 15, 1, 1, 1, 1),
(634, 60, 15, 1, 1, 1, 1),
(635, 61, 15, 1, 1, 1, 1),
(636, 62, 15, 1, 1, 1, 1),
(637, 63, 15, 1, 1, 1, 1),
(638, 64, 15, 1, 1, 1, 1),
(639, 65, 15, 1, 1, 1, 1),
(640, 66, 15, 1, 1, 1, 1),
(641, 67, 15, 1, 1, 1, 1),
(642, 68, 15, 1, 1, 1, 1),
(643, 69, 15, 1, 1, 1, 1),
(644, 70, 15, 1, 1, 1, 1),
(645, 71, 12, 1, 1, 1, 1),
(646, 71, 13, 1, 1, 1, 1),
(647, 72, 12, 1, 1, 1, 1),
(648, 72, 13, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `menu_caisse`
--

CREATE TABLE `menu_caisse` (
  `id` int(11) NOT NULL,
  `intitule_fr` varchar(100) DEFAULT NULL,
  `intitule_en` varchar(100) DEFAULT NULL,
  `intitule_ar` varchar(100) DEFAULT NULL,
  `id_parent` int(11) DEFAULT NULL,
  `url` text NOT NULL,
  `icon` varchar(50) NOT NULL,
  `position` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `menu_caisse`
--

INSERT INTO `menu_caisse` (`id`, `intitule_fr`, `intitule_en`, `intitule_ar`, `id_parent`, `url`, `icon`, `position`) VALUES
(1, 'caisse', 'cash register', '', 0, 'caisse.php', 'mdi mdi-cash', 1),
(6, 'mouvement caisse', 'cash movement', '', 0, 'mouvementcaisse.php', 'mdi mdi-cash-multiple', 2),
(7, 'synthese ', 'Synthesis', '', 0, '', 'mdi mdi-calendar-today', 3),
(8, 'quotidienne', 'daily', '', 7, 'quotidienne.php', '', 1),
(9, 'ticket', 'ticket', '', 0, '', 'mdi mdi-gauge', 4),
(10, 'Historique tickets', 'tickets Historical', '', 9, 'historique_tickets.php', '', 1),
(11, 'tickets aujourd\'hui', 'tickets today', '', 9, 'tickets_aujourdhui.php', '', 2);

-- --------------------------------------------------------

--
-- Table structure for table `menu_caisse_profil`
--

CREATE TABLE `menu_caisse_profil` (
  `id` int(11) NOT NULL,
  `id_menu` int(11) DEFAULT NULL,
  `id_profil` int(11) DEFAULT NULL,
  `consultation` tinyint(1) DEFAULT NULL,
  `ajout` tinyint(1) DEFAULT NULL,
  `modification` tinyint(1) DEFAULT NULL,
  `suppression` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `redirectattempts`
--

CREATE TABLE `redirectattempts` (
  `ip` varchar(255) NOT NULL,
  `attempts` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `redirectattempts`
--

INSERT INTO `redirectattempts` (`ip`, `attempts`) VALUES
('::1', 0);

-- --------------------------------------------------------

--
-- Table structure for table `societe`
--

CREATE TABLE `societe` (
  `id` int(11) NOT NULL,
  `rs` varchar(255) NOT NULL,
  `ville` varchar(255) NOT NULL,
  `contact` varchar(100) NOT NULL,
  `adresse` text NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `date_creation` date DEFAULT NULL,
  `date_activation` date DEFAULT NULL,
  `date_echeance` date DEFAULT NULL,
  `adresse_mail` varchar(200) DEFAULT NULL,
  `logo` text DEFAULT NULL,
  `repertoire` varchar(255) DEFAULT NULL,
  `active` tinyint(4) NOT NULL,
  `generated` tinyint(4) NOT NULL,
  `db` varchar(100) NOT NULL,
  `nbr_utl` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `societe`
--

INSERT INTO `societe` (`id`, `rs`, `ville`, `contact`, `adresse`, `telephone`, `date_creation`, `date_activation`, `date_echeance`, `adresse_mail`, `logo`, `repertoire`, `active`, `generated`, `db`, `nbr_utl`) VALUES
(2, 'demo', '', '', '', '', '2021-11-01', '0000-00-00', '2023-05-05', '', NULL, 'demo', 0, 1, 'demo', 10),
(3, 'disup', '', '', '', '', '0000-00-00', NULL, '2023-05-19', NULL, NULL, 'disup', 0, 1, '', 10),
(22, 'Reprehenderit tempor', 'Odio deserunt ut tem', 'Duis culpa voluptat', 'Voluptatibus dicta e', '+1 (194) 976-5716', '1995-01-15', '0000-00-00', NULL, 'fyjub@mailinator.com', NULL, 'magni', 1, 0, 'Cum', 10);

-- --------------------------------------------------------

--
-- Table structure for table `updates`
--

CREATE TABLE `updates` (
  `date_add` datetime NOT NULL,
  `date_update` datetime NOT NULL,
  `date_save_version` datetime NOT NULL,
  `date_restore_version` datetime NOT NULL,
  `date_up_test` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `updates`
--

INSERT INTO `updates` (`date_add`, `date_update`, `date_save_version`, `date_restore_version`, `date_up_test`) VALUES
('2022-11-16 09:56:00', '2022-11-16 09:24:00', '2022-12-26 04:00:00', '2022-12-26 04:14:00', '2022-12-26 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `login`, `password`) VALUES
(1, 'admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `versions`
--

CREATE TABLE `versions` (
  `id` int(11) NOT NULL,
  `intitule` varchar(100) DEFAULT NULL,
  `date_creation` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `versions`
--

INSERT INTO `versions` (`id`, `intitule`, `date_creation`) VALUES
(5, 'v1', '2023-01-12'),
(6, 'v24', '2023-01-12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_redirectattempts`
--
ALTER TABLE `detail_redirectattempts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dictionnaire`
--
ALTER TABLE `dictionnaire`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `historique`
--
ALTER TABLE `historique`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menuprofil`
--
ALTER TABLE `menuprofil`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu_caisse`
--
ALTER TABLE `menu_caisse`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu_caisse_profil`
--
ALTER TABLE `menu_caisse_profil`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `redirectattempts`
--
ALTER TABLE `redirectattempts`
  ADD UNIQUE KEY `ip` (`ip`);

--
-- Indexes for table `societe`
--
ALTER TABLE `societe`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `versions`
--
ALTER TABLE `versions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detail_redirectattempts`
--
ALTER TABLE `detail_redirectattempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT for table `dictionnaire`
--
ALTER TABLE `dictionnaire`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=725;

--
-- AUTO_INCREMENT for table `historique`
--
ALTER TABLE `historique`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `menuprofil`
--
ALTER TABLE `menuprofil`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=658;

--
-- AUTO_INCREMENT for table `menu_caisse`
--
ALTER TABLE `menu_caisse`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `menu_caisse_profil`
--
ALTER TABLE `menu_caisse_profil`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=740;

--
-- AUTO_INCREMENT for table `societe`
--
ALTER TABLE `societe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `versions`
--
ALTER TABLE `versions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
