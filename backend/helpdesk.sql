CREATE DATABASE helpdesk;
USE helpdesk;

CREATE TABLE setor (
    id_setor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_setor INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    foto_perfil VARCHAR(255) DEFAULT 'default-user.png',
    tipo ENUM('comum', 'suporte', 'admin') DEFAULT 'comum',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_setor) REFERENCES setor(id_setor)
);

CREATE TABLE chamado (
    id_chamado INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_setor INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    status ENUM('aberto', 'andamento', 'resolvido', 'cancelado') DEFAULT 'aberto',
    prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_setor) REFERENCES setores(id_setor)
);  

CREATE TABLE historico_chamado (
    id_historico INT AUTO_INCREMENT PRIMARY KEY,
    id_chamado INT NOT NULL,
    status_antigo ENUM('aberto', 'andamento', 'resolvido', 'cancelado'),
    status_novo   ENUM('aberto', 'andamento', 'resolvido', 'cancelado'),
    obs TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_chamado) REFERENCES chamado(id_chamado)
);

INSERT INTO setor (nome) VALUES
('Recursos Humanos'),
('Financeiro'),
('Atendimento ao Cliente'),
('Comercial / Vendas'),
('Logística'),
('Tecnologia da Informação'),
('Infraestrutura'),
('Marketing'),
('Compras'),
('Jurídico');

-- Reset de dados das tabelas

-- 1) Desliga checagem de FK (temporário)
SET FOREIGN_KEY_CHECKS = 0;

-- 2) Limpa tabelas filhas primeiro
DELETE FROM historico_chamado;
DELETE FROM chamado;

-- 3) Agora limpa as outras tabelas que dependem (se for o caso)
DELETE FROM usuario;
DELETE FROM setor;

-- 4) Reseta AUTO_INCREMENT para 1
ALTER TABLE historico_chamado AUTO_INCREMENT = 1;
ALTER TABLE chamado AUTO_INCREMENT = 1;
ALTER TABLE usuario AUTO_INCREMENT = 1;
ALTER TABLE setor AUTO_INCREMENT = 1;

-- 5) Reabilita checagem de FK
SET FOREIGN_KEY_CHECKS = 1;

--6) Exibe os IDs em ordem
SELECT * FROM setor ORDER BY id_setor;