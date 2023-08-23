-- 2 Towers CHIMPS
CREATE TABLE "2tc_completions" (
    tower1, tower2, map, person, link, og, pending, PRIMARY KEY (tower1, tower2, map)
);
CREATE VIRTUAL TABLE "2tc_completions_fts" USING fts5(
    tower1, tower2, map, person, link, og, pending UNINDEXED, content='2tc_completions', tokenize='unicode61 remove_diacritics 2', prefix='1 2 3'
);

CREATE TRIGGER "2tc_completions_ai" AFTER INSERT ON '2tc_completions' BEGIN 
    INSERT INTO "2tc_completions_fts" (rowid, tower1, tower2, map, person, link, og, pending) VALUES (new.rowid, new.tower1, new.tower2, new.map, new.person, new.link, new.og, new.pending);
END;
CREATE TRIGGER "2tc_completions_ad" AFTER DELETE ON '2tc_completions' BEGIN 
    INSERT INTO "2tc_completions_fts" ('2tc_completions_fts', rowid, tower1, tower2, map, person, link, og, pending) VALUES ('delete', old.rowid, old.tower1, old.tower2, old.map, old.person, old.link, old.og, old.pending);
END;
CREATE TRIGGER "2tc_completions_au" AFTER UPDATE ON '2tc_completions' BEGIN 
    INSERT INTO "2tc_completions_fts" ('2tc_completions_fts', rowid, tower1, tower2, map, person, link, og, pending) VALUES ('delete', old.rowid, old.tower1, old.tower2, old.map, old.person, old.link, old.og, old.pending);

    INSERT INTO "2tc_completions_fts" (rowid, tower1, tower2, map, person, link, og, pending) VALUES (new.rowid, new.tower1, new.tower2, new.map, new.person, new.link, new.og, new.pending);
END;

CREATE TRIGGER "2tc_completions_bi" BEFORE INSERT ON "2tc_completions" BEGIN 
    SELECT RAISE(ABORT, '2tc completion already exists') FROM "2tc_completions" AS cmp
    WHERE (cmp.tower1, cmp.tower2, cmp.map) = (new.tower1, new.tower2, new.map)
    OR (cmp.tower1, cmp.tower2, cmp.map) = (new.tower2, new.tower1, new.map);
END;
CREATE TRIGGER "2tc_completions_bu" BEFORE UPDATE ON "2tc_completions" BEGIN 
    SELECT RAISE(ABORT, '2tc completion already exists') FROM "2tc_completions" AS cmp
    WHERE NOT ( (new.tower1, new.tower2, new.map) = (old.tower1, old.tower2, old.map)
    OR (new.tower1, new.tower2, new.map) = (old.tower2, old.tower1, old.map) )
    AND ((cmp.tower1, cmp.tower2, cmp.map) = (new.tower1, new.tower2, new.map)
    OR (cmp.tower1, cmp.tower2, cmp.map) = (new.tower2, new.tower1, new.map));
END;

CREATE TABLE "2tc_extra_info" (
    tower1, tower2, upgrade1, upgrade2, version, date, PRIMARY KEY (tower1, tower2)
);
CREATE TABLE "2tc_completion_notes" (
    tower1, tower2, map, notes, PRIMARY KEY (tower1, tower2, map)
);

CREATE TABLE "2tc_filekeys" (
    tower1, tower2, map, filekey UNIQUE, PRIMARY KEY (tower1, tower2, map)
);

-- 2 Megapops CHIMPS
CREATE TABLE "2mp_completions" (
    entity, map, person, link, og, pending, PRIMARY KEY (entity, map)
);
CREATE VIRTUAL TABLE "2mp_completions_fts" USING fts5(
    entity, map, person, link, og, pending UNINDEXED, content='2mp_completions', tokenize='unicode61 remove_diacritics 2', prefix='1 2 3'
);
CREATE TRIGGER "2mp_completions_ai" AFTER INSERT ON '2mp_completions' BEGIN 
    INSERT INTO "2mp_completions_fts" (rowid, entity, map, person, link, og, pending) VALUES (new.rowid, new.entity, new.map, new.person, new.link, new.og, new.pending);
END;
CREATE TRIGGER "2mp_completions_ad" AFTER DELETE ON '2mp_completions' BEGIN 
    INSERT INTO "2mp_completions_fts" ('2mp_completions_fts', rowid, entity, map, person, link, og, pending) VALUES ('delete', old.rowid, old.entity, old.map, old.person, old.link, old.og, old.pending);
END;
CREATE TRIGGER "2mp_completions_au" AFTER UPDATE ON '2mp_completions' BEGIN 
    INSERT INTO "2mp_completions_fts" ('2mp_completions_fts', rowid, entity, map, person, link, og, pending) VALUES ('delete', old.rowid, old.entity, old.map, old.person, old.link, old.og, old.pending);

    INSERT INTO "2mp_completions_fts" (rowid, entity, map, person, link, og, pending) VALUES (new.rowid, new.entity, new.map, new.person, new.link, new.og, new.pending);
END;

CREATE TABLE "2mp_extra_info" (
    entity PRIMARY KEY, upgrade, version, date
);
CREATE TABLE "2mp_completion_notes" (
    entity, map, notes, PRIMARY KEY (entity, map)
);

CREATE TABLE "2mp_filekeys" (
    entity, map, filekey UNIQUE, PRIMARY KEY (entity, map)
);

-- 2 Towers Co-op CHIMPS
CREATE TABLE "2tcc_completions" (
    tower1, tower2, map, person1, person2, link, og, pending, PRIMARY KEY (tower1, tower2, map)
);
CREATE VIRTUAL TABLE "2tcc_completions_fts" USING fts5(
    tower1, tower2, map, person1, person2, link, og, pending UNINDEXED, content='2tcc_completions', tokenize='unicode61 remove_diacritics 2', prefix='1 2 3'
);
CREATE TRIGGER "2tcc_completions_ai" AFTER INSERT ON '2tcc_completions' BEGIN 
    INSERT INTO "2tcc_completions_fts" (rowid, tower1, tower2, map, person1, person2, link, og, pending)
    VALUES (new.rowid, new.tower1, new.tower2, new.map, new.person1, new.person2, new.link, new.og, new.pending);
END;
CREATE TRIGGER "2tcc_completions_ad" AFTER DELETE ON '2tcc_completions' BEGIN 
    INSERT INTO "2tcc_completions_fts" ('2tcc_completions_fts', rowid, tower1, tower2, map, person1, person2, link, og, pending)
    VALUES ('delete', old.rowid, old.tower1, old.tower2, old.map, old.person1, old.person2, old.link, old.og, old.pending);
END;
CREATE TRIGGER "2tcc_completions_au" AFTER UPDATE ON '2tcc_completions' BEGIN 
    INSERT INTO "2tcc_completions_fts" ('2tcc_completions_fts', rowid, tower1, tower2, map, person1, person2, link, og, pending)
    VALUES ('delete', old.rowid, old.tower1, old.tower2, old.map, old.person1, old.person2, old.link, old.og, old.pending);
    
    INSERT INTO "2tcc_completions_fts" (rowid, tower1, tower2, map, person1, person2, link, og, pending)
    VALUES (new.rowid, new.tower1, new.tower2, new.map, new.person1, new.person2, new.link, new.og, new.pending);
END;
CREATE TABLE "2tcc_extra_info" (
    tower1, tower2, upgrade1, upgrade2, version, date, money INTEGER, PRIMARY KEY (tower1, tower2)
);
CREATE TABLE "2tcc_completion_notes" (
    tower1, tower2, map, notes, PRIMARY KEY (tower1, tower2, map)
);
CREATE TABLE "2tcc_filekeys" (
    tower1, tower2, map, filekey UNIQUE, PRIMARY KEY (tower1, tower2, map)
);

CREATE TRIGGER "2tcc_completions_bi" BEFORE INSERT ON "2tcc_completions" BEGIN 
    SELECT RAISE(ABORT, '2tcc completion already exists') FROM "2tcc_completions" AS cmp
    WHERE (cmp.tower1, cmp.tower2, cmp.map) = (new.tower1, new.tower2, new.map)
    OR (cmp.tower1, cmp.tower2, cmp.map) = (new.tower2, new.tower1, new.map);
END;
CREATE TRIGGER "2tcc_completions_bu" BEFORE UPDATE ON "2tcc_completions" BEGIN 
    SELECT RAISE(ABORT, '2tcc completion already exists') FROM "2tcc_completions" AS cmp
    WHERE NOT ( (new.tower1, new.tower2, new.map) = (old.tower1, old.tower2, old.map)
    OR (new.tower1, new.tower2, new.map) = (old.tower2, old.tower1, old.map) )
    AND ((cmp.tower1, cmp.tower2, cmp.map) = (new.tower1, new.tower2, new.map)
    OR (cmp.tower1, cmp.tower2, cmp.map) = (new.tower2, new.tower1, new.map));
END;

-- Fewest Type of Towers CHIMPS
CREATE TABLE "fttc_completions" (
    map, towerset, person, link, og, pending, PRIMARY KEY (map, towerset)
);
CREATE TABLE "fttc_extra_info" (
    map PRIMARY KEY, version, date
);
CREATE TABLE "fttc_completion_notes" (
    map, towerset, notes, PRIMARY KEY (map, towerset)
);
CREATE TABLE "fttc_filekeys" (
    map, towerset, filekey UNIQUE, PRIMARY KEY (map, towerset)
);

CREATE VIRTUAL TABLE "fttc_completions_fts" USING fts5(
    map, towerset, person, link, og, pending UNINDEXED, content='fttc_completions', tokenize='unicode61 remove_diacritics 2', prefix='1 2 3'
);
CREATE TRIGGER "fttc_completions_ai" AFTER INSERT ON 'fttc_completions' BEGIN 
    INSERT INTO "fttc_completions_fts" (rowid, map, towerset, person, link, og, pending) VALUES (new.rowid, new.map, new.towerset, new.person, new.link, new.og, new.pending);
END;
CREATE TRIGGER "fttc_completions_ad" AFTER DELETE ON 'fttc_completions' BEGIN 
    INSERT INTO "fttc_completions_fts" ('fttc_completions_fts', rowid, map, towerset, person, link, og, pending) VALUES ('delete', old.rowid, old.map, old.towerset, old.person, old.link, old.og, old.pending);
END;
CREATE TRIGGER "fttc_completions_au" AFTER UPDATE ON 'fttc_completions' BEGIN 
    INSERT INTO "fttc_completions_fts" ('fttc_completions_fts', rowid, map, towerset, person, link, og, pending) VALUES ('delete', old.rowid, old.map, old.towerset, old.person, old.link, old.og, old.pending);

    INSERT INTO "fttc_completions_fts" (rowid, map, towerset, person, link, og, pending) VALUES (new.rowid, new.map, new.towerset, new.person, new.link, new.og, new.pending);
END;

-- Least Towers CHIMPS
CREATE TABLE "ltc_completions" (
    map, towerset, person, link, completiontype, pending,
    upgradeset, version, date, notes, filekey UNIQUE, PRIMARY KEY (map, towerset, completiontype)
);
CREATE VIRTUAL TABLE "ltc_completions_fts" USING fts5(
    map, towerset, person, link, completiontype, pending UNINDEXED,
    upgradeset, version, date, notes UNINDEXED, filekey UNINDEXED,
    content='ltc_completions', tokenize='unicode61 remove_diacritics 2', prefix='1 2 3'
);
CREATE TRIGGER "ltc_completions_ai" AFTER INSERT ON "ltc_completions" BEGIN 
    INSERT INTO "ltc_completions_fts" (
        rowid, map, towerset, person, link, completiontype, pending,
        upgradeset, version, date, notes, filekey
    ) VALUES (
        new.rowid, new.map, new.towerset, new.person, new.link, new.completiontype, new.pending,
        new.upgradeset, new.version, new.date, new.notes, new.filekey
    );
END;
CREATE TRIGGER "ltc_completions_ad" AFTER DELETE ON "ltc_completions" BEGIN 
    INSERT INTO "ltc_completions_fts" (
        "ltc_completions_fts", rowid, map, towerset, person, link, completiontype, pending,
        upgradeset, version, date, notes, filekey
    ) VALUES (
        'delete', old.rowid, old.map, old.towerset, old.person, old.link, old.completiontype, old.pending,
        old.upgradeset, old.version, old.date, old.notes, old.filekey
    );
END;
CREATE TRIGGER "ltc_completions_au" AFTER UPDATE ON "ltc_completions" BEGIN 
    INSERT INTO "ltc_completions_fts" (
        "ltc_completions_fts", rowid, map, towerset, person, link, completiontype, pending,
        upgradeset, version, date, notes, filekey
    ) VALUES (
        'delete', old.rowid, old.map, old.towerset, old.person, old.link, old.completiontype, old.pending,
        old.upgradeset, old.version, old.date, old.notes, old.filekey
    );

    INSERT INTO "ltc_completions_fts" (
        rowid, map, towerset, person, link, completiontype, pending,
        upgradeset, version, date, notes, filekey
    ) VALUES (
        new.rowid, new.map, new.towerset, new.person, new.link, new.completiontype, new.pending,
        new.upgradeset, new.version, new.date, new.notes, new.filekey
    );
END;


/*
CREATE TABLE "ltc_completions" (
    towerset, map PRIMARY KEY, person, link, upgradeset, version, date, notes, filekey UNIQUE
);
CREATE TABLE "lcc_completions" (
    cost, map PRIMARY KEY, person, link, version, date, notes, filekey UNIQUE
);
*/
