CREATE DATABASE helpdesk;
USE helpdesk;

-- TABELA: setor
CREATE TABLE setor (
    id_setor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

-- TABELA: usuario
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

-- TABELA: tecnico
CREATE TABLE tecnico (
    id_tecnico INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA: chamado
CREATE TABLE chamado (
    id_chamado INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_tecnico INT,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    status ENUM('aberto', 'andamento', 'resolvido', 'cancelado') DEFAULT 'aberto',
    prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_tecnico) REFERENCES tecnico(id_tecnico)
);

-- TABELA: historico_chamado
CREATE TABLE historico_chamado (
    id_historico INT AUTO_INCREMENT PRIMARY KEY,
    id_chamado INT NOT NULL,
    status_antigo ENUM('aberto', 'andamento', 'resolvido', 'cancelado'),
    status_novo   ENUM('aberto', 'andamento', 'resolvido', 'cancelado'),
    obs TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_chamado) REFERENCES chamado(id_chamado)
);

INSERT INTO setor (id_setor, nome) VALUES
(1, 'Arquitetura'),
(2, 'Contabilidade'),
(3, 'Engenharia'),
(4, 'Empreendedorismo'),
(5, 'Tecnologia');

