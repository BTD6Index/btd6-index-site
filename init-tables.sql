-- 2 Towers CHIMPS
CREATE TABLE "twotc_completions" (
    tower1, tower2, map, person, link, og, pending, PRIMARY KEY (tower1, tower2, map)
);
CREATE VIRTUAL TABLE "twotc_completions_fts" USING fts5(
    tower1, tower2, map, person, link, og, pending UNINDEXED, content='twotc_completions', tokenize='unicode61 remove_diacritics 2', prefix='1 2 3'
);

CREATE TRIGGER "twotc_completions_ai" AFTER INSERT ON 'twotc_completions' BEGIN 
    INSERT INTO "twotc_completions_fts" (rowid, tower1, tower2, map, person, link, og, pending) VALUES (new.rowid, new.tower1, new.tower2, new.map, new.person, new.link, new.og, new.pending);
END;
CREATE TRIGGER "twotc_completions_ad" AFTER DELETE ON 'twotc_completions' BEGIN 
    INSERT INTO "twotc_completions_fts" ('twotc_completions_fts', rowid, tower1, tower2, map, person, link, og, pending) VALUES ('delete', old.rowid, old.tower1, old.tower2, old.map, old.person, old.link, old.og, old.pending);
END;
CREATE TRIGGER "twotc_completions_au" AFTER UPDATE ON 'twotc_completions' BEGIN 
    INSERT INTO "twotc_completions_fts" ('twotc_completions_fts', rowid, tower1, tower2, map, person, link, og, pending) VALUES ('delete', old.rowid, old.tower1, old.tower2, old.map, old.person, old.link, old.og, old.pending);

    INSERT INTO "twotc_completions_fts" (rowid, tower1, tower2, map, person, link, og, pending) VALUES (new.rowid, new.tower1, new.tower2, new.map, new.person, new.link, new.og, new.pending);
END;

CREATE TRIGGER "twotc_completions_bi" BEFORE INSERT ON "twotc_completions" BEGIN 
    SELECT RAISE(ABORT, 'twotc completion already exists') FROM "twotc_completions" AS cmp
    WHERE (cmp.tower1, cmp.tower2, cmp.map) = (new.tower1, new.tower2, new.map)
    OR (cmp.tower1, cmp.tower2, cmp.map) = (new.tower2, new.tower1, new.map);
END;
CREATE TRIGGER "twotc_completions_bu" BEFORE UPDATE ON "twotc_completions" BEGIN 
    SELECT RAISE(ABORT, 'twotc completion already exists') FROM "twotc_completions" AS cmp
    WHERE NOT ( (new.tower1, new.tower2, new.map) = (old.tower1, old.tower2, old.map)
    OR (new.tower1, new.tower2, new.map) = (old.tower2, old.tower1, old.map) )
    AND ((cmp.tower1, cmp.tower2, cmp.map) = (new.tower1, new.tower2, new.map)
    OR (cmp.tower1, cmp.tower2, cmp.map) = (new.tower2, new.tower1, new.map));
END;

CREATE TABLE "twotc_extra_info" (
    tower1, tower2, upgrade1, upgrade2, version, date, PRIMARY KEY (tower1, tower2)
);
CREATE TABLE "twotc_completion_notes" (
    tower1, tower2, map, notes, PRIMARY KEY (tower1, tower2, map)
);

CREATE TABLE "twotc_filekeys" (
    tower1, tower2, map, filekey UNIQUE, PRIMARY KEY (tower1, tower2, map)
);

CREATE INDEX twotc_completions_tower1_nocase ON twotc_completions(tower1 COLLATE NOCASE);
CREATE INDEX twotc_completions_tower2_nocase ON twotc_completions(tower2 COLLATE NOCASE);
CREATE INDEX twotc_extra_info_tower1_nocase ON twotc_extra_info(tower1 COLLATE NOCASE);
CREATE INDEX twotc_extra_info_tower2_nocase ON twotc_extra_info(tower2 COLLATE NOCASE);
CREATE INDEX twotc_completion_notes_tower1_nocase ON twotc_completion_notes(tower1 COLLATE NOCASE);
CREATE INDEX twotc_completion_notes_tower2_nocase ON twotc_completion_notes(tower2 COLLATE NOCASE);
CREATE INDEX twotc_filekeys_tower1_nocase ON twotc_filekeys(tower1 COLLATE NOCASE);
CREATE INDEX twotc_filekeys_tower2_nocase ON twotc_filekeys(tower2 COLLATE NOCASE);

CREATE INDEX twotc_person_nocase ON twotc_completions(person COLLATE NOCASE);

-- 2 Megapops CHIMPS
CREATE TABLE "twomp_completions" (
    entity, map, person, link, og, pending, PRIMARY KEY (entity, map)
);
CREATE VIRTUAL TABLE "twomp_completions_fts" USING fts5(
    entity, map, person, link, og, pending UNINDEXED, content='twomp_completions', tokenize='unicode61 remove_diacritics 2', prefix='1 2 3'
);
CREATE TRIGGER "twomp_completions_ai" AFTER INSERT ON 'twomp_completions' BEGIN 
    INSERT INTO "twomp_completions_fts" (rowid, entity, map, person, link, og, pending) VALUES (new.rowid, new.entity, new.map, new.person, new.link, new.og, new.pending);
END;
CREATE TRIGGER "twomp_completions_ad" AFTER DELETE ON 'twomp_completions' BEGIN 
    INSERT INTO "twomp_completions_fts" ('twomp_completions_fts', rowid, entity, map, person, link, og, pending) VALUES ('delete', old.rowid, old.entity, old.map, old.person, old.link, old.og, old.pending);
END;
CREATE TRIGGER "twomp_completions_au" AFTER UPDATE ON 'twomp_completions' BEGIN 
    INSERT INTO "twomp_completions_fts" ('twomp_completions_fts', rowid, entity, map, person, link, og, pending) VALUES ('delete', old.rowid, old.entity, old.map, old.person, old.link, old.og, old.pending);

    INSERT INTO "twomp_completions_fts" (rowid, entity, map, person, link, og, pending) VALUES (new.rowid, new.entity, new.map, new.person, new.link, new.og, new.pending);
END;

CREATE TABLE "twomp_extra_info" (
    entity PRIMARY KEY, upgrade, version, date
);
CREATE TABLE "twomp_completion_notes" (
    entity, map, notes, PRIMARY KEY (entity, map)
);

CREATE TABLE "twomp_filekeys" (
    entity, map, filekey UNIQUE, PRIMARY KEY (entity, map)
);

CREATE INDEX twomp_completions_entity_nocase ON twomp_completions(entity COLLATE NOCASE);
CREATE INDEX twomp_extra_info_entity_nocase ON twomp_extra_info(entity COLLATE NOCASE);
CREATE INDEX twomp_completion_notes_entity_nocase ON twomp_completion_notes(entity COLLATE NOCASE);
CREATE INDEX twomp_filekeys_entity_nocase ON twomp_filekeys(entity COLLATE NOCASE);

CREATE INDEX twomp_person_nocase ON twomp_completions(person COLLATE NOCASE);

-- 2 Towers Co-op CHIMPS
CREATE TABLE "twotcc_completions" (
    tower1, tower2, map, person1, person2, link, og, pending, PRIMARY KEY (tower1, tower2, map)
);
CREATE VIRTUAL TABLE "twotcc_completions_fts" USING fts5(
    tower1, tower2, map, person1, person2, link, og, pending UNINDEXED, content='twotcc_completions', tokenize='unicode61 remove_diacritics 2', prefix='1 2 3'
);
CREATE TRIGGER "twotcc_completions_ai" AFTER INSERT ON 'twotcc_completions' BEGIN 
    INSERT INTO "twotcc_completions_fts" (rowid, tower1, tower2, map, person1, person2, link, og, pending)
    VALUES (new.rowid, new.tower1, new.tower2, new.map, new.person1, new.person2, new.link, new.og, new.pending);
END;
CREATE TRIGGER "twotcc_completions_ad" AFTER DELETE ON 'twotcc_completions' BEGIN 
    INSERT INTO "twotcc_completions_fts" ('twotcc_completions_fts', rowid, tower1, tower2, map, person1, person2, link, og, pending)
    VALUES ('delete', old.rowid, old.tower1, old.tower2, old.map, old.person1, old.person2, old.link, old.og, old.pending);
END;
CREATE TRIGGER "twotcc_completions_au" AFTER UPDATE ON 'twotcc_completions' BEGIN 
    INSERT INTO "twotcc_completions_fts" ('twotcc_completions_fts', rowid, tower1, tower2, map, person1, person2, link, og, pending)
    VALUES ('delete', old.rowid, old.tower1, old.tower2, old.map, old.person1, old.person2, old.link, old.og, old.pending);
    
    INSERT INTO "twotcc_completions_fts" (rowid, tower1, tower2, map, person1, person2, link, og, pending)
    VALUES (new.rowid, new.tower1, new.tower2, new.map, new.person1, new.person2, new.link, new.og, new.pending);
END;
CREATE TABLE "twotcc_extra_info" (
    tower1, tower2, upgrade1, upgrade2, version, date, money INTEGER, PRIMARY KEY (tower1, tower2)
);
CREATE TABLE "twotcc_completion_notes" (
    tower1, tower2, map, notes, PRIMARY KEY (tower1, tower2, map)
);
CREATE TABLE "twotcc_filekeys" (
    tower1, tower2, map, filekey UNIQUE, PRIMARY KEY (tower1, tower2, map)
);

CREATE TRIGGER "twotcc_completions_bi" BEFORE INSERT ON "twotcc_completions" BEGIN 
    SELECT RAISE(ABORT, 'twotcc completion already exists') FROM "twotcc_completions" AS cmp
    WHERE (cmp.tower1, cmp.tower2, cmp.map) = (new.tower1, new.tower2, new.map)
    OR (cmp.tower1, cmp.tower2, cmp.map) = (new.tower2, new.tower1, new.map);
END;
CREATE TRIGGER "twotcc_completions_bu" BEFORE UPDATE ON "twotcc_completions" BEGIN 
    SELECT RAISE(ABORT, 'twotcc completion already exists') FROM "twotcc_completions" AS cmp
    WHERE NOT ( (new.tower1, new.tower2, new.map) = (old.tower1, old.tower2, old.map)
    OR (new.tower1, new.tower2, new.map) = (old.tower2, old.tower1, old.map) )
    AND ((cmp.tower1, cmp.tower2, cmp.map) = (new.tower1, new.tower2, new.map)
    OR (cmp.tower1, cmp.tower2, cmp.map) = (new.tower2, new.tower1, new.map));
END;

CREATE INDEX twotcc_completions_tower1_nocase ON twotcc_completions(tower1 COLLATE NOCASE);
CREATE INDEX twotcc_completions_tower2_nocase ON twotcc_completions(tower2 COLLATE NOCASE);
CREATE INDEX twotcc_extra_info_tower1_nocase ON twotcc_extra_info(tower1 COLLATE NOCASE);
CREATE INDEX twotcc_extra_info_tower2_nocase ON twotcc_extra_info(tower2 COLLATE NOCASE);
CREATE INDEX twotcc_completion_notes_tower1_nocase ON twotcc_completion_notes(tower1 COLLATE NOCASE);
CREATE INDEX twotcc_completion_notes_tower2_nocase ON twotcc_completion_notes(tower2 COLLATE NOCASE);
CREATE INDEX twotcc_filekeys_tower1_nocase ON twotcc_filekeys(tower1 COLLATE NOCASE);
CREATE INDEX twotcc_filekeys_tower2_nocase ON twotcc_filekeys(tower2 COLLATE NOCASE);

CREATE INDEX twotcc_person1_nocase ON twotcc_completions(person1 COLLATE NOCASE);
CREATE INDEX twotcc_person2_nocase ON twotcc_completions(person2 COLLATE NOCASE);

-- Fewest Type of Towers CHIMPS
CREATE TABLE "fttc_completions" (
    map, towerset, person, link, og, pending, PRIMARY KEY (map, towerset)
);
CREATE TABLE "fttc_extra_info" (
    map, towerset, version, date, PRIMARY KEY (map, towerset)
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

CREATE INDEX fttc_completions_towerset_nocase ON fttc_completions(towerset COLLATE NOCASE);
CREATE INDEX fttc_extra_info_towerset_nocase ON fttc_extra_info(towerset COLLATE NOCASE);
CREATE INDEX fttc_completion_notes_towerset_nocase ON fttc_completion_notes(towerset COLLATE NOCASE);
CREATE INDEX fttc_filekeys_towerset_nocase ON fttc_filekeys(towerset COLLATE NOCASE);

CREATE INDEX fttc_person_nocase ON fttc_completions(person COLLATE NOCASE);

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

CREATE INDEX ltc_completions_towerset_nocase ON ltc_completions(towerset COLLATE NOCASE);

CREATE INDEX ltc_person_nocase ON ltc_completions(person COLLATE NOCASE);

-- Least Cost CHIMPS
CREATE TABLE "lcc_completions" (
    map, money INTEGER, person, link, pending,
    version, date, notes, filekey PRIMARY KEY
);
CREATE VIRTUAL TABLE "lcc_completions_fts" USING fts5(
    map, money, person, link, pending UNINDEXED,
    version, date, notes UNINDEXED, filekey UNINDEXED,
    content='lcc_completions', tokenize='unicode61 remove_diacritics 2', prefix='1 2 3'
);

CREATE TRIGGER "lcc_completions_ai" AFTER INSERT ON "lcc_completions" BEGIN 
    INSERT INTO "lcc_completions_fts" (rowid, map, money, person, link, pending, version, date, notes, filekey)
    VALUES (new.rowid, new.map, new.money, new.person, new.link, new.pending, new.version, new.date, new.notes, new.filekey);
END;

CREATE TRIGGER "lcc_completions_ad" AFTER DELETE ON "lcc_completions" BEGIN 
    INSERT INTO "lcc_completions_fts" (rowid, "lcc_completions_fts", map, money, person, link, pending, version, date, notes, filekey)
    VALUES (old.rowid, 'delete', old.map, old.money, old.person, old.link, old.pending, old.version, old.date, old.notes, old.filekey);
END;

CREATE TRIGGER "lcc_completions_au" AFTER UPDATE ON "lcc_completions" BEGIN 
    INSERT INTO "lcc_completions_fts" (rowid, "lcc_completions_fts", map, money, person, link, pending, version, date, notes, filekey)
    VALUES (old.rowid, 'delete', old.map, old.money, old.person, old.link, old.pending, old.version, old.date, old.notes, old.filekey);
    INSERT INTO "lcc_completions_fts" (rowid, map, money, person, link, pending, version, date, notes, filekey)
    VALUES (new.rowid, new.map, new.money, new.person, new.link, new.pending, new.version, new.date, new.notes, new.filekey);
END;

CREATE INDEX lcc_person_nocase ON lcc_completions(person COLLATE NOCASE);

-- Least Cost Deflation
CREATE TABLE "lcd_completions" (
    map, money INTEGER, person, link, pending,
    version, date, notes, filekey PRIMARY KEY
);
CREATE VIRTUAL TABLE "lcd_completions_fts" USING fts5(
    map, money, person, link, pending UNINDEXED,
    version, date, notes UNINDEXED, filekey UNINDEXED,
    content='lcd_completions', tokenize='unicode61 remove_diacritics 2', prefix='1 2 3'
);

CREATE TRIGGER "lcd_completions_ai" AFTER INSERT ON "lcd_completions" BEGIN 
    INSERT INTO "lcd_completions_fts" (rowid, map, money, person, link, pending, version, date, notes, filekey)
    VALUES (new.rowid, new.map, new.money, new.person, new.link, new.pending, new.version, new.date, new.notes, new.filekey);
END;

CREATE TRIGGER "lcd_completions_ad" AFTER DELETE ON "lcd_completions" BEGIN 
    INSERT INTO "lcd_completions_fts" (rowid, "lcd_completions_fts", map, money, person, link, pending, version, date, notes, filekey)
    VALUES (old.rowid, 'delete', old.map, old.money, old.person, old.link, old.pending, old.version, old.date, old.notes, old.filekey);
END;

CREATE TRIGGER "lcd_completions_au" AFTER UPDATE ON "lcd_completions" BEGIN 
    INSERT INTO "lcd_completions_fts" (rowid, "lcd_completions_fts", map, money, person, link, pending, version, date, notes, filekey)
    VALUES (old.rowid, 'delete', old.map, old.money, old.person, old.link, old.pending, old.version, old.date, old.notes, old.filekey);
    INSERT INTO "lcd_completions_fts" (rowid, map, money, person, link, pending, version, date, notes, filekey)
    VALUES (new.rowid, new.map, new.money, new.person, new.link, new.pending, new.version, new.date, new.notes, new.filekey);
END;

CREATE INDEX lcd_person_nocase ON lcd_completions(person COLLATE NOCASE);

CREATE TABLE map_information(
    map PRIMARY KEY,
    abbreviation,
    difficulty,
    hasLOS,
    hasWater,
    length REAL,
    lengthNotes,
    miscNotes,
    numEntrances INTEGER,
    numExits INTEGER,
    numObjects INTEGER,
    removalCost,
    removalCostNotes,
    version
);

CREATE TABLE chimps_starts(map, title, link, uuid PRIMARY KEY);
CREATE INDEX chimps_starts_map_idx ON chimps_starts(map);

CREATE TABLE balance_changes(tower, version, change, nature, uuid PRIMARY KEY);
CREATE INDEX balance_changes_tower_idx ON balance_changes(tower);
CREATE INDEX balance_changes_version_idx ON balance_changes(version);
CREATE INDEX balance_changes_tower_version_idx ON balance_changes(tower, version);
