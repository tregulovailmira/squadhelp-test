CREATE TABLE "Catalogs" (
    id serial  PRIMARY KEY,
    "catalogName" VARCHAR(64) NOT NULL,
    "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL
);

CREATE TABLE "Conversations" (
    id serial  PRIMARY KEY,
    "interlocutorId" INTEGER REFERENCES "Users"(id) ON DELETE NO ACTION ON UPDATE CASCADE NOT NULL,
    "userId" INTEGER REFERENCES "Users"(id) ON DELETE NO ACTION ON UPDATE CASCADE NOT NULL,
    "createdAt" TIMESTAMP CHECK("createdAt" <= current_timestamp) DEFAULT current_timestamp,
    "updatedAt" TIMESTAMP CHECK("createdAt" <= current_timestamp) DEFAULT current_timestamp
);

CREATE TABLE "Messages" (
    id serial  PRIMARY KEY,
    body text NOT NULL,
    sender INTEGER REFERENCES "Users"(id) ON DELETE NO ACTION ON UPDATE CASCADE NOT NULL,
    conversation INTEGER REFERENCES "Conversations"(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
    "createdAt" TIMESTAMP CHECK("createdAt" <= current_timestamp) DEFAULT current_timestamp,
    "updatedAt" TIMESTAMP CHECK("createdAt" <= current_timestamp) DEFAULT current_timestamp
);

CREATE TABLE "CatalogsToConversations" (
    "conversationId" INTEGER REFERENCES "Conversations"(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
    "catalogId" INTEGER REFERENCES "Catalogs"(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
    PRIMARY KEY("conversationId", "catalogId")
);

CREATE TABLE "BlackLists" (
    "userId" INTEGER REFERENCES "Users"(id) ON DELETE NO ACTION ON UPDATE CASCADE NOT NULL,
    "conversationId" INTEGER REFERENCES "Conversations"(id) ON DELETE NO ACTION ON UPDATE CASCADE NOT NULL,
    PRIMARY KEY("userId", "conversationId")
);

CREATE TABLE "FavoriteLists" (
    "userId" INTEGER REFERENCES "Users"(id) ON DELETE NO ACTION ON UPDATE CASCADE NOT NULL,
    "conversationId" INTEGER REFERENCES "Conversations"(id) ON DELETE NO ACTION ON UPDATE CASCADE NOT NULL,
    PRIMARY KEY("userId", "conversationId")
);
