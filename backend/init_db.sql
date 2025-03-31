-- Schéma de la base de données Yoozak
-- Ce script crée toutes les tables nécessaires pour le projet Yoozak

-- --------------------------------------------------------
-- Table des clients - Stocke les informations des utilisateurs
-- --------------------------------------------------------
CREATE TABLE Client (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    nom VARCHAR(255) NOT NULL,                -- Nom de famille du client
    prenom VARCHAR(255) NOT NULL,             -- Prénom du client
    phone VARCHAR(20) UNIQUE,                 -- Numéro de téléphone unique
    genre VARCHAR(50),                        -- Genre du client
    point_de_fidelite INT DEFAULT 0,          -- Points de fidélité accumulés
    mode_de_passe VARCHAR(255) NOT NULL,      -- Mot de passe crypté
    email VARCHAR(255) UNIQUE                 -- Adresse email unique
);

-- --------------------------------------------------------
-- Table des produits - Catalogue principal des chaussures
-- --------------------------------------------------------
CREATE TABLE Produit (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    nom VARCHAR(100) NOT NULL,                -- Nom du modèle de chaussure
    prix NUMERIC(10,2) NOT NULL,             -- Prix avec 2 décimales
    description TEXT,                         -- Description détaillée du produit
    type_de_semelle VARCHAR(255),            -- Type de semelle utilisée
    matieres_premieres JSON,                 -- Matériaux utilisés (format JSON)
    origine VARCHAR(255)                      -- Pays/région d'origine
);

-- --------------------------------------------------------
-- Table des catégories - Classification principale des produits
-- --------------------------------------------------------
CREATE TABLE Categories (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    nom VARCHAR(255) NOT NULL,                -- Nom de la catégorie
    description TEXT                          -- Description de la catégorie
);

-- --------------------------------------------------------
-- Table des sous-catégories - Sous-classification des produits
-- --------------------------------------------------------
CREATE TABLE Sous_Categories (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    nom VARCHAR(255) NOT NULL,                -- Nom de la sous-catégorie
    description TEXT,                         -- Description de la sous-catégorie
    categorie_id INT REFERENCES Categories(id) -- Lien vers la catégorie parente
);

-- --------------------------------------------------------
-- Table des articles - Déclinaisons spécifiques des produits
-- --------------------------------------------------------
CREATE TABLE Article (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    couleur VARCHAR(50),                      -- Couleur de l'article
    pointure VARCHAR(10),                     -- Taille/pointure disponible
    code_bar VARCHAR(50) UNIQUE,              -- Code-barres unique
    date_achat DATE,                          -- Date d'acquisition du stock
    produit_id INT REFERENCES Produit(id)     -- Lien vers le produit parent
);

-- --------------------------------------------------------
-- Table des créations visuelles - Médias associés aux produits
-- --------------------------------------------------------
CREATE TABLE Creative (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    type_creative VARCHAR(255),               -- Type de média (photo, vidéo, etc.)
    url VARCHAR(255),                         -- Lien vers la ressource
    produit_id INT REFERENCES Produit(id)     -- Lien vers le produit associé
);

-- --------------------------------------------------------
-- Table des commandes - Suivi des achats clients
-- --------------------------------------------------------
CREATE TABLE Commande (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    date_commande DATE NOT NULL,              -- Date de la commande
    adresse VARCHAR(255),                     -- Adresse de livraison
    region VARCHAR(255),                      -- Région de livraison
    etat_commande VARCHAR(255),               -- État actuel de la commande
    client_id INT REFERENCES Client(id)       -- Lien vers le client
);

-- --------------------------------------------------------
-- Table du panier - Gestion des paniers temporaires
-- --------------------------------------------------------
CREATE TABLE Panier (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    quantite INT NOT NULL,                    -- Nombre d'articles
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date d'ajout au panier
    client_id INT REFERENCES Client(id)       -- Lien vers le client
);

-- --------------------------------------------------------
-- Table des retours - Gestion des retours produits
-- --------------------------------------------------------
CREATE TABLE Retour (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    motif TEXT,                              -- Raison du retour
    date_retour DATE,                        -- Date du retour
    commande_id INT REFERENCES Commande(id)   -- Lien vers la commande concernée
);

-- --------------------------------------------------------
-- Table des remises - Gestion des réductions
-- --------------------------------------------------------
CREATE TABLE Remise (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    taux_de_reduction NUMERIC(5,2),           -- Pourcentage de réduction
    commande_id INT REFERENCES Commande(id)   -- Lien vers la commande
);

-- --------------------------------------------------------
-- Table des codes promotionnels - Gestion des codes promo
-- --------------------------------------------------------
CREATE TABLE Code_Promo (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    taux NUMERIC(5,2),                        -- Pourcentage de réduction
    numero_promo VARCHAR(50) UNIQUE,          -- Code promo unique
    commande_id INT REFERENCES Commande(id)   -- Lien vers la commande
);

-- --------------------------------------------------------
-- Table des promotions - Gestion des offres temporaires
-- --------------------------------------------------------
CREATE TABLE Promotion (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    type_promo VARCHAR(255),                  -- Type de promotion
    reduction NUMERIC(5,2),                   -- Montant de la réduction
    date_debut DATE,                          -- Date de début de la promotion
    date_fin DATE,                           -- Date de fin de la promotion
    produit_id INT REFERENCES Produit(id)     -- Lien vers le produit concerné
);

-- --------------------------------------------------------
-- Table des statuts de commande - États possibles des commandes
-- --------------------------------------------------------
CREATE TABLE Etat_Commande (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    libelle_etat VARCHAR(255) NOT NULL        -- Description de l'état
);

-- --------------------------------------------------------
-- Table des favoris - Liste des produits favoris par client
-- --------------------------------------------------------
CREATE TABLE Favoris (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    client_id INT REFERENCES Client(id),      -- Lien vers le client
    produit_id INT REFERENCES Produit(id)     -- Lien vers le produit favori
);

-- --------------------------------------------------------
-- Table des avis - Commentaires et notes des clients
-- --------------------------------------------------------
CREATE TABLE Avis (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    client_id INT REFERENCES Client(id),      -- Lien vers le client
    produit_id INT REFERENCES Produit(id),    -- Lien vers le produit évalué
    commentaire TEXT,                         -- Commentaire du client
    note INT CHECK (note BETWEEN 1 AND 5)     -- Note de 1 à 5
);

-- --------------------------------------------------------
-- Table des catalogues - Gestion des collections
-- --------------------------------------------------------
CREATE TABLE Catalogue (
    id SERIAL PRIMARY KEY,                    -- Identifiant unique auto-incrémenté
    nom VARCHAR(255) NOT NULL,                -- Nom du catalogue
    description TEXT,                         -- Description du catalogue
    date_creation DATE                        -- Date de création du catalogue
);

-- --------------------------------------------------------
-- Table de relation Produit-Catalogue - Association Many-to-Many
-- --------------------------------------------------------
CREATE TABLE Produit_Catalogue (
    produit_id INT REFERENCES Produit(id),    -- Lien vers le produit
    catalogue_id INT REFERENCES Catalogue(id), -- Lien vers le catalogue
    PRIMARY KEY (produit_id, catalogue_id)    -- Clé primaire composite
); 